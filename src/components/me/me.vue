<template>
    <div>

        <div class="avatar">
            <router-link to="/login">
                <!--<img class="logo" src="../../assets/vux_logo.png">-->
                <img class="logo" :src="avatar">
            </router-link>
        </div>
        <group title="应用">
            <cell title="我的收藏" value="我的收藏" is-link></cell>
            <cell title="设置" value="cool" is-link>
                <span class="cellIcon icon-cog" slot="icon"></span>
            </cell>
            <cell title="管理控制台"
                  is-link
                  :border-intent="false"
                  :arrow-direction="showContent ? 'up' : 'down'"
                  @click.native="showContent = !showContent"></cell>
            <div class="slide" :class="showContent?'animate':''">
                <cell-box is-link link="/article_edit">
                    <del>发布文章 使用wang_editor</del>
                </cell-box>

                <cell-box is-link link="/mavon_editor_test">发表一篇文章</cell-box>
                <cell-box is-link link="/article_modify">修改文章</cell-box>
            </div>
        </group>
        <group title="开发者">
            欢迎,{{username}} <br>
            id: {{user_id}}
            <cell title="版本" @click.native="clickVision" inline-desc="v1.0">
                <x-icon class="cellIcon" slot="icon" type="ios-information" size="30"></x-icon>
            </cell>
            <cell title="反馈" inline-desc="搞个大新闻,再把我批判一番" is-link>
                <span class="cellIcon icon-chrome" slot="icon"></span>
            </cell>
            <cell title="提高姿势水平" link="https://zh.wikiquote.org/wiki/%E6%B1%9F%E6%B3%BD%E6%B0%91#"></cell>

        </group>
    </div>
</template>

<script>
    import {Group, Cell, CellBox} from 'vux'
    import {mapState} from 'vuex'
    import {mapGetters} from 'vuex'
    import {mapMutations} from 'vuex'

    export default {
        components: {
            Group,
            Cell, CellBox
        },
        data() {
            return {
                // note: changing this line won't causes changes
                // with hot-reload because the reloaded component
                // preserves its current state and we are modifying
                // its initial state.
                msg: 'Hello World!',
                showContent: true,
                localCount: "localCount",
                avatar: localStorage.avatar ? localStorage.avatar : "http://placeholder.qiniudn.com/100x100/3c5e91/3c5e91",
            }
        },
        methods: {
            toLogin() {
                alert(11111111)
            },

            clickVision() {
                console.log(this.$store.state)
            },
        },
        computed: {
            ...mapState({
                // 箭头函数可使代码更简练
                count: state => state.count,

                // 传字符串参数 'count' 等同于 `state => state.count`
                countAlias: 'count',
                list: state => {
                    return state.todos
                },

                // 为了能够使用 `this` 获取局部状态，必须使用常规函数
                countPlusLocalState(state) {
                    return state.count + this.localCount
                },
                user_id (state) {
                    if(state.user_id === ""){
                        this.$store.commit('_flashUser')
                    }
                    return state.user_id
                },

            }),
            ...mapState([
                "username",
            ]),
            ...mapGetters([
                //映射 this.doneTodosCount 为 store.getters.doneTodosCount
                'doneTodosCount',
                "doneTodos",
                //'getter名称',


            ])
        }
    }
</script>

<style lang="less">
    .avatar {
        padding-top: 10px;
        text-align: center;
        img {
            border-radius: 5px;
        }

    }

    .logo {
        width: 100px;
        height: 100px
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
    }

    .icon-chrome {
        font-size: 2em;
    }
</style>
