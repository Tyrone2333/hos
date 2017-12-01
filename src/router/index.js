import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home/home.vue'
// import Hello from '../components/Hello.vue'
import news from '../components/news/news.vue'
import header from '../components/header/header.vue'
import me from '../components/me/me.vue'
import login from '../components/me/login.vue'
import article_edit from '../components/console/article_edit.vue'
import article from '../components/article/article.vue'
import read_article from '../components/article/read_article.vue'
// 引入后手机只有chrome能访问，其他都是空白
import mavon_editor_test from '../components/console/mavon_editor_test.vue'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    mode: 'hash',
    // history: false,//这个参数改为false就可以了
    routes: [
        {
            path: '/',
            component: home
        },
        // {
        //     path: '/Hello',
        //     name: 'Hello',
        //     component: Hello
        // },
        {
            path: '/home',
            name: 'home',
            component: home
        },
        {
            path: '/article',
            name: 'article',
            component: article,

        }, {
            path: '/news',
            name: 'news',
            component: news
        }, {
            path: '/header',
            name: 'header',
            component: header
        }, {
            path: '/me',
            name: 'me',
            component: me
        }, {
            path: '/login',
            name: 'login',
            component: login
        }, {
            path: '/article_edit',
            name: 'article_edit',
            component: article_edit
        },{
            path: '/read_article/:articleId',
            name: 'read_article',
            component: read_article
        },
        {
            path: '/mavon_editor_test',
            name: 'mavon_editor_test',
            component: mavon_editor_test
        },

    ]
})
