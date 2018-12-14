var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var utils = require('../build/utils')
module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // HOST: `'${getIPAddress()}'`,
    // PORT: '10086',
    // BASE_API: '"http://192.168.1.142:80"', // 本机php
    // BASE_API: '"http://127.0.0.1:80"',
    // BASE_API: '"http://192.168.1.142:10010/hos_api"',// 本机node 宿舍

    // BASE_API: '"http://127.0.0.1:10010/hos_api"',// 本机node
    // BASE_API: '"http://192.168.36.171:10010/hos_api"',// 本机node 公司

    BASE_API: `'http://${utils.getIPAddress()}:10010/hos_api'`,// 本机node
    CHAT_WS_SERVER: `'ws://${utils.getIPAddress()}:10010'`,
    APP_NAME: '"机yo"'

})
