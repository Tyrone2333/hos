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
