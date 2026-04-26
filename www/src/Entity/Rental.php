<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\RentalRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use App\State\RentalProcessor;
use App\State\RentalStatusProcessor;

#[ORM\Entity(repositoryClass: RentalRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['rental:read']],
    denormalizationContext: ['groups' => ['rental:write']],
    operations: [
        new Get(),
        new GetCollection(),
        new Post(processor: RentalProcessor::class),
        new Patch(processor: RentalStatusProcessor::class)
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'user.email' => 'exact',    // Filter rentals by user email
    'boat.name'  => 'ipartial', // Filter rentals by boat name (partial, case-insensitive)
    'status'     => 'exact'     // Filter by status: pending | confirmed | cancelled | completed
])]
class Rental
{
    /** Status constants */
    public const STATUS_CREATED   = 'created';   // Created but not paid yet
    public const STATUS_PENDING   = 'pending';   // Paid, waiting for crew
    public const STATUS_CONFIRMED = 'confirmed'; // Paid and crew validated
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rental:read'])]
    private ?int $id = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['rental:read', 'rental:write'])]
    #[Assert\NotBlank]
    #[Assert\Type('\DateTimeInterface')]
    private ?\DateTimeInterface $rentalStart = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['rental:read', 'rental:write'])]
    #[Assert\NotBlank]
    #[Assert\Type('\DateTimeInterface')]
    private ?\DateTimeInterface $rentalEnd = null;

    #[ORM\Column]
    #[Groups(['rental:read', 'rental:write'])]
    #[Assert\NotBlank]
    #[Assert\PositiveOrZero]
    private ?float $rentalPrice = null;

    #[ORM\Column(length: 20)]
    #[Groups(['rental:read', 'rental:write'])]
    #[Assert\Choice(choices: [
        self::STATUS_CREATED,
        self::STATUS_PENDING,
        self::STATUS_CONFIRMED,
        self::STATUS_CANCELLED,
        self::STATUS_COMPLETED,
    ])]
    private string $status = self::STATUS_PENDING;

    // =========================================================================
    // Relations — ManyToOne
    // =========================================================================

    /** User who is renting the boat (the client). */
    #[ORM\ManyToOne(inversedBy: 'rentals')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['rental:read', 'rental:write'])]
    private ?User $user = null;

    // =========================================================================
    // Relations — OneToMany
    // =========================================================================

    /**
     * @var Boat
     */
    #[ORM\ManyToOne(inversedBy: 'rentals')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['rental:read', 'rental:write'])]
    private ?Boat $boat = null;

    // =========================================================================
    // Relations — ManyToMany
    // =========================================================================

    /**
     * Formulas (pricing plans) attached to this rental.
     *
     * @var Collection<int, Formula>
     */
    #[ORM\ManyToMany(targetEntity: Formula::class, inversedBy: 'rental')]
    #[Groups(['rental:read', 'rental:write'])]
    private Collection $formulas;

    /**
     * Optional equipment (fittings) added to this rental.
     *
     * @var Collection<int, Fitting>
     */
    #[ORM\ManyToMany(targetEntity: Fitting::class, inversedBy: 'rentals')]
    #[Groups(['rental:read', 'rental:write'])]
    private Collection $fitting;

    /**
     * Professional crew members assigned to this rental.
     * Only users with roles ROLE_CAPITAINE, ROLE_CHEF, or ROLE_HOTESSE are valid.
     *
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: 'rental_crew')]
    #[Groups(['rental:read', 'rental:write'])]
    private Collection $crewMembers;

    /**
     * Crew members who have explicitly accepted this mission.
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class)]
    #[ORM\JoinTable(name: 'rental_confirmed_by')]
    #[Groups(['rental:read', 'rental:write'])]
    private Collection $confirmedBy;

    /**
     * Roles requested for this rental (e.g. ROLE_CAPITAINE, ROLE_CHEF).
     * @var array<string>
     */
    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['rental:read', 'rental:write'])]
    private array $requestedRoles = [];

    // =========================================================================
    // Constructor
    // =========================================================================

    public function __construct()
    {
        $this->formulas    = new ArrayCollection();
        $this->fitting     = new ArrayCollection();
        $this->crewMembers = new ArrayCollection();
        $this->confirmedBy = new ArrayCollection();
    }

    // =========================================================================
    // Getters / Setters
    // =========================================================================

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRentalStart(): ?\DateTimeInterface
    {
        return $this->rentalStart;
    }

    public function setRentalStart(\DateTimeInterface $rentalStart): static
    {
        $this->rentalStart = $rentalStart;

        return $this;
    }

    public function getRentalEnd(): ?\DateTimeInterface
    {
        return $this->rentalEnd;
    }

    public function setRentalEnd(\DateTimeInterface $rentalEnd): static
    {
        $this->rentalEnd = $rentalEnd;

        return $this;
    }

    public function getRentalPrice(): ?float
    {
        return $this->rentalPrice;
    }

    public function setRentalPrice(float $rentalPrice): static
    {
        $this->rentalPrice = $rentalPrice;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Boat|null
     */
    public function getBoat(): ?Boat
    {
        return $this->boat;
    }

    public function setBoat(?Boat $boat): static
    {
        $this->boat = $boat;

        return $this;
    }


    /**
     * @return Collection<int, Formula>
     */
    public function getFormulas(): Collection
    {
        return $this->formulas;
    }

    public function addFormula(Formula $formula): static
    {
        if (!$this->formulas->contains($formula)) {
            $this->formulas->add($formula);
            $formula->addRental($this);
        }

        return $this;
    }

    public function removeFormula(Formula $formula): static
    {
        if ($this->formulas->removeElement($formula)) {
            $formula->removeRental($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Fitting>
     */
    public function getFitting(): Collection
    {
        return $this->fitting;
    }

    public function addFitting(Fitting $fitting): static
    {
        if (!$this->fitting->contains($fitting)) {
            $this->fitting->add($fitting);
        }

        return $this;
    }

    public function removeFitting(Fitting $fitting): static
    {
        $this->fitting->removeElement($fitting);

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getCrewMembers(): Collection
    {
        return $this->crewMembers;
    }

    public function addCrewMember(User $crewMember): static
    {
        if (!$this->crewMembers->contains($crewMember)) {
            $this->crewMembers->add($crewMember);
        }

        return $this;
    }

    public function removeCrewMember(User $crewMember): static
    {
        $this->crewMembers->removeElement($crewMember);

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getConfirmedBy(): Collection
    {
        return $this->confirmedBy;
    }

    public function addConfirmedBy(User $user): static
    {
        if (!$this->confirmedBy->contains($user)) {
            $this->confirmedBy->add($user);
        }

        return $this;
    }

    public function removeConfirmedBy(User $user): static
    {
        $this->confirmedBy->removeElement($user);

        return $this;
    }

    public function getRequestedRoles(): array
    {
        return $this->requestedRoles ?? [];
    }

    public function setRequestedRoles(?array $requestedRoles): static
    {
        $this->requestedRoles = $requestedRoles;

        return $this;
    }

    /**
     * Virtual field for Stripe integration (not persisted)
     */
    #[Groups(['rental:read'])]
    public ?string $stripeClientSecret = null;
}
