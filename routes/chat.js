const express = require('express')
const router = express.Router()
const controller = require('../controllers/chatCont')
const passport = require('passport')
const upload = require('../middleware/upload')

router.get('/messages', passport.authenticate('jwt',
    { session: false }), controller.messages)

router.post('/upload', passport.authenticate('jwt',
    { session: false }), upload.any('files'), controller.uploadFiles)
module.exports = router
