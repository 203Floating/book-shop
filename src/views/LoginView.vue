<template>
  <div class="main">
    <div class="img"><img src="../style/img/张伟.jpg" alt="">
    </div>
    <div class="login">
      <el-form :model="ruleForm" label-width="120px" class="demo-ruleForm">
        <div>
          <span style="font-size: 35px;">账号登陆</span>
          <span style="font-size: 22px;margin-left: 20px;">使用邮箱和密码登陆</span>
        </div>
        <div style="height: 20px;"></div>
        <div>
          <span>还没有账号？&nbsp;</span><span><el-button link type="success"
              @click="router.push({ name: 'Register', })">立即注册</el-button></span>
        </div>
        <div style="height: 30px;"></div>
        <p class="ipt_title">邮箱：</p>
        <el-form-item prop="email">
          <el-input v-model="ruleForm.email"
            :style="{ width: '500px', height: '50px', marginLeft: '-120px', backgroundColor: 'red' }" />
        </el-form-item>
        <div style="height: 5px;"></div>
        <p class="ipt_title">密码：</p>
        <el-form-item label="" prop="pass">
          <el-input v-model="ruleForm.pass" type="password"
            :style="{ width: '500px', height: '50px', marginLeft: '-120px', backgroundColor: 'rgb(232, 240, 254)' }" />
        </el-form-item>
        <div style="height: 30px;"></div>
        <el-form-item>
          <el-button :style="{ width: '500px', height: '50px', marginLeft: '-120px' }" type="success"
            @click="Login">登陆</el-button>
          <!-- <el-button link @click="router.push({ name: 'Register', })">还没有账号？注册一个吧。</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'



const ruleForm = ref({})
const router = useRouter()
const Login = async () => {
  try {
    const res = await axios.post("https://api.shop.eduwork.cn/api/auth/login", {
      email: ruleForm.value.email,
      password: ruleForm.value.pass,
    })
    if (res.status == 200) {
      // 如果登陆成功就获取用户token
      sessionStorage.setItem('token', res.data.token_type + ' ' + res.data.access_token)
      sessionStorage.setItem('isAuthorization', true)
      if (ruleForm.value.email == 'cjwdzjl@qq.com' || ruleForm.value.email == 'super@a.com') {
        sessionStorage.setItem('isShowHoutai', true)
      } else {
        sessionStorage.setItem('isShowHoutai', false)
      }
      router.push({ name: 'MainPage', })
      ElMessage({
        message: '登陆成功！',
        type: 'success',
      })
    }
  } catch (error) {
    ruleForm.value = {}
    ElMessage.error('登陆失败.')
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

.login {
  width: 76%;
  margin: 0 auto;
  margin-top: 100px;
}

.login .demo-ruleForm {
  width: 500px;
  height: 500px;
  margin: 0 auto;
  margin-top: 150px;
}

.ipt_title {
  font-size: 20px;
  margin-bottom: 10px;
}
</style>