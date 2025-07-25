const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId
            req.auth = { userId }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    } else {
        res.status(401).json({ message: 'Non autorisé, aucun token' });
    }
};

module.exports = protect;