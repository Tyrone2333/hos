'use strict'
var utils = require('../build/utils')

module.exports = {
    NODE_ENV: '"production"',
    APP_NAME: '"机yo"',

    // BASE_API: '"http://www.dushizz.top:10010/hos_api"',
    // CHAT_WS_SERVER: '"ws://www.dushizz.top:10010/"',
    BASE_API: `'http://${utils.getIPAddress()}:10010/hos_api'`,// 本机node
    CHAT_WS_SERVER: `'ws://${utils.getIPAddress()}:10010'`,
}
