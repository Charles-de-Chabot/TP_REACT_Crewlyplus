<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\TeamRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Controller\RegistrationController;
use App\Controller\JoinTeamController;

#[ORM\Entity(repositoryClass: TeamRepository::class)]
#[ApiResource(
    operations: [
        new \ApiPlatform\Metadata\GetCollection(),
        new Get(security: "is_granted('TEAM_VIEW', object)"),
        new Post(),
        new Patch(security: "is_granted('TEAM_EDIT', object)"),
        new Delete(security: "is_granted('TEAM_EDIT', object)"),
        new Post(
            uriTemplate: '/teams/join',
            controller: JoinTeamController::class,
            name: 'team_join',
            openapi: new \ApiPlatform\OpenApi\Model\Operation(
                summary: 'Rejoindre une équipe via un code d\'invitation',
                description: 'Permet à l\'utilisateur connecté de rejoindre une équipe en fournissant son code unique.'
            )
        ),
        new Get(
            uriTemplate: '/teams/{id}/registration-package',
            controller: RegistrationController::class,
            name: 'team_registration_package',
            openapi: new \ApiPlatform\OpenApi\Model\Operation(
                summary: 'Génère le dossier d\'inscription ZIP (Leader uniquement)',
                description: 'Agrège les documents de tous les membres et les infos du CV nautique.'
            )
        )
    ],
    normalizationContext: ['groups' => ['team:read']],
    denormalizationContext: ['groups' => ['team:write']],
    processor: \App\State\TeamProcessor::class
)]
#[ApiFilter(SearchFilter::class, properties: [
    'name' => 'ipartial', 
    'regatta' => 'exact',
    'members.id' => 'exact'
])]
class Team
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['team:read', 'user:read', 'regatta:read', 'message:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['team:read', 'team:write', 'user:read', 'regatta:read', 'message:read'])]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'teams')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['team:read', 'team:write', 'user:read'])]
    private ?Regatta $regatta = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['team:read', 'team:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['team:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['team:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['team:read', 'team:write'])]
    private ?User $leader = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\OneToMany(targetEntity: User::class, mappedBy: 'currentTeam')]
    #[Groups(['team:read'])]
    private Collection $members;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['team:read', 'team:write', 'user:read'])]
    private ?string $emblem = null;

    /**
     * @var Collection<int, TeamMembership>
     */
    #[ORM\OneToMany(targetEntity: TeamMembership::class, mappedBy: 'team', orphanRemoval: true, cascade: ['persist'])]
    #[Groups(['team:read'])]
    private Collection $memberships;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['team:read', 'team:write'])]
    private ?array $provisioningList = null;

    /**
     * @var Collection<int, Registration>
     */
    #[ORM\OneToMany(targetEntity: Registration::class, mappedBy: 'team', orphanRemoval: true)]
    #[Groups(['team:read', 'registration:read', 'user:read'])]
    private Collection $registrations;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'team', orphanRemoval: true)]
    #[Groups(['team:read'])]
    private Collection $messages;

    #[ORM\Column(length: 10, unique: true, nullable: true)]
    #[Groups(['team:read'])]
    private ?string $inviteCode = null;

    public function __construct()
    {
        $this->members = new ArrayCollection();
        $this->registrations = new ArrayCollection();
        $this->memberships = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getRegatta(): ?Regatta
    {
        return $this->regatta;
    }

    public function setRegatta(?Regatta $regatta): static
    {
        $this->regatta = $regatta;

        return $this;
    }

    public function getLeader(): ?User
    {
        return $this->leader;
    }

    public function setLeader(?User $leader): static
    {
        $this->leader = $leader;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getMembers(): Collection
    {
        return $this->members;
    }

    public function addMember(User $member): static
    {
        if (!$this->members->contains($member)) {
            $this->members->add($member);
            $member->setCurrentTeam($this);

            // Créer le membership historique
            $membership = new TeamMembership();
            $membership->setUser($member);
            $membership->setTeam($this);
            // On vérifie si ce membre est le leader défini
            $isLeader = ($this->getLeader() && $this->getLeader()->getId() === $member->getId());
            $membership->setRole($isLeader ? 'LEADER' : 'MEMBER');
            $membership->setJoinedAt(new \DateTimeImmutable());
            $this->addMembership($membership);
        }

        return $this;
    }

    public function removeMember(User $member): static
    {
        if ($this->members->removeElement($member)) {
            // set the owning side to null (unless already changed)
            if ($member->getCurrentTeam() === $this) {
                $member->setCurrentTeam(null);
            }
        }

        return $this;
    }

    public function getProvisioningList(): ?array
    {
        return $this->provisioningList;
    }

    public function setProvisioningList(?array $provisioningList): static
    {
        $this->provisioningList = $provisioningList;

        return $this;
    }

    public function getInviteCode(): ?string
    {
        return $this->inviteCode;
    }

    public function setInviteCode(?string $inviteCode): static
    {
        $this->inviteCode = $inviteCode;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getEmblem(): ?string
    {
        return $this->emblem;
    }

    public function setEmblem(?string $emblem): static
    {
        $this->emblem = $emblem;

        return $this;
    }

    /**
     * @return Collection<int, Registration>
     */
    public function getRegistrations(): Collection
    {
        return $this->registrations;
    }

    public function addRegistration(Registration $registration): static
    {
        if (!$this->registrations->contains($registration)) {
            $this->registrations->add($registration);
            $registration->setTeam($this);
        }

        return $this;
    }

    public function removeRegistration(Registration $registration): static
    {
        if ($this->registrations->removeElement($registration)) {
            // set the owning side to null (unless already changed)
            if ($registration->getTeam() === $this) {
                $registration->setTeam(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TeamMembership>
     */
    public function getMemberships(): Collection
    {
        return $this->memberships;
    }

    public function addMembership(TeamMembership $membership): static
    {
        if (!$this->memberships->contains($membership)) {
            $this->memberships->add($membership);
            $membership->setTeam($this);
        }

        return $this;
    }

    public function removeMembership(TeamMembership $membership): static
    {
        if ($this->memberships->removeElement($membership)) {
            // set the owning side to null (unless already changed)
            if ($membership->getTeam() === $this) {
                $membership->setTeam(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setTeam($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getTeam() === $this) {
                $message->setTeam(null);
            }
        }

        return $this;
    }
}
