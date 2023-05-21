<template>
    <el-container class="layout">
        <el-header class="header">
            <span style="font-size: 20px">{{ imageInfo.patientName }}</span>
            <div class="studyBannerInfo">
                <span class="InfoBox">{{ imageInfo.modality }}</span>
                <span class="InfoBox">检查部位:{{ imageInfo.imageNum }}</span>
                <span class="InfoBox">检查日期:{{ imageInfo.imageDate }}</span>
                <span class="InfoBox">{{ imageInfo.description }}</span>
            </div>
        </el-header>
        <el-container style="height: 0">
            <el-aside class="leftFileBar">
                <el-row class="row">
                    <button class="button" style="border-right: 0">序列</button>
                    <button class="button" style="border-right: 0">占位</button>
                    <button class="button" style="width: 2rem; font-size: 1.6rem; border-right: 0">
                        <el-icon><Fold /></el-icon>
                    </button>
                </el-row>

                <div style="background-color: grey; font-size: 20px; border: 1px">
                    共有1个序列，一个影像
                </div>
                <div class="BaseRadius">
                    <el-button
                        v-for="(item, index) in imageNames"
                        :key="index"
                        plain
                        class="showFileList"
                    >
                        <el-image :src="url" class="image"></el-image>

                        <div class="picIndex">{{ index + 1 }}</div>
                        <div class="serialNumber">序列：{{ imageInfo.seriesNumber }}</div>
                        <div class="deep">{{ imageInfo.sliceThickness }}mm</div>
                        <div class="fileName">[{{ imageInfo.modality }}] {{ item }}</div>
                    </el-button>
                </div>
            </el-aside>
            <el-main class="dicom">
                <div class="wrapper">
                    <div class="box">
                        <div class="dicomInfo">
                            <span class="info">
                                {{ imageInfo.patientName }} ({{ imageInfo.patientGender }})
                            </span>
                            <span class="info">{{ imageInfo.patientId }}</span>
                            <span class="info">出生日期:{{ imageInfo.patientBirthDate }}</span>
                            <span class="info">图像:{{ imageIndex + 1 }}/{{ imageNum }}</span>
                            <span class="info">序列:{{ imageInfo.seriesNumber }}</span>
                        </div>
                        <div class="dicomInfo">
                            <span class="info">{{ imageNames[imageIndex] }}</span>
                            <span class="info">
                                T: {{ imageInfo.sliceThickness }}mm L:
                                {{ imageInfo.sliceLocation }}mm
                            </span>
                            <span class="info">
                                大小：{{ imageInfo.columns }}x{{ imageInfo.rows }}
                            </span>
                        </div>
                    </div>

                    <div class="box">
                        <div class="dicomInfo">
                            <span class="Rightinfo">{{ imageInfo.modality }}</span>
                            <span class="Rightinfo">检查部位:{{ imageInfo.imageNum }}</span>
                            <span class="Rightinfo">检查时间:{{ imageInfo.imageDate }}</span>
                            <span class="Rightinfo">{{ imageInfo.description }}</span>
                        </div>
                        <div class="dicomInfo">
                            <span class="Rightinfo">
                                {{ imageInfo.XRayTubeCurrent }}mA {{ imageInfo.kvp }}kv
                            </span>
                            <span class="Rightinfo">
                                WW: {{ imageInfo.windowWidth }} WC:{{ imageInfo.windowCenter }}
                            </span>
                            <span class="Rightinfo"
                                >设备:{{ imageInfo.ManufacturerModelName }}</span
                            >
                        </div>
                    </div>
                </div>

                <div id="dicomImage" style="width: 55.7rem; height: 44rem; margin: -10px"></div>
            </el-main>
            <el-aside class="rightToolBar">
                <div class="Block">
                    <el-row class="Block1">
                        <button class="button" style="width: 2rem; font-size: 1.6rem">
                            <el-icon style="transform: rotate(180deg)"><Fold /></el-icon>
                        </button>
                        <button class="button" style="width: 6rem; margin-right: 5rem">
                            常用工具
                        </button>
                    </el-row>
                    <div class="Block2">
                        <button
                            class="functionKey"
                            style="margin-left: 0.15rem; margin-top: 0.2rem"
                            @click="setToolActive('Wwwc')"
                        >
                            <svg-icon name="chuangwei"></svg-icon>
                        </button>
                        <button class="functionKey" @click="setToolActive('Pan')">
                            <svg-icon name="move"></svg-icon>
                        </button>
                        <button class="functionKey" @click="setToolActive('Zoom')">
                            <svg-icon name="zoom"></svg-icon>
                        </button>
                        <button class="functionKey" @click="setToolActive('Magnify')">
                            <svg-icon name="magnifier"></svg-icon>
                        </button>
                        <button class="functionKey" @click="reversal()">
                            <svg-icon name="reversal"></svg-icon>
                        </button>
                        <button class="functionKey" @click="setToolActive('Rotate')">
                            <svg-icon name="rotate"></svg-icon>
                        </button>
                        <button class="functionKey" @click="setToolActive('DragProbe')">
                            <svg-icon name="probe"></svg-icon>
                        </button>
                        <button class="functionKey" @click="setToolActive('ScaleOverlay')">
                            <svg-icon name="scaleOverlay"></svg-icon>
                        </button>
                    </div>
                    <div class="Block2">播放</div>
                    <div class="Block3">标注</div>
                    <div class="Block4">其他设置</div>
                </div>
            </el-aside>
        </el-container>
    </el-container>
