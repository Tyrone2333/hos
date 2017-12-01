<template>
    <div class="header">
        header

        <span class="icon-chrome"></span>

        <router-link to="/article_edit">
            <div >to console</div>
        </router-link>

        <!--<router-link to="/mavon_editor_test">-->
            <!--<h2 >mavon_editor_test</h2>-->
        <!--</router-link>-->


        <loading :show="isLoading" text="数据加载中..."></loading>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Loading} from 'vux'

    export default {
        data() {
            return {
                isLoading: false,

            }
        },
        components: {
            Loading,
        },

    }
</script>

<style>
.icon-chrome{
    color: #5d0500;
    width: 30px;
    height: 30px;
}
</style>
