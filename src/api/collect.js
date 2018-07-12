import {_get, _post} from "@/api"

export const  getCollectList = (id,username,token) => {
    let req = {
        url: "/collection",
        data:{
            id,// 用户的id
            username,
            token,
        },
    }

    return _post(req)
}