</template>
<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
axios.defaults.baseURL = 'http://175.178.186.100:2000/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'

//数据变量
let element: any
let image: any
let imageIds = ref([]) //获得的dicom文件处理结果的URL
let imageNames = ref([])
let imageIndex = ref(0) //记录当前所展示的dicom文件的下标
let imageNum = ref(0) //记录所上传的文件数量
let imageId = 'wadouri:http://localhost:80/dcm/Arterial Phase2  1.0  B31f__210_1.dcm' //当前所展示的dicom文件的URL，这个是预设值
//文件信息
let imageInfo = ref({
    windowWidth: 0,
    windowCenter: 0,
    scale: 0,
    seriesNumber: '',
    imageNum: '',
    imageDate: '',
    imageTime: '',
    sliceThickness: '',
    patientId: '',
    patientName: '',
    patientBirthDate: '',
    patientGender: '',
    sID: '',
    description: '',
    sliceLocation: '',
    modality: '',
    rows: '',
    columns: '',
    kvp: '',
    XRayTubeCurrent: '',
    ManufacturerModelName: ''
})
//cornerstone的初始化
_initCornerstone()

//cornerstone的初始化、让document加载完后再获取
onMounted(() => {
    //在template后加载
    element = document.getElementById('dicomImage')
    cornerstone.enable(element)
    window.addEventListener('resize', function () {
        //自适应窗口
        cornerstone.resize(element, true)
    })

    // element.addEventListener('cornerstoneimagerendered',function(e:any){
    //     let eventData=e.detail;
    //     getViewPort(eventData);//获取当前图片视口信息
    //     console.log(eventData)
    // })
    getResult() //获取dicom文件
    toolInit() //初始化工具
})
//设置功能
function setToolActive(toolName: string) {
    const options = {
        mouseButtonMask: 1 //1：左键 ，2：右键，4：中键
    }

    cornerstoneTools.setToolActive(toolName, options)
}
//cornerston组件的配置以及初始化
cornerstoneTools.init({
    touchEnabled: false,
    showSVGCursors: true
})
//获取处理结果
function getResult() {
    //获取url
    axios('/getResult').then((response) => {
        let res = Object.values(response.data)
        imageIds.value = (res as any)[2]
        imageNum.value = imageIds.value.length
        imageIndex.value = 0 //重新获取后下标回0
        getNames()
        refresh() //刷新
    })
}
//刷新cornerston组件
function refresh() {
    //加载dcm图片
    imageId = imageIds.value[imageIndex.value]
    cornerstone.loadAndCacheImage(imageId).then(function (image0: any) {
        image = image0
        cornerstone.displayImage(element, image)
        getImageInfo(image)
        //setToolActive('Wwwc')
        //setToolActive('Pan')
    })
}

