<template>
    <div>

        <group title="使用icon代替title">
            <x-input title="必须输入2333" :is-type="be2333" placeholder="I'm placeholder">
                <img slot="label" style="padding-right:10px;display:block;"
                     src="http://dn-placeholder.qbox.me/110x110/FF2D55/000" width="24" height="24">
            </x-input>
        </group>

        <!--<group title="set is-type=china-name 请输入中文名">-->
            <!--<x-input title="姓名" name="realname" placeholder="请输入姓名" is-type="china-name"></x-input>-->
            <!--<x-input title="用户名" name="username" v-model="username" @on-change="checkName" placeholder="请输入姓名"></x-input>-->
            <!--<x-input title="密码" v-model="password" :type="pwdType" placeholder="密码" @on-enter="srcNativeBtnClick">-->
                <!--<input slot="right" type="checkbox" @click="changeType"/>-->
            <!--</x-input>-->

            <!--<x-button :type="submitBtnType" :disabled="submitBtnDisabled" :show-loading="submitBtnLodingState"-->
                      <!--@click.native="srcNativeBtnClick" action-type="button">提交表单-->
            <!--</x-button>-->
        <!--</group>-->
        <form @submit.prevent="srcNativeBtnClick">
            <x-input title="姓名" name="realname" placeholder="请输入姓名" is-type="china-name"></x-input>
            <x-input title="用户名" name="username" v-model="username" @on-change="checkName" placeholder="请输入姓名"></x-input>
            <x-input title="密码" v-model="password" :type="pwdType" placeholder="密码" @on-enter="srcNativeBtnClick">
                <input slot="right" type="checkbox" @click="changeType"/>
            </x-input>
            <button class="handleSubmitBtn" type="submit">handleSubmit</button>
        </form>

        <group title="set keyboard=number and is-type=china-mobile">
            <x-input title="手机号码" name="tel" v-model="tel" placeholder="请输入手机号码" keyboard="number"
                     is-type="china-mobile"></x-input>
        </group>

        <div  v-if="resData" v-for="(val,key) in resData" >
            <span>{{key}}</span> ==> <span>{{val}}</span>
        </div>


        <group title="set is-type=email">
            <x-input title="邮箱" name="email" v-model="email" placeholder="请输入邮箱地址" is-type="email"></x-input>
        </group>


        <group title="确认输入">
            <x-input title="请输入6位数字" type="text" placeholder="" v-model="password" :min="6" :max="6"
                     @on-change="change"></x-input>
            <x-input title="请确认6位数字" type="text" placeholder="" :equal-with="password"></x-input>
        </group>


        <loading :show="isLoading" text="正在加载中..."></loading>
    </div>
</template>

<script>
    import {XInput, Group, XButton, Cell} from 'vux'
    import {AjaxPlugin} from 'vux'
    import { Loading } from 'vux'

    export default {
        components: {
            XInput,
            XButton,
            Group,
            Cell, AjaxPlugin,Loading,
        },
        data () {
            return {
                password: '',
                resData: "",
                enterText: '',
                iconType: '',
                tel: "",
                email: "",
                username: "",
                pwdType: "password",
                submitBtnType: "primary",
                submitBtnLodingState: false,
                submitBtnDisabled: false,
                isLoading: false,
                be2333: function (value) {
                    return {
                        valid: value === '2333',
                        msg: 'Must be 2333'
                    }
                },
                style: '',
                disabledValue: 'hello',
                debounceValue: '',
                maxValue: '',
                maskValue: '13545678910',
                maskValue2: ''
            }
        },
        methods: {
            changeType(){
                this.pwdType = this.pwdType === 'password' ? 'text' : 'password'
            },

            change (val) {
                console.log('on change', val)
            },

            onFocus (val, $event) {
                console.log('on focus', val, $event)
            },

            checkName(val){
                console.log('name change !', val)
            },

//            AjaxPlugin、axios 在移动端兼容性都不好，不使用
            submitForm (){
                var username = this.username
                var tel = this.tel
                var email = this.email
                var password = this.password
                let _this = this

                this.submitBtnLodingState = true
//                this.submitBtnDisabled = true


                var fromData = [
                    ["username",username],
                    ["password",password],
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


//            提交按钮事件
            srcNativeBtnClick (){
                var username = this.username
                var tel = this.tel
                var email = this.email
                var password = this.password
                let _this = this

                ajax({
                    type:"post",
                    url:"http://yangzq.top/phpstorm_test/phpstorm_test/hos_api.php", //添加自己的接口链接
                    timeOut:5000,
                    data : {
                        "username" : username,
                        "password" : password,
                    },
                    before:function(){

                    },
                    success:function(str){
                        var res =  JSON.parse(str)

                        _this.resData = res
                        console.log(res);
                    },
                    error:function(){
                        console.log("error");
                    }
                });
            },
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
    .handleSubmitBtn{
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
</style>