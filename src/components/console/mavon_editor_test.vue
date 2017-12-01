<template>
    <div class="mavon_editor_test">
        <h3>mavon_editor_test</h3>

        <!--<div class="show-panel">{{resData}}</div>-->
        源码显示：
        <textarea cols="50" rows="8" v-model="editorHtmlValue"></textarea>
        <button @click="uploadimg">upload</button>

        <h1>编辑文章</h1>
        文章标题: <input type="text" v-model="title" name="title" id="title"> <br>
        文章描述: <input type="text" v-model="description" id="description"> <br>
        <div id="editor">
            <mavon-editor ref="mavon-editor" style="height: 80%" v-model="editorValue"
                          default_open="edit"
                          @change="onEditorChange"
                          @htmlcode="onShowHtml"
                          @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>
        </div>

        <button @click="uploadArticle">提交文章</button>


        <div >
            <popup v-model="showPop" position="bottom" :show-mask="false">
                <div class="popup-text">
                    {{popupText}}
                </div>
            </popup>
        </div>
        <loading :show="isLoading" text="数据加载中..."></loading>
    </div>
</template>

<script type="text/ecmascript-6">
    import {Loading} from 'vux'
    import {  Popup, Group, Cell, XButton, XSwitch, Toast, XAddress, ChinaAddressData } from 'vux'

    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import axios from 'axios'

    export default {
        data() {
            return {
                isLoading: false,
                editorValue: "",
                editorHtmlValue: "",
                img_file: {},
                resData: null,
                title: "",
                author: "enzo",
                description: "",
                showPop: false,
                popupText: null,
            }
        },
        components: {
            Loading,
            mavonEditor,
            Popup,
            Group,
            Cell,
            XSwitch,
            Toast,
            XAddress,
            XButton
        },
        methods: {
            uploadimg() {
                let _this = this
                log(_this.title)
            },
            uploadArticle() {
                let _this = this

                ajax({
                    type: "post",
                    url: "//yangzq.top/console/public_article.php?n=" + Math.random(),
                    timeOut: 5000,
                    data: {
                        article: _this.editorHtmlValue,
                        description: _this.description,
                        title: _this.title,
                        author: _this.author,
                        firstName:"Fred",
                        lastName:"Flintstone"
                    },
                    before: function () {
//                        console.log("before");
                    },
                    success: function (str) {
                        var res = JSON.parse(str)
                        console.log(res)
                        if (res.errno == 0){
                            _this.popupText = res.msg.receiveMsg
                            _this.showPop = true
                        }else {
                            _this.popupText = res.msg.errMsg
                            _this.showPop = true

                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                })

            },
            onShowHtml(status, value) {
                // value 是 markdown 代码
            },
            onEditorChange(value, render) {
//                编辑区发生变化的回调事件(render: value 经过markdown解析后的结果)
                this.editorHtmlValue = render
            },
            $imgAdd(pos, $file) {
                let _this = this
                console.log('imgAdd', pos, $file);
                this.img_file[pos] = $file;

                var formData = new FormData();
                formData.append("file", $file);
                formData.append("author", _this.author);

                axios({
                    url: "http://yangzq.top/console/upload_file_test.php?n=" + Math.random(),
                    method: 'post',
                    data: formData,
                    headers: {'Content-Type': 'multipart/form-data'},
                }).then((res) => {
                    _this.resData = res.data
                    _this.$refs["mavon-editor"].$imgUpdateByUrl(pos, res.data.data[0]);
                    console.log(res.data);
                })
//                console.log('this.img_file',this.img_file);
            },
            $imgDel(pos) {
                console.log('imgDel', pos);
                delete this.img_file[pos];
            },

        },
        watch: {
            showPop (val) {
                if (val) {
                    setTimeout(() => {
                        this.showPop = false
                    }, 1000)
                }
            }
        },
    }
</script>

<style>
    .icon-chrome {
        color: #5d0500;
        width: 30px;
        height: 30px;
    }
    .popup-text{
        background-color: #30415e;
        color: #fafbfc;
        text-align: center;
        padding: 20px;
    }
</style>
