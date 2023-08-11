const express = require('express')
const router = express.Router()
const controller = require('../controllers/authCont')
const passport = require('passport')
// Роуты авторизации
router.post('/login', controller.login)
router.post('/sms', controller.sms)
router.get('/refresh', passport.authenticate('jwt', { session: false }), controller.refresh)
module.exports = router
