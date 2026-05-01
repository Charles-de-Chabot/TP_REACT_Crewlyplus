<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use App\Repository\BoatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: BoatRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ],
    normalizationContext: ['groups' => ['boat:read']],
    denormalizationContext: ['groups' => ['boat:write']]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'name' => 'ipartial',           // Recherche partielle insensible à la casse sur le nom
    'boatType' => 'exact',          // Filtre sur la relation Type 
    'boatModel' => 'exact',         // Filtre sur la relation Model 
    'address.city' => 'exact'       // Filtre sur la ville de l'adresse
])]
#[ApiFilter(BooleanFilter::class, properties: ['isActive', 'used'])]
#[ApiFilter(\App\Filter\BoatAvailabilityFilter::class)]
class Boat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['boat:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['boat:read', 'boat:write', 'rental:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['boat:read', 'boat:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['boat:read', 'boat:write'])]
    private ?bool $used = null;

    #[ORM\Column]
    #[Groups(['boat:read', 'boat:write'])]
    private ?float $dayPrice = null;

    #[ORM\Column]
    #[Groups(['boat:read', 'boat:write'])]
    private ?float $weekPrice = null;

    #[ORM\Column]
    #[Groups(['boat:read'])]
    private ?\DateTime $created_at = null;

    #[ORM\Column]
    #[Groups(['boat:read'])]
    private ?\DateTime $updated_at = null;

    #[ORM\Column(name: 'is_active')]
    private ?bool $isActive = true;



    #[ORM\ManyToOne(inversedBy: 'boats', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['boat:read', 'boat:write'])]
    private ?BoatInfo $boatinfo = null;

    #[ORM\ManyToOne(inversedBy: 'boats')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['boat:read', 'boat:write'])]
    #[SerializedName('type')]
    private ?Type $boatType = null;

    #[ORM\ManyToOne(inversedBy: 'boats')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['boat:read', 'boat:write'])]
    #[SerializedName('model')]
    private ?Model $boatModel = null;

    #[ORM\ManyToOne(inversedBy: 'boats', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['boat:read', 'boat:write'])]
    #[SerializedName('adress')]
    private ?Address $address = null;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\OneToMany(targetEntity: Media::class, mappedBy: 'boat')]
    #[Groups(['boat:read'])]
    private Collection $media;

    /**
     * @var Collection<int, Rental>
     */
    #[ORM\OneToMany(targetEntity: Rental::class, mappedBy: 'boat')]
    private Collection $rentals;

    /**
     * @var Collection<int, Formula>
     */
    #[ORM\ManyToMany(targetEntity: Formula::class, mappedBy: 'boat')]
    private Collection $formulas;

    public function __construct()
    {
        $this->media = new ArrayCollection();
        $this->formulas = new ArrayCollection();
        $this->rentals = new ArrayCollection();
        $this->isActive = true;
        $this->created_at = new \DateTime();
        $this->updated_at = new \DateTime();

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

    public function isUsed(): ?bool
    {
        return $this->used;
    }

    public function setUsed(bool $used): static
    {
        $this->used = $used;

        return $this;
    }

    public function getDayPrice(): ?float
    {
        return $this->dayPrice;
    }

    public function setDayPrice(float $dayPrice): static
    {
        $this->dayPrice = $dayPrice;

        return $this;
    }

    public function getWeekPrice(): ?float
    {
        return $this->weekPrice;
    }

    public function setWeekPrice(float $weekPrice): static
    {
        $this->weekPrice = $weekPrice;

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

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTime $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    #[Groups(['boat:read'])]
    #[SerializedName('isActive')]
    public function isActive(): ?bool
    {
        return $this->isActive;
    }


    #[Groups(['boat:write'])]
    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }


    public function getBoatinfo(): ?BoatInfo
    {
        return $this->boatinfo;
    }

    public function setBoatinfo(?BoatInfo $boatinfo): static
    {
        $this->boatinfo = $boatinfo;

        return $this;
    }

    public function getBoatType(): ?Type
    {
        return $this->boatType;
    }

    public function setBoatType(?Type $boatType): static
    {
        $this->boatType = $boatType;

        return $this;
    }

    public function getBoatModel(): ?Model
    {
        return $this->boatModel;
    }

    public function setBoatModel(?Model $boatModel): static
    {
        $this->boatModel = $boatModel;

        return $this;
    }

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): static
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedium(Media $medium): static
    {
        if (!$this->media->contains($medium)) {
            $this->media->add($medium);
            $medium->setBoat($this);
        }

        return $this;
    }

    public function removeMedium(Media $medium): static
    {
        if ($this->media->removeElement($medium)) {
            // set the owning side to null (unless already changed)
            if ($medium->getBoat() === $this) {
                $medium->setBoat(null);
            }
        }

        return $this;
    }


    /**
     * @return Collection<int, Formula>
     */
    public function getFormulas(): Collection
    {
        return $this->formulas;
    }

    public function addFormula(Formula $formula): static
    {
        if (!$this->formulas->contains($formula)) {
            $this->formulas->add($formula);
            $formula->addBoat($this);
        }

        return $this;
    }

    public function removeFormula(Formula $formula): static
    {
        if ($this->formulas->removeElement($formula)) {
            $formula->removeBoat($this);
        }

        return $this;
    }

    // Raccourci pour exposer directement la capacité du bateau à la racine du JSON
    #[Groups(['boat:read'])]
    #[SerializedName('maxUser')]
    public function getMaxUser(): ?int
    {
        return $this->boatinfo?->getMaxUser();
    }
}
