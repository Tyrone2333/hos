<template>
    <div id="app">


        <x-header style="width:100%;position:absolute;left:0;top:0;z-index:100;" slot="header"
                  :title="title"
                  @on-click-more="onClickMore"></x-header>

        <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">


            <!--切换标签-->
            <router-view></router-view>

            <tabbar class="tabbar-footer" slot="bottom">
                <tabbar-item link="/home">
                    <x-icon slot="icon" type="ios-barcode-outline" size="30"></x-icon>
                    <!--<span  slot="icon" class="icon-user" icon-class="icon-user"></span>-->

                    <span slot="label">首页</span>
                </tabbar-item>
                <!--<tabbar-item link="/hello">-->
                <!--<x-icon  slot="icon" type="xbox" size="30"></x-icon>-->
                <!--<span slot="label">xBox</span>-->
                <!--</tabbar-item>-->

                <tabbar-item @on-item-click="toNews">
                    <img slot="icon-active" src="./assets/1.png">
                    <x-icon slot="icon" type="ios-ionic-outline" size="30"></x-icon>
                    <span slot="label">信息登记</span>
                </tabbar-item>
                <tabbar-item link="/article">
                    <x-icon slot="icon" type="ios-monitor" size="30"></x-icon>
                    <span slot="label">患者交流</span>
                </tabbar-item>
                <tabbar-item link="/me">
                    <x-icon slot="icon" type="android-person" size="30"></x-icon>
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
        </view-box>
        <!--<router-view></router-view>-->
        <!--<app-footer></app-footer>-->


        <!--<div class="tabs">-->
        <!--<div class="tab-item active">-->
        <!--&lt;!&ndash;<router-link :to="{name:'goods',params:{username:'enzo',seller:seller,id:id}}">商品</router-link>&ndash;&gt;-->
        <!--<router-link to="/Home" name="Home">Home</router-link>-->
        <!--</div>-->
        <!--<div class="tab-item">-->
        <!--<router-link to="/Hello" name="Hello">Hello</router-link>-->
        <!--</div>-->
        <!--<div class="tab-item">-->
        <!--<router-link to="/article" name="article">关于部门</router-link>-->
        <!--</div>-->

        <!--</div>-->


    </div>
</template>

<script>
    import appHome from './components/home/home.vue'
    import appFooter from './components/footer/footer'
    import {Tab, TabItem, Sticky} from 'vux'
    import {ViewBox} from 'vux'
    import {Tabbar, TabbarItem, XHeader, XImg} from 'vux'

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
            XHeader, XImg
        },
        methods: {
            spaceChange() {
                this.showSpace = !this.showSpace
                this.$nextTick(() => {
                    this.$refs.sticky.bindSticky()
                })
            },
            onClickMore() {
                this.showMenu = true
            },
            toNews() {
                this.$router.push({name: 'news'})
            }
        },
        data() {
            return {
                showMenu: false,
                menus: {
                    'language.noop': '<span class="menu-title">Language</span>',
                    'zh-CN': '中文',
                    'en': 'English'
                },
                drawerVisibility: false,
                showMode: 'push',
                showModeValue: 'push',
                showPlacement: 'left',
                showPlacementValue: 'left',
                title: "XHeader"
            }
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
