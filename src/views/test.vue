<template>
    <el-container class="layout">
        <el-header class="header">效果对比页面</el-header>
        <el-main class="main">
            <el-row class="row">
                <div class="dicom">
                    <div class="dicomName">Origin</div>
                    <div id="OriginDicom" class="dicom"></div>
                </div>
                <div clsss="dicom">
                    <div class="dicomName">Normal</div>
                    <div id="ProcessedDicom" class="dicom"></div>
                </div>
                <div class="dicom">
                    <div class="dicomName">Processed</div>
                    <div id="NormalDicom" class="dicom"></div>
                </div>
            </el-row>
            <el-row class="box-row">
                <el-col class="box-tag"><span>PSNR</span><span>SSIM</span><span>RMSE</span></el-col>
                <el-divider
                    direction="vertical"
                    style="
                        margin-left: -5vw;
                        margin-right: -9vw;
                        height: 8rem;
                        border-left: 3px var(--el-border-color) var(--el-border-style);
                    "
                />
                <el-col class="box">
                    <el-text type="default" style="font-size: 2rem">31.5019</el-text>
                    <el-text type="default" style="font-size: 2rem">0.8901</el-text>
                    <el-text type="default" style="font-size: 2rem">11.9413</el-text>
                </el-col>
                <div style="margin-right: -10vw; margin-left: -5vw">
                    <svg-icon name="rightArrow" style="width: 10vw; height: 11vh"></svg-icon>
                </div>
                <el-col class="box">
                    <el-text type="danger" style="font-size: 2rem">3.0206</el-text>
                    <el-text type="danger" style="font-size: 2rem">0.0392</el-text>
                    <el-text type="danger" style="font-size: 2rem">-3.5683</el-text>
                </el-col>
                <div style="margin-left: -10vw; margin-right: -5vw">
                    <svg-icon name="leftArrow" style="width: 10vw; height: 11vh"></svg-icon>
                </div>
                <el-col class="box">
                    <el-text type="default" style="font-size: 2rem">34.5225</el-text>
                    <el-text type="default" style="font-size: 2rem">0.9293</el-text>
                    <el-text type="default" style="font-size: 2rem">8.373</el-text>
                </el-col>
                <el-divider
                    direction="vertical"
                    style="
                        margin-left: -9vw;
                        margin-right: -5vw;
                        height: 8rem;
                        border-left: 3px var(--el-border-color) var(--el-border-style);
                    "
                />
                <el-col class="box-tag"><span>PSNR</span><span>SSIM</span><span>RMSE</span></el-col>
            </el-row>
        </el-main>
        <el-footer class="footer">
            <el-row>
                <button class="functionKey" @click="setToolActive('Pan')">
                    <svg-icon name="move"></svg-icon>
                    移动
                </button>

                <!-- <button class="functionKey" @click="setToolActive('Magnify')">
                    <svg-icon name="magnifier"></svg-icon>
                    放大镜
                </button> -->

                <button class="functionKey" @click="reversal()">
                    <svg-icon name="reversal"></svg-icon>
                    颜色反转
                </button>
                <button class="functionKey" @click="setToolActive('Rotate')">旋转</button>
                <button class="functionKey" @click="setToolActive('DragProbe')">拖动探针</button>
                <button class="functionKey" @click="setToolActive('ScaleOverlay')">比例尺</button>
            </el-row>
        </el-footer>
    </el-container>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
axios.defaults.baseURL = 'http://175.178.186.100:2000/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const tableData = [
    {
        index: 'PSNR',
        origin: '34.3094',
        processed: '38.3841'
    },
    {
        index: 'RMSE',
        origin: '34.3094',
        processed: '38.3841'
    },
    {
        index: 'SSIM',
        origin: '34.3094',
        processed: '38.3841'
    }
]
//数据变量
let originElement: any
let processElement: any
let normalElement: any
let image: any
let originIds = ref([]) //获得的dicom文件处理结果的URL
let processIds = ref([])
let normalIds = ref([])
let imageIndex = ref(0) //记录当前所展示的dicom文件的下标
let imageNum = ref(0) //记录所上传的文件数量
let imageId = 'wadouri:http://localhost:80/dcm/Arterial Phase2  1.0  B31f__210_1.dcm' //当前所展示的dicom文件的URL，这个是预设值
//文件信息
const imageInfo = ref({
    windowWidth: 0,
    windowCenter: 0,
    scale: 0,
    seriesNumber: '',
    imageNum: '',
    imageDate: '',
    sliceThickness: '',
    patientId: '',
    patientName: '',
    patientBirthDate: '',
    patientGender: '',
    sID: ''
})
//初始化Cornerstone
_initCornerstone()
//初始化工具
//toolInit()
//同步器
const wwwcSynchronizer = new cornerstoneTools.Synchronizer(
    'cornerstoneimagerendered',
    cornerstoneTools.wwwcSynchronizer
)
const panZoomSynchronizer = new cornerstoneTools.Synchronizer(
    'cornerstoneimagerendered',
    cornerstoneTools.panZoomSynchronizer
)

