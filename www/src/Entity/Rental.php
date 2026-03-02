<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\RentalRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RentalRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['rental:read']],
    denormalizationContext: ['groups' => ['rental:write']]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'user.email' => 'exact',    // Retrouver les réservations d'un utilisateur précis
    'boat.name' => 'ipartial'   // Retrouver les réservations liées à un bateau
])]
class Rental
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rental:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['rental:read', 'rental:write'])]
    private ?\DateTime $rentalStart = null;

    #[ORM\Column]
    #[Groups(['rental:read', 'rental:write'])]
    private ?\DateTime $rentalEnd = null;

    #[ORM\Column]
    #[Groups(['rental:read', 'rental:write'])]
    private ?float $rentalPrice = null;

    #[ORM\ManyToOne(inversedBy: 'rentals')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    /**
     * @var Collection<int, Boat>
     */
    #[ORM\OneToMany(targetEntity: Boat::class, mappedBy: 'rental')]
    private Collection $boat;

    /**
     * @var Collection<int, Formula>
     */
    #[ORM\ManyToMany(targetEntity: Formula::class, mappedBy: 'rental')]
    private Collection $formulas;

    /**
     * @var Collection<int, Fitting>
     */
    #[ORM\ManyToMany(targetEntity: Fitting::class, inversedBy: 'rentals')]
    private Collection $fitting;

    public function __construct()
    {
        $this->boat = new ArrayCollection();
        $this->formulas = new ArrayCollection();
        $this->fitting = new ArrayCollection();
    }

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
            // set the owning side to null (unless already changed)
            if ($boat->getRental() === $this) {
                $boat->setRental(null);
            }
        }

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
}
