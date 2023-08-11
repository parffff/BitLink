const ONE_SIGNAL_CONFIG = require('../config/keys').oneSignal

module.exports = (req, callback) => {
    console.log('fff')
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Basic ' + ONE_SIGNAL_CONFIG
    }
    const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers
    }
    const https = require('https')

    const request = https.request(options, (resp) => {
        resp.on('data', (data) => {
            console.log(JSON.parse(data))
            return callback(null, JSON.parse(data))
        })
    })
    request.on('error', (e) => {
        // eslint-disable-next-line n/no-callback-literal
        return callback({ message: e })
    })
    request.write(JSON.stringify(req))
    request.end()
}
