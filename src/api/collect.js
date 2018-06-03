import {_get, _post} from "@/api"

export const getCollectList = (user_id) => {
    let req = {
        data:{
            action:"getlist",
            user_id,
            n:Math.random(),
        },
        // url: "console/article_list.php"
        url: "console/hos_collect.php"
    }
    return _get(req)
}