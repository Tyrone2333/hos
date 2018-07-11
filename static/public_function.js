function log(meg) {
    const date = new Date()
    const time = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]\t`

    if (typeof meg === "string"  ) {
        console.log("%c " + meg + " %c",
            "background:#fff; padding: 1px; color: #1b54f2", "background:transparent")
    } else if (typeof meg === "number"){
        console.log("%c " + meg + " %c",
            "background:#41b883 ; padding: 1px; border-radius: 3px ;  color: #fff", "background:transparent")
    }
    else {
        // console.log(time, ...arguments)
        console.log(meg)
    }
}
window.log = log;
function isEmptyArr(value) {
    return (Array.isArray(value) && value.length === 0)
        || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}
function isEmptyStr(str) {
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if (str.length === 0 || str.replace(/(^s*)|(s*$)/g, "").length === 0 || str == null || re.test(str))
    {
        return true
    }else {
        return false
    }
}

