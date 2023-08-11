const User = require("../models/User");
const s3 = require('../config/yandex')

// Функция входа в систему
module.exports.info = async (req, res) => {
  // Ищем пользователя с отправленным на сервер email
  const candidate = await User.findById(req.user.id).lean();
  res.status(200).json({
    id: candidate._id,
    name: candidate.name,
    surname: candidate.surname,
    age: candidate.age,
    role: candidate.role,
    city: candidate.city,
    avatar: candidate.avatar,
    photos: candidate.photos,
  });
};

module.exports.change = async (req, res) => {
  // Ищем пользователя с отправленным на сервер email
  const field = req.body.field;
  const value = req.body.newValue;
  const obj = {};
  obj[field] = value;

  const candidate = await User.updateOne({ _id: req.user.id }, obj);
  if (candidate) {
    res.status(200).json({
      message: "Success",
    });
  } else {
    res.status(404).json({
      message: "Пользователь не найден",
    });
  }
};

module.exports.avatar = async (req, res) => {
  const bufferTemp = req.file.buffer
  const uploadTemp = await s3.Upload(
    {
      buffer: bufferTemp,
    },
    `/images/profile/${req.user.id}/`
  )
  await User.updateOne({ _id: req.user.id }, { avatar: uploadTemp.Location })
  res.status(200).json({ avatar: uploadTemp.Location })
};
