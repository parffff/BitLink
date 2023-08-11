// Обработчик ошибок
module.exports = (res, e) => {
  console.log(e)
  res.status(500).json({ message: e })
}
