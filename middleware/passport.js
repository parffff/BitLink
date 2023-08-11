const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/keys')
const User = require('../models/User')
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt
}

// расшифровка json web token
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        // Взятие из БД нужной информации о пользователе, исходя из расшифрованного id
        //const userCand = await User.findById(payload.userId).select('name id').lean()
        const user = {
          id: payload.userId,
          role: payload.role,
        }

        // Отправка этой информации дальше
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      } catch (e) {
        console.log(e)
      }
    })
  )
}


