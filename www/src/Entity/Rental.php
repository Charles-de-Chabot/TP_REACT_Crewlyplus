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

use ApiPlatform\Metadata\Post;
use App\State\RentalProcessor;

#[ORM\Entity(repositoryClass: RentalRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['rental:read']],
    denormalizationContext: ['groups' => ['rental:write']],
    operations: [
        new Post(processor: RentalProcessor::class)
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'user.email' => 'exact',    // Filter rentals by user email
    'boat.name'  => 'ipartial', // Filter rentals by boat name (partial, case-insensitive)
    'status'     => 'exact',    // Filter by status: pending | confirmed | cancelled | completed
])]
class Rental
{
    // =========================================================================
    // Constants — Rental status values
    // =========================================================================

    public const STATUS_PENDING   = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_COMPLETED = 'completed';

    /** @var string[] Valid crew member roles */
    public const ALLOWED_CREW_ROLES = [
        'ROLE_CAPITAINE',
        'ROLE_CHEF',
        'ROLE_HOTESSE',
    ];

    // =========================================================================
    // Primary Key
    // =========================================================================

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rental:read'])]
    private ?int $id = null;

    // =========================================================================
    // Scalar fields
    // =========================================================================

    #[ORM\Column]
    #[Groups(['rental:read', 'rental:write'])]
    private ?\DateTime $rentalStart = null;

    #[ORM\Column]
    #[Groups(['rental:read', 'rental:write'])]
    private ?\DateTime $rentalEnd = null;

    #[ORM\Column]
    #[Groups(['rental:read', 'rental:write'])]
    private ?float $rentalPrice = null;

    /**
     * Non-persistent property to hold the Stripe client secret for the frontend.
     */
    #[Groups(['rental:read'])]
    public ?string $stripeClientSecret = null;

    /**
     * Rental lifecycle status.
     * Set to 'pending' by default; updated by Stripe webhook on payment outcome.
     */
    #[ORM\Column(length: 50)]
    #[Groups(['rental:read'])]
    #[Assert\Choice(choices: [
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
     * @var Collection<int, Boat>
     */
    #[ORM\OneToMany(targetEntity: Boat::class, mappedBy: 'rental')]
    #[Groups(['rental:read'])]
    private Collection $boat;

    // =========================================================================
    // Relations — ManyToMany
    // =========================================================================

    /**
     * Formulas (pricing plans) attached to this rental.
     *
     * @var Collection<int, Formula>
     */
    #[ORM\ManyToMany(targetEntity: Formula::class, mappedBy: 'rental')]
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

    // =========================================================================
    // Constructor
    // =========================================================================

    public function __construct()
    {
        $this->boat        = new ArrayCollection();
        $this->formulas    = new ArrayCollection();
        $this->fitting     = new ArrayCollection();
        $this->crewMembers = new ArrayCollection();
        $this->status      = self::STATUS_PENDING;
    }

    // =========================================================================
    // Getters & Setters — Scalar fields
    // =========================================================================

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRentalStart(): ?\DateTime
    {
        return $this->rentalStart;
    }

    public function setRentalStart(\DateTime $rentalStart): static
    {
        $this->rentalStart = $rentalStart;

        return $this;
    }

    public function getRentalEnd(): ?\DateTime
    {
        return $this->rentalEnd;
    }

    public function setRentalEnd(\DateTime $rentalEnd): static
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

    // =========================================================================
    // Getters & Setters — Relations
    // =========================================================================

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    // --- Boat -----------------------------------------------------------------

    /**
     * @return Collection<int, Boat>
     */
    public function getBoat(): Collection
    {
        return $this->boat;
    }

    public function addBoat(Boat $boat): static
    {
        if (!$this->boat->contains($boat)) {
            $this->boat->add($boat);
            $boat->setRental($this);
        }

        return $this;
    }

    public function removeBoat(Boat $boat): static
    {
        if ($this->boat->removeElement($boat)) {
            if ($boat->getRental() === $this) {
                $boat->setRental(null);
            }
        }

        return $this;
    }

    // --- Formula --------------------------------------------------------------

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

    // --- Fitting --------------------------------------------------------------

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

    // --- Crew Members ---------------------------------------------------------

    /**
     * @return Collection<int, User>
     */
    public function getCrewMembers(): Collection
    {
        return $this->crewMembers;
    }

    /**
     * Adds a crew member to this rental.
     * The caller is responsible for ensuring the user has an allowed crew role
     * (ROLE_CAPITAINE, ROLE_CHEF, ROLE_HOTESSE) before calling this method.
     */
    public function addCrewMember(User $user): static
    {
        if (!$this->crewMembers->contains($user)) {
            $this->crewMembers->add($user);
        }

        return $this;
    }

    public function removeCrewMember(User $user): static
    {
        $this->crewMembers->removeElement($user);

        return $this;
    }

    // =========================================================================
    // Computed helpers
    // =========================================================================

    /**
     * Returns the number of rental days between start and end dates.
     */
    public function getNbDays(): int
    {
        if ($this->rentalStart === null || $this->rentalEnd === null) {
            return 0;
        }

        return (int) $this->rentalStart->diff($this->rentalEnd)->days;
    }
}
