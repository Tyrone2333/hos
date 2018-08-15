var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // BASE_API: '"http://192.168.1.142:80"', // 本机php
    // BASE_API: '"http://127.0.0.1:80"',
    // BASE_API: '"http://192.168.1.142:10010/hos_api"',// 本机node

    // BASE_API: '"http://127.0.0.1:10010/hos_api"',// 本机node
    BASE_API: '"http://192.168.36.171:10010/hos_api"',// 本机node
    APP_NAME: '"机yo"',
})
