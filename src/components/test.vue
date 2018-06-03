<template>
    <div class="test">
        {{resData}}

        <form @submit.prevent="submitBtnClick">
            username: <input type="text" v-model="username" name="username">
            <input type="submit" value="submit">
        </form>


    </div>
</template>

<script type="text/ecmascript-6">
    import {_get, _post} from "@/api"
    import {getAritcleList} from "@/api/article.js"
    import {getCollectList} from "@/api/collect.js"

    import axios from "axios"

    export default {
        name: "test",
        data() {
            return {
                resData: "",
                username: "",
            }
        },
        methods: {
            async submitBtnClick() {
                let _this = this
                let req = {
                    url: 'http://localhost:3000/test',
                    data: {
                        "username": _this.username,
                        age: 11,
                        "password": "123456"
                    }
                }
                // _get(req)
                //     .then(function (response) {
                //         console.log(response.data);
                //         _this.resData = response.data
                //     })

                log(1)
              _this.$store.dispatch("getCollectList",1)
                log(2)
            }
        },
        mounted() {
            let _this = this
            let req = {
                url: 'http://localhost:3000/user/add_user',
                data: {
                    "username": "en20",
                    age: 11,
                    "password": "seohidnoasdgn"
                }
            }

            // _post(req).then(function (response) {
            //     console.log(response.data);
            //     _this.resData = response.data
            // })
            //     .catch(function (error) {
            //         console.log(error);
            //     })

            // axios.post(req.url, {params: req.data})
            //     .then(function (response) {
            //         console.log(response.data);
            //         _this.resData = response.data
            //     })


            // 官方建议的
            // const params = new URLSearchParams();
            // params.append('param1', 'value1');
            // params.append('param2', 'value2');
            // axios.post(process.env.BASE_API + '/console/article_list.php', params);

            // axios.post
            // axios.post(process.env.BASE_API + '/console/article_list.php', {
            //     firstName: 'Fred',
            //     lastName: 'Flintstone'
            // }).then(function (response) {
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });

            // 发送 POST 请求
            // axios({
            //     method: 'post',
            //     url: 'http://192.168.1.186/console/get_article.php',
            //     data: {
            //         firstName: 'Fred',
            //         lastName: 'Flintstone'
            //     }
            // }).then(function (response) {
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     })


        },
    }
</script>

<style>

</style>
