<!-- eslint-disable prettier/prettier -->
<script lang="ts" setup >
import { reactive, onMounted, ref } from 'vue'
import { Plus, ArrowLeft, Tools, Upload, DArrowRight, DCaret } from '@element-plus/icons-vue'
import { UploadProps, UploadUserFile, UploadInstance, uploadListProps, ElMessage } from 'element-plus'
import axios from 'axios'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import { RenderingEngine } from '@cornerstonejs/core'
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType'
axios.defaults.baseURL = 'http://175.178.186.100:2000/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const fileList = ref<UploadUserFile[]>([
    // 上传文件的列表
])

//cornerstone组件的配置信息
cornerstoneWADOImageLoader.configure({
    useWebWorkers: true,
    decodeConfig: {
        convertFloatPixelDataToInt: false
    }
})
var config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: false,
    taskConfiguration: {
        decodeTask: {
            initializeCodecsOnStartup: true,
            strict: false
        }
    }
}
cornerstoneWADOImageLoader.webWorkerManager.initialize(config)

let imageIds = ref([])//获得的dicom文件处理结果的URL
let imageNames=ref([])
let imageIndex = ref(0)//记录当前所展示的dicom文件的下标
let imageNum = ref(0) //记录所上传的文件数量
let Origin=ref({str:"原图"})
let ifOrigin=ref(false)  //记录是否为原图
let imageId = 'wadouri:http://localhost:80/dcm/Arterial Phase2  1.0  B31f__210_1.dcm' //当前所展示的dicom文件的URL，这个是预设值

//文件上传的相关变量函数
const dialogVisible = ref(false)
const uploadRef = ref<UploadInstance>()
const submitUpload = () => {
  uploadRef.value!.submit()
  predictStatus.value=false
}
const handlePreview: UploadProps['onPreview'] = (file) => {
    console.log(file)
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}
//axios
function uploadCompleted() {
    axios('/uploadCompleted').then(()=>{
        getResultStatus.value=false
        downloadStatus.value=false
    })
}

