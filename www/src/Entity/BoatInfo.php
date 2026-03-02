<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\BoatInfoRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: BoatInfoRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['boatinfo:read']],
    denormalizationContext: ['groups' => ['boatinfo:write']]
)]
class BoatInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['boatinfo:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?int $maxUser = null;

    #[ORM\Column]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?float $length = null;

    #[ORM\Column]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?float $width = null;

    #[ORM\Column]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?float $draught = null;

    #[ORM\Column]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?int $cabineNumber = null;

    #[ORM\Column]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?int $bedsNumber = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?string $fuel = null;

    #[ORM\Column(length: 255)]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?string $powerEngine = null;

    #[ORM\Column]
    #[Groups(['boatinfo:read', 'boatinfo:write'])]
    private ?float $irc = null;

    /**
     * @var Collection<int, Boat>
     */
    #[ORM\OneToMany(targetEntity: Boat::class, mappedBy: 'boatinfo')]
    private Collection $boats;

    public function __construct()
    {
        $this->boats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMaxUser(): ?int
    {
        return $this->maxUser;
    }

    public function setMaxUser(int $maxUser): static
    {
        $this->maxUser = $maxUser;

        return $this;
    }

    public function getLength(): ?float
    {
        return $this->length;
    }

    public function setLength(float $length): static
    {
        $this->length = $length;

        return $this;
    }

    public function getWidth(): ?float
    {
        return $this->width;
    }

    public function setWidth(float $width): static
    {
        $this->width = $width;

        return $this;
    }

    public function getDraught(): ?float
    {
        return $this->draught;
    }

    public function setDraught(float $draught): static
    {
        $this->draught = $draught;

        return $this;
    }

    public function getCabineNumber(): ?int
    {
        return $this->cabineNumber;
    }

    public function setCabineNumber(int $cabineNumber): static
    {
        $this->cabineNumber = $cabineNumber;

        return $this;
    }

    public function getBedsNumber(): ?int
    {
        return $this->bedsNumber;
    }

    public function setBedsNumber(int $bedsNumber): static
    {
        $this->bedsNumber = $bedsNumber;

        return $this;
    }

    public function getFuel(): ?string
    {
        return $this->fuel;
    }

    public function setFuel(?string $fuel): static
    {
        $this->fuel = $fuel;

        return $this;
    }

    public function getPowerEngine(): ?string
    {
        return $this->powerEngine;
    }

    public function setPowerEngine(string $powerEngine): static
    {
        $this->powerEngine = $powerEngine;

        return $this;
    }

    public function getIrc(): ?float
    {
        return $this->irc;
    }

    public function setIrc(float $irc): static
    {
        $this->irc = $irc;

        return $this;
    }

    /**
     * @return Collection<int, Boat>
     */
    public function getBoats(): Collection
    {
        return $this->boats;
    }

    public function addBoat(Boat $boat): static
    {
        if (!$this->boats->contains($boat)) {
            $this->boats->add($boat);
            $boat->setBoatinfo($this);
        }

        return $this;
    }

    public function removeBoat(Boat $boat): static
    {
        if ($this->boats->removeElement($boat)) {
            // set the owning side to null (unless already changed)
            if ($boat->getBoatinfo() === $this) {
                $boat->setBoatinfo(null);
            }
        }

        return $this;
    }
}
