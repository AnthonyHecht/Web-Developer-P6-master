const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

//importation et utilisation rapide des headers cors
const cors = require('cors');
dotenv.config();

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');

//log mongoDB dans le .env
mongoose.connect(process.env.MONGOOSE,
    {useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB établie'))
    .catch(() => console.log('Connexion à MongoDB échouée'));

const app = express();

app.use(express.json());

// Création d'un dossier images si inexistant 
const fs = require('fs');
const folderName = './images';
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;