<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\DailyStatRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DailyStatRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('REGISTRATION_EDIT', object.getRegistration())"),
        new Delete(security: "is_granted('REGISTRATION_EDIT', object.getRegistration())"),
    ],
    normalizationContext: ['groups' => ['dailystat:read']],
    denormalizationContext: ['groups' => ['dailystat:write']],
)]
class DailyStat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['dailystat:read', 'registration:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'dailyStats')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['dailystat:read', 'dailystat:write'])]
    private ?Registration $registration = null;

    #[ORM\Column]
    #[Groups(['dailystat:read', 'dailystat:write'])]
    private ?int $dayNumber = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['dailystat:read', 'dailystat:write'])]
    private ?int $ranking = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['dailystat:read', 'dailystat:write'])]
    private ?float $avgSpeed = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['dailystat:read', 'dailystat:write'])]
    private ?float $maxSpeed = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['dailystat:read', 'dailystat:write'])]
    private ?string $windConditions = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['dailystat:read', 'dailystat:write'])]
    private ?string $notes = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRegistration(): ?Registration
    {
        return $this->registration;
    }

    public function setRegistration(?Registration $registration): static
    {
        $this->registration = $registration;

        return $this;
    }

    public function getDayNumber(): ?int
    {
        return $this->dayNumber;
    }

    public function setDayNumber(int $dayNumber): static
    {
        $this->dayNumber = $dayNumber;

        return $this;
    }

    public function getRanking(): ?int
    {
        return $this->ranking;
    }

    public function setRanking(?int $ranking): static
    {
        $this->ranking = $ranking;

        return $this;
    }

    public function getAvgSpeed(): ?float
    {
        return $this->avgSpeed;
    }

    public function setAvgSpeed(?float $avgSpeed): static
    {
        $this->avgSpeed = $avgSpeed;

        return $this;
    }

    public function getMaxSpeed(): ?float
    {
        return $this->maxSpeed;
    }

    public function setMaxSpeed(?float $maxSpeed): static
    {
        $this->maxSpeed = $maxSpeed;

        return $this;
    }

    public function getWindConditions(): ?string
    {
        return $this->windConditions;
    }

    public function setWindConditions(?string $windConditions): static
    {
        $this->windConditions = $windConditions;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