//Button状态
const predictStatus=ref(true)
const getResultStatus=ref(true)
const downloadStatus=ref(true)
//获取处理结果
function getResult() {
    //获取url
    axios('/getResult').then((response) => {
        let res = Object.values(response.data)
        imageIds.value = (res as any)[2]
        imageNum.value = imageIds.value.length
        //imageIndex.value = 0 //重新获取后下标回0
        refresh()
        predictStatus.value=false//防止进行多次运算消耗资源
        getNames()
    })
}
function getNames(){
    axios('/getNames').then((response)=>{
        let res = Object.values(response.data)
        imageNames.value = (res as any)[2]
    })
}
function deleteFiles(){
    axios('/deleteFiles').then(()=>{
        open2()
    })
}
const open2 = () => {
    ElMessage({
        message: 'Congrats, this is a success message.',
        type: 'success',
    })
}
//下载文件Zip的形式
function downLoad(){
    axios({url:'/downloadZip',responseType:'blob'}).then(response => { 
        console.log(response);
        let blob = new Blob([response.data], {type: 'application/octet-stream'});
        if('download' in document.createElement('a') ){ 
            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = window.URL.createObjectURL(blob);
            a.download = response.headers['content-disposition'];
            a.click();
            URL.revokeObjectURL(a.href) // 释放URL 对象
            document.body.removeChild(a);
        }//下面那个方法被弃用了
        // }else{ //IE10+
        //     window.navigator.msSaveOrOpenBlob(blob, zipName)
        // }
    }).catch(err => {
        console.log(err);
    })
}
//文件信息
const imageInfo = ref({
    windowWidth: 0,
    windowCenter: 0,
    scale: 0,
    seriesNumber: '',
    imageNum: '',
    imageDate: '',
    imageData: '',
    sliceThickness: '',
    patientId: '',
    patientName: '',
    patientBirthDate: '',
    patientGender: '',
    sID: ''
})
//文件信息的获取
function getImageInfo(image: any) {
    imageInfo.value.seriesNumber = image.data.string('x00200011') //图像序列号
    imageInfo.value.imageNum = image.data.string('x00180015') //图像位置
    imageInfo.value.imageDate = image.data.string('x00080023') //拍摄日期
    imageInfo.value.sliceThickness = image.data.string('x00180050') //层厚
    // 病人基本信息
    imageInfo.value.patientName = image.data.string('x00100010')
    imageInfo.value.patientBirthDate = image.data.string('x00100030')
    imageInfo.value.patientGender = image.data.string('x00100040')//性别
    imageInfo.value.patientId = image.data.string('x00100020') //病理号
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

//cornerston组件的配置以及初始化
let element: any
let image: any
cornerstoneTools.init({
    touchEnabled: false,
    showSVGCursors: true
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
//cornerstone的初始化、让document加载完后再获取
onMounted(() => {
    //在template后加载
    element = document.getElementById('dicomImage')
    cornerstone.enable(element)
    window.addEventListener('resize', function () {
    //自适应窗口
        cornerstone.resize(element, true)
    })
    function toolInit() {
        const tools = ['Wwwc', 'Zoom', 'Pan', 'Rotate', 'Bidirectional', 'Eraser', 'Magnify', 'Length'] //窗位、放大、移位、旋转

        tools.forEach((toolName) => {
            addTool(toolName)
        })
    }
    function addTool(toolName: string) {
        const ApiTool = cornerstoneTools[`${toolName}Tool`]

        cornerstoneTools.addTool(ApiTool)
    }
    toolInit() //初始化工具
    
    // element.addEventListener('cornerstoneimagerendered',function(e:any){
    //     let eventData=e.detail;
    //     getViewPort(eventData);//获取当前图片视口信息
    //     console.log(eventData)
    // })
})
function setToolActive(toolName: string) {
    const options = {
        mouseButtonMask: 1 //1：左键 ，2：右键，4：中键
    }

    cornerstoneTools.setToolActive(toolName, options)
}
//上一个dicom文件
function lastPic() {
    if (imageIndex.value > 0) {
        imageIndex.value = imageIndex.value - 1
        refresh()
    } else {
        console.log('无响应')
    }
}
//下一个dicom文件
function nextPic() {
    if (imageIndex.value < imageNum.value - 1) {
        imageIndex.value = imageIndex.value + 1
        refresh()
    } else {
        console.log('无响应')
    }
}
function changeDicom(index:any){
    imageIndex.value=index
    refresh()
}
function getOrigin(){
    axios('/getOrigin').then((response) => {
        let res = Object.values(response.data)
        imageIds.value = (res as any)[2]
        refresh()
    })
}
function switchO(){
    if(ifOrigin.value==false){
        getOrigin()
        ifOrigin.value=true
        Origin.value.str="返回"
    }
    else if(ifOrigin.value==true){
        getResult()
        ifOrigin.value=false
        Origin.value.str="原图"
    }

}
//刷新cornerston组件
function refresh() {
    //加载dcm图片
    imageId = imageIds.value[imageIndex.value]
    cornerstone.loadAndCacheImage(imageId).then(function (image0: any) {
        image = image0
        cornerstone.displayImage(element, image)
        getImageInfo(image)
        setToolActive('Wwwc')
    })
}
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
</script>
<template>
    <a-layout class="content">
        <body>
            <div
                style="
                    padding-top: 20px;
                    padding-bottom: 20px;
                    background: url(./src/assets/bg-pattern.png),
                        linear-gradient(to left, #4d9ec4, #4384a6);
                "
            >
                <div>
                    <div class="show">
                        <el-dialog
                            v-model="dialogVisible"
                            title="文件上传"
                            width="40%"
                            z-index="10000"
                        >
                            <el-upload
                                v-model:file-list="fileList"
                                class="upload-demo"
                                ref="uploadRef"
                                action="http://175.178.186.100:2000/api/upload"
                                method="post"
                                multiple="ture"
                                list-type="text"
                                :auto-upload="false"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                            >
                                <el-button type="primary">Click to upload</el-button>
                            </el-upload>
                            <template #footer>
                                <el-button @click="deleteFiles()" style="width: auto"
                                    >清理缓存</el-button
                                >
                                <el-button
                                    class="ml-3"
                                    type="success"
                                    style="width: auto"
                                    @click="submitUpload(), (dialogVisible = false)"
                                >
                                    确定
                                </el-button>
                            </template>
                        </el-dialog>

                        <div class="flex1">
                            <div class="Button1">
                                <el-button
                                    @click="dialogVisible = true"
                                    style="width: 200px; height: 100px"
                                    class="button1"
                                >
                                    <el-icon class="el-icon--left"><Upload /></el-icon>
                                    上传文件
                                </el-button>
                            </div>
                            <div class="Button2">
                                <el-button
                                    @click="uploadCompleted(), (predictStatus = true)"
                                    style="width: 200px; height: 100px"
                                    class="buttonArrow"
                                    :disabled="predictStatus"
                                    ><el-icon class="el-icon--left"><DCaret /></el-icon>
                                    开始处理</el-button
                                >

                                <el-button
                                    @click=";(imageIndex = 0), getResult()"
                                    style="width: 200px; height: 100px; margin-left: 0"
                                    :disabled="getResultStatus"
                                >
                                    <el-icon class="el-icon--left"><Files /></el-icon>
                                    获取结果</el-button
                                >
                            </div>
                            <div class="Title">效果展示</div>
                        </div>

                        <div class="common-layout">
                            <el-container>
                                <el-container>
                                    <el-aside
                                        width="32%"
                                        class="radius"
                                        :style="{
                                            borderRadius: 'base'
                                        }"
                                    >
                                        <div
                                            style="
                                                background-color: rgb(136, 185, 234);
                                                margin: auto;
                                                height: 40px;
                                                width: 120px;
                                                border-radius: 20px;
                                            "
                                        >
                                            <p
                                                style="
                                                    text-align: center;
                                                    margin-top: 10px;
                                                    line-height: 40px;
                                                    font-size: 20px;
                                                    color: white;
                                                "
                                            >
                                                文件列表
                                            </p>
                                        </div>
                                        <div class="top" style="height: 1px"></div>
                                        <div style="height: 80%; width: 90%; margin-left: 10px">
                                            <el-scrollbar height="650px" class="mb-4">
                                                <el-button
                                                    v-for="(item, index) in imageIds"
                                                    :key="index"
                                                    plain
                                                    class="showFileList"
                                                    @click="changeDicom(index)"
                                                >
                                                    {{ imageNames[index] }}
                                                </el-button>
                                            </el-scrollbar>
                                        </div>
                                    </el-aside>

                                    <el-container>
                                        <el-main>
                                            <div style="display: flex; flex-wrap: nowrap">
                                                <div
                                                    id="dicomImage"
                                                    style="
                                                        width: 512px;
                                                        height: 512px;
                                                        border: 1px dashed rgb(64, 158, 255);
                                                        display: inline-block;
                                                    "
                                                    oncontextmenu="return false"
                                                    onmousedown="return false"
                                                ></div>
                                                <div
                                                    style="
                                                        display: block;
                                                        float: right;
                                                        padding-right: 0px;
                                                        padding-left: 16px;
                                                    "
                                                >
                                                    <div class="function">
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="setToolActive('Wwwc')"
                                                                >窗位调整</el-button
                                                            ></elrow
                                                        >
                                                    </div>
                                                    <div class="function">
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="setToolActive('Zoom')"
                                                                >大小缩放</el-button
                                                            ></elrow
                                                        >
                                                    </div>

                                                    <div class="function">
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="setToolActive('Pan')"
                                                                >移动</el-button
                                                            ></elrow
                                                        >
                                                    </div>
                                                    <div class="function">
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="setToolActive('Rotate')"
                                                                >旋转</el-button
                                                            ></elrow
                                                        >
                                                    </div>
                                                    <div class="function">
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="setToolActive('Length')"
                                                                >线段</el-button
                                                            ></elrow
                                                        >
                                                    </div>
                                                    <div class="function">
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="
                                                                    setToolActive('Bidirectional')
                                                                "
                                                                >正交线段</el-button
                                                            ></elrow
                                                        >
                                                    </div>
                                                    <div class="function">
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="setToolActive('Eraser')"
                                                                >橡皮擦</el-button
                                                            ></elrow
                                                        >
                                                    </div>

                                                    <div>
                                                        <elrow>
                                                            <el-button
                                                                round
                                                                @click="setToolActive('Magnify')"
                                                                >放大镜</el-button
                                                            ></elrow
                                                        >
                                                    </div>
                                                </div>
                                            </div>
                                        </el-main>
                                        <el-footer height="none">
                                            <el-descriptions
                                                title="CT信息"
                                                style="margin-bottom: 20px"
                                            >
                                                <el-descriptions-item label="患者姓名">{{
                                                    imageInfo.patientName
                                                }}</el-descriptions-item>
                                                <el-descriptions-item label="出生日期">{{
                                                    imageInfo.patientBirthDate
                                                }}</el-descriptions-item>
                                                <el-descriptions-item label="ID">{{
                                                    imageInfo.patientId
                                                }}</el-descriptions-item>
                                                <el-descriptions-item label="检查日期">
                                                    {{ imageInfo.imageData }}
                                                </el-descriptions-item>
                                                <el-descriptions-item label="图像序列号">{{
                                                    imageInfo.seriesNumber
                                                }}</el-descriptions-item>
                                                <el-descriptions-item label="性别">{{
                                                    imageInfo.patientGender == 'F' ? '女' : '男'
                                                }}</el-descriptions-item>
                                                <el-descriptions-item label="身体部位">{{
                                                    imageInfo.imageNum.toLowerCase()
                                                }}</el-descriptions-item>
                                            </el-descriptions>

                                            <el-button-group>
                                                <el-button
                                                    type="primary"
                                                    :icon="ArrowLeft"
                                                    @click="lastPic()"
                                                    >上一张</el-button
                                                >
                                                <el-button type="primary" @click="switchO()"
                                                    ><el-icon><House /></el-icon
                                                    >{{ Origin.str }}</el-button
                                                >

                                                <el-button type="primary" @click="nextPic()">
                                                    下一张<el-icon class="el-icon--right">
                                                        <ArrowRight />
                                                    </el-icon>
                                                </el-button>
                                                <el-button
                                                    type="primary"
                                                    @click="downLoad()"
                                                    :disabled="downloadStatus"
                                                >
                                                    downLoad<el-icon class="el-icon--right"
                                                        ><Download
                                                    /></el-icon>
                                                </el-button>
                                            </el-button-group>
                                        </el-footer>
                                    </el-container>
                                </el-container>
                            </el-container>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </a-layout>
</template>

<style>
.content {
    display: flex;
    flex-direction: column;
    /* background-image: url('/src/assets/pexels-photo.webp'); */
    background-size: 100% 100%;
    background-attachment: fixed;

    width: 100%;
    height: 100%;
    min-width: 900px;
    min-height: 1000px;

    /* justify-content: center;
  align-items: center; */
}

.top {
    margin-top: 10px;
    margin-bottom: 10px;
    background: linear-gradient(to left, transparent 0%, transparent 50%, #ccc 50%, #ccc 100%);
    background-size: 10px 1px;
    background-repeat: repeat-x;
    background-position: top;
}
button.el-button.is-round {
    width: 150px;
    height: 50px;
    font-size: 15px;
    border-radius: 0%;
    /* border:#0c0b0b solid 1px */
}

.demo-image__error .image-slot {
    font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
    font-size: 30px;
}

.demo-image__error .el-image {
    width: 100%;
    height: 200px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.tittle {
    height: 50px;
    background-color: #0c0b0b;
}
.function {
    margin-bottom: 16px;
}

#box {
    width: 350px;
    height: 468px;
    margin: 100px;
    border: 1px solid #ccc;
    position: relative;
}

#small {
    position: relative;
    width: 350px;
    height: 468px;
}

#mask {
    position: absolute;
    width: 175px;
    height: 175px;
    background: rgba(255, 255, 0, 0.4);
    /* left: 0px;
    top: 0; */
    display: none;
    cursor: move;
}

#big {
    position: absolute;
    left: 400px;
    top: 0;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;
    overflow: hidden;
    display: none;
}

.show {
    background-color: rgb(245, 247, 250);
    width: 75%;

    margin: 50px auto;
    padding: 10px;
}

.el-button--primary {
    height: 50px;
    width: 150px;
    font-size: 20px;
}

.el-button--info {
    height: 50px;
    width: 100px;
    font-size: 20px;
}

aside.el-aside {
    text-align: center;
    margin-top: 10px;
}
.el-row {
    margin-bottom: 20px;
}
.el-row:last-child {
    margin-bottom: 0;
}
.el-col {
    /* border-radius: 4px; */
}
aside.el-aside {
    margin-top: 0px;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}
.flex1 {
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    display: flex;
    /* padding-top: 10px;
    padding-bottom: 10px; */
    padding: 10px;
}
.Button1 {
    border-bottom: #ccc;
    position: relative;
    width: 200px;
    height: 100px;
    /* margin-left: -10px; */
    /* margin-top: -10px; */
    border: 1px solid #ccc;
    display: -webkit-flex;
    z-index: 9999;
}
.Button2 {
    /* border-bottom: #ccc; */
    position: relative;
    width: 200px;
    height: 100px;
    border: 1px solid #ccc;
    /* margin-top: -9px; */
    margin-left: 0px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    z-index: 9999;
}
.Title {
    border-bottom: #ccc;
    /* position: relative; */
    width: 700px;
    height: 100px;
    /* margin-top: -9px; */
    border: 1px solid #ccc;
    /* display: flex;
    justify-content: center; */
    text-align: center;
    /* align-content: flex-start; */
    /* z-index: 9999; */
    color: #fff;
    /* padding-left: 50px; */
    /* background: linear-gradient(-210deg, transparent 1.5em, rgb(64, 158, 255) 0); */
    background-color: rgb(136, 185, 234);
    line-height: 100px;
}
/* .Title::before {
    content: '';
    display: block;
    width: 1.73em;
    height: 3em;
    position: absolute;
    background: linear-gradient(-60deg, #577b98 50%, transparent 0);
    left: -3px;
    top: 0;
    border-bottom-left-radius: inherit;
    transform: translateY(-0.5em) rotate(30deg);
    transform-origin: bottom right;
    box-shadow: 0.2em 0.2em 0.3em -0.1em rgba(0, 0, 0, 0.15);
} */
.radius {
    /* height: 100%; */
    width: 100%;
    border: 2px solid var(--el-border-color);
    border-radius: 0;
    margin-top: 20px !important;
}

.showFileList {
    font-size: 14px;
    border: #ccc solid 1px;
    padding-top: 5px;
    padding-bottom: 5px;
    width: 90%;
    margin: 10px auto;
}
button.el-button.is-plain.showFileList {
    margin: 2px 15px;
}
.showFileList:hover {
    background-color: rgb(160, 207, 255);
    color: rgb(64, 158, 255);
}
.buttonArrow {
    display: inline-block;
    border-radius: 4px;
    background-color: #f4511e;
    border: none;
    color: #ffffff;
    text-align: center;
    font-size: 28px;
    padding: 20px;
    width: 200px;
    transition: all 0.5s;
    cursor: pointer;
    vertical-align: middle;
}

.buttonArrow span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
}

.buttonArrow span:after {
    content: '»';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
}

.buttonArrow:hover span {
    padding-right: 25px;
}

.buttonArrow:hover span:after {
    opacity: 1;
    right: 0;
}
</style>
