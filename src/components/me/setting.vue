<template>
    <div class="setting">
        <div class="user-info">
            <div class="avatar">
                <router-link to="/me">
                    <img :src="userInfo.avatar">
                </router-link>
            </div>
            <div class="text">
                <div class="nickname">
                    {{userInfo.username}} <br>
                </div>
                <div class="home-page-edit">第 {{userInfo.id}} 号用户,加入于{{commonTime(userInfo.register_time)}}</div>
            </div>
        </div>

        <div class="information">
            <group title="基本信息">
                <x-input title="用户名" name="name" v-model="informationDraft.nickname" placeholder="请输入姓名"></x-input>

                <x-input title="邮箱" name="email" placeholder="请输入邮箱地址" is-type="email"></x-input>

                <x-switch :title="informationDraft.sex ? '男' : '女' " v-model="informationDraft.sex"></x-switch>

                <x-number title="你的年龄" v-model="informationDraft.age"></x-number>

                <x-address title="你的地址" v-model="informationDraft.address" raw-value :list="addressData"
                           value-text-align="left"></x-address>

                <cell>
                    <x-button mini type="primary" @click.native="changeInformation">修改基本信息</x-button>
                </cell>
            </group>

            <group title="密码设置">
                <x-input title="旧密码" required v-model="oldPwd"></x-input>
                <x-input title="新密码" required v-model="newPwd" :min="6" :max="15"></x-input>
                <x-input title="重复密码" required v-model="newPwd2" :min="6" :max="15" :equal-with="newPwd"></x-input>

                <cell>
                    <x-button mini type="primary" @click.native="changePwd">修改密码</x-button>
                </cell>
            </group>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import {
        XTextarea,
        Group,
        XInput,
        XNumber,
        XButton,
        XAddress,
        ChinaAddressV4Data,
        Cell,
        Rater,
        XSwitch,
        Checker,
        CheckerItem,
    } from 'vux'
    import {mapGetters} from 'vuex'
    import {changeInformation, changePwd} from "@/api/user"

    export default {
        name: "setting",
        components: {
            XTextarea,
            Group,
            XInput,
            XNumber,
            XButton,
            XAddress,
            ChinaAddressV4Data,
            Cell,
            Rater,
            XSwitch,
            Checker,
            CheckerItem,
        },
        data() {
            return {
                informationDraft: {},

                addressData: ChinaAddressV4Data,    // 全国地址信息

                raterNumber: 5, // 星星
                oldPwd: '', // 改密码
                newPwd: '',
                newPwd2: '',
            }
        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        mounted() {
            // 复制一下 userInfo,不需要深拷贝
            this.createInformationDraft()
            // contributor test
        },

        methods: {
            commonTime(timestamp) {
                let unixTimestamp = new Date(timestamp * 1000)
                return unixTimestamp.toLocaleString()
            },
            createInformationDraft() {
                // 创建符合 vux 组件要求的 用户信息数据
                this.informationDraft = JSON.parse(JSON.stringify(this.userInfo))
                if (this.informationDraft.address == null || isEmptyStr(this.informationDraft.address)) {
                    this.informationDraft.address = []
                }
                if (this.informationDraft.age == null ) {
                    this.informationDraft.age = 0
                }

            },
            // 修改个人信息
            changeInformation() {
                let data = {
                    nickname: this.informationDraft.nickname,
                    age: this.informationDraft.age,
                    sex: this.informationDraft.sex ? 1 : 0,
                    email: this.informationDraft.email,
                    address: this.informationDraft.address.join(","),
                }
                changeInformation({...data}).then((response) => {
                    let res = response.data
                    if (res.errno === 0) {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "success",
                        })
                    } else {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "warn",
                        })
                    }
                })
                log(this.informationDraft)


            },
            // 修改密码
            changePwd() {
                changePwd(this.oldPwd, this.newPwd).then((response) => {
                    let res = response.data
                    if (res.errno === 0) {
                        this.$vux.toast.show({
                            text: "修改成功,请重新登录",
                            type: "success",
                        })
                        setTimeout(() => {
                            this.$router.push({path: "/login"})
                        }, 2000)
                        this.$store.dispatch("_signOut")
                    } else {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "warn",
                        })
                    }
                })

            }
        },

    }
</script>

<style lang="less">
    .setting {
        .user-info {
            display: flex;
            padding: 5px 15px;
            .text {
                flex-direction: column;
                margin-left: 20px;
                color: #4d555d;
                .nickname {
                    font-size: 1.2em;
                }
                .home-page-edit {
                    font-size: 0.9em;
                    color: #ccc;
                }
            }
            .avatar {
                /*padding-top: 10px;*/
                text-align: center;
                img {
                    width: 60px;
                    height: 60px;
                    border-radius: 20%;
                }
            }
        }

    }

</style>
