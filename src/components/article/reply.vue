<template>
    <div class="reply">
        <form>
            <textarea name="content" maxlength="10000" class="mll" id="reply_content"
                      style="overflow: hidden; word-wrap: break-word; resize: none; height: 112px;"></textarea>

        </form>

        <!--<span class="icon   icon-send" @click="reply"></span>-->
        <span class="weui-btn weui-btn_mini btn-none">取消</span>
        <span class="weui-btn weui-btn_mini weui-btn_primary">确认</span>


    </div>
</template>

<script type="text/ecmascript-6">

    export default {
        data() {
            return {
                commentDraft: [],
            }
        },
        props: {
            needReply: {
                type: Boolean,
                default: true
            },
            horizontal: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            log("mounted")
            // document.querySelector("#reply_content").focus()
        },
        methods: {
            reply() {
                log("submit!!!")
                log(this)
            },
        },
    }
</script>

<style lang="less">
    .reply{
        .btn-none {
            border: none !important;
            background: transparent !important;
            color: black;
            &.btn-none:after{
                content: none;
            }
        }
    }
    .mll {
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
        border-radius: 3px;
        font-size: 14px;
        border: 1px solid #ccc;
        display: block;
        height: 8em;
        overflow-y: auto;
        font-family: "Helvetica Neue", "Luxi Sans", "DejaVu Sans", Tahoma, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
        resize: vertical;
    }


</style>
