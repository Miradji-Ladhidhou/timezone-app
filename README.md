# TimeZone

**TimeZone** est une application web de gestion des temps pour les entreprises. Elle permet de suivre les congés, les pointages journaliers, les heures supplémentaires, ainsi que les récupérations de temps.  
Cette solution propose une interface moderne adaptée à différents rôles : **employé**, **secrétaire**, **admin**.

---

## Fonctionnalités principales

### Authentification & Rôles
- Connexion sécurisée avec JWT
- Rôles : `employe`, `secretaire`, `admin`
- Gestion des accès selon le rôle

### Congés
- Demande de congés (annuel, RTT, sans solde, maladie, maternité ...)
- Validation ou refus par les admins/secrétaires
- Détection de chevauchement avec d'autres congés ou dates bloquées
- Statut : `en_attente`, `valide`, `refuse` (+ motif si refus)

### Dates Bloquées
- Ajout/modification/suppression de dates bloquées par les admins/secrétaires
- Utiles pour jours fériés, fermetures d'entreprise, etc.

### Pointages
- Enregistrement manuel des heures :
  - Entrée
  - Pause
  - Reprise
  - Sortie
- Calcul automatique du temps de travail journalier

### Heures Supplémentaires
- Calcul automatique des heures supp après un pointage de sortie
- 7h/jour = référence
- Report des heures à récupérer si non récupéré 
- Suivi par jour, récupération possible
- Vue admin pour validation, suppression et export

### Interface
- Affichage **mobile-first** avec cards
- Tableau dynamique pour desktop
- Tri, pagination, filtres
- Modals Bootstrap pour les formulaires
- Feedbacks (alertes, badges, etc.)

---

## Stack technique

 Côté Technologie

 Frontend : React.js + React Bootstrap 
 Backend : Node.js + Express 
 Authentification : JSON Web Tokens (JWT) 
 Base de données : PostgreSQL (via Sequelize ORM) 
 Documentation : JSDoc 
 Export CSV : `json2csv` 

---

## Installation

### 1. Cloner le projet

git clone https://github.com/Miradji-Ladhidhou/timezone-app.git
cd timezone

### 2. Installer les dépendendance 

npm install 

### 3. Configurer les variables d’environnement

### server .env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_DIALECT=postgres
DB_PORT=

JWT_SECRET=
PORT=

### client .env
REACT_APP_API_URL=

### Lance le serveur
npm run start

### Lance le front 
npm run start