
const Dialog = require("../models/Dialog");
const s3 = require('../config/yandex')

// Функция входа в систему
module.exports.messages = async (req, res) => {
    // Ищем пользователя с отправленным на сервер email
    const firstMember = req.user.role == 'admin' ? req.query.interlocutor : req.user.id

    const messages = await Dialog.findOne({ firstMember }).select('messages').lean()
    if (messages) {
        console.log(messages)
        res.status(200).json(messages);
    } else {
        res.status(404).json({});
    }
};

module.exports.uploadFiles = async (req, res) => {
    // Ищем пользователя с отправленным на сервер email
    const links = []
    for (let i = 0; i < req.files.length; i++) {
        const bufferTemp = req.files[i].buffer
        const uploadTemp = await s3.Upload(
            {
                buffer: bufferTemp,
            },
            `/files/chat/${req.user.id}/`
        )

        links.push(uploadTemp.Location)
    }

    res.status(200).json({ links })
};
