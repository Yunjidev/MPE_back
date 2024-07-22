# Utiliser l'image officielle de Node.js
FROM node:18

# Créer un répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 8080

# Démarrer l'application
CMD ["npm", "start"]

