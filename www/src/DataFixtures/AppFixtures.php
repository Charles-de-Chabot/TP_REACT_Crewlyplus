<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Type;
use App\Entity\Model;
use App\Entity\Address;
use App\Entity\Boat;
use App\Entity\BoatInfo;
use App\Entity\Media;
use App\Entity\Fitting;
use App\Entity\Formula;
use App\Entity\Role;
use App\Entity\SailingProfile;
use App\Entity\Regatta;
use App\Entity\Position;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use DateTime;

class AppFixtures extends Fixture
{

    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        #[Autowire('%kernel.project_dir%')] private string $projectDir
    ) {}


    public function load(ObjectManager $manager): void
    {
        $this->loadPosition($manager);
        $this->loadRole($manager);
        $this->loadType($manager);
        $this->loadModel($manager);
        $this->loadAdress($manager);
        $this->loadFitting($manager);
        $this->loadUser($manager);
        $this->loadBoat($manager);
        $this->loadRegatta($manager);

        $manager->flush();
    }

    //==============================
    // Création des rôles
    //==============================
    public function loadRole(ObjectManager $manager)
    {
        $roles = [
            'ROLE_USER',
            'ROLE_ADMIN',
            'ROLE_PREMIUM',
            'ROLE_CAPITAINE',
            'ROLE_CHEF',
            'ROLE_HOTESSE'
        ];

        foreach ($roles as $label) {
            $role = new Role();
            $role->setLabel($label);
            $manager->persist($role);
            $this->addReference('role_' . $label, $role);
        }
    }

    //==============================
    // Création des utilisateurs
    //==============================
    public function loadUser(ObjectManager $manager)
    {
        // 1. Admin
        $admin = new User();
        $admin->setEmail('admin@crewly.com');
        $admin->setFirstname('Admin');
        $admin->setLastname('Crewly');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'password'));
        $admin->setRole($this->getReference('role_ROLE_ADMIN', Role::class));
        $manager->persist($admin);

        // 2. Premium User (pour tester la réduction)
        $premium = new User();
        $premium->setEmail('premium@gmail.com');
        $premium->setFirstname('Charles');
        $premium->setLastname('Premium');
        $premium->setPassword($this->passwordHasher->hashPassword($premium, 'password'));
        $premium->setRole($this->getReference('role_ROLE_PREMIUM', Role::class));
        
        // Création de son CV Nautique
        $profile = new SailingProfile();
        $profile->setMilesSailed(1500);
        $profile->setBoatTypes(['Monocoque', 'Foil', 'Catamaran']);
        $profile->setAchievements([
            ['race' => 'Spi Ouest-France 2024', 'rank' => '3ème'],
            ['race' => 'Giraglia 2025', 'rank' => '1er IRC']
        ]);
        $profile->setCurrentPosition('Tactitien');
        $profile->setUser($premium);
        
        $manager->persist($premium);
        $manager->persist($profile);
        $this->addReference('user_premium', $premium);

        // 3. Crew Members
        $crewData = [
            ['role' => 'ROLE_CAPITAINE', 'count' => 5, 'prefix' => 'Capitaine'],
            ['role' => 'ROLE_CHEF', 'count' => 3, 'prefix' => 'Chef'],
            ['role' => 'ROLE_HOTESSE', 'count' => 4, 'prefix' => 'Hotesse'],
        ];

        foreach ($crewData as $data) {
            for ($i = 1; $i <= $data['count']; $i++) {
                $user = new User();
                $user->setEmail(strtolower($data['prefix']) . $i . '@crewly.com');
                $user->setFirstname($data['prefix']);
                $user->setLastname('N°' . $i);
                $user->setPassword($this->passwordHasher->hashPassword($user, 'password'));
                $user->setRole($this->getReference('role_' . $data['role'], Role::class));
                $manager->persist($user);
            }
        }
    }

    //==============================
    // Création des types
    //==============================

    public function loadType(ObjectManager $manager)
    {
        $arrayType = ['Monocoque', 'Catamaran', 'MotorYatch', 'Pêche', 'Jetski', 'Kayak'];
        foreach ($arrayType as $value) {
            $type = new Type();
            $type->setLabel($value);

            $manager->persist($type);

            $this->addReference("type_" . $value, $type);
        }
    }

    //==============================
    // Création des modèles
    //==============================

    public function loadModel(ObjectManager $manager)
    {
        $arrayModel = [
            'Beneteau',
            'Jeanneau',
            'Dufour',
            'Catalina',
            'Hallberg-Rassy',
            'Lagoon',
            'Fountaine Pajot',
            'Leopard',
            'Bali',
            'Nautitech',
            'Prestige',
            'Azimut',
            'Sunseeker',
            'Princess',
            'FishHawk',
            'Trophy',
            'FunYak',
            'Abaco',
            'Yamaha',
            'Kawasaki',
            'Perception',
            'Ocean',
            // Modèles Régate 
            'Beneteau First 31.7',
            'JPK 10.10',
            'J/Boats J/99',
            'Grand Soleil 37',
            'Farr 40',
            'Nautor Swan 45'
        ];
        foreach ($arrayModel as $value) {
            $model = new Model();
            $model->setLabel($value);

            $manager->persist($model);

            $this->addReference("model_" . $value, $model);
        }
    }

    //==============================
    // Création des adresses
    //==============================

    public function loadAdress(ObjectManager $manager)
    {
        $adresses = [
            ['house_number' => '1', 'street_name' => 'Quai du Port', 'postcode' => '13002', 'city' => 'Marseille'],
            ['house_number' => '10', 'street_name' => 'Marina du Château', 'postcode' => '29200', 'city' => 'Brest'],
            ['house_number' => '2', 'street_name' => 'Place de la Bourse', 'postcode' => '33000', 'city' => 'Bordeaux'],
            ['house_number' => '1', 'street_name' => 'Quai Pierre Forgas', 'postcode' => '66660', 'city' => 'Port-Vendres']
        ];

        foreach ($adresses as $data) {
            $adress = new Address();
            $adress->setHouseNumber($data['house_number']);
            $adress->setStreetName($data['street_name']);
            $adress->setPostcode($data['postcode']);
            $adress->setCity($data['city']);

            $manager->persist($adress);
            $this->addReference('adress_' . $data['city'], $adress);
        }
    }

    //==============================
    // Création des bateaux
    //==============================
    public function loadBoat(ObjectManager $manager)
    {
        // Initialisation du système de fichiers
        $filesystem = new Filesystem();
        // Dossier source (où vous avez mis vos images originales)
        $sourceDir = $this->projectDir . '/public/images';
        // Dossier destination (accessible via le navigateur)
        $uploadDir = $this->projectDir . '/public/uploads/boats';

        // Création du dossier d'upload s'il n'existe pas
        if (!$filesystem->exists($uploadDir)) {
            $filesystem->mkdir($uploadDir);
        }

        $arrayBoat = [

            //==============================
            // Bateaux de plaisance
            //==============================
            //TYPE: Monocoque
            [
                'type' => "Monocoque",
                'model' => "Beneteau",
                'name' => "Ocean Spirit",
                'description' => "Oceanis 40.1 – Un croiseur moderne alliant confort et performance. Profitez d'un large cockpit ergonomique et d'un intérieur lumineux pour des croisières inoubliables.",
                'max_user' => "8",
                'boat_length' => "12.50",
                'boat_width' => "3.99",
                'boat_draught' => "2.10",
                'cabine_number' => "3",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "45",
                'used' => false
            ],
            [
                'type' => "Monocoque",
                'model' => "Jeanneau",
                'name' => "Blue Velvet",
                'description' => "Sun Odyssey 440 – Une carène fluide pour une navigation sereine en famille. Son plan de pont sans obstacle et ses passavants inclinés offrent une sécurité et un confort inégalés.",
                'max_user' => "10",
                'boat_length' => "13.34",
                'boat_width' => "4.29",
                'boat_draught' => "2.20",
                'cabine_number' => "4",
                'bed_number' => "8",
                'fuel' => "Diesel",
                'power_engine' => "57",
                'used' => false
            ],
            [
                'type' => "Monocoque",
                'model' => "Dufour",
                'name' => "L'Escale",
                'description' => "Dufour 360 Grand Large – Un intérieur baigné de lumière et un pont spacieux. Idéal pour les escapades côtières, il dispose d'une cuisine extérieure avec plancha pour vos mouillages.",
                'max_user' => "6",
                'boat_length' => "10.30",
                'boat_width' => "3.54",
                'boat_draught' => "1.90",
                'cabine_number' => "2",
                'bed_number' => "4",
                'fuel' => "Diesel",
                'power_engine' => "30",
                'used' => false
            ],
            [
                'type' => "Monocoque",
                'model' => "Catalina",
                'name' => "Horizon",
                'description' => "Catalina 425 – La robustesse américaine au service de votre confort. Ce voilier marin est doté d'un cockpit profond et d'un gréement performant pour les longues traversées.",
                'max_user' => "8",
                'boat_length' => "11.50",
                'boat_width' => "3.60",
                'boat_draught' => "1.65",
                'cabine_number' => "2",
                'bed_number' => "5",
                'fuel' => "Diesel",
                'power_engine' => "40",
                'used' => false
            ],
            [
                'type' => "Monocoque",
                'model' => "Hallberg-Rassy",
                'name' => "North Star",
                'description' => "Hallberg-Rassy 40C – Le luxe scandinave pour affronter toutes les mers. Sa qualité de finition artisanale et sa protection centrale du cockpit garantissent une navigation haut de gamme par tous les temps.",
                'max_user' => "6",
                'boat_length' => "12.30",
                'boat_width' => "3.90",
                'boat_draught' => "1.90",
                'cabine_number' => "2",
                'bed_number' => "5",
                'fuel' => "Diesel",
                'power_engine' => "75",
                'used' => false
            ],
            //TYPE: Catamaran
            [
                'type' => "Catamaran",
                'model' => "Lagoon",
                'name' => "Sea Cloud",
                'description' => "Lagoon 420 – Une véritable villa flottante avec vue à 360°. Son salon de plain-pied et son immense flybridge en font le choix numéro 1 pour le farniente au soleil.",
                'max_user' => "12",
                'boat_length' => "12.80",
                'boat_width' => "7.70",
                'boat_draught' => "1.25",
                'cabine_number' => "4",
                'bed_number' => "10",
                'fuel' => "Diesel",
                'power_engine' => "114",
                'used' => false
            ],
            [
                'type' => "Catamaran",
                'model' => "Fountaine Pajot",
                'name' => "Aura",
                'description' => "Isla 40 – Design élégant et zones de détente immenses. Ce modèle se distingue par ses lignes inversées et son salon de pont avant incroyablement convivial pour l'apéritif.",
                'max_user' => "10",
                'boat_length' => "11.73",
                'boat_width' => "6.63",
                'boat_draught' => "1.20",
                'cabine_number' => "3",
                'bed_number' => "8",
                'fuel' => "Diesel",
                'power_engine' => "60",
                'used' => false
            ],
            [
                'type' => "Catamaran",
                'model' => "Leopard",
                'name' => "Wild Cat",
                'description' => "Leopard 45 – Performance et ergonomie pour les aventuriers. Il dispose d'un cockpit avant unique accessible directement depuis le salon, parfait pour une ventilation naturelle.",
                'max_user' => "10",
                'boat_length' => "13.70",
                'boat_width' => "7.35",
                'boat_draught' => "1.25",
                'cabine_number' => "4",
                'bed_number' => "8",
                'fuel' => "Diesel",
                'power_engine' => "90",
                'used' => false
            ],
            [
                'type' => "Catamaran",
                'model' => "Bali",
                'name' => "Open Sky",
                'description' => "Bali 4.2 – Un cockpit immense sans cloisons pour vivre dehors. Grâce à sa célèbre porte oscillo-basculante, l'espace intérieur et extérieur ne font plus qu'un.",
                'max_user' => "12",
                'boat_length' => "12.10",
                'boat_width' => "6.70",
                'boat_draught' => "1.12",
                'cabine_number' => "4",
                'bed_number' => "10",
                'fuel' => "Diesel",
                'power_engine' => "80",
                'used' => false
            ],
            [
                'type' => "Catamaran",
                'model' => "Nautitech",
                'name' => "Swift Breeze",
                'description' => "Nautitech 40 Open – Le plaisir de la barre et un salon hyper convivial. Conçu pour ceux qui aiment naviguer vite tout en profitant d'un espace de vie ouvert et moderne.",
                'max_user' => "8",
                'boat_length' => "11.98",
                'boat_width' => "6.91",
                'boat_draught' => "1.35",
                'cabine_number' => "3",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "60",
                'used' => false
            ],

            //TYPE: MotorYacht
            [
                'type' => "MotorYatch",
                'model' => "Prestige",
                'name' => "Luxury Dream",
                'description' => "Prestige 520 – Le raffinement absolu pour des soirées chics. Admirez le coucher de soleil depuis son flybridge format XXL et profitez d'une suite propriétaire digne d'un hôtel 5 étoiles.",
                'max_user' => "12",
                'boat_length' => "16.10",
                'boat_width' => "4.50",
                'boat_draught' => "1.20",
                'cabine_number' => "3",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "870",
                'used' => false
            ],
            [
                'type' => "MotorYatch",
                'model' => "Azimut",
                'name' => "Italian Star",
                'description' => "Azimut Fly 50 – Le style italien pur pour briller dans la marina. Son design extérieur sculptural cache un intérieur sophistiqué avec des finitions en matériaux nobles.",
                'max_user' => "10",
                'boat_length' => "15.00",
                'boat_width' => "4.30",
                'boat_draught' => "1.10",
                'cabine_number' => "3",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "720",
                'used' => false
            ],
            [
                'type' => "MotorYatch",
                'model' => "Sunseeker",
                'name' => "Silver Bullet",
                'description' => "Predator 60 – Un monstre de puissance au design agressif. Vivez une expérience haute performance avec son toit ouvrant sport et son garage à annexe motorisé.",
                'max_user' => "12",
                'boat_length' => "18.20",
                'boat_width' => "5.00",
                'boat_draught' => "1.30",
                'cabine_number' => "3",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "1600",
                'used' => false
            ],
            [
                'type' => "MotorYatch",
                'model' => "Princess",
                'name' => "Royal Lady",
                'description' => "Princess F45 – Un yacht de prestige offrant un confort royal. Sa technologie de stabilisation de pointe assure des nuits paisibles même au mouillage.",
                'max_user' => "12",
                'boat_length' => "14.50",
                'boat_width' => "4.20",
                'boat_draught' => "1.15",
                'cabine_number' => "2",
                'bed_number' => "4",
                'fuel' => "Diesel",
                'power_engine' => "600",
                'used' => false
            ],

            //TYPE: Pêche
            [
                'type' => "Pêche",
                'model' => "FishHawk",
                'name' => "Angler Pro",
                'description' => "FishHawk 210 – Tout l'équipement professionnel pour une pêche record. Doté de viviers aérés, de multiples porte-cannes et d'un sondeur de dernière génération.",
                'max_user' => "6",
                'boat_length' => "6.50",
                'boat_width' => "2.40",
                'boat_draught' => "0.40",
                'cabine_number' => "0",
                'bed_number' => "0",
                'fuel' => "Essence",
                'power_engine' => "150",
                'used' => false
            ],
            [
                'type' => "Pêche",
                'model' => "Trophy",
                'name' => "The Hunter",
                'description' => "Trophy 2202 WA – Conçu pour la haute mer et les combats épiques. Sa cabine Walk-Around permet de circuler facilement tout autour du bateau pour ne jamais perdre votre prise.",
                'max_user' => "8",
                'boat_length' => "7.80",
                'boat_width' => "2.55",
                'boat_draught' => "0.60",
                'cabine_number' => "1",
                'bed_number' => "2",
                'fuel' => "Essence",
                'power_engine' => "300",
                'used' => false
            ],
            [
                'type' => "Pêche",
                'model' => "FunYak",
                'name' => "Robust",
                'description' => "FunYak Secu 12 – Insubmersible et ultra-pratique pour explorer les zones rocheuses. Sa coque en polyéthylène double paroi est pratiquement indestructible.",
                'max_user' => "4",
                'boat_length' => "4.50",
                'boat_width' => "1.90",
                'boat_draught' => "0.20",
                'cabine_number' => "0",
                'bed_number' => "0",
                'fuel' => "Essence",
                'power_engine' => "40",
                'used' => false
            ],
            [
                'type' => "Pêche",
                'model' => "Abaco",
                'name' => "Island King",
                'description' => "Abaco 242 – Le compromis parfait entre confort et sportivité. Un bateau de pêche côtière qui sait aussi accueillir la famille avec sa banquette modulable.",
                'max_user' => "8",
                'boat_length' => "9.20",
                'boat_width' => "2.80",
                'boat_draught' => "0.50",
                'cabine_number' => "1",
                'bed_number' => "2",
                'fuel' => "Essence",
                'power_engine' => "350",
                'used' => false
            ],

            //TYPE: Jetski
            [
                'type' => "Jetski",
                'model' => "Yamaha",
                'name' => "Wave Runner",
                'description' => "VX Cruiser HO – Des accélérations foudroyantes sur l'eau. Alliez confort de selle et technologie de pointe avec son système de commande RiDE pour des manœuvres intuitives.",
                'max_user' => "3",
                'boat_length' => "3.35",
                'boat_width' => "1.22",
                'boat_draught' => "0.30",
                'cabine_number' => "0",
                'bed_number' => "0",
                'fuel' => "Essence",
                'power_engine' => "180",
                'used' => false
            ],
            [
                'type' => "Jetski",
                'model' => "Kawasaki",
                'name' => "Ultra Jet",
                'description' => "Ultra 310LX – La référence pour les amateurs de sensations fortes. Équipé d'un compresseur, c'est l'un des jetskis les plus puissants du marché avec son système audio intégré.",
                'max_user' => "3",
                'boat_length' => "3.50",
                'boat_width' => "1.18",
                'boat_draught' => "0.30",
                'cabine_number' => "0",
                'bed_number' => "0",
                'fuel' => "Essence",
                'power_engine' => "310",
                'used' => false
            ],

            //TYPE: Kayak
            [
                'type' => "Kayak",
                'model' => "Perception",
                'name' => "Flow",
                'description' => "Perception Expression 11 – Glissez en silence au plus près de la nature. Un kayak de randonnée stable, doté d'un siège ergonomique pour de longues explorations sans fatigue.",
                'max_user' => "1",
                'boat_length' => "3.00",
                'boat_width' => "0.75",
                'boat_draught' => "0.15",
                'cabine_number' => "0",
                'bed_number' => "0",
                'fuel' => "/",
                'power_engine' => "0",
                'used' => false
            ],
            [
                'type' => "Kayak",
                'model' => "Ocean",
                'name' => "Explorer",
                'description' => "Ocean Kayak Malibu Two – Stable et rapide, idéal pour l'exploration côtière. Ce kayak Sit-on-top est le favori des familles pour sa facilité d'utilisation.",
                'max_user' => "2",
                'boat_length' => "4.20",
                'boat_width' => "0.85",
                'boat_draught' => "0.20",
                'cabine_number' => "0",
                'bed_number' => "0",
                'fuel' => "/",
                'power_engine' => "0",
                'used' => false
            ],

            //==============================
            // Bateaux de Régate
            //==============================
            // --- BENETEAU FIRST 31.7 ---
            [
                'type' => "Monocoque",
                'model' => "Beneteau First 31.7",
                'name' => "Petit Piment",
                'description' => "Un First 31.7 optimisé pour le petit temps avec un jeu de voiles en carbone.",
                'max_user' => "6",
                'boat_length' => "9.61",
                'boat_width' => "3.23",
                'boat_draught' => "1.90",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "21",
                'irc' => "0.945",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Beneteau First 31.7",
                'name' => "Zest",
                'description' => "Le vétéran du club, toujours sur le podium grâce à une carène impeccable.",
                'max_user' => "6",
                'boat_length' => "9.61",
                'boat_width' => "3.23",
                'boat_draught' => "1.90",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "21",
                'irc' => "0.942",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Beneteau First 31.7",
                'name' => "Gueule de Bois",
                'description' => "Équipage étudiant sur-motivé. Ce 31.7 est connu pour ses départs agressifs.",
                'max_user' => "6",
                'boat_length' => "9.61",
                'boat_width' => "3.23",
                'boat_draught' => "1.90",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "21",
                'irc' => "0.948",
                'used' => true
            ],

            // --- JPK 10.10 ---
            [
                'type' => "Monocoque",
                'model' => "JPK 10.10",
                'name' => "Rhum Express",
                'description' => "Préparé pour la Transquadra, ce bateau est une machine de guerre au portant.",
                'max_user' => "6",
                'boat_length' => "10.10",
                'boat_width' => "3.39",
                'boat_draught' => "1.98",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "20",
                'irc' => "1.005",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "JPK 10.10",
                'name' => "Léon",
                'description' => "Le JPK iconique du chantier. Une référence absolue sur tous les plans d'eau.",
                'max_user' => "6",
                'boat_length' => "10.10",
                'boat_width' => "3.39",
                'boat_draught' => "1.98",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "20",
                'irc' => "1.008",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "JPK 10.10",
                'name' => "Night & Day",
                'description' => "Spécialiste des courses de nuit et de l'endurance en équipage réduit.",
                'max_user' => "6",
                'boat_length' => "10.10",
                'boat_width' => "3.39",
                'boat_draught' => "1.98",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "20",
                'irc' => "1.002",
                'used' => true
            ],

            // --- J/BOATS J/99 ---
            [
                'type' => "Monocoque",
                'model' => "J/Boats J/99",
                'name' => "Symmetric Chaos",
                'description' => "Équipé d'un mât carbone et d'un double safran pour un contrôle total.",
                'max_user' => "7",
                'boat_length' => "9.94",
                'boat_width' => "3.40",
                'boat_draught' => "1.99",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "19",
                'irc' => "1.020",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "J/Boats J/99",
                'name' => "J-Vitesse",
                'description' => "Configuration inshore pour les régates de baie. Très rapide dans les relances.",
                'max_user' => "7",
                'boat_length' => "9.94",
                'boat_width' => "3.40",
                'boat_draught' => "1.99",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "19",
                'irc' => "1.018",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "J/Boats J/99",
                'name' => "Black Jack",
                'description' => "Coque sombre et voiles noires. Autant de style que de vitesse sur l'eau.",
                'max_user' => "7",
                'boat_length' => "9.94",
                'boat_width' => "3.40",
                'boat_draught' => "1.99",
                'cabine_number' => "2",
                'bed_number' => "6",
                'fuel' => "Diesel",
                'power_engine' => "19",
                'irc' => "1.022",
                'used' => true
            ],

            // --- GRAND SOLEIL 37 ---
            [
                'type' => "Monocoque",
                'model' => "Grand Soleil 37",
                'name' => "Luna Rossa",
                'description' => "Une préparation italienne pour le championnat d'Europe IRC.",
                'max_user' => "8",
                'boat_length' => "11.30",
                'boat_width' => "3.68",
                'boat_draught' => "2.10",
                'cabine_number' => "3",
                'bed_number' => "8",
                'fuel' => "Diesel",
                'power_engine' => "29",
                'irc' => "1.025",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Grand Soleil 37",
                'name' => "Bella Ciao",
                'description' => "Aussi confortable en croisière que rapide entre trois bouées.",
                'max_user' => "8",
                'boat_length' => "11.30",
                'boat_width' => "3.68",
                'boat_draught' => "2.10",
                'cabine_number' => "3",
                'bed_number' => "8",
                'fuel' => "Diesel",
                'power_engine' => "29",
                'irc' => "1.023",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Grand Soleil 37",
                'name' => "Soleil Noir",
                'description' => "Quille haute performance et équipage de pros. Redoutable au près.",
                'max_user' => "8",
                'boat_length' => "11.30",
                'boat_width' => "3.68",
                'boat_draught' => "2.10",
                'cabine_number' => "3",
                'bed_number' => "8",
                'fuel' => "Diesel",
                'power_engine' => "29",
                'irc' => "1.028",
                'used' => true
            ],

            // --- FARR 40 ---
            [
                'type' => "Monocoque",
                'model' => "Farr 40",
                'name' => "Carbon Bullet",
                'description' => "Ancien bateau du circuit mondial. Entièrement revu pour la jauge IRC.",
                'max_user' => "10",
                'boat_length' => "12.41",
                'boat_width' => "4.03",
                'boat_draught' => "2.60",
                'cabine_number' => "0",
                'bed_number' => "4",
                'fuel' => "Diesel",
                'power_engine' => "29",
                'irc' => "1.170",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Farr 40",
                'name' => "Flash Gordon",
                'description' => "Spécialiste des parcours bananes. Des manoeuvres d'équipage millimétrées.",
                'max_user' => "10",
                'boat_length' => "12.41",
                'boat_width' => "4.03",
                'boat_draught' => "2.60",
                'cabine_number' => "0",
                'bed_number' => "4",
                'fuel' => "Diesel",
                'power_engine' => "29",
                'irc' => "1.168",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Farr 40",
                'name' => "Azzurra",
                'description' => "L'ADN de la Coupe de l'America. Un bateau exigeant pour les puristes.",
                'max_user' => "10",
                'boat_length' => "12.41",
                'boat_width' => "4.03",
                'boat_draught' => "2.60",
                'cabine_number' => "0",
                'bed_number' => "4",
                'fuel' => "Diesel",
                'power_engine' => "29",
                'irc' => "1.172",
                'used' => true
            ],

            // --- NAUTOR SWAN 45 ---
            [
                'type' => "Monocoque",
                'model' => "Nautor Swan 45",
                'name' => "Blue Knight",
                'description' => "L'élégance du chantier Nautor alliée à une préparation de course offshore.",
                'max_user' => "12",
                'boat_length' => "13.83",
                'boat_width' => "3.91",
                'boat_draught' => "2.80",
                'cabine_number' => "3",
                'bed_number' => "9",
                'fuel' => "Diesel",
                'power_engine' => "53",
                'irc' => "1.185",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Nautor Swan 45",
                'name' => "Early Bird",
                'description' => "Multiple vainqueur de la Swan Cup. Un palmarès long comme le bras.",
                'max_user' => "12",
                'boat_length' => "13.83",
                'boat_width' => "3.91",
                'boat_draught' => "2.80",
                'cabine_number' => "3",
                'bed_number' => "9",
                'fuel' => "Diesel",
                'power_engine' => "53",
                'irc' => "1.188",
                'used' => true
            ],
            [
                'type' => "Monocoque",
                'model' => "Nautor Swan 45",
                'name' => "Elena",
                'description' => "Un mélange parfait de luxe intérieur et de puissance sous voiles.",
                'max_user' => "12",
                'boat_length' => "13.83",
                'boat_width' => "3.91",
                'boat_draught' => "2.80",
                'cabine_number' => "3",
                'bed_number' => "9",
                'fuel' => "Diesel",
                'power_engine' => "53",
                'irc' => "1.182",
                'used' => true
            ]
        ];

        foreach ($arrayBoat as $value) {
            //==============================
            // Création des BoatInfo
            //==============================
            $boatInfo = new BoatInfo();
            $boatInfo->setMaxUser((int)$value['max_user']);
            $boatInfo->setLength((float)$value['boat_length']);
            $boatInfo->setWidth((float)$value['boat_width']);
            $boatInfo->setDraught((float)$value['boat_draught']);
            $boatInfo->setCabineNumber((int)$value['cabine_number']);
            $boatInfo->setBedsNumber((int)$value['bed_number']);
            $boatInfo->setFuel($value['fuel']);
            $boatInfo->setPowerEngine($value['power_engine']);
            $boatInfo->setIrc(isset($value['irc']) ? (float)$value['irc'] : 0.0);

            $manager->persist($boatInfo);

            $boat = new Boat();
            $boat->setBoatinfo($boatInfo);
            $boat->setName($value['name']);
            $boat->setDescription($value['description']);

            $boat->setUsed($value['used']);
            $boat->setDayPrice(rand(200, 1000));
            $boat->setWeekPrice(rand(1000, 5000));
            $boat->setUpdatedAt(new DateTime());

            $createdAt = new DateTime();
            $createdAt->modify('-' . rand(0, 30) . 'days');
            $boat->setCreatedAt($createdAt);

            $boat->setIsActive(true);

            $cities = ['Marseille', 'Brest', 'Bordeaux', 'Port-Vendres'];
            $randomCity = $cities[array_rand($cities)];
            $boat->setAddress($this->getReference('adress_' . $randomCity, Address::class));

            $boat->setBoatType($this->getReference('type_' . $value['type'], Type::class));
            $boat->setBoatModel($this->getReference('model_' . $value['model'], Model::class));
            $this->addReference('boat_' . $value['name'], $boat);
            $boatsReferences[] = 'boat_' . $value['name'];

            $manager->persist($boat);

            // Gestion de l'image
            $imageName = strtolower($value['type']) . '.png';
            $sourceFile = $sourceDir . '/' . $imageName;
            $targetFile = $uploadDir . '/' . $imageName;

            if ($filesystem->exists($sourceFile)) {
                $filesystem->copy($sourceFile, $targetFile, true);
            }

            //==============================
            // Création des Media
            //==============================
            $media = new Media();
            $media->setMediaPath($imageName);
            $media->setBoat($boat);
            $manager->persist($media);
        }
    }

    //==============================
    // Création des équipements
    //==============================
    public function loadFitting(ObjectManager $manager)
    {
        $arrayFitting = [
            // --- ÉQUIPEMENTS RÉGATE (PERFORMANCE) ---
            [
                'label' => "Pack Tablette Tactique (iPad + Adrena)",
                'fittingPrice' => 45.0,
            ],
            [
                'label' => "Tracker GPS Haute Précision (10Hz)",
                'fittingPrice' => 15.0,
            ],
            [
                'label' => "Anémomètre Bluetooth de secours",
                'fittingPrice' => 25.0,
            ],
            [
                'label' => "Pack Caméras Debriefing (2x GoPro)",
                'fittingPrice' => 40.0,
            ],
            [
                'label' => "Gilets Auto-percutants Slim Fit (Race)",
                'fittingPrice' => 25.0,
            ],
            [
                'label' => "VHF Portable étanche avec ASN",
                'fittingPrice' => 12.0,
            ],

            // --- ÉQUIPEMENTS PLAISANCE (CONFORT & LOISIRS) ---
            [
                'label' => "Stand-Up Paddle Gonflable",
                'fittingPrice' => 35.0,
            ],
            [
                'label' => "Propulseur sous-marin (Seabob)",
                'fittingPrice' => 120.0,
            ],
            [
                'label' => "Pack Wakeboard & Gilet d'impact",
                'fittingPrice' => 50.0,
            ],
            [
                'label' => "Bouée tractable (2 places)",
                'fittingPrice' => 30.0,
            ],
            [
                'label' => "Canne à pêche de traîne + Kit leurres",
                'fittingPrice' => 20.0,
            ],
            [
                'label' => "Glacière électrique 12V/220V",
                'fittingPrice' => 15.0,
            ],
            [
                'label' => "Pack Snorkeling (4 personnes)",
                'fittingPrice' => 15.0,
            ],
            [
                'label' => "Enceinte Bluetooth Waterproof (Fusion)",
                'fittingPrice' => 10.0,
            ],
        ];

        foreach ($arrayFitting as $value) {
            $fitting = new Fitting();
            $fitting->setLabel($value['label']);
            $fitting->setFittingPrice($value['fittingPrice']);

            $manager->persist($fitting);
        }
    }

    //==============================
    // Création des régates
    //==============================
    public function loadRegatta(ObjectManager $manager)
    {
        $regattas = [
            [
                'name' => 'Spi Ouest-France Banque Populaire',
                'location' => 'La Trinité-sur-Mer, Bretagne',
                'description' => "Le pèlerinage printanier de la voile française. La Baie de Quiberon offre un terrain de jeu tactique complexe avec des effets de courant et de côte permanents. L'Avis de l'Expert : C'est LA régate test pour vos JPK 10.10 et J/99. Si vous gagnez ici, vous gagnez partout.",
                'startDate' => new \DateTime('2026-04-03'),
                'endDate' => new \DateTime('2026-04-06'),
                'latitude' => 47.5833,
                'longitude' => -3.0333,
            ],
            [
                'name' => 'SNIM (Semaine Nautique Internationale de Méditerranée)',
                'location' => 'Marseille, Vieux-Port',
                'description' => "Le coup d'envoi magistral de la saison méditerranéenne. Marseille offre une lumière unique et un accueil chaleureux au pied du Mucem. L'Avis de l'Expert : Une régate physique et rapide. Votre Farr 40 y trouvera des conditions idéales.",
                'startDate' => new \DateTime('2026-04-03'),
                'endDate' => new \DateTime('2026-04-06'),
                'latitude' => 43.2964,
                'longitude' => 5.3700,
            ],
            [
                'name' => 'Loro Piana Giraglia',
                'location' => 'Saint-Tropez -> Gênes',
                'description' => "Le monument offshore entre la France et l'Italie. Le passage de nuit autour du rocher de la Giraglia est un moment mystique et stratégique. L'Avis de l'Expert : Le Nautor Swan 45 est né pour cette course, mélange parfait de confort et de performance.",
                'startDate' => new \DateTime('2026-06-11'),
                'endDate' => new \DateTime('2026-06-17'),
                'latitude' => 43.2727,
                'longitude' => 6.6386,
            ],
            [
                'name' => 'Rolex Swan Cup',
                'location' => 'Porto Cervo, Sardaigne',
                'description' => "L'exclusivité absolue dans le sanctuaire de Porto Cervo. Le passage de 'Bomb Alley' exige des manœuvres millimétrées entre les rochers. L'Avis de l'Expert : Une compétition monotype pour vos Swan 45. Aucune erreur n'est permise.",
                'startDate' => new \DateTime('2026-09-13'),
                'endDate' => new \DateTime('2026-09-19'),
                'latitude' => 41.1350,
                'longitude' => 9.5317,
            ],
            [
                'name' => 'Les Voiles de Saint-Tropez',
                'location' => 'Saint-Tropez',
                'description' => "Le festival de Cannes de la voile. Un musée à ciel ouvert où les centenaires côtoient les prototypes en carbone. L'Avis de l'Expert : Pour le Grand Soleil 37 ou le Farr 40, c'est l'occasion de briller par son esthétique devant le monde entier.",
                'startDate' => new \DateTime('2026-09-26'),
                'endDate' => new \DateTime('2026-10-04'),
                'latitude' => 43.2727,
                'longitude' => 6.6386,
            ],
            [
                'name' => 'Copa del Rey MAPFRE',
                'location' => 'Palma de Majorque, Baléares',
                'description' => "Le temple de la performance sous le vent thermique 'Embat' qui se lève à 13h00 précise. L'Avis de l'Expert : C'est le terrain de jeu favori des J/99. Rapide et agile, ce bateau excelle dans ces conditions stables.",
                'startDate' => new \DateTime('2026-08-01'),
                'endDate' => new \DateTime('2026-08-08'),
                'latitude' => 39.5696,
                'longitude' => 2.6502,
            ],
        ];

        foreach ($regattas as $data) {
            $regatta = new Regatta();
            $regatta->setName($data['name']);
            $regatta->setLocation($data['location']);
            $regatta->setDescription($data['description']);
            $regatta->setStartDate($data['startDate']);
            $regatta->setEndDate($data['endDate']);
            $regatta->setLatitude($data['latitude']);
            $regatta->setLongitude($data['longitude']);
            
            $manager->persist($regatta);
            $this->addReference('regatta_' . str_replace(' ', '_', strtolower($data['name'])), $regatta);
        }
    }

    //==============================
    // Création des positions de régate
    //==============================
    public function loadPosition(ObjectManager $manager)
    {
        $positions = [
            ['label' => 'Numéro 1', 'x' => 50, 'y' => 10, 'zone' => 'Proue'],
            ['label' => 'Numéro 2 (Mât)', 'x' => 50, 'y' => 30, 'zone' => 'Pied de mât'],
            ['label' => 'Piano', 'x' => 50, 'y' => 45, 'zone' => 'Milieu'],
            ['label' => 'Régleur Bâbord', 'x' => 30, 'y' => 60, 'zone' => 'Cockpit Côtés'],
            ['label' => 'Régleur Tribord', 'x' => 70, 'y' => 60, 'zone' => 'Cockpit Côtés'],
            ['label' => 'Régleur GV', 'x' => 50, 'y' => 75, 'zone' => 'Cockpit Arrière'],
            ['label' => 'Barreur', 'x' => 50, 'y' => 85, 'zone' => 'Gouvernail'],
            ['label' => 'Tacticien', 'x' => 65, 'y' => 90, 'zone' => 'Arrière Droite'],
        ];

        foreach ($positions as $data) {
            $position = new Position();
            $position->setLabel($data['label']);
            $position->setX($data['x']);
            $position->setY($data['y']);
            $position->setZone($data['zone']);
            $manager->persist($position);
            
            $this->addReference('position_' . str_replace([' ', '(', ')'], ['_', '', ''], strtolower($data['label'])), $position);
        }
    }
}
