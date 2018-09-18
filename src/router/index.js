import Vue from 'vue'
import Router from 'vue-router'
import {store} from '@/store/store.js'


import news from '@/pages/news/news.vue'
import header from '@/pages/header/header.vue'
import me from '@/pages/me/me.vue'
import login from '@/pages/me/login.vue'

import article_modify from '@/pages/console/article_modify.vue'
import article from '@/pages/article/article_list.vue'
import read_article from '@/pages/article/read_article.vue'
import collect from '@/pages/collect/collect.vue'
import feedback from '@/pages/feedback/feedback.vue'
import test from "@/pages/test.vue"
import user from "@/pages/me/user.vue"
import setting from "@/pages/me/setting.vue"
import chatRoom from "@/pages/chatRoom/chatRoom.vue"

import mavon_editor_test from '@/pages/console/mavon_editor_test.vue'
import about from '@/pages/me/about.vue'

Vue.use(Router)


const router = new Router({
    // mode: 'history',
    mode: 'hash',
    // history: false,//这个参数改为false就可以了
    routes: [
        {
            path: '/',
            // component: article,
            redirect: '/article'
        },
        // {
        //     path: '/Hello',
        //     name: 'Hello',
        //     component: Hello
        // },

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
            ],
            meta: {
                // 这里想用 keep-alive 缓存列表的位置,未果,可能是用了 view-box 的原因????
                isUseCache: false,  // 前进刷新
                keepAlive: true  // 通过此字段判断是否需要缓存当前组件
            },
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
        },
        {
            path: '/feedback',
            name: 'feedback',
            component: feedback
        },
        {
            path: '/collect',
            name: 'collect',
            component: collect,
            meta: {
                requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            },
        },
        {
            path: '/user/:id',
            name: 'user',
            component: user,
        },
        {
            path: '/setting',
            name: 'setting',
            component: setting,
        },
        {
            path: '/chatRoom',
            name: 'chatRoom',
            component: chatRoom,
        },
        {
            path: '/test',
            name: 'test',
            component: test,
        },

    ]
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        // 通过vuex state获取当前的token是否存在,由于时间所限没有验证token,以后添加
        if (store.state.user.token && store.state.user.status === "ok") {
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