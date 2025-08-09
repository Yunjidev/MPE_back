# Ma Petite Entreprise Backend

## Presentation

Le backend de Ma Petite Entreprise est un projet open source développé par :
Ma Petite Entreprise.
C'est une application web qui permet aux utilisateurs de Ma Petite Entreprise de
gérer leurs offres de travail, de leur demande de devis, pour leur entreprise, etc.

## Technologies

- Node.js
- Express.js
- Sequelize
- PostgreSQL

## Installation

```bash
git clone https://github.com/Ma-Petite-Entreprise/mpe-backend.git
cd mpe-backend
npm install
```

## Configuration

- Créer un fichier `.env` à la racine du projet
- Copier le contenu du fichier `.env.example` dans le fichier `.env`
- Remplacer les variables par les valeurs correspondantes

## Démarrage

```bash
npm start
```

## API

Pour voir les routes disponibles, vous pouvez consulter le fichier `routes-postman-insomnia.json` à la racine du projet.

## Docker

```bash
docker build -t mpe-backend .
docker run -p 8080:8080 mpe-backend
```

## Contribuer

Si vous souhaitez contribuer au projet, veuillez suivre les étapes suivantes :

1.
