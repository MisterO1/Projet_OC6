const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
    const response = User.findOne({ email: req.body.email })
    if (response) {
        res.status(400).json({message: 'email déjà utilisé'})
    }else {
        bcrypt.hash({password: req.body.password}, 10)
            .then( hash => {
                const user = new User({
                    email: req.body.password,
                    password: hash
                })
                user.save()
                    .then(()=> res.status(201).json({message: 'utilisateur créé avec succès'}))
                    .catch((error)=> res.status(400).json({ error }))
            })
            .catch((error)=> res.status(500).json({ error }) )
    }
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email})
        .then(user => {
            if (user == null){
                res.status(401).json({message: 'Pair identifiant/mot de passe incorrect'})
            }else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid){
                            res.status(401).json({message: 'Pair identifiant/mot de passe incorrect'})
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
                    .catch(error => res.status(500).json({ error }))
            }
        })
        .catch((error)=> res.status(500).json({error}))
}