<template>
    <div>
        <div class="login-in" v-if="inLogin">
            <form @submit.prevent="loginBtnClick">
                <x-input name="username" v-model="username" @on-change="checkName"
                         placeholder="用户名/邮箱"></x-input>
                <x-input v-model="password" :type="pwdType" placeholder="打脸网登录密码">
                    <span :class="pwdClass" @click="pwdTypeChange" slot="right"></span>
                </x-input>
                <button class="handleSubmitBtn" type="submit">登录</button>
            </form>

            <!--用来显示登录数据,正式版会关闭-->
            <!--<div v-if="resData" v-for="(val,key) in resData">-->
                <!--<span>{{key}}</span> ==> <span>{{val}}</span>-->
            <!--</div>-->

        </div>
        <!--<divider>我是有底线的</divider>-->

        <div class="register" v-if="!inLogin">
            <group title="填写基本信息">
                <form @submit.prevent="registerBtnClick">

                    <x-input title="昵 称" name="nickname" v-model="nickname" placeholder="昵称"></x-input>
                    <!--禁用内置验证才能显示成功或者错误样式-->
                    <x-input title="用户名" @on-change="checkName" novalidate
                             :icon-type="iconType"
                             :show-clear="false"
                             name="username" v-model="username" placeholder="请输入用户名(用于登录)"></x-input>

                    <x-input title="密码" type="text" :is-type="bePwd" placeholder="" v-model="password"
                             :min="2"></x-input>
                    <x-input title="确认密码" type="text" v-model="password2" placeholder=""
                             :equal-with="password"></x-input>

                    <button class="handleSubmitBtn" type="submit">注册</button>
                </form>
            </group>


            <group title="非必填">
                <x-input title="手机号码" name="tel" v-model="tel" placeholder="请输入手机号码" keyboard="number"
                         is-type="china-mobile"></x-input>
                <x-input title="邮箱" name="email" v-model="email" placeholder="请输入邮箱地址" is-type="email"></x-input>
            </group>


            <loading :show="isLoading" text="正在加载中..."></loading>
        </div>

        <div class="togleLogin" @click="togleLogin">
            {{togleInfo}}
        </div>
    </div>

</template>

