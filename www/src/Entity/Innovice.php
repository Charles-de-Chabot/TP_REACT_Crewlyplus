<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\InnoviceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: InnoviceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['innovice:read']],
    denormalizationContext: ['groups' => ['innovice:write']]
)]
class Innovice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['innovice:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['innovice:read', 'innovice:write'])]
    private ?string $innovice_path = null;

    #[ORM\Column]
    #[Groups(['innovice:read'])]
    private ?\DateTime $created_at = null;

    #[ORM\ManyToOne(inversedBy: 'innovices')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInnovicePath(): ?string
    {
        return $this->innovice_path;
    }

    public function setInnovicePath(string $innovice_path): static
    {
        $this->innovice_path = $innovice_path;

        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTime $created_at): static
    {
        $this->created_at = $created_at;

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
