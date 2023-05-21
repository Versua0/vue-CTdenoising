<script lang="ts" setup>
import axios from 'axios'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import { onMounted, ref } from 'vue'

//数据变量
let element: any
let image: any
let imageIds = ref([]) //获得的dicom文件处理结果的URL
let imageNames = ref([])
let imageIndex = ref(0) //记录当前所展示的dicom文件的下标
let imageId = 'wadouri:http://localhost:80/dcm/Arterial Phase2  1.0  B31f__210_1.dcm' //当前所展示的dicom文件的URL，这个是预设值

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
        const tools = [
            'Wwwc',
            'Zoom',
            'Pan',
            'Rotate',
            'Bidirectional',
            'Eraser',
            'Magnify',
            'Length'
        ] //窗位、放大、移位、旋转

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
//设置功能
function setToolActive(toolName: string) {
    const options = {
        mouseButtonMask: 1 //1：左键 ，2：右键，4：中键
    }

    cornerstoneTools.setToolActive(toolName, options)
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
//文件信息的获取
function getImageInfo(image: any) {
    imageInfo.value.seriesNumber = image.data.string('x00200011') //图像序列号
    imageInfo.value.imageNum = image.data.string('x00180015') //图像位置
    imageInfo.value.imageDate = image.data.string('x00080023') //拍摄日期
    imageInfo.value.sliceThickness = image.data.string('x00180050') //层厚
    // 病人基本信息
    imageInfo.value.patientName = image.data.string('x00100010')
    imageInfo.value.patientBirthDate = image.data.string('x00100030')
    imageInfo.value.patientGender = image.data.string('x00100040') //性别
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
cornerstoneTools.init({
    touchEnabled: false,
    showSVGCursors: true
})
function getNames() {
    axios('/getNames').then((response) => {
        let res = Object.values(response.data)
        imageNames.value = (res as any)[2]
    })
}
</script>
