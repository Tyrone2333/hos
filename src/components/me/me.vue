<template>
    <div class="me">

        <div class="user-info">
            <div class="avatar">
                <router-link :to="/user/+userInfo.id">
                    <!--<img class="logo" src="../../assets/vux_logo.png">-->
                    <img :src="userInfo.avatar">
                </router-link>
            </div>
            <div class="text">
                <div class="nickname">
                    {{userInfo.nickname}} <br>
                </div>
                <div class="home-page-edit">User : {{userInfo.username}}</div>
            </div>

        </div>

        <group title="">
            <cell title="我的主页" value="" is-link :link="/user/+userInfo.id">
                <span class="cellIcon small-icon icon-user" slot="icon"></span>
            </cell>

            <cell title="与我相关"
                  is-link
                  :border-intent="false"
                  :arrow-direction="showContent ? 'up' : 'down'"
                  @click.native="showContent = !showContent"></cell>
            <div class="slide" :class="showContent?'animate':''">
                <!--<cell-box is-link link="/article_edit">-->
                <!--<del>发布文章 使用wang_editor</del>-->
                <!--</cell-box>-->
                <cell title="我的收藏" value="" is-link link="/collect">
                    <span class="cellIcon small-icon icon-bookmark" slot="icon"></span>
                </cell>
                <cell title="我的回复" value="" is-link link="/collect">
                    <span class="cellIcon small-icon icon-notifications" slot="icon"></span>
                    <span>
                    <span class="vertical-middle">新提醒</span>
                    <badge text="16"></badge>
                </span>
                </cell>

            </div>



            <cell title="设置" value="" is-link>
                <span class="cellIcon small-icon icon-cog" slot="icon"></span>
            </cell>

        </group>
        <group title="开发者">

            <cell title="版本" @click.native="clickVision" inline-desc="v1.1.3">
                <x-icon class="cellIcon" slot="icon" type="ios-information" size="30"></x-icon>
            </cell>

            <cell title="反馈" inline-desc="搞个大新闻,再把我批判一番" is-link link="/feedback">
                <span class="cellIcon icon-question-circle-o" slot="icon"></span>
            </cell>

            <x-button @click.native="signOut" type="warn">退出账户</x-button>

        </group>
    </div>
</template>

<script>
    import {Group, Cell, CellBox, XButton, Badge} from 'vux'
    import {mapState} from 'vuex'
    import {mapGetters} from 'vuex'

    import {tokenLogin} from "../../api/user";


    export default {
        components: {
            Group, Cell, CellBox, XButton, Badge
        },
        data() {
            return {
                msg: 'Hello World!',
                showContent: true,
                localCount: "localCount",
                avatar: localStorage.avatar ? localStorage.avatar : "https://pic4.zhimg.com/354a338c01699ca3bf7556bcd8e4e9ea_xl.jpg",
            }
        },
        methods: {
            clickVision() {
                console.log("%c" + "  当前版本 v 1.13" + " %c",
                    "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff", "background:transparent")


            },
            signOut() {
                localStorage.clear()
                this.$store.commit("_clearToken")
                location.reload()
                log(this.$store.state)
            }

        },
        computed: {
            ...mapGetters(["userInfo"]),
        },
        // beforeMount() {
        //     let username = JSON.parse(localStorage.user)
        //     let token = JSON.parse(localStorage.token)
        //     let _this = this
        //     tokenLogin(username, token).then((response) => {
        //         let res = response.data
        //
        //         console.log(res);
        //
        //         // 登录失败
        //         if (res.errno === 1) {
        //             _this.$vux.toast.show({
        //                 text: res.message,
        //                 type: "warn",
        //             })
        //             return
        //         }
        //
        //         // 登录成功,保存必要信息进localStorage
        //         _this.$store.commit("setUserInfo", res.userinfo)
        //         _this.$store.commit("setToken", res.token)
        //
        //         // 登录成功 路由跳转并显示 Toast
        //         let redirect = _this.$router.currentRoute.query.redirect
        //         if (redirect) {
        //             _this.$vux.toast.show({
        //                 text: "登录成功,2秒后转入之前页面",
        //                 type: "success",
        //             })
        //             setTimeout(() => {
        //                 _this.$router.push({path: redirect})
        //             }, 2000)
        //         } else {
        //             _this.$vux.toast.show({
        //                 text: res.message,
        //                 type: "success",
        //             })
        //             setTimeout(() => {
        //                 _this.$router.push({path: "/me"})
        //             }, 2000)
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //     })
        // },
    }
</script>

<style lang="less">
    .me {
        .small-icon {
            /*height: 16px;*/
            /*width: 16px;*/
            font-size: 16px;
        }
    }

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
                border-radius: 50%;
            }
        }
    }

    .slide {
        padding: 0 20px;
        overflow: hidden;
        max-height: 0;
        transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
    }

    .animate {
        max-height: 9999px;
        transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
        transition-delay: 0s;
    }

    .cellIcon {
        margin-right: 20px;
        width: 30px;
        height: 30px;
        font-size: 30px;
    }

    .icon-chrome {
        font-size: 2em;
    }
</style>
