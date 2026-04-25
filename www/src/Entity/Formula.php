<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\FormulaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: FormulaRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['formula:read']],
    denormalizationContext: ['groups' => ['formula:write']]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'title' => 'ipartial',
    'boat.id' => 'exact'
])]
class Formula
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['formula:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['formula:read', 'formula:write'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['formula:read', 'formula:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['formula:read', 'formula:write'])]
    private ?float $formulaPrice = null;

    /**
     * @var Collection<int, Boat>
     */
    #[ORM\ManyToMany(targetEntity: Boat::class, inversedBy: 'formulas')]
    private Collection $boat;

    /**
     * @var Collection<int, Rental>
     */
    #[ORM\ManyToMany(targetEntity: Rental::class, inversedBy: 'formulas')]
    private Collection $rental;

    public function __construct()
    {
        $this->boat = new ArrayCollection();
        $this->rental = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getFormulaPrice(): ?float
    {
        return $this->formulaPrice;
    }

    public function setFormulaPrice(float $formulaPrice): static
    {
        $this->formulaPrice = $formulaPrice;

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
        }

        return $this;
    }

    public function removeBoat(Boat $boat): static
    {
        $this->boat->removeElement($boat);

        return $this;
    }

    /**
     * @return Collection<int, Rental>
     */
    public function getRental(): Collection
    {
        return $this->rental;
    }

    public function addRental(Rental $rental): static
    {
        if (!$this->rental->contains($rental)) {
            $this->rental->add($rental);
        }

        return $this;
    }

    public function removeRental(Rental $rental): static
    {
        $this->rental->removeElement($rental);

        return $this;
    }
}
