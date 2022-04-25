const jwt = require('jsonwebtoken')
const config = require('../config/auth.config')
const db = require('../models')
const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token) {
        return res.status(403).json({ message: 'Access token is required' })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is not valid' })
        }

        req.userId = decoded.id
        next()
    })
}

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).json({ message: err })
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        Role.find({
            _id: { $in: user.roles }
        }, (err, roles) => {
            if (err) {
                return res.status(500).json({ message: err })
            }

            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === 'admin') {
                    return next()
                }
            }

            return res.status(403).json({ message: 'User is not authorized' })
        })
    })
}

const authJwt = {
    verifyToken,
    isAdmin
}

module.exports = authJwt