//cornerstone的初始化、让document加载完后再获取
onMounted(() => {
    //在template后加载
    originElement = document.getElementById('OriginDicom')
    processElement = document.getElementById('ProcessedDicom')
    normalElement = document.getElementById('NormalDicom')
    const elements = [originElement, processElement, normalElement]
    elements.forEach((element) => {
        cornerstone.enable(element)
    })
    window.addEventListener('resize', function () {
        //自适应窗口
        elements.forEach((element) => {
            cornerstone.resize(element, true)
        })
    })

    // element.addEventListener('cornerstoneimagerendered',function(e:any){
    //     let eventData=e.detail;
    //     getViewPort(eventData);//获取当前图片视口信息
    //     console.log(eventData)
    // })
    getResult() //获取dicom文件
    toolInit()
})

//获取处理结果
function getResult() {
    //获取url
    axios('/getResult').then((response) => {
        let res = Object.values(response.data)
        normalIds.value = (res as any)[2]
        imageNum.value = normalIds.value.length
        imageIndex.value = 0 //重新获取后下标回0

        refresh() //刷新
    })
}
//刷新cornerston组件
function refresh() {
    //加载dcm图片
    imageId = normalIds.value[imageIndex.value]
    const a = cornerstone.loadAndCacheImage(imageId).then(function (image0: any) {
        image = image0
        cornerstone.displayImage(originElement, image)
        cornerstone.displayImage(processElement, image)
        cornerstone.displayImage(normalElement, image)
    })
    Promise.all([a]).then(() => {
        Toolsynchronizatier(0), Toolsynchronizatier(1)
    })
}

