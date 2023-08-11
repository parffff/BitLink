const app = require('./app')
const express = require('express')
const http = require('http')
const moment = require('moment')
const server = http.createServer(app)
const port = 9000
const Dialog = require('./models/Dialog')
const io = require('socket.io')(server)
const clients = []
const pushNotificationService = require('./middleware/notifications')
const ONE_SIGNAL_CONFIG = require('./config/keys').oneSignalAppId
app.use(express.json())


io.on('connection', (socket) => {
    console.log('connected')
    console.log(socket.id, 'has joined')

    // добавление пользователя в массив clients
    socket.on('signin', (id) => {
        console.log(socket.name + ' is signed in!')
        socket.name = id
        clients[id] = socket
        console.log('New name is', id)
    })
    socket.on('readed change', async (msg) => {
        await Dialog.updateOne({
            $or: [{ first: msg.first, second: msg.second },
            { first: msg.second, second: msg.first }]
        }, { isRead: msg.isRead })
    })

    socket.on('update message', async (msg) => {
        console.log(msg)
        await Dialog.updateOne({
            $or: [{ first: msg.first, second: msg.second },
            { first: msg.second, second: msg.first }]
        }, { $set: { [`messages.${msg.index}.message`]: msg.updatedMessage } })
    })
    socket.on('delete dialog', async (msg) => {
        console.log(msg)
        await Dialog.deleteOne({
            $or: [{ first: msg.first, second: msg.second },
            { first: msg.second, second: msg.first }]
        })
    })
    // отправка сообщения адресату
    socket.on('private_message', async (msg) => {
        const time = moment().format('YYYY-MM-DD HH:mm:ss')
        console.log(msg)
        try {
            let pushContent = ''
            switch (msg.type) {
                case 'image':
                    pushContent = 'Изображение'
                    break
                case 'voice':
                    pushContent = 'Голосовое сообщение'
                    break
                default:
                    pushContent = msg.text
                    break
            }
            // const message = {
            //     app_id: ONE_SIGNAL_CONFIG,
            //     contents: { en: pushContent },
            //     headings: { en: `${msg.from}` },
            //     large_icon: `https://finqual.ru/${msg.isUserHasAvatar ? `uploads/${msg.from}/avatar/profile.jpg` : 'ava.png'}`,
            //     //included_segments: ['included_player_ids'],
            //     included_segments: ['All'],
            //     //include_player_ids: msg.device,
            //     content_available: false,
            //     small_icon: 'default_notification_icon',
            //     data: {
            //         PushTitle: 'Новое сообщение'
            //     }
            // }

            // pushNotificationService(message, (error, results) => {
            //     if (error) {
            //         console.log(error)
            //     }
            // })

            const member = msg.from == 'admin' ? msg.to : msg.from
            const candidate = await Dialog.findOne(
                { firstMember: member }
            ).select('firstMember').lean()


            const info = {
                type: msg.type,
                from: msg.from,
                text: msg.text,
                pickedImages: msg.pickedImages,
                pickedVoice: msg.pickedVoice,
                datetime: msg.datetime
            }


            if (candidate) {
                await Dialog.updateOne({ firstMember: candidate.firstMember },
                    {
                        lastMessageTime: msg.datetime,
                        $inc: { isNotReadedCount: 1 },
                        lastSender: msg.from,
                        lastMessageType: msg.type,
                        $push: { messages: info }
                    }
                )
            } else {
                const message = Dialog({
                    firstMember: msg.from,
                    second: 'admin',
                    lastSender: msg.from,
                    lastMessageType: msg.type,
                    lastMessageTime: msg.datetime,
                    messages: [info]
                })
                await message.save()
            }
            const adressee = msg.from == 'admin' ? candidate._id : 'admin'
            if (clients[adressee]) {
                io.to(clients[adressee].id).emit('private_message', info)
                io.to(clients[adressee].id).emit('readed change',
                    { lastSender: msg.from, isRead: candidate.isNotReadedCount ? candidate.isNotReadedCount + 1 : 1 })
            }
        } catch (e) {
            console.log(e)
        }
    }

    )

    socket.on('reset_unread', async (msg) => {
        if (msg.firstMember == 'admin') {
            await Dialog.updateOne(
                { firstMember: msg.secondMember, secondMember: msg.firstMember },
                { isNotReadedCount: 0 })
        }
        else {
            await Dialog.updateOne({ firstMember: msg.firstMember, secondMember: msg.secondMember },
                { isNotReadedCount: 0 })
        }
    })

    socket.on('delete message', async (msg) => {
        console.log(msg)
        await Dialog.updateOne({
            $or: [{ first: msg.first, second: msg.second },
            { first: msg.second, second: msg.first }]
        }, { $pull: { messages: { _id: msg.messageId } } })
    })
    socket.on('get dialogs', async (msg) => {
        console.log('dialogs here', msg.userId)
        const dialogs = await Dialog.find(
            msg.userId == 'admin' ? { secondMember: msg.userId } : { firstMember: msg.userId }
        ).select('firstMember isNotReadedCount lastSender messages lastMessageTime lastMessageType').populate('firstMember', 'name surname avatar').lean()
        for (let i = 0; i < dialogs.length; i++) {
            dialogs[i]['messages'] = dialogs[i]['messages'][dialogs[i]['messages'].length - 1].text

        }
        if (clients[msg.userId]) {
            io.to(clients[msg.userId].id).emit('get dialogs',
                dialogs)
        }
    })

    socket.on('get_messages', async (msg) => {
        console.log('messages here', msg.first)

        const messages = await Dialog.findOne({
            $or: [{ firstMember: msg.firstMember, secondMember: msg.secondMember },
            { firstMember: msg.secondMember, secondMember: msg.firstMember }]
        })
        if (messages) {
            io.to(clients[msg.userId].id).emit('get_messages', messages.messages)
        }
    })
    // удаление пользователя из массива clients
    socket.on('disconnect', () => {
        console.log(socket.id, 'has disconnected')
        delete clients[socket.name]
    })
})


server.listen(port, () => console.log(`Сервер запущен на порту ${port}`))
