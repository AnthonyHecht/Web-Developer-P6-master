const User = require('../models/User');
// importation de bcrypt pour sécuriser les mot de passes
const bcrypt = require('bcrypt');
// importation de JSON Web Token
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    //test regex sur le mot de passe crée
    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[&,#,$,@,£,*])(?=.{8,})/.test(req.body.password)) {
        return res.status(401).json({ error: 'Le mot de passe doit contenir au minimum huit caractères, une lettre minuscule, une majuscule et un caractère spécial "&,#,$,@,£,*".'})
    } else {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'utilisateur créé' }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_SECRET_TOKEN',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};