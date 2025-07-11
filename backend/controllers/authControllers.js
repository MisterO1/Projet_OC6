const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config()

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ message: 'Email déjà utilisé' });
            }
            bcrypt.hash(req.body.password, 10)
                .then( hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    })
                    return user.save()
                        .then(()=> res.status(201).json({message: 'utilisateur créé avec succès'}))
                        .catch((error)=> res.status(400).json({ error }))
                })
        })
        .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (!user){
                return res.status(401).json({message: 'Pair identifiant/mot de passe incorrect'})
            }else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid){
                            return res.status(401).json({message: 'Pair identifiant/mot de passe incorrect'})
                        }else{
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    process.env.JWT_SECRET,
                                    { expiresIn: '24h'}
                                )
                            })
                        }
                    })
                    .catch(error => {
                        console.error("Erreur pendant la connexion :", error);
                        res.status(500).json({ error: "Erreur serveur" });
                    })
            }
        })
        .catch((error)=> res.status(500).json({error}))
}