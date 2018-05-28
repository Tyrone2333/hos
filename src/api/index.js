const BASE_URL = process.env.BASE_API

const axios = require('axios').create({
    baseURL: BASE_URL,            //api请求的baseURL
    timeout: 0,
    // withCredentials: true, // 允许跨域 cookie ! 后端Access-Control-Allow-Credentials 必须设置 true
    // headers: {'X-Requested-With': 'XMLHttpRequest'},
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
    // let params = new URLSearchParams();
    // for (let key in req.data) {
    //
    //     params.append(key, req.data[key]);
    //     params.append("111", "222");
    // }
    //
    // log(params)
    // return axios.post(process.env.BASE_API + req.url, params);
    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    return axios({method: 'post', url: `/${req.url}`, data: req.data})

}