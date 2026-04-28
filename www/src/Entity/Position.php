<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\PositionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: PositionRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
    ],
    normalizationContext: ['groups' => ['position:read']],
)]
class Position
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['position:read', 'membership:read', 'team:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['position:read', 'membership:read', 'team:read'])]
    private ?string $label = null;

    #[ORM\Column]
    #[Groups(['position:read', 'membership:read', 'team:read'])]
    private ?float $x = null;

    #[ORM\Column]
    #[Groups(['position:read', 'membership:read', 'team:read'])]
    private ?float $y = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['position:read', 'membership:read', 'team:read'])]
    private ?string $zone = null;

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

    public function getX(): ?float
    {
        return $this->x;
    }

    public function setX(float $x): static
    {
        $this->x = $x;

        return $this;
    }

    public function getY(): ?float
    {
        return $this->y;
    }

    public function setY(float $y): static
    {
        $this->y = $y;

        return $this;
    }

    public function getZone(): ?string
    {
        return $this->zone;
    }

    public function setZone(?string $zone): static
    {
        $this->zone = $zone;

        return $this;
    }
}
