const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://aydeguegayr:asefth158nju@cluster0.kv19p.mongodb.net/?retryWrites=true&w=majority',
    {useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB établie'))
    .catch(() => console.log('Connexion à MongoDB échouée'));

const app = express();

app.use(express.json());


app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;