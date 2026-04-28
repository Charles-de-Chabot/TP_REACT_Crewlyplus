<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use App\Repository\RegistrationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RegistrationRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(security: "is_granted('REGISTRATION_VIEW', object)"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('REGISTRATION_EDIT', object)"),
        new Delete(security: "is_granted('REGISTRATION_EDIT', object)"),
    ],
    normalizationContext: ['groups' => ['registration:read']],
    denormalizationContext: ['groups' => ['registration:write']],
)]
class Registration
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['registration:read', 'team:read', 'regatta:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'registrations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['registration:read', 'registration:write'])]
    private ?Team $team = null;

    #[ORM\ManyToOne(inversedBy: 'registrations')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['registration:read', 'registration:write', 'team:read'])]
    private ?Regatta $regatta = null;

    #[ORM\Column(length: 20)]
    #[Groups(['registration:read', 'registration:write'])]
    private ?string $status = 'PENDING';

    #[ORM\Column(nullable: true)]
    #[Groups(['registration:read', 'registration:write'])]
    private ?int $finalPosition = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['registration:read', 'registration:write'])]
    private ?float $totalPoints = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['registration:read', 'registration:write'])]
    private ?array $archivedMembers = null;

    /**
     * @var Collection<int, DailyStat>
     */
    #[ORM\OneToMany(targetEntity: DailyStat::class, mappedBy: 'registration', orphanRemoval: true)]
    #[Groups(['registration:read', 'team:read'])]
    private Collection $dailyStats;

    #[ORM\Column]
    #[Groups(['registration:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['registration:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->dailyStats = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTeam(): ?Team
    {
        return $this->team;
    }

    public function setTeam(?Team $team): static
    {
        $this->team = $team;

        return $this;
    }

    public function getRegatta(): ?Regatta
    {
        return $this->regatta;
    }

    public function setRegatta(?Regatta $regatta): static
    {
        $this->regatta = $regatta;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getFinalPosition(): ?int
    {
        return $this->finalPosition;
    }

    public function setFinalPosition(?int $finalPosition): static
    {
        $this->finalPosition = $finalPosition;

        return $this;
    }

    public function getTotalPoints(): ?float
    {
        return $this->totalPoints;
    }

    public function setTotalPoints(?float $totalPoints): static
    {
        $this->totalPoints = $totalPoints;

        return $this;
    }

    public function getArchivedMembers(): ?array
    {
        return $this->archivedMembers;
    }

    public function setArchivedMembers(?array $archivedMembers): static
    {
        $this->archivedMembers = $archivedMembers;

        return $this;
    }

    /**
     * @return Collection<int, DailyStat>
     */
    public function getDailyStats(): Collection
    {
        return $this->dailyStats;
    }

    public function addDailyStat(DailyStat $dailyStat): static
    {
        if (!$this->dailyStats->contains($dailyStat)) {
            $this->dailyStats->add($dailyStat);
            $dailyStat->setRegistration($this);
        }

        return $this;
    }

    public function removeDailyStat(DailyStat $dailyStat): static
    {
        if ($this->dailyStats->removeElement($dailyStat)) {
            // set the owning side to null (unless already changed)
            if ($dailyStat->getRegistration() === $this) {
                $dailyStat->setRegistration(null);
            }
        }

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

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
