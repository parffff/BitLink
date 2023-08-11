
const Favorite = require("../models/Favorite");

// Функция входа в систему
module.exports.all = async (req, res) => {
  // Ищем пользователя с отправленным на сервер email
  const candidate = await Favorite.findOne({ userId: req.user.id }).populate('favorites').populate('userId', 'avatar name surname').lean()
  res.status(200).json(candidate);
};

module.exports.change = async (req, res) => {
  // Ищем пользователя с отправленным на сервер email
  let candidate = null
  if (req.body.action == 1) {
    candidate = await Favorite.updateOne({ userId: req.user.id }, { $push: { favorites: req.body.newsId } })
  } else {
    candidate = await Favorite.updateOne({ userId: req.user.id }, { $pull: { favorites: req.body.newsId } })
  }

  res.status(200).json(candidate);
};