import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),

        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
            //iconDirs: [fileURLToPath(new URL('./src/icons/svg', import.meta.url))],
            symbolId: '[name]'
        })
    ],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // //前端跨域问题解决
    server: {
        port: 5174, //前端启动端口
        https: false, //是否开启https
        // host: "localhost",//本地主机地址
        open: true, //启动时是否自动打开
        proxy: {
            //跨域代理
            // '/api': {
            //     // target: "http://localhost:8080/",
            //     target: 'http://www.chef.ski:8080/',
            //     changeOrigin: true, //是否设置同源
            //     rewrite: (path) => path.replace(/^\/api/, '')
            // },
            '/image': {
                target: 'http://175.178.186.100:31355/',
                changeOrigin: true, //是否设置同源
                rewrite: (path) => path.replace(/^\/image/, '')
            }
        }
    }
})
