<script lang="ts" setup>
import { ref } from 'vue'
import { Plus, ArrowLeft, Tools, Upload, DArrowRight, Files } from '@element-plus/icons-vue'
const activeIndex = ref('1')
const activeIndex2 = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const carouselData = [
    { imgUrl: 'http://175.178.186.100:8073/image/1.png', toUrl: '/1' },
    { imgUrl: 'http://175.178.186.100:8073/image/2.png', toUrl: '/2' },
    { imgUrl: 'http://175.178.186.100:8073/image/3.png', toUrl: '/3' },
    { imgUrl: 'http://175.178.186.100:8073/image/4.png', toUrl: '/4' },
    { imgUrl: 'http://175.178.186.100:8073/image/5.png', toUrl: '/5' }
]
</script>

<template>
    <!-- 标题 -->
    <!-- <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="handleSelect"
    >
        <el-menu-item index="1"
            ><span><router-link to="/">首页</router-link></span></el-menu-item
        >
        <el-menu-item index="2"
            ><span class="button"><router-link to="/ct">前往测试</router-link></span></el-menu-item
        >
        <el-menu-item index="4"
            ><span class="button"><router-link to="/login">登录</router-link></span></el-menu-item
        >
    </el-menu> -->

    <router-view></router-view>

    <!--<RouterView /> -->

    <div class="head">
        <span class="words">
            <p class="words">低剂量CT降噪</p>
        </span>
        <span class="title_img">
            <img src="../assets/first.png" alt="" />
        </span>
    </div>
    <!-- 介绍 -->
    <div class="text_head">
        <div class="model">
            <img src="../assets/model_structure.png" alt="" />
        </div>

        <div class="text">
            <p>计算机断层扫描（CT）技术在现代医学诊断中起着非常重要的作用</p>
            <p>本项目将适用于恢复图像高级、低级语义信息的编解码网络应用于低剂量CT降噪中</p>
            <p>并针对降噪图像细节不清晰问题，提出相应的解决方案</p>
            <p>提高降噪CT图像的定性与定量指标，使之有利于医疗人员对病情的诊断与筛查</p>
        </div>

        <!-- <span class="steps_word">处理步骤: </span>
        <div class="steps">
            步骤条实现 
            <el-steps :active="0" align-center>
                <el-step
                    title="文件上传"
                    description="Some description"
                    :icon="Upload"
                    status="process"
                />
                <el-step title="开始处理" :icon="DArrowRight" status="process" />
                <el-step title="获得结果" :icon="Files" status="process" />
            </el-steps>
        </div> -->
    </div>
    <!-- demo -->
    <div class="demo">
        <h2>Demo</h2>
        <!-- <div style="margin: 20px;">
        <el-carousel :interval="4000" type="card" height="395px">
            <el-carousel-item v-for="item in 3" :key="item">
                <h3 text="2xl" justify="center"><img src="../assets/demo1.png" alt="" /></h3>
                <h3 text="2xl" justify="center"><img src="../assets/demo2.png" alt="" /></h3>
                <h3 text="2xl" justify="center"><img src="../assets/demo1.png" alt="" /></h3>
            </el-carousel-item>
        </el-carousel>
        </div> -->
        <div style="margin: 20px">
            <el-carousel :interval="5000" arrow="always" height="600px">
                <el-carousel-item v-for="item in carouselData" :key="item">
                    <div class=""><img :src="item.imgUrl" alt="" class="carouseImg" /></div>
                </el-carousel-item>
            </el-carousel>
        </div>
        <!-- <div class="demo_img">
            <img src="../assets/demo1.png" alt="" />
            <img src="../assets/demo2.png" alt="" />
        </div> -->
    </div>
    <!-- 提交部分 -->

    <div class="click">
        <span class="steps_word2">处理步骤: </span>
        <span class="button"><router-link to="/login">前往测试</router-link></span>
        <!-- <a href="/ct.vue">点击前往测试</a> -->
        <div class="steps2">
            <!-- 步骤条实现 -->
            <el-steps :active="0" align-center>
                <el-step
                    class="title1"
                    title="文件上传"
                    description="选择所要处理的文件上传"
                    :icon="Upload"
                    status="process"
                />
                <el-step
                    title="开始处理"
                    description="调用相关算法进行降噪处理"
                    :icon="DArrowRight"
                    status="process"
                />
                <el-step
                    title="获得结果"
                    description="获得处理过后的文件"
                    :icon="Files"
                    status="process"
                />
            </el-steps>
        </div>
    </div>
    <!--<router-link to="/ct.vue">点击前往测试</router-link>
        <router-view></router-view> -->
    <!-- 感谢 -->
    <div class="thanks">
        <div class="thanks_text">
            thankyou
            <span><img src="../assets/爱心2.png" alt="" /></span>
        </div>
    </div>
