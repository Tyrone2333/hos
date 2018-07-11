import {_get, _post} from "@/api"

export const getAritcleList = (page) => {
    let req = {
        url: "console/article_list.php",
        data:{
            page,
            n:Math.random(),
        },

    }
    return _get(req)
}

export const  getCollectList = (user_id) => {
    let req = {
        url: "console/hos_collect.php",
        data:{
            action:"getlist",
            user_id,
            n:Math.random(),
        },
    }


    return _get(req)
}