function _initCornerstone() {
    //cornerstone组件的配置信息
    cornerstoneWADOImageLoader.configure({
        useWebWorkers: true,
        decodeConfig: {
            convertFloatPixelDataToInt: false
        }
    })
    cornerstoneWADOImageLoader.webWorkerManager.initialize({
        maxWebWorkers: navigator.hardwareConcurrency || 1,
        startWebWorkersOnDemand: true,
        taskConfiguration: {
            decodeTask: {
                initializeCodecsOnStartup: false
            }
        },
        webWorkerTaskPaths: [
            'https://unpkg.com/cornerstone-wado-image-loader@4.1.5/dist/610.bundle.min.worker.js'
        ]
    })
    // 初始化 api
    cornerstoneTools.init({
        touchEnabled: false,
        // 显示光标
        showSVGCursors: true
    })
    //cornerstonTools工具样式设置
    const fontFamily =
        'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif'
    cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`)
    // Set the tool width
    cornerstoneTools.toolStyle.setToolWidth(2)
    // Set color for inactive tools
    cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)')
    // Set color for active tools
    cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)')
    //cornerston组件的配置以及初始化
}

function toolInit() {
    const tools = ['Bidirectional', 'Eraser', 'Length'] //窗位、放大、移位、旋转

    tools.forEach((toolName) => {
        addTool(toolName)
    })
    //拖动探针
    const DragProbeToolProps = {
        configuration: {
            // 是否开启阴影
            shadow: false,
            // 阴影颜色
            shadowColor: '#000000',
            // 阴影模糊程度
            shadowBlur: 0,
            // 阴影偏移量横坐标
            shadowOffsetX: 1,
            // 阴影偏移量纵坐标
            shadowOffsetY: 1
        }
    }

    //滚轮缩放
    const ZoomMouseWheelToolProps = {
        configuration: {
            // 最小缩放比例
            minScale: 0.25,
            // 最大缩放比例
            maxScale: 20.0,
            // 滚轮方向是否反转，false：上滚放大、下滚缩小；true：上滚缩小、下滚放大
            invert: false
        }
    }
    //比例尺
    const ScaleOverlayToolProps = {
        configuration: {
            // 次要刻度线的长度
            minorTickLength: 12.5,
            // 主要刻度线的长度
            majorTickLength: 25,
            // 是否开启阴影
            shadow: false,
            // 阴影颜色
            shadowColor: '#000000',
            // 阴影模糊程度
            shadowBlur: 0,
            // 阴影偏移量横坐标
            shadowOffsetX: 1,
            // 阴影偏移量纵坐标
            shadowOffsetY: 1
        }
    }
    //旋转
    const RotateProps = {
        configuration: {
            // 是否采用整数的角度，自动取整
            roundAngles: false,
            // 水平方向翻转角度
            flipHorizontal: false,
            // 垂直方向翻转角度
            flipVertical: false,
            // 角度的步长，此项调整旋转的鼠标的控制力度
            rotateScale: 1
        }
    }
    //方向标记
    const OrientationMarkersToolprops = {
        configuration: {
            // 是否显示全部方向标记，未开启则只显示上侧与左侧的方向标记
            drawAllMarkers: true
        }
    }
    //放大镜
    const MagnifyToolProps = {
        configuration: {
            // 放大将尺寸
            magnifySize: 200,
            // 放大镜放大倍数
            magnificationLevel: 3
        }
    }

    const ZoomMouseWheelTool = cornerstoneTools[`ZoomMouseWheelTool`]
    const MagnifyTool = cornerstoneTools[`MagnifyTool`]
    const RotateTool = cornerstoneTools[`RotateTool`]
    const DragProbeTool = cornerstoneTools[`DragProbeTool`]
    const ScaleOverlayTool = cornerstoneTools[`ScaleOverlayTool`]
    cornerstoneTools.addTool(ZoomMouseWheelTool, ZoomMouseWheelToolProps)
    cornerstoneTools.addTool(MagnifyTool, MagnifyToolProps)
    cornerstoneTools.addTool(RotateTool, RotateProps)
    cornerstoneTools.addTool(DragProbeTool, DragProbeToolProps)
    cornerstoneTools.addTool(ScaleOverlayTool, ScaleOverlayToolProps)
    setToolActive('ZoomMouseWheel')
}
function addTool(toolName: string) {
    const ApiTool = cornerstoneTools[`${toolName}Tool`]
    cornerstoneTools.addTool(ApiTool)
}
//设置功能
function setToolActive(toolName: string) {
    const options = {
        mouseButtonMask: 1 //1：左键 ，2：右键，4：中键
    }

    cornerstoneTools.setToolActive(toolName, options)
}
function Toolsynchronizatier(options: number) {
    const elements = [originElement, processElement, normalElement]
    let tool: any
    switch (options) {
        case 0: //移动
            elements.forEach((element) => {
                panZoomSynchronizer.add(element)
            })
            panZoomSynchronizer.enabled = true
            tool = cornerstoneTools[`PanTool`]
            elements.forEach(() => {
                cornerstoneTools.addTool(tool)
                cornerstoneTools.setToolActive('Pan', {
                    mouseButtonMask: 1,
                    synchronizationContext: panZoomSynchronizer
                })
            })

            break
        case 1: //窗宽窗位调节
            elements.forEach((element) => {
                wwwcSynchronizer.add(element)
            })
            wwwcSynchronizer.enabled = true
            tool = cornerstoneTools[`WwwcTool`]
            elements.forEach(() => {
                cornerstoneTools.addTool(tool)
                cornerstoneTools.setToolActive('Wwwc', {
                    mouseButtonMask: 2,
                    synchronizationContext: wwwcSynchronizer
                })
            })
    }
}
//颜色反转
function reversal() {
    const originViewport = cornerstone.getViewport(originElement)
    const processedViewport = cornerstone.getViewport(processElement)
    const normalViewport = cornerstone.getViewport(normalElement)

    originViewport.invert = !originViewport.invert
    processedViewport.invert = !processedViewport.invert
    normalViewport.invert = !normalViewport.invert
    cornerstone.setViewport(originElement, originViewport)
    cornerstone.setViewport(processElement, processedViewport)
    cornerstone.setViewport(normalElement, normalViewport)
}
</script>
<style scoped>
.layout {
    height: 100vh;
    width: 100vw;
    margin: 0%;
}
.dicom {
    width: 33vw;
    height: 33vw;
    margin: 0px;
}
.header {
    background-color: rgb(134, 138, 138);
}
.main {
    padding: 0;
    background-color: rgb(114, 118, 118);
    overflow: hidden;
    height: 30rem;
}
.main .row {
    display: flex;
    justify-content: center;
}
.main .dicomName {
    z-index: 20;
    position: absolute;
    font-size: 1.3rem;
    color: white;
    margin-left: 15vw;
    margin-top: 1rem;
    text-align: center;
}
.main .box-row {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    display: -webkit-flex;
    background-color: rgb(198, 201, 204);
}
.main .box-row .box-tag {
    display: flex;
    justify-content: space-evenly; /*水平均匀分布  */
    align-items: center;
    flex-direction: column;
    max-width: 15vw;
}
.main .box-row .box {
    display: flex;
    justify-content: space-evenly; /*水平均匀分布  */
    align-items: center; /* 垂直居中  */
    flex-direction: column;
    max-width: 30vw;
}
.my-label {
    background: var(--el-color-success-light-9);
}
.my-content {
    background: var(--el-color-danger-light-9);
}
.footer {
    background-color: rgb(52, 54, 54);
    height: 6rem;
}
.footer .functionKey {
    background-color: rgba(0, 0, 0, 0);
    color: white;
}
</style>
