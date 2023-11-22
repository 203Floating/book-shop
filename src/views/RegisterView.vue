<template>
  <div class="main">
    <div class="img"><img src="../style/img/张伟.jpg" alt=""></div>

    <div class="register">
      <el-form :model="ruleForm" label-width="120px" class="demo-ruleForm">
        <div>
          <span style="font-size: 35px;">账号注册</span>
          <span style="font-size: 22px;margin-left: 20px;">使用邮箱和密码注册</span>
        </div>
        <div style="height: 20px;"></div>
        <div>
          <span>有账号了？&nbsp;</span><span><el-button link type="success"
              @click="router.push({ path: '/login' })">立即登陆</el-button></span>
        </div>
        <div style="height: 30px;"></div>
        <p class="ipt_title">用户名：</p>
        <el-form-item label="用户：" prop="name">
          <el-input v-model="ruleForm.name" type="email"
            :style="{ width: '500px', height: '50px', marginLeft: '-120px' }" />
        </el-form-item>
        <!-- <div style="height: 5px;"></div> -->
        <p class="ipt_title">邮箱：</p>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="ruleForm.email" type="email" :style="{
            width: '500px', height: '50px', marginLeft: '-120px',
          }" />
        </el-form-item>
        <!-- <div style="height: 5px;"></div> -->
        <p class="ipt_title">密码：</p>
        <el-form-item label="密码：" prop="pass">
          <el-input v-model="ruleForm.pass" type="password"
            :style="{ width: '500px', height: '50px', marginLeft: '-120px' }" />
        </el-form-item>
        <!-- <div style="height: 5px;"></div> -->
        <p class="ipt_title">重复密码：</p>
        <el-form-item label="密码：" prop="checkpass">
          <el-input v-model="ruleForm.checkpass" type="password"
            :style="{ width: '500px', height: '50px', marginLeft: '-120px' }" />
        </el-form-item>
        <!-- <div style="height: 30px;"></div> -->
        <el-form-item>
          <el-button type="success" @click="Register"
            :style="{ width: '500px', height: '50px', marginLeft: '-120px' }">注册</el-button>
          <!-- <el-button type="primary" @clcik="ToLogin">登陆</el-button> -->
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const ruleForm = ref({
  name: '',
  email: '',
  pass: '',
  checkpass: ''
})
// 使用路由
const router = useRouter()

const Register = async () => {
  try {
    const res = await axios.post("https://api.shop.eduwork.cn/api/auth/register", {
      name: ruleForm.value.name,
      email: ruleForm.value.email,
      password: ruleForm.value.pass,
      password_confirmation: ruleForm.value.checkpass
    })
    if (res.status == 201) {
      ElMessage({
        title: 'Success',
        message: '注册成功',
        type: 'success',
      })
      router.push({
        name: 'Login',
      })
    }
    console.log(res.status)
    // if(res.data.status_code)
  } catch (error) {
    console.error(error)
    ElMessage({
      title: 'Error',
      message: '注册失败',
      type: 'error',
    })
  }
}


</script>


<style scoped>
.main {
  display: flex;
}

.img {
  width: 34%;
}

.register {
  width: 76%;
  margin: 0 auto;
  margin-top: 100px;
}

.register .demo-ruleForm {
  width: 500px;
  height: 500px;
  margin: 0 auto;
  margin-top: 100px;
}

.ipt_title {
  font-size: 20px;
  margin-bottom: 10px;
}
</style>