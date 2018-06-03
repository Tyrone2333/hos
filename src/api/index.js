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


// get
export const _get = (req) => {
    return axios.get(req.url, {params: req.data})
}

// post
export const _post = (req) => {

    // return axios({method: 'post', url: `/${req.url}`, data: req.data})
    return axios({method: 'post', url: req.url, data: req.data})

}