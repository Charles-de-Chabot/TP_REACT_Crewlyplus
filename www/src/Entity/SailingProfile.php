<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SailingProfileRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: SailingProfileRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['profile:read']],
    denormalizationContext: ['groups' => ['profile:write']]
)]
class SailingProfile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['profile:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['profile:read', 'profile:write', 'user:read'])]
    private ?int $milesSailed = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['profile:read', 'profile:write', 'user:read'])]
    private ?array $boatTypes = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['profile:read', 'profile:write', 'user:read'])]
    private ?array $achievements = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['profile:read', 'profile:write', 'user:read'])]
    private ?string $currentPosition = null;

    #[ORM\OneToOne(inversedBy: 'sailingProfile', targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['profile:read'])]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMilesSailed(): ?int
    {
        return $this->milesSailed;
    }

    public function setMilesSailed(?int $milesSailed): static
    {
        $this->milesSailed = $milesSailed;

        return $this;
    }

    public function getBoatTypes(): ?array
    {
        return $this->boatTypes;
    }

    public function setBoatTypes(?array $boatTypes): static
    {
        $this->boatTypes = $boatTypes;

        return $this;
    }

    public function getAchievements(): ?array
    {
        return $this->achievements;
    }

    public function setAchievements(?array $achievements): static
    {
        $this->achievements = $achievements;

        return $this;
    }

    public function getCurrentPosition(): ?string
    {
        return $this->currentPosition;
    }

    public function setCurrentPosition(?string $currentPosition): static
    {
        $this->currentPosition = $currentPosition;

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
}
