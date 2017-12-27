<template>
    <div>
        <div class="login-in" v-if="inLogin">
            <form @submit.prevent="loginBtnClick">
                <x-input name="username" v-model="username" @on-change="checkName"
                         placeholder="用户名/邮箱"></x-input>
                <x-input v-model="password" :type="pwdType" placeholder="打脸网登录密码">
                    <!--<input slot="right" type="checkbox" @click="changeType"/>-->
                    <span class="cellIcon icon-chrome" @click="changeType" slot="right"></span>
                </x-input>
                <button class="handleSubmitBtn" type="submit">登录</button>
            </form>

            <!--用来显示登录数据-->
            <div v-if="resData" v-for="(val,key) in resData">
                <span>{{key}}</span> ==> <span>{{val}}</span>
            </div>

        </div>
        <!--<divider>我是有底线的</divider>-->

        <div class="register" v-if="!inLogin">
            <group title="使用icon代替title">
                <form @submit.prevent="registerBtnClick">

                    <x-input title="昵 称" name="nickname" v-model="nickname" placeholder="昵称"></x-input>
                    <x-input title="用户名" name="username" v-model="username" placeholder="请输入用户名(用于登录)"></x-input>

                    <x-input title="密码" required type="text" placeholder="" v-model="password" :min="6"></x-input>
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
    import { mapMutations } from 'vuex'

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
            changeType() {
                this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
            },
            onFocus(val, $event) {
                console.log('on focus', val, $event)
            },

            checkName(val) {
                console.log('name change !', val)
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
//                AjaxPlugin.$http.post("http://yangzq.top/phpstorm_test/phpstorm_test/hos_api.php", params)
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
//                this.axios.post('http://yangzq.top/phpstorm_test/phpstorm_test/hos_api.php', params)
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
                    url: "//yangzq.top/console/hos_login.php", //添加自己的接口链接
                    timeOut: 5000,
                    data: {
                        "username": username,
                        "password": password,
                    },
                    before: function () {

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
                            // alert(res.resMsg)
                            return
                        }
                        // 登录成功 显示 Toast

                        _this.setToken(res)
                        _this.$store.commit('_flashUser')

                        let redirect = _this.$router.currentRoute.query.redirect
                        if(redirect){
                            _this.$vux.toast.show({
                                text: "登录成功,2秒后转入之前页面",
                                type: "success",
                            })
                            setTimeout(() => {
                                _this.$router.push({path: redirect})
                            },2000)
                        }else {
                            _this.$vux.toast.show({
                                text: res.resMsg,
                                type: "success",
                            })
                            setTimeout(() => {
                                _this.$router.push({path: "/me"})
                            },2000)
                        }
                    },
                    error: function () {
                        console.log("error");
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
                    url: "//yangzq.top/console/hos_register.php", //添加自己的接口链接
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
                        setTimeout(()=>{
                            _this.inLogin = true
                            _this.username = username
                            _this.password = ""
                        },1500)


                    },
                    error: function () {
                        _this.$vux.toast.show({
                            text: "error",
                            type: "warn",
                        })
                    }
                });
            },
            setToken(res) {
                localStorage.setItem('username', res.userInfo.username);
                localStorage.setItem('user_id', res.userInfo.user_id);
                localStorage.setItem('nickname', res.userInfo.nickname);
                localStorage.setItem('avatar', res.userInfo.avatar);
                localStorage.setItem('token', res.userInfo.token);
                log("注册信息已保存 localStorage")
            }
        },
    }
</script>
<style scoped>
    .red {
        color: red;
    }

    .green {
        color: green;
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