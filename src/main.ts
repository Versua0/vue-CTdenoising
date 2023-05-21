import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElUpload, ElButton } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import * as cornerstone from 'cornerstone-core'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import * as cornerstoneTools from 'cornerstone-tools'
import * as cornerstoneMath from 'cornerstone-math'
import * as dicomParser from 'dicom-parser'
import * as Hammer from 'hammerjs'
import axios from 'axios'
import './assets/basic.css'
import SvgIcon from '@/components/SvgIcon.vue'
import 'virtual:svg-icons-register'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ElementPlus) // 引用ElemenyPlus
app.use(ElUpload)
app.use(ElButton)
app.use(cornerstone)
app.use(cornerstoneTools)
app.use(cornerstoneWADOImageLoader)
//app.use(dicomParser)
//cornerstone的相关配置
cornerstoneTools.external.cornerstone = cornerstone
cornerstoneTools.external.cornerstoneMath = cornerstoneMath
cornerstoneTools.external.Hammer = Hammer
cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.cornerstoneMath = cornerstoneMath
cornerstoneWADOImageLoader.external.dicomParser = dicomParser
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.component('SvgIcon', SvgIcon)
app.mount('#app')
app.config.globalProperties.$axios = axios //配置axios的全局引用
