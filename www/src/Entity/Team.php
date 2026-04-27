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
use App\Controller\RegistrationController;
use App\Controller\JoinTeamController;

#[ORM\Entity(repositoryClass: TeamRepository::class)]
#[ApiResource(
    operations: [
        new \ApiPlatform\Metadata\GetCollection(),
        new Get(),
        new Post(),
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
    #[Groups(['team:read', 'user:read', 'regatta:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['team:read', 'team:write', 'user:read', 'regatta:read'])]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'teams')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['team:read', 'team:write'])]
    private ?Regatta $regatta = null;

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

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['team:read', 'team:write'])]
    private ?array $provisioningList = null;

    #[ORM\Column(length: 10, unique: true, nullable: true)]
    #[Groups(['team:read'])]
    private ?string $inviteCode = null;

    public function __construct()
    {
        $this->members = new ArrayCollection();
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
}
