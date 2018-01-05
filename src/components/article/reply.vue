<template>
    <div class="reply" v-if="needReply">
        <form @submit.prevent="reply">
            <textarea name="content" maxlength="10000" class="mll" id="reply_content"
                      style="overflow: hidden; word-wrap: break-word; resize: none; height: 112px;"></textarea>
            <span class="icon   icon-send" @click="replyText"></span>
            <!--<input type="submit"  class="super normal button icon   icon-send"-->
            <!--style="width: 100%; line-height: 20px">-->
        </form>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                commentList: [{
                    avatar: "https://static.huxiucdn.com/m/image/guide-logo.png?v=201706161525",
                    nickname: "水明",
                    content: "应该可以从另外线程 close，block 的这个可能会读到 EOF 或这异常（可能语言相关）。",
                    time: "4小时前",
                }, {
                    avatar: "https://static.huxiucdn.com/m/image/guide-logo.png?v=201706161525",
                    nickname: "耳机",
                    content: "既不懂比特币也不懂朝鲜。且不说比特币的独特加密性，朝鲜得到的比特币对于本国经济根本杯水车薪。另外，作者说的外汇来源也不对，明面上是资源输出、和经济特区，暗地里是毒品、走私、军火。不过作者的新闻综合能力挺好，建议再去看看外媒，会有新的收获。\n",
                    time: "7小时前",
                },
                ],
            }
        },
        props: [
            "needReply"
        ],
        methods: {
            reply() {
                log("submit!!!")
                log(this)
            },
        },
    }
</script>

<style>
    .mll {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }

    .mll {
        border-radius: 3px;
        padding: 5px;
        font-size: 14px;
        border: 1px solid #ccc;
        display: block;
        width: 100%;
        height: 8em;
        overflow-y: auto;
        font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
        resize: vertical;
        box-sizing: border-box;
    }
</style>
