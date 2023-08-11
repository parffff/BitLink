const express = require('express')
const router = express.Router()
const controller = require('../controllers/newsCont')
const passport = require('passport')
const upload = require('../middleware/upload')
// Роуты авторизации
router.post('/add', passport.authenticate('jwt', { session: false }),
    upload.any('images'),
    controller.add)
router.patch('/add/comment', passport.authenticate('jwt', { session: false }), controller.addComment)
router.patch('/like/change', passport.authenticate('jwt', { session: false }), controller.changeUserLike)
router.get('/all', controller.getAll)
module.exports = router
