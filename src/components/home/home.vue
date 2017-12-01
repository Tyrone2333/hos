<template>
    <div class="home">
        <!--<app-header></app-header>-->

        <grid col="1" :cols="colsNum">
            <grid-item link="/component/cell" label="科室、专家">
                <img slot="icon" src="https://assets.servedby-buysellads.com/p/manage/asset/id/28536">
            </grid-item>
            <grid-item :link="{ path: '/component/cell'}" label="病情咨询">
                <img slot="icon" src="https://icomoon.io/icons1b2a269/2/627.png">
            </grid-item>
            <grid-item :link="{ path: '/component/cell'}" label="疾病科普">
                <img slot="icon" src="http://img.zcool.cn/community/017fe957b2b16a0000018c1bdc7cf3.png">
            </grid-item>
            <grid-item :link="{ path: '/component/cell'}" label="联系我们">
                <img slot="icon" src="http://bpic.588ku.com/element_pic/01/47/68/615743fc38856ae.jpg">
            </grid-item>
        </grid>

        <loading :show="isLoading" text="数据加载中..."></loading>
    </div>
</template>
<style>

</style>
<script>
    import {Tabbar, TabbarItem} from 'vux'
    import {Grid, GridItem, GroupTitle} from 'vux'
    import appHeader from '../header/header'
    import {Loading} from 'vux'

    export default {
        data() {
            return {
                tag: '资讯',
                taglist: ['资讯', '博客', '问答', '活动'],
                isLoading: false,
                colsNum: 1,

            }
        },
        methods : {

        },
        components: {
            Grid,
            GridItem,
            GroupTitle,
            appHeader,
            Loading,
        },
        created() {
            this.isLoading = true
        },
        mounted() {
            this.isLoading = false
        }
    }
</script>