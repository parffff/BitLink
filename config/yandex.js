const EasyYandexS3 = require('easy-yandex-s3').default
const keys = require('./keys')

module.exports = new EasyYandexS3({
    auth: {
        accessKeyId: keys.yandexAccess,
        secretAccessKey: keys.yandexSecret,
    },
    Bucket: 'lashmanov',
    debug: true,
});