import {_get, _post} from "@/api"

export const getAritcleList = (page) => {
    let req = {
        url: "/article",
        data: {
            page,
            n: Math.random(),
        },

    }
    return _get(req)
}
export const getAritcleById = (id) => {
    let req = {
        url: "/article/" + id,
    }
    return _get(req)
}
