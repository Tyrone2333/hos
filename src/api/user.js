import {_get, _post} from "@/api"

//  登录
export const login = (username, password) => {
    let req = {
        data: {
            "username": username,
            "pwd": password,
        },
        url: '/user/login'
    }
    return _post(req);
}
export const tokenLogin = () => {
    let req = {
        data: {
            // "username": username,
            // "token": token,
        },
        url: '/user/token_login'
    }
    return _post(req);
}

//  注册
export const register = (data) => {
    // 注册所填信息不定,username,pwd为必须
    //     let data = {
    //     "username": username,
    //     "pwd": password,
    //     "nickname": nickname,
    // }
    let req = {
        data,
        url: '/user/register'
    }
    return _post(req);
}
// 获取用户信息
export const getUserInfo = (id) => {
    let req = {
        url: "/user/" + id,
    }
    return _get(req)
}