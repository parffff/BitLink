const express = require('express')
const router = express.Router()
const controller = require('../controllers/profileCont')
const passport = require('passport')
const upload = require('../middleware/upload')

// Роуты авторизации
router.get('/info', passport.authenticate('jwt', { session: false }), controller.info)
router.patch('/info/change', passport.authenticate('jwt', { session: false }), controller.change)
router.patch('/avatar/change', passport.authenticate('jwt', { session: false }), upload.single('avatar'), controller.avatar)
module.exports = router
