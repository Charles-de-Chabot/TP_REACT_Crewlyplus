# ⚓ Roadmap : Module Régates & Expérience Premium - Crewly Plus

Ce document définit la structure technique et les étapes d'implémentation pour les fonctionnalités de régates et l'espace Premium.

---

## 🏗️ 1. Architecture du Modèle de Données (Backend Symfony)

### A. Entité `Regatta`
- **Accès** : **RESTRINT AUX MEMBRES PREMIUM** (ROLE_PREMIUM). Un `Voter` ou une règle `security` dans ApiResource bloquera l'accès aux non-premium.
- **Champs** : `name`, `description` (incluant l'avis expert), `location`, `startDate`, `endDate`, `registrationPrice`.
- **Relations** : 
    - `teams` (OneToMany) : Les équipes inscrites.
    - `eligibleModels` (ManyToMany avec `Model`) : Modèles autorisés.
    - `participants` (ManyToMany avec `User`) : Inscription individuelle.

### B. Entité `SailingProfile` (Le CV Nautique)
- **Relation** : `OneToOne` avec `User`.
- **Champs** :
    - `milesSailed` (Integer)
    - `boatTypes` (JSON : ['Monocoque', 'Foil', etc.])
    - `achievements` (JSON : [{'race': 'Spi', 'rank': '1er'}])
    - `currentPosition` (String : "N°1", "Tactitien", etc.)
    - `isAvailable` (Boolean) : Pour le système de suggestion.

### C. Entité `Team` (Espace Social)
- **Champs** : `name`, `provisioningList` (JSON), `createdAt`.
- **Relations** :
    - `regatta` (ManyToOne)
    - `leader` (ManyToOne avec `User`)
    - `members` (OneToMany avec `User`) -> *Logique : 1 team active par user.*

### D. Entité `Media` (Coffre-fort numérique)
- **Extension** : Ajouter une constante de types/catégories.
    - `TYPE_IDENTITY_CARD`
    - `TYPE_FFV_LICENSE`
    - `TYPE_MEDICAL_CERTIFICATE`

---

## 🚀 2. Roadmap d'Implémentation

### Étape 1 : Le Socle (Data & Fixtures)
- [x] **Entités** : `Regatta`, `SailingProfile` (OneToOne avec User), et `Team`.
- [x] **SailingProfile** : Champs `milesSailed`, `boatTypes` (JSON), `achievements` (JSON).
- [x] **Migration** : `php bin/console make:migration`.
- [x] **Fixtures Régates** : Créer `RegattaFixtures` en extrayant les données (nom, lieu, prix, dates, avis expert) du fichier `regates_fixtures.md`.
- [x] **Fixtures Profils** : Mettre à jour `AppFixtures` pour inclure des profils nautiques types.
- [x] **Référence** : Lier un profil Premium par défaut à Charles Premium pour les tests.

### Étape 2 : Logique "Ghost Boats" (Exclusivité Premium)
- [x] **Doctrine Extension** : Créer une `QueryCollectionExtensionInterface` pour filtrer globalement les bateaux.
- [x] **Condition** : `IF (User != Premium AND boat.used == true AND now < created_at + 48h) THEN HIDE`.
- [x] **Transparence** : Cette logique s'applique sur toutes les requêtes de liste de bateaux sans modifier les contrôleurs.

### Étape 3 : Système de Team & "Voters"
- [x] **TeamManager** : Service gérant l'adhésion (`joinTeam`) et la vérification de disponibilité.
- [x] **Sécurité (Voters)** : Créer un `TeamVoter` pour protéger les ressources de la Team.
- [x] **Vault Sécurisé** : Configurer un dossier de stockage hors `public/` pour les documents sensibles, servis via un `StreamingResponse` après vérification du Voter.

### Étape 4 : Inscription "One-Click"
- [x] **DocumentService** : Service agrégeant les données JSON du profil et les fichiers du Vault.
- [x] **Génération** : Création d'un export (PDF ou ZIP) structuré pour les organisateurs (SNIM, Spi, etc.).

### Étape 5 : Intégrations Externes (Windy & Messenger)
- [x] **WindyService** : Client API pour récupérer les prévisions météo/courant selon la localisation de la régate.
- [x] **Carte Interactive** : Intégration de l'Iframe Windy (ou Leaflet avec Windy layer) sur la page de la régate pour une visualisation en temps réel.
- [x] **Async Jobs** : Utiliser `Symfony Messenger` pour planifier les alertes de bascule de vent.
- [x] **Notifications** : Envoi automatisé (Email/SMS) 2h avant le signal de départ de la régate.

### Étape 6 : Frontend - Design System & Base UI
- [x] **Thème "Deep Sea"** :
    - Background : Gradient radial de `#050810` (centre) à `#020408` (bords).
    - Palette : Cyan Electrique (`#00f2ff`) pour l'énergie, Or Sablé (`#c5a059`) pour le luxe, Blanc Pur (`#ffffff`) à 90% d'opacité pour le texte.
- [x] **Bibliothèque Glassmorphism** :
    - `GlassCard` : `background: rgba(255, 255, 255, 0.03)`, `backdrop-filter: blur(15px)`, `border: 1px solid rgba(255, 255, 255, 0.08)`.
    - `GlassButton` : Effet de survol avec translation de 2px vers le haut et augmentation du `box-shadow` cyan.
- [x] **Typographie & Iconographie** :
    - Headings : `Outfit` (moderne, géométrique).
    - Body : `Inter` (lisibilité optimale).
    - Icons : `Lucide React` avec un stroke-width fin (1.5px).
- [x] **Logique Technique** :
    - Utilisation de variables CSS pour le thème afin de permettre un switch facile si besoin.
    - Création de composants React réutilisables (`<GlassCard />`, `<PremiumBadge />`).

### Étape 7 : Frontend - Pages & Features
- [x] **Profil "Sailing CV"** :
    - Dashboard personnel montrant le total des milles avec une animation de compteur (`countUp`).
    - Liste des types de bateaux (`boatTypes`) sous forme de badges stylisés.
    - Zone "Palmarès" : Cartes horizontales pour chaque `achievement` avec une icône de trophée dorée.
- [x] **Catalogue "Ghost Boats"** :
    - Liste des bateaux filtrée.
    - Les modèles `used: true` affichent un contour cyan pulsant (`animation: pulse-cyan 2s infinite`).
    - Overlay "Exclusivité Premium" avec une icône de chrono (indiquant l'accès anticipé).
- [x] **Explorer Régates** :
    - Grille de cartes. Au survol, la carte s'agrandit légèrement et révèle le bouton "Avis de l'Expert".
    - Badge dynamique selon le statut (Inscription ouverte / Bientôt).
- [x] **Logique Technique** :
    - `AuthContext` : Utiliser le rôle de l'utilisateur pour conditionner l'affichage des éléments Premium.
    - `React Query` (ou `Axios` + `useEffect`) : Fetcher les données de `/api/boats` et gérer l'état de chargement stylisé.
    - `Forms` : Utilisation de `React Hook Form` pour la mise à jour du `SailingProfile`.

### Étape 8 : Frontend - Intégrations Avancées
- [x] **Module Windy (Page Détail Régate)** :
    - [x] Intégration de l'Iframe Windy dans un conteneur `GlassCard`.
    - [x] Ajout d'un sélecteur de calques (Vent / Vagues / Courant) si possible via les options d'URL Windy.
- [x] **Team Workspace (Espace Collaboratif)** :
    - [x] Liste des équipiers avec statut "Vérifié" (si leurs documents du Vault sont valides).
    - [x] Éditeur interactif pour la `provisioningList` (liste de courses partagée).
    - [x] **Bouton One-Click** : Bouton d'action principal avec icône de téléchargement. Affichage d'un `Spinner` pendant la génération du ZIP.
- [x] **Digital Vault (Gestionnaire de Documents)** :
    - [x] Interface de type "Dropzone" pour uploader les fichiers.
    - [x] Liste des fichiers avec prévisualisation (si image) et icône de bouclier pour confirmer le stockage sécurisé hors-public.
- [x] **Logique Technique** :
    - [x] `Iframe Construction` : Calcul dynamique de l'URL Windy selon les coordonnées de la régate.
    - [x] `Blob Handling` : Utilisation de `axios.get(url, { responseType: 'blob' })` pour déclencher le téléchargement du ZIP d'inscription et des documents du Vault.
    - [x] `JSON Editor` : État local pour la `provisioningList` avec un `debounce` avant l'envoi du `PATCH` à l'API.

---

---

## 🛠️ 3. Spécifications Techniques Détaillées

### Performance
- **Cache** : Les prédictions Windy doivent être mises en cache (Redis/Filesystem) pour limiter les appels API.
- **Lazy Loading** : Le `SailingProfile` ne doit être chargé que sur les pages de profil ou de recrutement.

### Sécurité & Confidentialité
- **Access Control** : Seuls les membres d'une équipe peuvent voir la `provisioningList` et les documents partagés.
- **RGPD** : Possibilité pour l'utilisateur de purger ses documents du Vault à tout moment.

### Clean Code
- **DTOs** : Utiliser des DTO pour les formulaires de création de Team complexes.
- **Repository Pattern** : Toute la logique de filtrage des bateaux fantômes doit rester dans la couche Repository/Extension.

---

## 🎨 4. Design System & UI (Aesthétique Premium)

### Thème : "Elite Dark Nautical"
- **Background** : Dark mode profond (`#050810`) avec des dégradés radiaux bleus sombres.
- **Glassmorphism** : Cartes et panneaux avec `backdrop-filter: blur(12px)` et des bordures blanches très fines (0.5px) à 10% d'opacité.
- **Accents** : 
    - `Primary`: Cyan Vibrant (`#00f2ff`) pour les actions et le vent.
    - `Secondary`: Or Brossé (`#c5a059`) pour le prestige Premium.

### Typographie
- **Titres** : `Outfit` (Sans-serif géométrique, moderne).
- **Données/Labels** : `JetBrains Mono` ou `Inter` pour l'aspect technique et précis.

### Composants UI
- **Regatta Hero Card** : Image plein format avec un masque de gradient, titre en gras et compte à rebours avant le départ animé.
- **Sailing CV Dashboard** : Graphiques circulaires (charts) pour les miles parcourus et badges holographiques pour les résultats de course.
- **Windy Map Container** : Intégration full-width avec un effet d'ombre interne pour simuler un écran radar encastré.
- **Team Chat** : Bulles de message ultra-minimalistes avec des avatars circulaires bordés d'un liseré de couleur selon le rôle (Capitaine = Or, Equipier = Cyan).
