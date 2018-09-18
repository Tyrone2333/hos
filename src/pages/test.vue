<template>
    <div class="test">
        {{resData}}

        <form @submit.prevent="submitBtnClick">
            username: <input type="text" v-model="username" name="username">
            <input type="submit" value="submit">
            <div>{{username}}</div>
        </form>

        <div class="nextTickTest" @click="nextTickTest">nextTickTest</div>

        <div class="websocket">
            <p>websocket test:</p>
            <input type="text" v-model="username">
        </div>

        <h2 @click="test">test</h2>
        <div class="transform-test">
            <div class="transform-test-item">
            </div>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import {_get, _post} from "@/api"
    import {getAritcleList} from "@/api/article.js"

    import axios from "axios"

    export default {
        name: "test",
        data() {
            return {
                resData: "",
                username: "username",
            }
        },
        computed:{
            addUsername(){
                if(this.username === ""){
                    return false
                }
                return this.username + "addUsername"
            }
        },
        methods: {
            test(){
              log(this.addUsername)
            },
            async submitBtnClick() {
                let req = {
                    url: process.env.BASE_API + '/test',
                    data: {
                        "username": "en20",
                        age: 11,
                        "password": "seohidnoasdgn"
                    }
                }

                await _get(req).then((res) => {
                    log(res)
                })
                log("await get complete")
            },
            axiosTest() {

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
            nextTickTest() {
                // 修改数据
                this.username = 'Hello'
                // DOM 还没有更新
                this.$nextTick(function () {
                    // DOM 更新了
                    log(" this.nextTick")
                })

                // 2.1.0 起新增：如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise
                this.$nextTick().then(function () {
                    // DOM 更新了
                    log(" this.nextTick().then(function () {")

                })
                log("在$nextTick之后的内容先输出")
            },

        },
        mounted() {

        },
    }
</script>

<style>

</style>
