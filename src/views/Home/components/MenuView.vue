import axios from 'axios';
<template>
  <el-row>
    <el-col style="text-align: center; font-size: 30px; font-weight: 700;">菜单管理</el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-table :data="datalist" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
        <!-- default-expand-all属性是默认展开的 -->
        <el-table-column prop="id" label="ID" sortable />
        <el-table-column prop="name" label="Name" sortable />
        <el-table-column prop="level" label="Level" sortable />
        <el-table-column prop="status" label="Status" sortable />
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'


// 挂载函数
onMounted(() => {
  axiosConfig.value.url = '/api/admin/menus'
  axiosConfig.value.params = {}
  axiosConfig.value.method = 'get'
  loader()
})
// 加载请求函数
const loader = async () => {
  const res = await axios({
    method: axiosConfig.value.method,
    baseURL: baseUrl,
    url: axiosConfig.value.url,
    headers: headers,
  })
  datalist.value = res.data
}


const token = sessionStorage.getItem('token')
const headers = { 'Authorization': token } //获取储存在session里面的token
const baseUrl = 'https://api.shop.eduwork.cn/'     // 基地址 
const datalist = ref([])
const axiosConfig = ref({})
</script>