//文件信息的获取
function getImageInfo(image: any) {
    imageInfo.value.seriesNumber = image.data.string('x00200011') //图像序列号
    imageInfo.value.imageNum = image.data.string('x00180015') //图像位置
    imageInfo.value.imageDate = image.data.string('x00080023') //拍摄日期
    imageInfo.value.imageTime = image.data.string('x00080031') //拍摄时间
    imageInfo.value.sliceThickness = image.data.string('x00180050') //层厚
    imageInfo.value.sliceLocation = image.data.string('x00201041') //检查描述
    imageInfo.value.modality = image.data.string('x00080060') //检查模态：CT/MRI/CR/DR
    imageInfo.value.rows = image.data.string('x00280010') //图片高
    imageInfo.value.columns = image.data.string('x00280011') //图片宽
    imageInfo.value.kvp = image.data.string('x00180060') //kvp
    imageInfo.value.XRayTubeCurrent = image.data.string('x00181151') //电流
    imageInfo.value.ManufacturerModelName = image.data.string('x00081090') //电流
    // 病人基本信息
    imageInfo.value.patientName = image.data.string('x00100010')
    imageInfo.value.patientBirthDate = image.data.string('x00100030')
    imageInfo.value.patientGender = image.data.string('x00100040') //性别
    imageInfo.value.patientId = image.data.string('x00100020') //病理号
    imageInfo.value.description = image.data.string('x00081030') //检查描述
    imageInfo.value.windowCenter = image.data.string('x00281050')
    imageInfo.value.windowWidth = image.data.string('x00281051')
    console.log(imageInfo.value)
    // 像素间距
    //pixelSpacing = image.data.string('x00280030');
    //imagePixelSpacing = image.data.string('x00181164') || '';
    //rowPixelSpacing = image.rowPixelSpacing;
    // 放射放大系数
    //magnification = Number(image.data.string('x00181114'));
    // 放射源到面板的距离
    //sourceTOdetector = image.data.string('x00181110');
    // 放射源到病人的距离
    //sourceTOpatient = image.data.string('x00181111');
    //this.modalityLUT = cornerstone.metaData.get('modalityLutModule', image.imageId).modalityLUTSequence;
    //voiContent = cornerstone.metaData.get('voiLutModule', image.imageId);
    // 斜率截距
    //rescaleIntercept = Number(image.data.string('x00281052'));
    //rescaleSlope = Number(image.data.string('x00281053'));
}

