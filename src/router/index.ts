import login from '../views/login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import test from '../views/test.vue'
import home from '../views/home.vue'
import show from '../views/show.vue'
import report from '../views/report.vue'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: '/',
        //     name: 'home',
        //     component: home
        // },
        {
            path: '/show',
            component: show
        },
        {
            path: '/',
            component: test
        },
        {
            path: '/report',
            component: report
        },
        {
            path: '/login',
            component: login
        }
    ]
})

export default router
