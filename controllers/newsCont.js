const News = require('../models/News')
const s3 = require('../config/yandex')
const User = require('../models/User')


module.exports.add = async (req, res) => {

    const links = []
    for (let i = 0; i < req.files.length; i++) {
        const bufferTemp = req.files[i].buffer
        const uploadTemp = await s3.Upload(
            {
                buffer: bufferTemp,
            },
            `/images/news/${req.user.id}/`
        )

        links.push(uploadTemp.Location)
    }
    const news = News({
        userId: req.user.id,
        text: req.body.text,
        images: links,
        comments: [],
    })

    await news.save()
    const example = await news.populate('userId', 'avatar name surname')
    res.status(200).json(example)

}

module.exports.getAll = async (req, res) => {


    const news = await News.find({}).populate('userId', 'avatar name surname').populate('comments.author', 'avatar name surname').lean()
    res.status(200).json(news)

}
module.exports.addComment = async (req, res) => {
    const comment = { author: req.user.id, text: req.body.text }
    const news = await News.updateOne({ _id: req.body.newsId }, { $push: { comments: comment } })
    res.status(200).json(news)

}
module.exports.changeUserLike = async (req, res) => {
    const news = await News.updateOne({ _id: req.body.newsId }, { $inc: { likesCount: req.body.likeValue } })
    if (req.body.likeValue == 1) {
        await User.updateOne({ _id: req.user.id }, { $push: { likedNews: req.body.newsId } })
    } else {
        await User.updateOne({ _id: req.user.id }, { $pull: { likedNews: req.body.newsId } })
    }

    res.status(200).json(news)

}