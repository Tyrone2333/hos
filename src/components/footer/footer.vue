<template>
    <tabbar class="tabbar-footer">
        <tabbar-item selected link="home">
            <img slot="icon" src="./1.png">
            <span slot="label">综合</span>
        </tabbar-item>
        <tabbar-item link="hello">
            <img slot="icon" src="./1.png">
            <span slot="label">百科</span>
        </tabbar-item>
        <tabbar-item>
            <img style="height:40px;width:40px;" slot="icon" src="./1.png">
        </tabbar-item>

        <tabbar-item link="news">
            <img slot="icon" src="./1.png">
            <span slot="label">新闻</span>
        </tabbar-item>
        <tabbar-item link="about">
            <img slot="icon" src="./1.png">
            <span slot="label">关于</span>
        </tabbar-item>
        <tabbar-item link="me">
            <img slot="icon" src="./1.png">
            <span slot="label">我的</span>
        </tabbar-item>
    </tabbar>
</template>
<style>
    .add {
        height: 40px;
        width: 40px;
    }
    .tabbar-footer{
        position: fixed;
        bottom: 0;
        left: 0;
    }
</style>
<script>
    import {Tabbar, TabbarItem} from 'vux'
    export default{
        name: 'AppFooter',
        components: {
            Tabbar,
            TabbarItem,
        },
        data(){
            return {
                msg: ''
            }
        },

    }
</script>