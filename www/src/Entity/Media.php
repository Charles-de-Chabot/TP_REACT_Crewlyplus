<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\MediaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

use ApiPlatform\Metadata\Get;
use App\Controller\MediaController;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new Get(
            uriTemplate: '/media/{id}/download',
            controller: MediaController::class,
            name: 'media_download',
            openapiContext: [
                'summary' => 'Télécharge un document sécurisé du coffre-fort',
                'description' => 'Nécessite d\'être membre de la team du propriétaire du document.'
            ]
        )
    ],
    normalizationContext: ['groups' => ['media:read']],
    denormalizationContext: ['groups' => ['media:write']]
)]
class Media
{
    public const CATEGORY_IDENTITY = 'IDENTITY';
    public const CATEGORY_LICENSE = 'LICENSE';
    public const CATEGORY_MEDICAL = 'MEDICAL';
    public const CATEGORY_BOAT_IMAGE = 'BOAT_IMAGE';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media:read', 'boat:read', 'user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:read', 'media:write', 'boat:read', 'user:read'])]
    private ?string $media_path = null;

    
    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['media:read', 'media:write', 'boat:read', 'user:read'])]
    private ?string $type = null;

    /**
     * Un média appartient à UN utilisateur (mais un utilisateur peut avoir plusieurs médias)
     */
    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'media')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['media:read'])]
    private ?User $user = null;

    /**
     * Un média appartient à UN bateau (mais un bateau peut avoir plusieurs médias)
     */
    #[ORM\ManyToOne(targetEntity: Boat::class, inversedBy: 'media')]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['media:read'])]
    private ?Boat $boat = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMediaPath(): ?string
    {
        return $this->media_path;
    }

    public function setMediaPath(string $media_path): static
    {
        $this->media_path = $media_path;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;
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

    public function getBoat(): ?Boat
    {
        return $this->boat;
    }

    public function setBoat(?Boat $boat): static
    {
        $this->boat = $boat;
        return $this;
    }
}