</template>

<style scoped>
* {
    margin: 0;
    padding: 0;
    font-size: 30px;
}
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
/* .el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
  height: 360px;
  width: 910px;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
  height: 360px;
  width: 996px;
} */
.carouseImg {
    width: 95%;
}
.lead {
    height: 70px;
    background-color: rgb(69, 137, 171);
}
.head {
    position: relative;
    width: 100%;
    min-height: 780px;
    background-color: #4993b7;
    background: url(../assets/bg-pattern.png), linear-gradient(to left, #4d9ec4, #4384a6);
}

.words {
    text-align: right;
    position: absolute;
    width: 400px;
    line-height: 400px;
    font-size: 100px;
    top: 50%;
    transform: translateY(-50%);
    left: 4%;
    letter-spacing: 2px;
    font-family: 'Catamaran', 'Helvetica', 'Arial', 'sans-serif';
    color: #ffffff;
    line-height: 1.5;
    /* background-color: #dddddd; */
}

.title_img {
    position: absolute;
    width: 790px;
    height: 390px;
    top: 50%;
    transform: translateY(-50%);
    right: 2%;
    background-color: white;
}
.title_img img {
    width: 100%;
    height: 100%;
}

.text_head {
    position: relative;
    width: 100%;
    height: 800px;
    background-color: white;
}
.text_head .model {
    position: absolute;
    width: 60%;
    height: 40%;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background-color: pink;
}
.text_head .model img {
    width: 100%;
    height: 100%;
}

.text {
    position: absolute;
    width: 100%;
    height: 45%;
    top: 80%;
    font-size: 25px;
    transform: translate(-50%, -50%);
    left: 50%;
    text-align: center;
}
.steps_word2 {
    position: absolute;
    width: 100%;
    height: 45%;
    top: 30%;
    font-size: 30px;
    transform: translate(-50%, -50%);
    left: 50%;
    text-align: center;
}
.steps2 {
    position: absolute;
    width: 100%;
    height: 45%;
    top: 50%;
    font-size: 25px;
    transform: translate(-50%, -50%);
    left: 50%;
}
.demo {
    position: relative;
    text-align: center;
    padding-top: 3%;
    width: 100%;
    height: 750px;
    background-color: #4890b4;
}
.demo h2 {
    font-size: 50px;
    font-weight: 200;
    letter-spacing: 2px;
    font-family: 'Catamaran', 'Helvetica', 'Arial', 'sans-serif';
    color: #ffffff;
}

.demo_img {
    position: absolute;
    width: 87%;
    height: 77%;
    margin-top: 15px;
    left: 50%;
    transform: translateX(-50%);
}
.demo_img img {
    width: 48%;
    height: 75%;
}

a {
    text-decoration: none;
}
.click {
    position: relative;
    width: 100%;
    height: 350px;
    background-color: white;
}
.click a {
    text-decoration: none;
    letter-spacing: 2px;
    position: absolute;
    top: 80%;
    left: 50%;
    width: 300px;
    height: 100px;
    transform: translate(-50%, -50%);
    border: solid 1px #4486a9;
    border-radius: 50px 50px 50px 50px;
    font-size: 28px;
    color: #4486a9;
    line-height: 100px;
    text-align: center;
}
.click a:hover {
    transition: 0.8s;
    border: solid 1px #4486a9;
    background-color: #4486a9;
    color: #ffffff;
}

.thanks {
    position: relative;
    text-align: center;
    width: 100%;
    height: 230px;
    background-color: #4486a9;
    color: #ffffff;
}

.thanks_text {
    font-size: 40px;
    letter-spacing: 2px;
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translateX(-50%);
}

header {
    line-height: 1.5;
    max-height: 100vh;
}
</style>
