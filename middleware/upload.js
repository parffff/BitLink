const multer = require('multer')
const fs = require('fs')

// Распределяем выгруженные файлы в систему
const storage = multer.diskStorage({
  destination(req, file, callback) {
    // Прописываем путь, куда отправится выгруженный файл
    let path
    if (req.body.type === 'avatar') {
      path = `uploads/${req.user.id}/avatar`
    }
    if (!fs.existsSync(path)) {
      // Если такового не существет, рекурсивно создаем его
      fs.mkdirSync(path, { recursive: true })
    }
    // Возвращаем заданный путь
    callback(null, path)
  },

  filename(req, file, callback) {
    // Задаем имя файла в формате "дата-ориг.имя"
    if (req.body.type === 'avatar') {
      callback(null, file.originalname)
    } else {
      callback(null, file.originalname)
    }
  }
})

module.exports = multer({

})
