<template>
    <div class="article_edit">

        <div >article_edit</div>
        <pre>
            如果需要将 wangEditor 用于 Vue 中，可参见如下示例

下载源码 git clone git@github.com:wangfupeng1988/wangEditor.git
进入 vue 示例目录 cd wangEditor/example/demo/in-vue/，查看src/components/Editor.vue即可
也可以运行npm install && npm run dev查看在 vue 中的效果（http://localhost:8080/）
        </pre>

        <editor></editor>
    </div>
</template>

<script type="text/ecmascript-6">
    import Editor from './Editor'
    export default {
        components: {
            Editor,
        }
    }
</script>

<style>

</style>
