<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FittingRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: FittingRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['fitting:read']],
    denormalizationContext: ['groups' => ['fitting:write']]
)]
class Fitting
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fitting:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['fitting:read', 'fitting:write'])]
    private ?string $label = null;

    #[ORM\Column]
    #[Groups(['fitting:read', 'fitting:write'])]
    private ?float $fittingPrice = null;

    /**
     * @var Collection<int, Rental>
     */
    #[ORM\ManyToMany(targetEntity: Rental::class, mappedBy: 'fitting')]
    private Collection $rentals;

    public function __construct()
    {
        $this->rentals = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(string $label): static
    {
        $this->label = $label;

        return $this;
    }

    public function getFittingPrice(): ?float
    {
        return $this->fittingPrice;
    }

    public function setFittingPrice(float $fittingPrice): static
    {
        $this->fittingPrice = $fittingPrice;

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
            $rental->addFitting($this);
        }

        return $this;
    }

    public function removeRental(Rental $rental): static
    {
        if ($this->rentals->removeElement($rental)) {
            $rental->removeFitting($this);
        }

        return $this;
    }
}
