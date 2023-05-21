<template>
    <div class="loginbackground">
        <div>
            <el-form ref="form" :model="form" :rules="rules" class="loginform">
                <h3 class="logintitle">请先登录</h3>

                <el-form-item label="账号" prop="username" class="item">
                    <span style="color: black"></span>
                    <el-input
                        type="text"
                        placeholder="请输入账号"
                        v-model="form.username"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" class="item">
                    <el-input
                        type="password"
                        placeholder="请输入密码"
                        v-model="form.password"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            console.log(this.$data.form.username)
            console.log(this.$data.form.password)
            let _this = this
            this.$axios({
                method: 'post',
                url: 'http://175.178.186.100:2000/user/login',

                data: _this.$data.form,
                contentType: 'application/x-www-form-urlencoded'
            })
                .then((res) => {
                    console.log(res)
                    console.log(res.data.success)
                    console.log(res.data.user_id)
                    if (res.data.success == 'true') {
                        _this.$router.push('ct')
                    } else {
                        this.$message({
                            message: '用户名或密码错误',
                            type: 'warning'
                        })
                    }
                })
                .catch((error) => {
                    this.$message({
                        message: '用户名或密码错误',
                        type: 'warning'
                    })
                })
        }
    }
}
</script>

<style>
.loginform {
    width: 21.875rem;
    margin: 9.375rem auto;
    border: 1px solid #dcdfe6;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 0 30px #dcdfe6;
}

.logintitle {
    text-align: center;
}
.el-button {
    width: 50%;
    margin: auto;
}
.loginbackground {
    /* width: 100%;
        height: 100vh;
        background-color:aliceblue rgba(242,242,242,1);
        background-image: url(../assets/pexels-photo.webp);
        background-position: center bottom;
        background-repeat: no-repeat;
        background-attachment: scroll;
        background-size: 100% 100%;
        background-origin: border-box;
        border: none;
        border-radius: 0px;  */
    display: flex;
    flex-direction: column;
    /* background-image: url("/src/assets/pexels-photo.webp"); */

    background-image: linear-gradient(45deg, #5593c9, #41ede5);
    background-position: center bottom;
    background-size: 100% 100%;
    background-attachment: fixed;
    width: 100%;
    height: 100%;
    position: fixed;
}
.item .el-form-item__label {
    color: black;
}
</style>
