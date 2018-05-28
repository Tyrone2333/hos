<template>
    <div class="me">

        <div class="user-info">
            <div class="avatar">
                <router-link to="/login">
                    <!--<img class="logo" src="../../assets/vux_logo.png">-->
                    <img :src="avatar">
                </router-link>
            </div>
            <div class="text">
                <div class="nickname">
                    {{nickname}} <br>
                </div>
                <div class="home-page-edit">User : {{username}}</div>
            </div>

        </div>

        <group title="">
            <cell title="管理控制台"
                  is-link
                  :border-intent="false"
                  :arrow-direction="showContent ? 'up' : 'down'"
                  @click.native="showContent = !showContent"></cell>
            <div class="slide" :class="showContent?'animate':''">
                <!--<cell-box is-link link="/article_edit">-->
                <!--<del>发布文章 使用wang_editor</del>-->
                <!--</cell-box>-->

                <cell-box is-link link="/mavon_editor_test">写断言</cell-box>
                <!--<cell-box is-link link="/article_modify"><del>修改断言</del></cell-box>-->
                <cell-box is-link>
                    <del>修改断言</del>
                </cell-box>
            </div>

            <cell title="我的收藏" value="" is-link link="/collect">
                <span class="cellIcon small-icon icon-bookmark" slot="icon"></span>
            </cell>
            <cell title="我的回复" value="" is-link link="/collect">
                <span class="cellIcon small-icon icon-notifications" slot="icon"></span>
                <span  >
                    <span class="vertical-middle">新提醒</span>
                    <badge text="16"></badge>
                </span>

            </cell>

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
    import {mapMutations} from 'vuex'

    export default {
        components: {
            Group, Cell, CellBox, XButton, Badge
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
                user_id(state) {
                    if (state.user_id === "") {
                        this.$store.commit('_flashUser')
                    }
                    return state.user_id
                },

            }),
            ...mapState([
                "username",
                "nickname",
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
