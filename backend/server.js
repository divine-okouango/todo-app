const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Serveur Todo App opérationnel !' });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connecté');
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log('❌ Erreur MongoDB :', err.message);
    });