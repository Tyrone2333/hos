import {_get, _post} from "@/api"

//  登录
export const login = (username,password) => {
    let req = {
        data:{
            "username": username,
            "pwd": password,
        },
        url: '/user/login'
    }
    return _post(req);
}

//  注册
export const register = (data) => {
    let req = {
        data,
        url: '/user/register'
    }
    return _post(req);
}