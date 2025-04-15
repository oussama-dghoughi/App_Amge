const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// 🔹 Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, status, domain, track } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email déjà utilisé' });

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    user = new User({ name, surname, email, password: hashedPassword, status, domain, track });
    await user.save();

    res.status(201).json({ 
      msg: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        domain: user.domain,
        track: user.track,
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error.message);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

// 🔹 Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      msg: 'Connexion réussie',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        status: user.status, 
        domain: user.domain, 
        track: user.track, 
      } 
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    res.status(500).json({ msg: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;