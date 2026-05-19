const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { nom, email, password } = req.body;
        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ message: 'Email déjà utilisé' });
        const hash = await bcrypt.hash(password, 10);
        await User.create({ nom, email, password: hash });
        res.status(201).json({ message: 'Compte créé avec succès !' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email incorrect' });
        const valide = await bcrypt.compare(password, user.password);
        if (!valide) return res.status(400).json({ message: 'Mot de passe incorrect' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, nom: user.nom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;