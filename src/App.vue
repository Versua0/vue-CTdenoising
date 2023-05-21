<script setup lang="ts">
//import { focusNode } from 'element-plus/es/utils'
import { RouterView } from 'vue-router'
</script>

<template>
    <router-view></router-view>

    <!--<RouterView /> -->
</template>

<style scoped>
:deep(*) {
    margin: 0px;
    padding: 0px;
    font-size: 30px;
}
.button {
    display: inline-block;
    background-color: rgb(69, 137, 171);
    border-radius: 30px;
    padding-left: 50px;
    padding-right: 50px;
    height: 60px;
    line-height: 60px;
    margin: 5px;
}
.router-link-active {
    text-decoration: none;
    color: #ffffff;
}
a {
    text-decoration: none;
    color: #ffffff;
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
    top: 85%;
    font-size: 25px;
    transform: translate(-50%, -50%);
    left: 50%;
    text-align: center;
    /* color: #dddddd; */
}

.demo {
    position: relative;
    text-align: center;
    padding-top: 3%;
    width: 100%;
    height: 450px;
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
    /* background-color: pink; */
}
.demo_img img {
    width: 48%;
    height: 75%;
}
.click {
    position: relative;
    width: 100%;
    height: 300px;
    background-color: white;
}
.click a {
    text-decoration: none;
    letter-spacing: 2px;
    position: absolute;
    top: 50%;
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
