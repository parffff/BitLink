const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const User = require('../models/User')
const Favorite = require('../models/Favorite')
const errorHandler = require('../utils/errorHandler')
const jwtGenerator = require('../utils/jwt-generator')
const request = require('request')

// Функция входа в систему
module.exports.login = async (req, res) => {
  // Ищем пользователя с отправленным на сервер email
  const candidate = await User.findOne({ phone: req.body.phone }).lean()
  if (candidate) {

    // Проверка пароля, пользователь существует
    const passwordResult = bcrypt.compareSync(req.body.smsCode, candidate.lastSMSCode)
    if (passwordResult) {
      // Пароли совпали, генерация токена

      const tokens = jwtGenerator(candidate)

      res.status(200).json({
        id: candidate._id,
        name: candidate.name,
        surname: candidate.surname,
        phone: candidate.phone,
        city: candidate.city,
        age: candidate.age,
        avatar: candidate.avatar,
        role: candidate.role,
        photos: candidate.photos,
        likedNews: candidate.likedNews,
        jwt: tokens.accessToken,
        refreshJwt: tokens.refreshToken
      })
    } else {
      // Пароли не совпали, отправляем ошибку
      res.status(401).json({
        message: 'Неверно указаны телефон или пароль'
      })
    }
  } else {
    // Пользователя нет, ошибка

    const user = User({
      phone: req.body.phone,

    })
    await user.save()


    const favorite = Favorite({ userId: user._id, favorites: [], })
    await favorite.save()

    const tokens = jwtGenerator(user)
    res.status(200).json({
      id: user._id,
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      city: user.city,
      age: user.age,
      avatar: user.avatar,
      role: user.role,
      photos: user.photos,
      likedNews: user.likedNews,
      jwt: tokens.accessToken,
      refreshJwt: tokens.refreshToken
    })


  }
}

module.exports.refresh = async (req, res) => {
  const accessToken = jwt.sign({
    userId: req.user.id,
  }, keys.jwt, {
    expiresIn: "10h"
  })
  res.status(200).json({
    token: accessToken
  })
}

module.exports.sms = async (req, res) => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const phone = encodeURIComponent(req.body.phone)
  const text = encodeURIComponent(`Ваш код: ${randomNumber}`)
  const urlStr = `http://htmlweb.ru/sendsms/api.php?send_sms&sms_text=${text}&sms_to=${phone}&api_key=example`
  await request.post(
    'https://smsc.ru/rest/send/ ',
    {
      json: true,
      body: {
        phones: req.body.phone,
        psw: 'example',
        login: 'example',
        mes: `Ваш код: ${randomNumber}`
      },
      headers: { Authorization: `Bearer ${keys.exolveAPI}` }
    },
    async function (error, response, body) {
      console.log(body)

      if (response.statusCode == 200) {
        const lastCode = randomNumber.toString()
        const salt = bcrypt.genSaltSync(10)

        await User.updateOne({ phone: req.body.phone }, { lastSMSCode: bcrypt.hashSync(lastCode, salt) })
      }
      res.status(200).json({ message: 'success' })

      return

    }
  );

}
