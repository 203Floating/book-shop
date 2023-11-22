<template>
  <el-page-header :style="{ marginLeft: '50px' }" @back="router.back()">
    <template #content>
      <div class="flex items-center">
        <el-popover :width="300"
          popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
          <template #reference>
            <el-button link @click="console.log('点击了')">
              <el-avatar :src="ReturnData.avatar_url" />
            </el-button>
          </template>
          <template #default>
            <div class="demo-rich-conent" style="display: flex; gap: 16px; flex-direction: column">
              <el-avatar :size="60" :src="ReturnData.avatar_url" style="margin-bottom: 8px" />
              <div>
                <p class="demo-rich-content__name" style="margin: 0; font-weight: 500">
                  {{ ReturnData.name }}
                </p>
                <p class="demo-rich-content__mention" style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                  {{ ReturnData.email }}
                </p>
                <p class="demo-rich-content__mention" style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                  创建时间：{{ ReturnData.created_at }}
                </p>
                <p class="demo-rich-content__mention" style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                  更新时间：{{ ReturnData.updated_at }}
                </p>
              </div>
              <p class="demo-rich-content__desc" style="margin: 0">
                Element Plus, a Vue 3 based component library for developers,
                designers and product managers
              </p>
            </div>
          </template>
        </el-popover>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
          &nbsp;{{ ReturnData.name }}&nbsp;
        </span>
        <el-tag>Default</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center" :style="{ marginRight: '100px' }">
        <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" :icon="InfoFilled"
          icon-color="#626AEF" title="确定要退出登陆吗？" @confirm="ExitLogn()" @cancel="doNothing">
          <template #reference>
            <el-button type="primary" class="ml-2">退出</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" :icon="InfoFilled"
          icon-color="#626AEF" title="确定要修改密码吗？" @confirm="dialogFormVisible = true" @cancel="doNothing">
          <template #reference>
            <el-button type="primary" class="ml-2">修改密码</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm width="220" confirm-button-text="OK" cancel-button-text="No, Thanks" :icon="InfoFilled"
          icon-color="#626AEF" title="确定要修改邮箱吗？" @confirm="dialogFormVisible_email = true" @cancel="doNothing">
          <template #reference>
            <el-button type="primary" class="ml-2">修改邮箱</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm width="220" confirm-button-text="OK" v-if="isShowHoutai" cancel-button-text="No, Thanks"
          :icon="InfoFilled" icon-color="#626AEF" title="确定要进入后台页面吗？" @confirm="router.push({
            path: '/',
          })" @cancel="doNothing">
          <template #reference>
            <el-button type="primary" class="ml-2">进入后台</el-button>
          </template>
        </el-popconfirm>
        <!-- 修改密码 -->
        <el-dialog v-model="dialogFormVisible" title="Shipping address">
          <el-form :model="form">
            <el-form-item label="旧密码：" :label-width="formLabelWidth">
              <el-input v-model="alertPas.oldPas" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码：" :label-width="formLabelWidth">
              <el-input v-model="alertPas.Pas1" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码：" :label-width="formLabelWidth">
              <el-input v-model="alertPas.Pas2" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="Reset" :plain="true">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
        <!-- 修改邮箱 -->
        <el-dialog v-model="dialogFormVisible_email" title="Shipping address">
          <el-form :model="form">
            <el-form-item label="邮箱：" :label-width="formLabelWidth">
              <el-input v-model="alertEmail.email" autocomplete="off" />
              <el-button type="primary" @click="SendEmail">发送</el-button>
            </el-form-item>
            <el-form-item label="验证码：" :label-width="formLabelWidth" v-if="isShowNewEmail">
              <el-input v-model="alertEmail.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新邮箱名：" :label-width="formLabelWidth" v-if="isShowNewEmail">
              <el-input v-model="alertEmail.newemail" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="UpdateEmail" :plain="true" v-if="isShowNewEmail">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </template>
    {{ ReturnData.value }}
  </el-page-header>
</template>
<script setup>
import axios from "axios"
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import httpInstance from "../utils/api"
// import { userStores } from '../../stores//user'       //用户信息仓库
// const userStore = userStores()//使用

const isShowHoutai = sessionStorage.getItem('isShowHoutai')
const isShowNewEmail = ref(false)
const alertEmail = ref({})
//修改密码的弹框
const dialogFormVisible = ref(false)
const dialogFormVisible_email = ref(false)
//搜集新旧密码
const alertPas = ref({})
const router = useRouter()
//获取当前用户的信息
const ReturnData = ref({})
const headers = { 'Authorization': sessionStorage.getItem('token') }
const baseUrl = 'https://api.shop.eduwork.cn/'
const axiosConfig = ref({})
//获取用户详情


onMounted(async () => {
  try {
    const res = await axios({
      method: 'get',
      headers: headers,
      baseURL: baseUrl,
      url: '/api/user',
    })
    ReturnData.value = res.data
  } catch (err) {
    console.log(err)
  }
})

//修改密码
const Reset = async () => {
  if (alertPas.value.Pas1 == '' || alertPas.value.Pas2 == '' || alertPas.value.oldPas == '') {
    ElMessage({
      showClose: true,
      message: '密码不能为空！.',
      type: 'warning',
    })
  } else {
    if (alertPas.value.Pas1 != alertPas.value.Pas2) {
      alertPas.value = {}
      ElMessage({
        showClose: true,
        message: '前后密码不一致！',
        type: 'error',
      })
    } else {
      dialogFormVisible.value = false
      axiosConfig.value.methods = 'post'
      axiosConfig.value.url = '/api/auth/password/update'
      axiosConfig.value.isReturn = false
      axiosConfig.value.params = {
        old_password: alertPas.value.oldPas,
        password: alertPas.value.Pas1,
        password_confirmation: alertPas.value.Pas2
      }
      try {
        const res = await httpInstance(axiosConfig)
        if (res.status == 204) {
          ElMessage({
            showClose: true,
            message: '重新登陆!',
          })
          sessionStorage.removeItem('isAuthorization')
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('isShowHoutai')
          router.push({
            path: '/login'
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
//退出登录
const ExitLogn = async () => {
  axiosConfig.value.methods = 'post'
  axiosConfig.value.url = '/api/auth/logout'
  axiosConfig.value.params = {}
  axiosConfig.value.isReturn = false
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 204) {
      //移除session
      sessionStorage.removeItem('isAuthorization')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('isShowHoutai')
      router.push({
        path: '/login'
      })
    }
  } catch (err) {
    console.log(err)
  }
}

//发送邮件
const SendEmail = async () => {
  axiosConfig.value.url = '/api/auth/email/code'
  axiosConfig.value.methods = 'post'
  axiosConfig.value.params = {
    email: alertEmail.value.email
  }
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 204) {
      console.log('成功')
      isShowNewEmail.value = true
    }
  } catch (err) {
    console.log(err)
  }
}
//更新邮箱
const UpdateEmail = async () => {
  axiosConfig.value.url = '/api/auth/email/update'
  axiosConfig.value.methods = 'patch'
  axiosConfig.value.params = {
    email: alertEmail.value.email,
    code: alertEmail.value.code
  }
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 204) {
      console.log('成功')
      isShowNewEmail.value = true
    }
  } catch (err) {
    console.log(err)
  }
}
</script>
