<div align="center">

# 🌊 Crewly

![Crewly Banner](./www/public/images/readme.jpg)

### *Où le prestige rencontre la rigueur nautique*

> **Louez, Recrutez et Naviguez avec l'excellence**

---

![Symfony](https://img.shields.io/badge/Symfony-8.0-black?style=for-the-badge&logo=symfony&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge&logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Intégré-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-11.3-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📖 Présentation

**Crewly** est une plateforme nautique complète conçue pour réunir trois univers en un seul écosystème digital :

- ⛵ **Location de bateaux** — Réservez des embarcations de prestige avec paiement sécurisé via Stripe
- 👨‍✈️ **Job Board Maritime** — Recrutez ou postulez en tant que capitaine, hôtesse ou chef cuisinier à bord
- 🏁 **Gestion de Régates** — Créez des équipages, inscrivez-les à des compétitions et gérez les courses en temps réel
- 🌦️ **Météo Marine** — Consultez les conditions en mer via l'intégration de la carte interactive **Windy API**

L'architecture repose sur une **API REST Symfony** (API Platform) consommée par un **frontend React** moderne, le tout orchestré par **Docker Compose**.

---

## 🗂️ Sommaire

1. [✨ Fonctionnalités](#-fonctionnalités)
2. [🏗️ Architecture Technique](#️-architecture-technique)
3. [📋 Prérequis](#-prérequis)
4. [🚀 Installation Pas à Pas](#-installation-pas-à-pas)
   - [Étape 1 — Configuration de l'environnement](#étape-1--configuration-de-lenvironnement)
   - [Étape 2 — Lancement des containers Docker](#étape-2--lancement-des-containers-docker)
   - [Étape 3 — Initialisation du Backend Symfony](#étape-3--initialisation-du-backend-symfony)
   - [Étape 4 — Chargement des Données de Démonstration](#étape-4--chargement-des-données-de-démonstration)
   - [Étape 5 — Initialisation du Frontend React](#étape-5--initialisation-du-frontend-react)
5. [⚙️ Configuration des Variables d'Environnement](#️-configuration-des-variables-denvironnement)
6. [🌐 Accès aux Services](#-accès-aux-services)
7. [📦 Stack Technique Détaillée](#-stack-technique-détaillée)

---

## ✨ Fonctionnalités

### ⛵ Système de Location de Bateaux
- Catalogue de bateaux avec galerie photo et fiches techniques détaillées
- Système de réservation avec sélection de dates (Flatpickr)
- **Paiement en ligne sécurisé via Stripe** (Stripe Elements intégré au frontend, webhooks Symfony côté backend)
- Historique des réservations par utilisateur avec statuts visuels

### 👨‍✈️ Job Board Maritime
- Offres d'emploi à bord : capitaines, hôtesses, chefs cuisinier
- Profils de compétences et système de candidature
- Validation par les propriétaires / armateurs

### 🏁 Gestion d'Équipes & Régates
- Création et gestion d'équipages
- Inscription des équipes aux régates disponibles
- Tableau de bord de suivi des compétitions
- Chat tactique en temps réel pour les membres d'équipe (**Mercure / SSE**)

### 🌦️ Carte Météo Marine (Windy API)
- Widget météo interactif intégré directement dans la plateforme
- Visualisation des conditions de vent, vagues et température en mer
- Powered by [Windy API](https://api.windy.com/)

### 🔐 Authentification & Sécurité
- Authentification JWT (LexikJWTAuthenticationBundle)
- Rôles utilisateurs : `ROLE_USER`, `ROLE_ADMIN`
- Tableau de bord d'administration dédié

---

## 🏗️ Architecture Technique

```
TP_API_CrewlyPlus/
│
├── 🐳 docker-compose.yml          # Orchestration des services
│
├── www/                           # 🔵 Backend Symfony (API)
│   ├── src/
│   │   ├── Entity/                # Entités Doctrine (Boat, Booking, Team, Regatta...)
│   │   ├── Controller/            # Contrôleurs API Platform & custom
│   │   ├── DataFixtures/          # Données de démonstration
│   │   └── Security/              # Voters, JWT handlers
│   ├── config/
│   └── composer.json              # Dépendances PHP
│
├── frontend/                      # 🟢 Frontend React (Vite)
│   ├── src/
│   │   ├── components/            # Composants React réutilisables
│   │   ├── pages/                 # Pages de l'application
│   │   ├── store/                 # Redux Toolkit (state management)
│   │   └── constants/             # Configuration globale
│   └── package.json               # Dépendances Node.js
│
├── apache/                        # ⚙️ Config Apache + PHP
└── db/                            # 🗄️ Scripts SQL d'initialisation
```

### Services Docker

| Service | Image | Port | Rôle |
|---------|-------|------|------|
| `apache_crewlyplus` | PHP 8.4 + Apache (custom) | `8000` | Serveur Web + API Symfony |
| `mariadb_crewlyplus` | `mariadb:11.3` | `3306` | Base de données relationnelle |
| `frontend_crewlyplus` | `node:20-alpine` | `5173` | Serveur de dev Vite/React |
| `mercure_crewlyplus` | `dunglas/mercure` | `3000` | SSE temps réel (chat tactique) |

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé et configuré les éléments suivants :

| Outil | Version minimale | Lien |
|-------|-----------------|------|
| 🐳 **Docker Desktop** | 4.x | [Télécharger](https://www.docker.com/products/docker-desktop/) |
| 🐙 **Docker Compose** | v2.x (inclus dans Docker Desktop) | — |
| 💳 **Compte Stripe (test)** | Clé `votre_cle_...` | [dashboard.stripe.com](https://dashboard.stripe.com/register) |
| 🌦️ **Clé API Windy** | Gratuite | [api.windy.com](https://api.windy.com/) |

> [!IMPORTANT]
> Docker Desktop doit être **démarré et actif** avant de lancer les commandes ci-dessous. Vérifiez que les ports **8000**, **3306**, **5173** et **3000** sont disponibles sur votre machine.

---

## 🚀 Installation Pas à Pas

### Étape 1 — Configuration de l'Environnement

Clonez le projet et préparez votre fichier de configuration :

```bash
# 1. Clonez le dépôt
git clone <URL_DU_REPO> crewly
cd crewly

# 2. Copiez le fichier d'environnement exemple
cp .env.example .env
```

Ouvrez le fichier `.env` nouvellement créé et **renseignez vos valeurs** (voir la section [Configuration](#️-configuration-des-variables-denvironnement) pour le détail de chaque variable).

---

### Étape 2 — Lancement des Containers Docker

```bash
# Démarrage de tous les services en arrière-plan
docker-compose up -d
```

Attendez que tous les containers soient **healthy**. Vous pouvez vérifier leur état avec :

```bash
docker-compose ps
```

> [!NOTE]
> Le container MariaDB peut prendre **30 à 60 secondes** pour être pleinement opérationnel (healthcheck). Le container Apache attend automatiquement que MariaDB soit prêt avant de démarrer.

---

### Étape 3 — Initialisation du Backend Symfony

Toutes les commandes suivantes s'exécutent **à l'intérieur du container Apache** :

```bash
# Entrez dans le container Apache
docker exec -it apache_crewlyplus bash
```

Une fois dans le container, exécutez les commandes dans l'ordre :

```bash
# 📦 1. Installer les dépendances PHP via Composer
composer install

# 🗄️ 2. Créer la base de données
php bin/console doctrine:database:create

# 🔄 3. Exécuter toutes les migrations (création des tables)
php bin/console doctrine:migrations:migrate --no-interaction

# 🔑 4. Générer les clés JWT (authentification)
php bin/console lexik:jwt:generate-keypair

# 🌱 5. ⚠️ IMPORTANT — Charger les DataFixtures (données de démonstration)
php bin/console doctrine:fixtures:load --no-interaction
```

> [!IMPORTANT]
> La commande `doctrine:fixtures:load` est **indispensable** pour peupler la base de données avec des bateaux, utilisateurs, régates et équipes de démonstration. Sans cette étape, l'application sera vide.

> [!WARNING]
> La commande `doctrine:fixtures:load` **supprime et recrée toutes les données** existantes. Ne l'exécutez jamais sur une base de données de production.

Quittez le container une fois terminé :

```bash
exit
```

---

### Étape 4 — Chargement des Données de Démonstration

Les DataFixtures créent automatiquement :

- 👤 Des utilisateurs (dont un compte **administrateur**)
- ⛵ Des bateaux avec photos et caractéristiques
- 🏁 Des régates avec inscriptions
- 👥 Des équipes et membres d'équipage

> [!TIP]
> Consultez le fichier `www/src/DataFixtures/` pour connaître les identifiants des comptes de test créés (email / mot de passe).

---

### Étape 5 — Initialisation du Frontend React

Le frontend tourne dans son propre container Docker et démarre automatiquement. Cependant, si les modules Node ne sont pas encore installés :

```bash
# Entrez dans le container frontend
docker exec -it frontend_crewlyplus sh

# 📦 Installer les dépendances Node.js
npm install

# Quittez le container
exit
```

Le serveur de développement Vite redémarre automatiquement grâce à la commande définie dans `docker-compose.yml`.

> [!TIP]
> Si le frontend ne démarre pas, relancez le container avec `docker-compose restart frontend_crewlyplus`.

---

## ⚙️ Configuration des Variables d'Environnement

### Fichier `.env` à la racine du projet (Docker Compose)

```env
# ─── Ports ────────────────────────────────────────
APACHE_PORT=8000          # Port d'accès à l'API Symfony
MARIADB_PORT=3306         # Port MariaDB

# ─── Base de données ──────────────────────────────
MYSQL_ROOT_PASSWORD=votre_mot_de_passe_root
MYSQL_DATABASE=crewly_db
MYSQL_USER=crewly_user
MYSQL_PASSWORD=votre_mot_de_passe

# ─── Noms des containers ──────────────────────────
APACHE_CONTAINER=apache_crewlyplus
MARIADB_CONTAINER=mariadb_crewlyplus
```

### Fichier `www/.env` (Symfony — variables critiques)

> [!IMPORTANT]
> Ce fichier doit être créé/configuré **à l'intérieur du dossier `www/`**, séparément du `.env` Docker racine.

```env
# ─── Base de données ──────────────────────────────────────────────────────────
DATABASE_URL="mysql://crewly_user:votre_mot_de_passe@mariadb_crewlyplus:3306/crewly_db?serverVersion=11.3&charset=utf8mb4"

# ─── JWT (Authentification) ───────────────────────────────────────────────────
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=votre_passphrase_jwt

# ─── Stripe (Paiement) ───────────────────────────────────────────────────────
STRIPE_SECRET_KEY=votre_cle_secrete_stripe_test        # Clé secrète Stripe (mode TEST)
STRIPE_WEBHOOK_SECRET=votre_secret_webhook_stripe    # Secret du webhook Stripe

# ─── Mercure (Temps réel) ────────────────────────────────────────────────────
MERCURE_URL=http://mercure_crewlyplus/.well-known/mercure
MERCURE_PUBLIC_URL=http://localhost:3000/.well-known/mercure
MERCURE_JWT_SECRET=!ChangeThisMercureHubJWTSecretKey!

# ─── Application ─────────────────────────────────────────────────────────────
APP_ENV=dev
APP_SECRET=votre_app_secret_symfony
```

### Fichier `frontend/.env` (React / Vite)

```env
# ─── URL de l'API Backend ────────────────────────────────────────────────────
VITE_API_URL=http://localhost:8000

# ─── Stripe (Frontend) ───────────────────────────────────────────────────────
VITE_STRIPE_PUBLIC_KEY=votre_cle_publique_stripe_test  # Clé publique Stripe

# ─── Windy API (Carte Météo) ─────────────────────────────────────────────────
VITE_WINDY_API_KEY=votre_cle_windy_api
```

---

## 🌐 Accès aux Services

Une fois l'installation terminée, accédez aux différents services via votre navigateur :

| Service | URL | Description |
|---------|-----|-------------|
| 🌊 **Application Crewly** | [http://localhost:5173](http://localhost:5173) | Frontend React |
| 🔵 **API Symfony** | [http://localhost:8000/api](http://localhost:8000/api) | Endpoint REST principal |
| 📚 **Documentation API** | [http://localhost:8000/api/docs](http://localhost:8000/api/docs) | Swagger UI (API Platform) |
| 🗄️ **Base de données** | `localhost:3306` | MariaDB (via DBeaver, TablePlus…) |
| 📡 **Mercure Hub** | [http://localhost:3000](http://localhost:3000) | Serveur SSE temps réel |

---

## 📦 Stack Technique Détaillée

### 🔵 Backend — Symfony 8.0 (PHP 8.4)

Les versions exactes de chaque bundle sont consultables dans [`www/composer.json`](./www/composer.json).

| Bundle / Package | Rôle |
|-----------------|------|
| `symfony/framework-bundle ^8.0` | Cœur du framework Symfony |
| `api-platform/symfony ^4.2` | Génération automatique de l'API REST |
| `doctrine/orm ^3.6` | ORM (mapping objet-relationnel) |
| `doctrine/doctrine-migrations-bundle ^4.0` | Versioning du schéma BDD |
| `doctrine/doctrine-fixtures-bundle ^4.3` | Données de démonstration |
| `lexik/jwt-authentication-bundle ^3.2` | Authentification par tokens JWT |
| `stripe/stripe-php ^20.0` | SDK Stripe pour les paiements |
| `symfony/mercure-bundle ^0.4.2` | Temps réel (Server-Sent Events) |
| `symfony/messenger ^8.0` | Bus de messages asynchrones |
| `nelmio/cors-bundle ^2.6` | Gestion des CORS (cross-origin) |

### 🟢 Frontend — React 19 (Vite 7 + TailwindCSS 4)

Les versions exactes sont consultables dans [`frontend/package.json`](./frontend/package.json).

| Package | Rôle |
|---------|------|
| `react ^19` + `react-dom` | Bibliothèque UI principale |
| `react-router-dom ^7` | Routage côté client (SPA) |
| `@reduxjs/toolkit ^2` + `react-redux` | Gestion d'état global |
| `@stripe/react-stripe-js ^6` | Composants Stripe Elements |
| `axios ^1` | Client HTTP pour l'API |
| `tailwindcss ^4` | Framework CSS utilitaire |
| `lucide-react` + `react-icons` | Bibliothèques d'icônes |
| `recharts ^3` | Graphiques (dashboard admin) |
| `sonner ^2` | Notifications toast |
| `flatpickr ^4` | Sélecteur de dates (réservations) |

### 🐳 Infrastructure Docker

| Service | Image | Rôle |
|---------|-------|------|
| Apache + PHP | Custom Dockerfile | Serveur web + interpréteur PHP |
| MariaDB | `mariadb:11.3` | Base de données relationnelle |
| Node.js | `node:20-alpine` | Serveur de dev frontend |
| Mercure | `dunglas/mercure` | Hub SSE pour le temps réel |

---

<div align="center">

**🌊 Crewly — Projet Académique**

*Développé avec passion pour le secteur nautique*

![Symfony](https://img.shields.io/badge/Symfony-8.0-black?style=flat-square&logo=symfony)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)

</div>
