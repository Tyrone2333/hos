<template>
    <div id="app">


        <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;"
                  :title="title"
                  :right-options="{showMore: true}"

                  @on-click-more="onClickMore"
                  @on-click-title="onClickTitle">
            <!--<a slot="right">Feedback</a>-->
        </x-header>

        <div >
            <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
        </div>

        <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">


            <!--切换标签-->
            <router-view></router-view>

            <tabbar class="tabbar-footer" slot="bottom">
                <tabbar-item link="/mavon_editor_test">
                    <x-icon slot="icon" type="ios-barcode-outline" size="30"></x-icon>
                    <!--<span  slot="icon" class="icon-user" icon-class="icon-user"></span>-->
                    <span slot="label">首页</span>
                </tabbar-item>

                <tabbar-item @on-item-click="toNews">
                    <img slot="icon-active" src="./assets/1.png">
                    <x-icon slot="icon" type="ios-ionic-outline" size="30"></x-icon>
                    <span slot="label">谈笑风生</span>
                </tabbar-item>

                <tabbar-item link="/article">
                    <x-icon slot="icon" type="ios-monitor" size="30"></x-icon>
                    <!--<span class="cellIcon icon-file-text" slot="icon" ></span>-->
                    <span slot="label">断言</span>
                </tabbar-item>

                <tabbar-item link="/me">
                    <x-icon slot="icon" type="android-person" size="30"></x-icon>
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>


        </view-box>

    </div>
</template>

<script>
    import appHome from './components/home/home.vue'
    import appFooter from './components/footer/footer'
    import {Tab, TabItem, Sticky} from 'vux'
    import {ViewBox} from 'vux'
    import {Tabbar,Actionsheet, TabbarItem, XHeader, XImg} from 'vux'

    export default {
        name: 'app',
        components: {
            appHome,
            appFooter,
            Tab,
            TabItem,
            Sticky,
            ViewBox,
            Tabbar,
            TabbarItem,
            XHeader, XImg,Actionsheet
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
                title: "打脸网",
                states: {
                    scrollTop: 0,
                },
            }
        },
        methods: {
            spaceChange() {
                this.showSpace = !this.showSpace
                this.$nextTick(() => {
                    this.$refs.sticky.bindSticky()
                })
            },
            onClickMore() {

                this.showMenus = true
                log(true)
            },
            toNews() {
                this.$router.push({name: 'news'})
            },
            scrollToBefore(s) {
                this.$refs.viewBox.scrollTo(s)
            },
            onClickTitle() {
                log(this.$refs)
                this.$refs.viewBox.scrollTo(0)
            }
        },

        watch: {
            $route(to, from) {
                let _this = this
                let scrBody = this.$refs.viewBox.getScrollBody()
                let scrTop = this.$refs.viewBox.getScrollTop()
//                从列表到具体文章时保存之前的滚动距离
                if (to.name == "read_article" && from.name == "article") {
                    console.warn("从列表到具体文章" + scrTop)
                    this.states.scrollTop = scrTop
                }
//                从文章退回列表跳转到之前的位置
                if (to.name == "article" && from.name == "read_article") {
                    console.warn("从文章退回列表 this.states.scrollTop: " + this.states.scrollTop)
                    setTimeout(() => {
                        this.scrollToBefore(this.states.scrollTop)
                    }, 0)

//                    this.$refs.viewBox.scrollTo(this.states.scrollTop)
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

    .icon-user {
        width: 27px;
        height: 27px;
        color: #5d0500 !important;
    }

    .weui-bar__item_on .weui-tabbar__label span {
        color: #0870e3;
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
