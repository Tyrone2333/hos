<template>
    <div id="app">


        <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
                  :title="title"
                  :right-options="{showMore: true}"

                  @on-click-more="onClickMore"
                  @on-click-title="onClickTitle">
            <!--<a slot="right">Feedback</a>-->
        </x-header>

        <div>
            <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
        </div>

        <view-box ref="viewBox"  body-padding-top="46px" body-padding-bottom="45px">

            <!--<keep-alive>-->
            <!--<router-view v-if="$route.meta.keepAlive"/>-->
            <!--</keep-alive>-->
            <!--<router-view v-if="!$route.meta.keepAlive"/>-->

            <div  class="bs-scroll-wrapper">
                <router-view/>

            </div>


            <tabbar class="tabbar-footer" slot="bottom">
                <tabbar-item link="/article">
                    <!--<x-icon slot="icon" type="ios-barcode-outline" size="30"></x-icon>-->
                    <!--<span  slot="icon" class="icon-user" icon-class="icon-user"></span>-->
                    <img src="./assets/PNG/file-text.png" slot="icon" alt="icon">
                    <span slot="label">首页</span>
                </tabbar-item>

                <!--图标点击切换-->
                <!--<tabbar-item @on-item-click="toNews">-->
                <!--<img slot="icon-active" src="./assets/example.png">-->
                <!--<x-icon slot="icon" type="ios-ionic-outline" size="30"></x-icon>-->
                <!--<span slot="label">谈笑风生</span>-->
                <!--</tabbar-item>-->

                <tabbar-item link="/mavon_editor_test">
                    <img src="./assets/PNG/quill.png" slot="icon" alt="icon">
                    <span slot="label">写动态</span>
                </tabbar-item>

                <tabbar-item link="/collect">
                    <img src="./assets/PNG/star-empty.png" slot="icon" alt="icon">
                    <span slot="label">收藏</span>
                </tabbar-item>

                <tabbar-item link="/me">
                    <img src="./assets/PNG/user.png" slot="icon" alt="icon">
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
        </view-box>

    </div>
</template>

<script>

    import {Tab, TabItem, Sticky} from 'vux'
    import {ViewBox} from 'vux'
    import {Tabbar, Actionsheet, TabbarItem, XHeader, XImg} from 'vux'
    import BScroll from 'better-scroll'

    import {tokenLogin} from "./api/user";

    export default {
        name: 'app',
        components: {

            Tab,
            TabItem,
            Sticky,
            ViewBox,
            Tabbar,
            TabbarItem,
            XHeader, XImg, Actionsheet
        },
        data() {
            return {
                showMenu: false,
                menus: {
                    'language.noop': '<span class="menu-title">Language</span>',
                    'zh-CN': '中文',
                    'en': 'English'
                },
                showMenus: false,
                drawerVisibility: false,
                showMode: 'push',
                showModeValue: 'push',
                showPlacement: 'left',
                showPlacementValue: 'left',
                title: process.env.APP_NAME,
                states: {
                    scrollTop: 0,
                },
            }
        },
        methods: {
            onClickMore() {
                this.showMenus = true
            },
            scrollToBefore(s) {
                this.$refs.viewBox.scrollTo(s)
            },
            onClickTitle() {
                log(this.$refs)
                this.$refs.viewBox.scrollTo(0)
            }
        },

        mounted() {
            // let options = {
            //     pullDownRefresh: {
            //         threshold: 50, // 当下拉到超过顶部 50px 时，触发 pullingDown 事件
            //         stop: 20 // 刷新数据的过程中，回弹停留在距离顶部还有 20px 的位置
            //     },
            //
            // }
            // this.$nextTick(() => {
            //
            //     let bs = document.querySelector(".bs-scroll-wrapper")
            //     let bsw = this.$refs.viewBox
            //     this.scroll = new BScroll(bs, options)
            //     this.scroll.on('pullingDown', () => {
            //         // 刷新数据的过程中，回弹停留在距离顶部还有20px的位置
            //         // RefreshData()
            //         //     .then((newData) => {
            //         //         this.data = newData
            //         //         // 在刷新数据完成之后，调用 finishPullDown 方法，回弹到顶部
            //         //         this.scroll.finishPullDown()
            //         //     })
            //         log("this.scroll.finishPullDown()")
            //         this.scroll.finishPullDown()
            //     })
            // })
            // 每次打开如果token没过期就会自动刷新,很久未访问就要重新登录
            if (localStorage.token && localStorage.token !== "undefined") {
                tokenLogin().then((res) => {

                    // 登录失败
                    if (res.errno !== 0) {
                        this.$vux.toast.show({
                            text: res.message,
                            type: "warn",
                        })
                        return
                    }
                    // 登录成功,保存必要信息进localStorage
                    this.$store.commit("setUserInfo", res.userinfo)
                    this.$store.commit("setToken", res.token)
                    console.log("已刷新token和用户信息")
                })
            }

        },
        watch: {
            $route(to, from) {
                /**
                 *  TODO 这段代码写这里非常恶心,文章回退写的不好,有空必改
                 *
                 *  关于前进刷新 后退缓存,各种方案都尝试失败,目前只有这种能用
                 */
                let scrTop = this.$refs.viewBox.getScrollTop()
                // 从列表到具体文章时保存之前的滚动距离
                if (to.name === "read_article" && from.name === "article") {
                    log("从列表到具体文章" + scrTop)
                    this.states.scrollTop = scrTop
                }
                // 从文章退回列表跳转到之前的位置
                if (to.name === "article" && from.name === "read_article") {
                    log("从文章退回列表 this.states.scrollTop: " + this.states.scrollTop)
                    // 都可以
                    // setTimeout(() => {
                    //     this.scrollToBefore(this.states.scrollTop)
                    // }, 0)
                    this.$nextTick(() => {
                        this.scrollToBefore(this.states.scrollTop)
                    })
                }
            },

        },
    }
</script>

<style lang="less">
    @import '~vux/src/styles/reset.less';

    body {
        background-color: #fbf9fe;
    }

    html, body {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }

    #app {
        height: 100%;
    }

    /*better-scroll 的容器*/
    .bs-scroll-wrapper{
        box-sizing: border-box;
        height: 100%;
    }

    .icon-user {
        width: 27px;
        height: 27px;
        color: #5d0500 !important;
    }

    .weui-bar__item_on .weui-tabbar__label span {
        color: #0870e3;
    }

    .weui-tabbar__icon {
        width: 22px !important;
        height: 22px !important;
    }

    /*固定底部vue-router的样式*/
    .tabs {
        display: flex;
        text-align: center;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        .active {
            color: #f01414;
        }
        .tab-item {
            flex: 1;
            font-size: 14px;
            line-height: 40px;
            width: 100%;
            height: 40px;
            color: #4d555d;
            a {
                display: block;
            }
        }
    }

</style>
