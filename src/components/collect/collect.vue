<template>
    <div class="collect">
        <div class="collect-title">主题收藏</div>
        <cell-list :articleList="collectList"></cell-list>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapGetters, mapState} from 'vuex'
    import {getCollectList} from "@/api/collect.js"
    import cellList from "../common/cellList"

    export default {
        name: "collect",
        data() {
            return {
                // articleList: null,
                resData: null

            }
        },
        computed: {
            ...mapGetters(["collectList"])
        },
        components:{cellList},
        methods: {

        },
        mounted() {
            let _this = this
            getCollectList(_this.$store.state.user.user.id, _this.$store.state.user.user.username, _this.$store.state.user.token)
                .then((response) => {
                    if (response.data.errno === 0) {
                        let list = response.data.data;
                        _this.$store.commit("setcollectList", list)
                    } else {
                        _this.$store.commit("setcollectList", undefined)
                    }
                })
        },
        watch: {},
    }
</script>

<style lang="less">
    .collect {
        .collect-title {
            padding: 14px 15px 10px;
            color: #999999;
            font-size: 13px;
            position: relative;
        }

    }
</style>
