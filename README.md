# LabPlatform

> Plateforme web de labs Kubernetes pour la formation et la préparation à la certification CKA — développée chez **Learneo**.

LabPlatform permet aux apprenants de pratiquer des commandes Kubernetes (`kubectl`) dans des environnements isolés, lancés à la demande dans des conteneurs Docker. Chaque lab fournit un terminal interactif dans le navigateur, suit la progression de l'apprenant étape par étape, et réinitialise l'environnement après chaque session.

---

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [Structure du projet](#structure-du-projet)
- [Fonctionnement d'un lab](#fonctionnement-dun-lab)
- [Export des données](#export-des-données)
- [Commandes utiles](#commandes-utiles)

---

## Aperçu

L'application propose un parcours de 8 labs Kubernetes organisés en deux catégories pédagogiques :

| Ordre | Lab | Concept Kubernetes |
|-------|-----|--------------------|
| 1 | Créer un Pod | la plus petite unité de Kubernetes |
| 2 | Deployment et Service | gérer plusieurs répliques |
| 3 | Namespaces | isoler des ressources |
| 4 | ConfigMaps | externaliser la configuration |
| 5 | Labels et Selectors | étiqueter et filtrer |
| 6 | Rolling Updates | mettre à jour sans interruption |
| 7 | Ingress | exposer une application |
| 8 | HPA | mise à l'échelle automatique |

Les labs se débloquent progressivement : un apprenant doit réussir les labs d'une catégorie pour accéder à la suivante. Un administrateur peut débloquer ou verrouiller manuellement un lab ou une catégorie.

---

## Stack technique

**Frontend**
- React (Create React App)
- xterm.js — terminal interactif dans le navigateur
- socket.io-client — communication temps réel
- axios — client HTTP avec intercepteur JWT

**Backend**
- Node.js / Express
- Socket.io — gestion des sessions de labs en temps réel
- dockerode — pilotage des conteneurs Docker depuis Node.js
- JWT — authentification
- node-cron — export automatique planifié

**Bases de données**
- MongoDB — base principale (users, labs, sessions, étapes)
- MySQL — base d'export pour analyses SQL

**Infrastructure**
- Docker / Docker Compose
- Kind (Kubernetes in Docker) — cluster Kubernetes simulé dans chaque lab

---

## Architecture

La plateforme repose sur deux canaux de communication distincts :

```
Frontend  <-- WebSocket (socket.io) -->  Backend  <-- Stream (dockerode) -->  Conteneur Docker
```

- Le **frontend** communique avec le **backend** via WebSocket pour le terminal en temps réel, et via HTTP (axios) pour les opérations classiques.
- Le **backend** pilote les **conteneurs Docker** via la bibliothèque dockerode, en branchant un stream bidirectionnel sur l'entrée/sortie du conteneur.
- Chaque lab lance un **cluster Kubernetes simulé** grâce à Kind, en partageant le socket Docker de l'hôte (`/var/run/docker.sock`).

---

## Fonctionnalités

**Côté apprenant**
- Authentification (inscription / connexion) avec JWT
- Parcours de labs avec déblocage progressif par catégorie
- Terminal Kubernetes interactif dans le navigateur
- Suivi de progression étape par étape en temps réel
- Écran de résultat avec score et détail des étapes
- Timer de 30 minutes par session
- Thème clair / sombre

**Côté administrateur**
- Tableau de bord de gestion des utilisateurs et de leurs statistiques
- Gestion des parcours : déblocage / verrouillage des catégories et labs
- Contrôle individuel ou en masse
- Export des données vers MySQL et fichiers compressés
- Dashboard avec thème clair / sombre indépendant

---

## Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- [Node.js](https://nodejs.org/) (pour le développement hors conteneur)
- Git

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/wiamebz/mes-projets.git
cd mes-projets/lab-platform
```

Créer un fichier `.env` dans `backend/` avec les variables suivantes :

```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/lab-platform
JWT_SECRET=votre_secret_jwt
```

> Les variables MySQL (`MYSQL_HOST`, `MYSQL_USER`, etc.) sont injectées via `docker-compose.yml`.

Construire les images Docker des labs (une seule fois) :

```bash
# Exemple pour un lab — à répéter pour chaque dossier dans labs/
cd labs/lab-kubernetes-namespaces
docker build -t lab-kubernetes-namespaces:latest .
```

---

## Lancement

```bash
# Démarrer tous les services (frontend, backend, MongoDB, MySQL)
docker-compose up -d --build
```

L'application est ensuite accessible sur :

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:5001 |
| MongoDB | localhost:27017 |
| MySQL | localhost:3307 (root / root) |

### Compte administrateur de démonstration

| Email | Mot de passe |
|-------|--------------|
| `admin@gmail.com` | `12345` |

> Ce compte donne accès au dashboard d'administration (gestion des utilisateurs, des parcours et exports). Identifiants de démonstration — à modifier avant toute mise en production.

---

## Structure du projet

```
lab-platform/
├── backend/
│   ├── middleware/        # authMiddleware, adminMiddleware (JWT)
│   ├── models/            # modèles Mongoose (User, Lab, Session, Categorie)
│   ├── routes/            # routes Express (labs, auth, admin)
│   ├── exports/           # fichiers d'export générés (.tar)
│   ├── export_csv.js      # génération des exports CSV/Excel
│   ├── export_to_sql.js   # helpers export MySQL
│   ├── server.js          # point d'entrée + logique Socket.io
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── api/axios.js    # client axios centralisé (intercepteur JWT)
│       └── pages/          # Login, Register, HomePage, Labs, Admin...
├── labs/                   # un dossier par lab Kubernetes
│   ├── lab-kubernetes-pod/
│   │   ├── Dockerfile      # recette de l'image du lab
│   │   └── lab.sh          # script d'exécution du lab
│   └── ...
└── docker-compose.yml
```

---

## Fonctionnement d'un lab

1. L'apprenant clique sur **Lancer** depuis la liste des labs.
2. Le frontend ouvre une connexion **WebSocket** et envoie le nom de l'image Docker et la commande à exécuter (`socket.emit('start_lab', ...)`).
3. Le backend vérifie le token JWT, crée une **session** en MongoDB, puis crée et démarre un **conteneur Docker** depuis l'image.
4. Le script `lab.sh` du conteneur s'exécute et lance un cluster Kubernetes via **Kind**.
5. La sortie du conteneur est diffusée en temps réel vers le terminal **xterm.js** du navigateur.
6. Le script écrit des marqueurs `STEP_COMPLETED:...` détectés par le backend pour suivre la progression, puis `LAB_COMPLETED` à la fin.
7. À la fin, le backend met à jour la session, supprime le conteneur, et le frontend affiche l'écran de résultat.

> **Note :** les dossiers dans `labs/` ne servent qu'à construire les images Docker une seule fois. Une fois l'image construite (avec `lab.sh` à l'intérieur), c'est l'image qui est utilisée à chaque session — le dossier n'est plus nécessaire à l'exécution.

---

## Export des données

L'application propose deux mécanismes d'export, déclenchables manuellement par l'administrateur ou automatiquement chaque nuit via un cron job.

**Export CSV / Excel**
Lit les données depuis MongoDB, génère des fichiers Excel, et compresse le tout en archive `.tar` stockée dans `backend/exports/`, téléchargeable depuis le dashboard admin.

**Export MySQL**
Vide les tables MySQL puis réimporte l'intégralité des données depuis MongoDB. Les données sont alors accessibles via MySQL Workbench pour des analyses SQL avancées.

> Le cron job s'exécute à minuit (fuseau `Europe/Paris`). En environnement de développement local, les exécutions peuvent être manquées si la machine est en veille — ce comportement est normal et n'existe pas sur un serveur de production fonctionnant en continu.

---

## Commandes utiles

```bash
# Docker
docker-compose up -d --build      # build + démarrage
docker-compose down               # arrêt + suppression des conteneurs
docker ps                         # conteneurs actifs
docker images                     # images disponibles
docker logs lab-platform-backend-1 --tail 20

# Bases de données
docker exec -it lab-platform-mongodb-1 mongosh    # puis : use lab-platform
docker exec -it lab-platform-mysql-1 mysql -u root -proot lab_platform

# Vérifier le script d'un lab dans son image
docker run --rm lab-kubernetes-namespaces:latest ls -la /lab/
```

---

## Auteur

**Wiame BOUZIANE** — L3 Métiers du Numérique, INSSET (Université de Picardie Jules Verne)
Stage chez Learneo — Développement full-stack et intégration de labs Kubernetes.