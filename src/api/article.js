import {_get, _post} from "@/api"

export const getAritcleList = (page) => {
    let req = {
        data:{
            page,
            n:Math.random(),
        },
        url: "console/article_list.php"

    }
    return _get(req)
}