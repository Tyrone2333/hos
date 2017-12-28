<template>
    <div class="mavon_editor_test">

        <!--源码显示： <textarea cols="50" rows="8" v-model="editorHtmlValue"></textarea>-->

        <button @click="uploadimg" class="btn-publish">只是一个功能按钮</button>

        <h1>编辑文章</h1>

         <input type="text" v-model="title" name="title" id="title" placeholder="请输入标题"> <br>
        文章描述:
        <textarea v-model="description" name="description" id="" cols="50" rows="7"></textarea>
        <!--<input type="text" v-model="description" id="description"> -->
        <br>


        <div id="editor">
            <mavon-editor ref="mavon-editor" style="height: 80%" v-model="editorValue"
                          default_open="edit"
                          @change="onEditorChange"
                          @htmlcode="onShowHtml"
                          placeholder="提交“待验证”的预言、个人判断、思路"
                          @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>
        </div>

        <div class="joinTopic ">
            <transition-group name="list-complete" tag="p">

        <span v-for="(item,idx) in joinTopicList"
              @click="joinClick(item,idx)"
              v-bind:key="item"
              class="list-complete-item">{{item}}</span>

            </transition-group>
        </div>
        <hr>
        <div class="options">
            <transition-group name="list-complete-botton" tag="p">
        <span v-for="(item,idx)  in optionsList "
              @click="optionsClick(item,idx)"
              v-bind:key="item"
              class="list-complete-item"
        >{{item}}</span>
            </transition-group>
        </div>

        <div class="major-publish">
            <button class="btn-publish" @click="uploadArticle">提交文章</button>
        </div>
        <!--<button v-if="isChild" @click="modifyArticle">提交修改</button>-->


        <div>
            <popup v-model="showPop" position="bottom" :show-mask="false">
                <div class="popup-text">
                    {{popupText}}
                </div>
            </popup>
        </div>
        <loading :show="isLoading" text="数据加载中..."></loading>
        <toast v-model="showToast" :type="toastType" :time="2000" is-show-mask :text="toastText"
               position="default"></toast>

    </div>
</template>

<script type="text/ecmascript-6">
    import {Loading} from 'vux'
    import {Popup, Group, Cell, XInput, XButton, XSwitch, Toast, XAddress, ChinaAddressData} from 'vux'

    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import axios from 'axios'

    export default {
        data() {
            return {
                isLoading: false,
                editorValue: this.initVal,
                editorHtmlValue: "",
                editorMDValue: "",
                img_file: {},
                resData: null,
                title: "",
                author: "enzo",
                description: "",
                showPop: false,
                popupText: null,
                showToast: false,
                toastType: "default",
                toastText: "hello world",
                banner_img :"", // 文章列表显示的略缩图
                joinTopicList: [],
                optionsList: ["英语", "环境", "france", "游戏",1, 2, 3, 4, 5, 6, 7, 8, 9],

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
            XButton, XInput
        },
        methods: {
            uploadimg() {
                let _this = this
                log(_this.$store)
                localStorage.setItem("name", "myName")
                this.$vux.toast.show({
                    showPositionValue: false,
                    text: "localStorage.name: " + localStorage.name,
                    type: "warn",
                    // width: width,
                    position: 'middle',
                    onShow() {
                        // console.log('Plugin: I\'m showing')
                    },
                    onHide() {
                        // console.log('Plugin: I\'m hiding')
                    }
                })
            },
            uploadArticle() {
                let _this = this
                if (_this.contentCheck()) {
                    return
                }
                ajax({
                    type: "post",
                    url: "//yangzq.top/console/publish_article.php?n=" + Math.random(),
                    timeOut: 5000,
                    data: {
                        article: _this.editorHtmlValue,
                        description: _this.description,
                        title: _this.title,
                        author: _this.$store.state.username,
                        authorId: _this.$store.state.user_id,
                        md: _this.editorMDValue,
                        banner_img : _this.banner_img,
                    },
                    before: function () {
//                        console.log("before");
                    },
                    success: function (str) {
                        var res = JSON.parse(str)
                        console.log(res)
                        if (res.errno == 0) {
                            _this.toastSuccess(res.msg.receiveMsg)
                        } else {
                            _this.toastWarn(res.msg.errMsg)
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
                this.editorMDValue = value
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
                    _this.$refs["mavon-editor"].$img2Url(pos, res.data.data[0]);
                    _this.banner_img = res.data.data[0]
                    log(_this.banner_img)
                    console.log(res.data);
                })
//                console.log('this.img_file',this.img_file);
            },
            $imgDel(pos) {
                console.log('imgDel', pos);
                delete this.img_file[pos];
            },
            toastWarn(text) {
                this.toastType = "warn"
                this.toastText = text
                this.showToast = true
            },
            toastSuccess(text) {
                this.toastType = "success"
                this.toastText = text
                this.showToast = true
            },
            contentCheck() {
                let _this = this
                if (isEmptyStr(_this.title)) {
                    _this.toastWarn("标题不能为空")
                    return true
                }
                // if (isEmptyStr(_this.description)) {
                //     _this.toastWarn("描述不可为空")
                //     return true
                // }
                if (isEmptyStr(_this.editorMDValue)) {
                    _this.toastWarn("内容不可为空")
                    return true
                }
            },
            joinClick: function (item, idx) {

                this.joinTopicList.splice(idx, 1)
                this.optionsList.splice(this.randomIndex(this.optionsList), 0, item)

                // this.optionsList.push(item)
                console.log(item)
            }, optionsClick: function (item, idx) {
                this.optionsList.splice(idx, 1)
                this.joinTopicList.push(item)
                console.log(item)
            },
            randomIndex: function (items) {
                return Math.floor(Math.random() * items.length)
            },

        },
        watch: {
            showPop(val) {
                log(val)
                if (val) {
                    setTimeout(() => {
                        this.showPop = false
                    }, 1000)
                }
            }
        },
    }
</script>

<style lang="less">
    .icon-chrome {
        color: #5d0500;
        width: 30px;
        height: 30px;
    }

    .popup-text {
        background-color: #30415e;
        color: #fafbfc;
        text-align: center;
        padding: 20px;
    }
    #title{
        width: 100%;
        height: 26px;
    }

    .major-publish {
        &:after{
            content: " ";
            display: block;
            visibility: hidden;
            clear: both;
        }
        .btn-publish{
            float: right;
            text-align: center;
            padding: 6px 14px;
            line-height: normal;
            font-size: 14px;
            vertical-align: middle;
            height: auto;
            background: #0f88eb;
            color: #fff;
            border-radius: 3px;
            /*border: none;*/
            z-index: 103;
            margin: 16px;
            border: 1px solid #0f88eb;
        }
    }

    /*添加标签的动画css*/
    .options span {
        padding: 5px 8px;
        background-color: cadetblue;
        border-radius: 2px;

        margin: 5px;
    }
    .joinTopic span {
        padding: 5px 8px;
        background-color: #0f88eb;
        border-radius: 2px;
        margin: 5px;
    }

    .list-complete-item {
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }

    .list-complete-enter, .list-complete-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(10px);
    }

    .list-complete-leave-active {
        position: absolute;
    }

    .list-complete-item-botton {
        transition: all 1s;
        display: inline-block;
        margin-right: 10px;
    }

    .list-complete-botton-enter, .list-complete-botton-leave-to
        /* .list-complete-leave-active for below version 2.1.8 */
    {
        opacity: 0;
        transform: translateY(-10px);
    }

    .list-complete-botton-leave-active {
        position: absolute;
    }

</style>