<script>
    import {mapMutations} from 'vuex'

    import {XInput, Group, XButton, Cell} from 'vux'
    import {AjaxPlugin} from 'vux'
    import {Loading} from 'vux'
    import {Divider} from 'vux'

    export default {
        components: {
            XInput,
            XButton,
            Group,
            Cell, AjaxPlugin, Loading, Divider,
        },
        data() {
            return {
                password: '',
                password2: "",
                resData: "",
                enterText: '',
                iconType: '',
                tel: "",
                email: "",
                username: "",
                nickname: "",
                pwdType: "password",    //用于显示隐藏密码
                pwdClass: "cell-icon icon-eye-hidden",

                isLoading: false,
                inLogin: true, // 用于切换显示注册页,登录页
                submitBtnType: "primary",   // AjaxPlugin、axios 测试用变量
                submitBtnLodingState: false,
                submitBtnDisabled: false,

            }
        },
        computed: {
            togleInfo() {
                return this.inLogin ? "或者,创建账户" : "已有账户,登录"
            },


        },
        methods: {

            ...mapMutations([
                'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

                // `mapMutations` 也支持载荷：
                'incrementBy', // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
                "setUsername",
            ]),
            ...mapMutations({
                add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
            }),
            bePwd: function (value) {
                let reg = /^[A-Za-z0-9]{6,12}$/
                if (reg.test(value)) {
                    return {
                        valid: true,
                    }
                } else {
                    return {
                        valid: false,
                        msg: '6-12位大小写字母加数字'
                    }
                }

            },
            pwdTypeChange() {
                this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
                this.pwdClass = this.pwdType === 'password' ? 'cell-icon icon-eye-hidden' : 'cell-icon icon-eye'

            },

            checkName(val) {
                let reg = /^[A-Za-z][A-Za-z0-9]{5,12}$/
                if (reg.test(val)) {
                    this.iconType = "success"
                } else {
                    this.iconType = "error"
                }
            },
            togleLogin() {
                this.inLogin = !this.inLogin
            },

//            AjaxPlugin、axios 在移动端兼容性都不好，不使用
            submitForm() {
                var username = this.username
                var tel = this.tel
                var email = this.email
                var password = this.password
                let _this = this

                this.submitBtnLodingState = true
//                this.submitBtnDisabled = true


                var fromData = [
                    ["username", username],
                    ["password", password],
                ]
                var params = new URLSearchParams(fromData);

                /**
                 * AjaxPlugin 在UC和夸克都无法提交表单
                 *
                 * */
//                AjaxPlugin.$http.post(process.env.BASE_API + "/phpstorm_test/phpstorm_test/hos_api.php", params)
//                    .then((response) => {
//                    _this.resData = response.data
//                        console.log(this.resData)
//                    })

                /**
                 * axios 在UC和夸克都无法提交表单
                 * @type {[*]}
                 */
//                var fromData = [
//                    ["username",username],
//                    ["password",password],
//                ]
//                var params = new URLSearchParams(fromData);
//                var _this = this
//                this.axios.post(process.env.BASE_API + "/phpstorm_test/phpstorm_test/hos_api.php', params)
//                    .then(function (response) {
//                        _this.resData = response.data
//                        console.log(_this.resData);
//                    })
//                    .catch(function (response) {
//                        _this.resData = response.data
////                        console.warn(response);
//                        if (response instanceof Error) {
//                            // Something happened in setting up the request that triggered an Error
//                            console.warn('Error', response);
//                        }
//                    });
            },

//            登录按钮事件
            loginBtnClick() {
                var username = this.username
                var tel = this.tel
                var email = this.email
                var password = this.password
                let _this = this

                ajax({
                    type: "post",
                    url: process.env.BASE_API + "/console/hos_login.php", //添加自己的接口链接
                    timeOut: 5000,
                    data: {
                        "username": username,
                        "password": password,
                    },
                    success: function (str) {
                        var res = JSON.parse(str)
                        _this.resData = res
                        console.warn(res);

                        // 登录失败
                        if (res.errno === 1) {
                            _this.$vux.toast.show({
                                text: res.resMsg,
                                type: "warn",
                            })
                            return
                        }
                        // 登录成功 显示 Toast
                        _this.setLocalUserInfo(res)
                        _this.$store.commit('_flashUser')
                        _this.getCollectList(res.userInfo.user_id)

                        let redirect = _this.$router.currentRoute.query.redirect
                        if (redirect) {
                            _this.$vux.toast.show({
                                text: "登录成功,2秒后转入之前页面",
                                type: "success",
                            })
                            setTimeout(() => {
                                _this.$router.push({path: redirect})
                            }, 2000)
                        } else {
                            _this.$vux.toast.show({
                                text: res.resMsg,
                                type: "success",
                            })
                            setTimeout(() => {
                                _this.$router.push({path: "/me"})
                            }, 2000)
                        }
                    },
                    error: function () {
                        if (res.errno === 1) {
                            _this.$vux.toast.show({
                                text: "出错了",
                                type: "warn",
                            })
                        }
                    }
                });
            },
            registerBtnClick() {
                var username = this.username
                var tel = this.tel
                var email = this.email
                var password = this.password
                var password2 = this.password2
                var nickname = this.nickname
                let _this = this
                if (isEmptyStr(password) || password2 !== password) {
                    _this.$vux.toast.show({
                        text: "请检查密码",
                        type: "warn",
                    })
                    return
                }
                ajax({
                    type: "post",
                    url: process.env.BASE_API + "/console/hos_register.php", //添加自己的接口链接
                    timeOut: 5000,
                    data: {
                        "username": username,
                        "password": password,
                        "nickname": nickname,
                    },
                    before: function () {
                    },
                    success: function (str) {
                        var res = JSON.parse(str)
                        _this.resData = res
                        console.warn(_this.resData);
                        // 注册失败
                        if (res.errno === 1) {
                            _this.$vux.toast.show({
                                text: res.msg.errMsg,
                                type: "warn",
                            })
                            // alert(res.resMsg)
                            return
                        }
                        // 注册成功
                        // 显示 Toast
                        _this.$vux.toast.show({
                            text: res.msg.noticeMsg,
                            type: "success",
                        })
                        // 跳转到登录页,并放置注册的用户名
                        setTimeout(() => {
                            _this.inLogin = true
                            _this.username = username
                            _this.password = ""
                        }, 1500)
                    },
                    error: function () {
                        _this.$vux.toast.show({
                            text: "error",
                            type: "warn",
                        })
                    }
                });
            },
            setLocalUserInfo(res) {
                localStorage.setItem('username', res.userInfo.username);
                localStorage.setItem('user_id', res.userInfo.user_id);
                localStorage.setItem('nickname', res.userInfo.nickname);
                localStorage.setItem('avatar', res.userInfo.avatar);
                localStorage.setItem('token', res.userInfo.token);
                log("注册信息已保存 localStorage")
            },
            getCollectList(user_id,) {
                let _this = this
                ajax({
                    type: "get",
                    url: process.env.BASE_API + "/console/hos_collect.php?" + "action=" + "getlist" + "&user_id=" + user_id + "&n=" + Math.random(),
                    data: {},
                    success: function (data) {
                        let res = JSON.parse(data);
                        log(res)
                        if (res.errno == 0) {
                            // 在vuex保存收藏列表
                            _this.$store.commit("setcollectList", res.data)

                            // 存：localStorage.setItem('weekDay',JSON.stringify(weekArray));
                            // 取： weekArray = JSON.parse(localStorage.getItem('weekDay'));
                            localStorage.setItem("setcollectList", JSON.stringify(res.data))
                        } else if (res.errno == 1) {
                            log(res.msg.receiveMsg)
                        }
                        else {

                        }
                    },
                    error() {
                        log("getCollectList error")
                    }
                })
            },
        },
        beforeMount() {
            let redirect = this.$router.currentRoute.query.redirect

            if (redirect) {
                this.$vux.toast.show({
                    text: "本页面需要登录",
                    type: "text",
                })
            }


        },
    }
</script>
<style lang="less" scoped>
    .login-in {
        .cell-icon {
            color: #8590a6;
        }
    }

    .handleSubmitBtn {
        position: relative;
        display: block;
        margin-left: auto;
        margin-right: auto;
        padding-left: 14px;
        padding-right: 14px;
        box-sizing: border-box;
        font-size: 18px;
        text-align: center;
        text-decoration: none;
        color: #FFFFFF;
        line-height: 2.33333333;
        border-radius: 5px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        overflow: hidden;
        width: 100%;
        border-width: 0;
        outline: 0;
        -webkit-appearance: none;
        background-color: #1AAD19;
    }

    .togleLogin {
        text-align: center;
        position: fixed;
        bottom: 100px;
        left: 50%;
        margin-left: -50px;
        color: #1e88e5;
    }
</style>