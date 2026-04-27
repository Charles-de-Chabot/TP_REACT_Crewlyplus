<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\RegattaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RegattaRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['regatta:read']],
    denormalizationContext: ['groups' => ['regatta:write']],
    security: "is_granted('ROLE_PREMIUM')"
)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'ipartial', 'location' => 'ipartial'])]
class Regatta
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['regatta:read', 'user:read', 'team:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['regatta:read', 'regatta:write', 'user:read', 'team:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['regatta:read', 'regatta:write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['regatta:read', 'regatta:write'])]
    private ?string $location = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['regatta:read', 'regatta:write'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['regatta:read', 'regatta:write'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['regatta:read', 'regatta:write'])]
    private ?float $registrationPrice = null;

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, mappedBy: 'participatingRegattas')]
    #[Groups(['regatta:read'])]
    private Collection $participants;

    /**
     * @var Collection<int, Team>
     */
    #[ORM\OneToMany(targetEntity: Team::class, mappedBy: 'regatta')]
    #[Groups(['regatta:read'])]
    private Collection $teams;

    public function __construct()
    {
        $this->participants = new ArrayCollection();
        $this->teams = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

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

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getRegistrationPrice(): ?float
    {
        return $this->registrationPrice;
    }

    public function setRegistrationPrice(?float $registrationPrice): static
    {
        $this->registrationPrice = $registrationPrice;

        return $this;
    }

    /**
     * @return Collection<int, User>
     */
    public function getParticipants(): Collection
    {
        return $this->participants;
    }

    public function addParticipant(User $participant): static
    {
        if (!$this->participants->contains($participant)) {
            $this->participants->add($participant);
            $participant->addParticipatingRegatta($this);
        }

        return $this;
    }

    public function removeParticipant(User $participant): static
    {
        if ($this->participants->removeElement($participant)) {
            $participant->removeParticipatingRegatta($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Team>
     */
    public function getTeams(): Collection
    {
        return $this->teams;
    }

    public function addTeam(Team $team): static
    {
        if (!$this->teams->contains($team)) {
            $this->teams->add($team);
            $team->setRegatta($this);
        }

        return $this;
    }

    public function removeTeam(Team $team): static
    {
        if ($this->teams->removeElement($team)) {
            // set the owning side to null (unless already changed)
            if ($team->getRegatta() === $this) {
                $team->setRegatta(null);
            }
        }

        return $this;
    }
}
