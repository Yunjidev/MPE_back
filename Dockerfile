# Utiliser l'image officielle Node.js comme image de base
FROM node:latest

# Définir le répertoire de travail dans le container
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances du backend
RUN npm install

# Copier tous les fichiers du backend dans le répertoire de travail
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 8080

# Démarrer l'application
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm start"]
