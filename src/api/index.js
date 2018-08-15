import Vue from 'vue'
import {ToastPlugin, LoadingPlugin} from 'vux'
import router from "../router"

Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)

const BASE_URL = process.env.BASE_API

log("BASE_URL:" + BASE_URL)
const axios = require('axios').create({
    baseURL: BASE_URL,            //api请求的baseURL
    timeout: 6000,
    // withCredentials: true, // 允许跨域 cookie ! 后端Access-Control-Allow-Credentials 必须设置 true
    // headers: {'X-Requested-With': 'XMLHttpRequest'},
    // headers: {'token': JSON.parse(localStorage.token) || ""},
    maxContentLength: 2000,
    transformResponse: [function (data) {
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = {}
        }
        return data
    }],
})

// 设置重试次数及重试延迟
axios.defaults.retry = 4
axios.defaults.retryDelay = 1000
// http response 拦截器
axios.interceptors.response.use(
    response => {

        // 如请求正确,则将 loading 关闭
        Vue.$vux.loading.hide()

        if (response.data.errno === 401) {
            Vue.$vux.toast.show({
                text: response.data.message,
                type: "warn",
            })

            router.replace({
                path: 'login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            })
        }


        return response
    },
    error => {

        // 弹窗显示后台404 500 错误
        if (error.response) {
            switch (error.response.status) {

                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    // 处理没写好会造成重复bug重复跳到登录
                    // 所以使用response拦截后台已经预料到的401
                    // router.replace({
                    //     path: 'login',
                    //     query: {redirect: router.currentRoute.fullPath}
                    // })
                    break
                case 404:
                    Vue.$vux.toast.show({
                        text: "404啦,请联系管理员",
                        type: "warn",
                    })
                    break
                case 500:
                    Vue.$vux.toast.show({
                        text: "服务器错误,请联系管理员",
                        type: "warn",
                    })
                    break
                default:


            }
        }

        // 请求失败后重试
        let config = error.config
        // 如果 config 不存在，或 retry 未设置, reject
        if (!config || !config.retry) {
            return Promise.reject(error)
        }

        // 保存重试次数
        config.__retryCount = config.__retryCount || 0

        // 重试次数大于设置的次数，reject
        if (config.__retryCount >= config.retry) {
            Vue.$vux.loading.hide()
            return Promise.reject(error)
        }
        console.log(`第 ${config.__retryCount + 1} 次重试`)

        // 重试统计 +1
        config.__retryCount += 1

        // 创建一个 promise 处理新请求
        return new Promise(resolve => {
            setTimeout(resolve, config.retryDelay || 1)
        }).then(() => {
            if (!Vue.$vux.loading.isVisible()) {

                Vue.$vux.loading.show({
                    text: "网络错误，正在重试",
                })
            }
            return axios(config)
        })

    },
)

// get
export const _get = (req) => {
    return axios.get(req.url, {params: req.data})
}

// post
export const _post = (req) => {
    return axios({method: 'post', url: req.url, data: req.data})
}