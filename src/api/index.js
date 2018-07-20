
import Vue from 'vue'
import  { ToastPlugin } from 'vux'
import router from "../router"
Vue.use(ToastPlugin)

const BASE_URL = process.env.BASE_API

log(BASE_URL)
const axios = require('axios').create({
    baseURL: BASE_URL,            //api请求的baseURL
    timeout: 0,
    // withCredentials: true, // 允许跨域 cookie ! 后端Access-Control-Allow-Credentials 必须设置 true
    // headers: {'X-Requested-With': 'XMLHttpRequest'},
    // headers: {'token': window.localStorage.getItem('token')},
    maxContentLength: 2000,
    transformResponse: [function (data) {
        try {
            data = JSON.parse(data);
        } catch (e) {
            data = {};
        }
        if (data.status === 403) {
            // removeInfo();
            // router.push('/login');
            log("data.status === 403 ?????")
        }
        return data;
    }],

})


// http response 拦截器
axios.interceptors.response.use(
    response => {
        if(response.data.errno === 401){
            Vue.$vux.toast.show({
                text: response.data.message,
                type: "warn",
            })

            router.replace({
                path: 'login',
                query: {redirect: router.currentRoute.fullPath}
            })
        }

        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    // store.commit(types.LOGOUT);
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
            }
        }

        // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
        return Promise.reject(error)   // 返回接口返回的错误信息
    });

// get
export const _get = (req) => {
    return axios.get(req.url, {params: req.data})
}

// post
export const _post = (req) => {

    // return axios({method: 'post', url: `/${req.url}`, data: req.data})
    return axios({method: 'post', url: req.url, data: req.data})

}