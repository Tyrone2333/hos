import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store/store.js'

import home from '../components/home/home.vue'
import news from '../components/news/news.vue'
import header from '../components/header/header.vue'
import me from '../components/me/me.vue'
import login from '../components/me/login.vue'
import article_edit from '../components/console/article_edit.vue'
import article_modify from '../components/console/article_modify.vue'
import article from '../components/article/article_list.vue'
import assert from '../components/article/assert.vue'
import read_article from '../components/article/read_article.vue'
import collect from '../components/collect/collect.vue'
import feedback from '../components/feedback/feedback.vue'

import mavon_editor_test from '../components/console/mavon_editor_test.vue'
import about from '../components/me/about.vue'

Vue.use(Router)


const router = new Router({
    // mode: 'history',
    mode: 'hash',
    // history: false,//这个参数改为false就可以了
    routes: [
        {
            path: '/',
            component: article
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
            children: [
                {
                    path: 'read_article/:articleId',
                    name: 'read_article',
                    component: read_article
                },
            ]
        },
        {
            path: '/assert',
            name: 'assert',
            component: assert,
            children: [
                {
                    path: 'read_article/:articleId',
                    name: 'read_article',
                    component: read_article
                },
            ]

        },
        {
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
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            component: me
        }, {
            path: '/login',
            name: 'login',
            component: login
        }, {
            path: '/article_edit',
            name: 'article_edit',
            component: article_edit
        },
        {
            path: '/mavon_editor_test',
            name: 'mavon_editor_test',
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
            component: mavon_editor_test
        }, {
            path: '/article_modify',
            name: 'article_modify',
            component: article_modify
        }, {
            path: '/about',
            name: 'about',
            component: about
        }, {
            path: '/feedback',
            name: 'feedback',
            component: feedback
        },
        {
            path: '/collect',
            name: 'collect',
            component: collect,
            children: [
                {
                    path: 'read_article/:articleId',
                    name: 'read_article',
                    component: read_article
                },
            ],
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
        },

    ]
})

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit("_flashUser")
}
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        // 通过vuex state获取当前的token是否存在,由于时间所限没有验证token,以后添加
        if (store.state.token) {
            next();
        }
        else {

            next({
                path: '/login',
                query: {redirect: to.path}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

export default router