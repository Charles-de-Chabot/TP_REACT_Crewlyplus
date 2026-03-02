<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CrewRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CrewRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['crew:read']],
    denormalizationContext: ['groups' => ['crew:write']]
)]
#[ApiFilter(SearchFilter::class, properties: ['crewName' => 'ipartial'])]
class Crew
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['crew:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['crew:read', 'crew:write'])]
    private ?string $crewName = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['crew:read', 'crew:write'])]
    private ?string $description = null;

    /**
     * @var Collection<int, Statistic>
     */
    #[ORM\ManyToMany(targetEntity: Statistic::class, inversedBy: 'crews')]
    private Collection $statistic;

    public function __construct()
    {
        $this->statistic = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCrewName(): ?string
    {
        return $this->crewName;
    }

    public function setCrewName(string $crewName): static
    {
        $this->crewName = $crewName;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, Statistic>
     */
    public function getStatistic(): Collection
    {
        return $this->statistic;
    }

    public function addStatistic(Statistic $statistic): static
    {
        if (!$this->statistic->contains($statistic)) {
            $this->statistic->add($statistic);
        }

        return $this;
    }

    public function removeStatistic(Statistic $statistic): static
    {
        $this->statistic->removeElement($statistic);

        return $this;
    }
}
