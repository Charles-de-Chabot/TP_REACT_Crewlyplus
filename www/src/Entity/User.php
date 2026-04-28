<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(fields: ['email'], message: 'Un compte existe déjà avec cet email')]
#[ApiResource(
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'firstname' => 'ipartial',      // Recherche par prénom (partiel)
    'lastname' => 'ipartial',       // Recherche par nom (partiel)
    'email' => 'ipartial',          // Recherche par email
    'role.label' => 'exact'         // Filtrer par rôle exact (ex: ROLE_ADMIN)
])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'rental:read', 'team:read', 'message:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write', 'rental:read', 'team:read', 'message:read'])]
    private ?string $firstname = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write', 'message:read'])]
    private ?string $lastname = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $nickname = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:write'])]
    private ?string $password = null;

    #[ORM\Column(length: 15, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $phoneNumber = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?\DateTimeImmutable $updated_at = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private ?bool $is_active = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write', 'message:read'])]
    private ?string $position = null;

    #[ORM\ManyToOne(inversedBy: 'users')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['user:read', 'user:write'])]
    private ?Role $role = null;

    #[ORM\ManyToOne(inversedBy: 'users', cascade: ['persist'])]
    #[Groups(['user:read', 'user:write'])]
    private ?Address $address = null;

    #[ORM\OneToOne(mappedBy: 'user', targetEntity: SailingProfile::class, cascade: ['persist', 'remove'])]
    #[Groups(['user:read', 'user:write'])]
    private ?SailingProfile $sailingProfile = null;

    #[ORM\ManyToOne(targetEntity: Team::class, inversedBy: 'members')]
    #[Groups(['user:read', 'user:write'])]
    private ?Team $currentTeam = null;

    /**
     * @var Collection<int, TeamMembership>
     */
    #[ORM\OneToMany(targetEntity: TeamMembership::class, mappedBy: 'user', orphanRemoval: true)]
    #[Groups(['user:read', 'message:read'])]
    private Collection $memberships;

    /**
     * @var Collection<int, Regatta>
     */
    #[ORM\ManyToMany(targetEntity: Regatta::class, inversedBy: 'participants')]
    #[Groups(['user:read', 'user:write'])]
    private Collection $participatingRegattas;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\OneToMany(targetEntity: Media::class, mappedBy: 'user')]
    #[Groups(['user:read', 'team:read'])]
    private Collection $media;


    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'author')]
    private Collection $messages;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'user')]
    private Collection $notification;

    /**
     * @var Collection<int, Innovice>
     */
    #[ORM\OneToMany(targetEntity: Innovice::class, mappedBy: 'user')]
    #[Groups(['user:read'])]
    private Collection $innovices;

    /**
     * @var Collection<int, Rental>
     */
    #[ORM\OneToMany(targetEntity: Rental::class, mappedBy: 'user')]
    #[Groups(['user:read'])]
    private Collection $rentals;



    #[Groups(['message:read'])]
    public function getTacticalPosition(): string
    {
        // 1. Chercher dans les memberships actifs d'abord (plus précis)
        foreach ($this->memberships as $membership) {
            if (!$membership->getLeftAt()) {
                if ($membership->getPosition()) {
                    return $membership->getPosition()->getLabel();
                }
                // Si c'est le leader de cette team
                if ($membership->getTeam()->getLeader() && $membership->getTeam()->getLeader()->getId() === $this->getId()) {
                    return 'Skipper';
                }
            }
        }

        // 2. Fallback sur le champ statique ou défaut
        return $this->position ?? 'Équipier';
    }

    #[Groups(['message:read'])]
    #[SerializedName('isSkipper')]
    public function isSkipper(): bool
    {
        foreach ($this->memberships as $membership) {
            if (!$membership->getLeftAt()) {
                $team = $membership->getTeam();
                if ($team && $team->getLeader() && $team->getLeader()->getId() === $this->getId()) {
                    return true;
                }
            }
        }
        return false;
    }

    public function __construct()
    {
        $this->media = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->notification = new ArrayCollection();
        $this->innovices = new ArrayCollection();
        $this->rentals = new ArrayCollection();
        $this->participatingRegattas = new ArrayCollection();
        $this->memberships = new ArrayCollection();
        // Initialisation des valeurs par défaut à la création
        $this->created_at = new \DateTimeImmutable();
        $this->updated_at = new \DateTimeImmutable();
        $this->is_active = true;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getNickname(): ?string
    {
        return $this->nickname;
    }

    public function setNickname(?string $nickname): static
    {
        $this->nickname = $nickname;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }

    public function setPhoneNumber(?string $phoneNumber): static
    {
        $this->phoneNumber = $phoneNumber;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->is_active;
    }

    public function setIsActive(bool $is_active): static
    {
        $this->is_active = $is_active;

        return $this;
    }

    public function getPosition(): ?string
    {
        return $this->position;
    }

    public function setPosition(?string $position): static
    {
        $this->position = $position;

        return $this;
    }

    public function getRole(): ?Role
    {
        return $this->role;
    }

    public function setRole(?Role $role): static
    {
        $this->role = $role;

        return $this;
    }

    #[Groups(['user:read'])] // On l'ajoute au groupe de lecture
    public function getRoleLabel(): ?string
    {
        // On va chercher le label dans l'entité Role liée
        return $this->role ? $this->role->getLabel() : 'ROLE_USER';
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): static
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }
    public function addMedia(Media $media): static
    {
        if (!$this->media->contains($media)) {
            $this->media->add($media);
            $media->setUser($this);
        }

        return $this;
    }

    public function removeMedia(Media $media): static
    {
        if ($this->media->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getUser() === $this) {
                $media->setUser(null);
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
            $message->setAuthor($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getAuthor() === $this) {
                $message->setAuthor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotification(): Collection
    {
        return $this->notification;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notification->contains($notification)) {
            $this->notification->add($notification);
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notification->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Innovice>
     */
    public function getInnovices(): Collection
    {
        return $this->innovices;
    }

    public function addInnovice(Innovice $innovice): static
    {
        if (!$this->innovices->contains($innovice)) {
            $this->innovices->add($innovice);
            $innovice->setUser($this);
        }

        return $this;
    }

    public function removeInnovice(Innovice $innovice): static
    {
        if ($this->innovices->removeElement($innovice)) {
            // set the owning side to null (unless already changed)
            if ($innovice->getUser() === $this) {
                $innovice->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Rental>
     */
    public function getRentals(): Collection
    {
        return $this->rentals;
    }

    public function addRental(Rental $rental): static
    {
        if (!$this->rentals->contains($rental)) {
            $this->rentals->add($rental);
            $rental->setUser($this);
        }

        return $this;
    }

    public function removeRental(Rental $rental): static
    {
        if ($this->rentals->removeElement($rental)) {
            // set the owning side to null (unless already changed)
            if ($rental->getUser() === $this) {
                $rental->setUser(null);
            }
        }

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->role ? [$this->role->getLabel()] : [];
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function getSailingProfile(): ?SailingProfile
    {
        return $this->sailingProfile;
    }

    public function setSailingProfile(SailingProfile $sailingProfile): static
    {
        // set the owning side of the relation if necessary
        if ($sailingProfile->getUser() !== $this) {
            $sailingProfile->setUser($this);
        }

        $this->sailingProfile = $sailingProfile;

        return $this;
    }

    public function getCurrentTeam(): ?Team
    {
        return $this->currentTeam;
    }

    public function setCurrentTeam(?Team $currentTeam): static
    {
        $this->currentTeam = $currentTeam;

        return $this;
    }

    /**
     * @return Collection<int, Regatta>
     */
    public function getParticipatingRegattas(): Collection
    {
        return $this->participatingRegattas;
    }

    public function addParticipatingRegatta(Regatta $regatta): static
    {
        if (!$this->participatingRegattas->contains($regatta)) {
            $this->participatingRegattas->add($regatta);
        }

        return $this;
    }

    public function removeParticipatingRegatta(Regatta $regatta): static
    {
        $this->participatingRegattas->removeElement($regatta);

        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, TeamMembership>
     */
    public function getMemberships(): Collection
    {
        return $this->memberships;
    }
}
