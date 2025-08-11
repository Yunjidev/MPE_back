require('dotenv').config();
const express = require('express');
const http = require('http');
const { initIo } = require('./io');
const app = express();
const db = require('../models/index');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Routes
const publicRoutes = require('./routes/public/public-routes');
const authenticatedRoutes = require('./routes/authenticated/authenticated-routes');
const adminRoutes = require('./routes/admin/admin-routes');

const corsOptions = {
  origin: 'http://localhost:5173',
  exposedHeaders: ['Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

app.use((req, res, next) => {
  res.charset = 'UTF-8';
  next();
});

// 📌 Route de status
app.get('/api/status', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const formattedDate = `${pad(now.getDate())}/${pad(
      now.getMonth() + 1
    )}/${now.getFullYear()} à ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    res.json({
      status: '✅ OK',
      message: 'Serveur et base de données opérationnels',
      timestamp: formattedDate,
    });
  } catch (error) {
    res.status(500).json({
      status: '❌ ERREUR',
      message: 'Problème de connexion à la base de données',
      error: error.message,
    });
  }
});

const server = http.createServer(app);
initIo(server);

db.sequelize
  .authenticate()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log('Error:' + error));

const uploadDir = path.resolve(__dirname, '../uploads');
app.use('/app/uploads', express.static(uploadDir));

app.use('/api', publicRoutes);
app.use('/api', authenticatedRoutes);
app.use('/api', adminRoutes);

app.use((err, req, res, next) => {
  console.error('❌ ERREUR SERVER :', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});
