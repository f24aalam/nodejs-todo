const db = require('../models')
const ROLES = db.ROLES
const User = db.user

checkDuplicateEmail = (req, res, next)  => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }

        if (user) {
            res.status(400).send({ message: 'Email already exists' })
            return;
        }

        next()
    })
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            const role = req.body.roles[i];
            if (!ROLES.includes(role)) {
                res.status(400).send({ message: `Role '${role}' is not valid` })
                return
            }
        }
    }

    next()
}

const verifySignUp = {
    checkDuplicateEmail,
    checkRolesExisted
}

module.exports = verifySignUp