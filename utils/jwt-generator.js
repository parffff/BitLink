const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

module.exports = (user) => {
    const accessToken = jwt.sign({
        userId: user._id,
        role: user.role
    }, keys.jwt, {
        //expiresIn: "10h"
    })

    const refreshToken = jwt.sign({
        userId: user._id,
        role: user.role
    }, keys.jwt, {})

    return {
        accessToken,
        refreshToken
    }
}