function getNames() {
    axios('/getNames').then((response) => {
        let res = Object.values(response.data)
        imageNames.value = (res as any)[2]
    })
}
function toolInit() {
    const tools = ['Wwwc', 'Zoom', 'Pan', 'Rotate', 'Bidirectional', 'Eraser', 'Magnify', 'Length'] //窗位、放大、移位、旋转

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
            magnifySize: 300,
            // 放大镜放大倍数
            magnificationLevel: 2
        }
    }
    const ZoomMouseWheelTool = cornerstoneTools[`ZoomMouseWheelTool`]
    const MagnifyTool = cornerstoneTools[`MagnifyTool`]
    const RotateTool = cornerstoneTools[`RotateTool`]
    const DragProbeTool = cornerstoneTools[`DragProbeTool`]
    const ScaleOverlayTool = cornerstoneTools[`ScaleOverlayTool`]
    const OrientationMarkersTool = cornerstoneTools['OrientationMarkersTool']
    cornerstoneTools.addTool(ZoomMouseWheelTool, ZoomMouseWheelToolProps)
    cornerstoneTools.addTool(MagnifyTool, MagnifyToolProps)
    cornerstoneTools.addTool(RotateTool, RotateProps)
    cornerstoneTools.addTool(DragProbeTool, DragProbeToolProps)
    cornerstoneTools.addTool(ScaleOverlayTool, ScaleOverlayToolProps)
    cornerstoneTools.addTool(OrientationMarkersTool, OrientationMarkersToolprops)
    setToolActive('ZoomMouseWheel')
    setToolActive('OrientationMarkers')
}
function addTool(toolName: string) {
    const ApiTool = cornerstoneTools[`${toolName}Tool`]

    cornerstoneTools.addTool(ApiTool)
}
//颜色反转
function reversal() {
    const viewport = cornerstone.getViewport(element)
    //视窗取反
    viewport.invert = !viewport.invert
    //设置视窗
    cornerstone.setViewport(element, viewport)
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
</script>
<style scoped>
.header {
    background-color: rgb(83 83 83);
    height: 3vh;
    display: flex;
}
.header .studyBannerInfo {
    margin-left: 0.5rem;
    margin-top: 0.2rem;
    display: flex;
}
.header .studyBannerInfo .InfoBox {
    font-size: 16px;
    margin-top: 0.15rem;
    margin-left: 1rem;
}
.leftFileBar {
    width: 15rem;
    overflow-x: hidden;
    background-color: rgb(73, 76, 77);
    height: 97vh;
}
.leftFileBar .row {
    height: 1.8rem;
    margin: 0;
    opacity: 1;
}

.leftFileBar .row .button {
    height: 1.8rem;
    font-size: 18px;
    background-color: rgb(132, 127, 127);
    width: 6.5rem;
}
.leftFileBar .BaseRadius {
    height: 9%;
    width: 98%;
    border: 1px solid;
    margin-top: 5%;
    margin-left: 1%;
    border-radius: 5px;
}
.leftFileBar .BaseRadius .showFileList {
    padding: 0;
    height: 6rem;
    width: 13.6rem;
    margin-left: 0.45rem;
    margin-top: 0.8rem;
    justify-content: flex-start;
    flex-wrap: wrap;
    background-color: rgba(0, 0, 0, 0);
}
.leftFileBar .BaseRadius .showFileList .image {
    height: 80px;
    width: 80px;
    margin-left: 0.5rem;
    object-fit: cover;
}
.leftFileBar .BaseRadius .showFileList .picIndex {
    margin-top: -20%;
    margin-left: -1%;
    font-size: 50%;
    width: 30px;
    height: 18px;
    color: rgb(203, 211, 211);
}
.leftFileBar .BaseRadius .showFileList .serialNumber {
    margin-left: -7%;
    margin-top: -6%;
    font-size: 45%;
    color: rgb(185, 192, 192);
}
.leftFileBar .BaseRadius .showFileList .deep {
    margin-left: 9%;
    margin-top: -6%;
    font-size: 45%;
    color: rgb(185, 192, 192);
}
.leftFileBar .BaseRadius .showFileList .fileName {
    margin-left: -35.5%;
    margin-top: 19%;
    font-size: 27%;
    white-space: normal;
    word-wrap: break-word;
    text-align: justify;
    overflow: hidden;
    width: 108px;
    height: 30px;
    line-height: 16px;
    color: rgb(190, 181, 181);
}

.dicom {
    background-color: rgb(65, 64, 61);
    overflow: hidden;
    height: 97vh;
}
.dicom .wrapper {
    background-color: rgba(0, 0, 0, 0);
    width: 50vw;
    height: 43.5rem;
    display: flex;
    justify-content: space-between;
    position: absolute;
    z-index: 20;
    pointer-events: none;
}
.dicom .wrapper .box {
    display: flex;
    flex-flow: column;
    width: 15rem;
    justify-content: space-between;
}
.dicom .wrapper .box .dicomInfo {
    color: white;
    display: flex;
    flex-flow: column;
}
.dicom .dicomInfo .info {
    font-size: 0.8rem;
}
.dicom .dicomInfo .Rightinfo {
    font-size: 0.8rem;
    justify-content: end;
    margin-left: auto;
}
.rightToolBar {
    width: 20vw;
    height: 97vh;
    background-color: rgb(84, 89, 89);
}
.rightToolBar .Block {
    height: 97%;
    width: 95%;
    margin: 2.5%;
    border: 1.5px solid;
    background-color: rgb(75, 77, 77);
}
.rightToolBar .Block .Block1 {
    height: 2rem;
    border: 1.5px solid;
}
.rightToolBar .Block .Block2 {
    margin-top: 1rem;
    height: 6rem;
    border: 1.5px solid;
}
.rightToolBar .Block .Block3 {
    margin-top: 1rem;
    height: 5rem;
    border: 1.5px solid;
}
.rightToolBar .Block .Block4 {
    margin-top: 1rem;
    height: 20rem;
    border: 1.5px solid;
}
.rightToolBar .Block .Block1 .button {
    height: 100%;
    font-size: 70%;
    background-color: rgb(132, 127, 127);
}
.rightToolBar .Block .functionKey {
    background: rgba(0, 0, 0, 0);
}
.layout {
    height: 100vh;
    width: 100vw;
    margin: 0%;
}
</style>
