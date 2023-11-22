<template>
  <el-row>

    <el-col :span="10"></el-col>
    <el-col :span="2" style="text-align: center; font-size: 30px; font-weight: 700;">
      友情链接
    </el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="4">
      <!-- 分页搜索 -->
      <el-input v-model="IptData.name" placeholder="友情链接名称"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="4">
      <!-- 商品名模糊搜索 -->
      <el-input v-model="IptData.img" placeholder="友情链接logo图片地址"></el-input>
    </el-col><el-col :span="1"></el-col>
    <el-col :span="4">
      <!-- 分页搜索 -->
      <el-input v-model="IptData.url" placeholder="跳转链接"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="4">
      <!-- 评论等级 -->
      <el-select v-model="IptData.statusRef" @change="ChangeComments()">
        <el-option v-for=" item  in  status " :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="2">
      <el-button text @click="AddLinks" type="danger">添加</el-button>
    </el-col>

  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-table :data="datalist" style="width: :100%">>
        <!-- <el-table-column prop="name" label="友情链接名称" /> -->
        <el-table-column label="友情链接名称" width="160">
          <template #default="scope">
            <el-col @click="Detail(scope.row.id)">
              <el-link :style="{ textDecoration: 'none', color: '#606266' }"> {{ scope.row.name }}</el-link>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="跳转连接" />
        <el-table-column prop="img_url" label="logo">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="Detail(scope.row.id)">
              <el-image :src="img_url" />
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-col>
              <el-tooltip class="box-item" effect="dark" content="禁用" v-if="scope.row.status == 1">
                <el-button link @click="SwitchStatus(scope.row.id)"> {{ scope.row.status }}</el-button>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="启用" v-if="scope.row.status == 0">
                <el-button link @click="SwitchStatus(scope.row.id)"> {{ scope.row.status }}</el-button>
              </el-tooltip>
            </el-col>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button type="danger" @click="Delete(scope.row.id)">删除</el-button>
            <el-button type="success"
              @click="Editlink(scope.row.id, scope.row.name, scope.row.img, scope.row.url, scope.row.status)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row v-if="currentlist.total_pages > 10">
    <el-col :span="16"></el-col>
    <!-- 分页 -->
    <el-col :span="8">
      <el-pagination background layout="prev,pager,next" :page-size="currentlist.per_page"
        :current_page="currentlist.current_page" :total="currentlist.total_pages" @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>
  </el-row>
  <!-- //显示详细信息 -->
  <el-row>
    <el-dialog v-model="dialogFormVisible">
      <el-form :model="alertFrom">
        <el-form-item label="友情链接ID:" :label-width="100 + 'px'" v-if="isdisabled">
          <el-input v-model="alertFrom.id" disabled />
        </el-form-item>
        <el-form-item label="友情链接:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.name" :disabled="isdisabled" />
        </el-form-item>
        <el-form-item label="跳转链接:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.url" :disabled="isdisabled" />
        </el-form-item>
        <el-form-item label="logo:" :label-width="100 + 'px'">
          <el-image :src="alertFrom.img" :disable="isdisabled"></el-image>
          <!-- <el-input v-model="alertFrom.logo" disabled /> -->
        </el-form-item>
        <el-form-item label="logo地址:" :label-width="100 + 'px'" v-if="isdisabled">
          <el-input v-model="alertFrom.img_url" disabled />
        </el-form-item>
        <el-form-item label="排序:" :label-width="100 + 'px'" v-if="isdisabled">
          <el-input v-model="alertFrom.seq" disabled />
        </el-form-item>
        <el-form-item label="状态:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.status" :disabled="isdisabled" />
        </el-form-item>
        <el-form-item label="添加时间：" :label-width="100 + 'px'" v-if="isdisabled">
          <el-input v-model="alertFrom.created_at" disabled />
        </el-form-item>
        <el-form-item label="更新时间：" :label-width="100 + 'px'" v-if="isdisabled">
          <el-input v-model="alertFrom.update_at" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Judge">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import httpInstance from "../../../utils/api"



const isdisabled = ref(true)
const alertFrom = ref({})
//弹出框的显示
const dialogFormVisible = ref(false)
const IptData = ref({})
//自定义的星级下拉列表
const status = ref([
  {
    id: '0',
    name: '启用'
  },
  {
    id: '1',
    name: '禁用'
  },

])
//获取储存在session里面的token
const token = sessionStorage.getItem('token')
const headers = { 'Authorization': token }
// 基地址
const baseUrl = 'https://api.shop.eduwork.cn/'
//d定义一个对象存放请求的配置数据
const axiosConfig = ref({ params: {} })
//定义一数组接受表格数据
const datalist = ref([])
//定义数组接受分页数据
const currentlist = ref([])
const render = () => {


  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/api/admin/links'
  axiosConfig.value.params = {
    current: 1
  }
  axiosConfig.value.isReturn = true
  httpInstance(axiosConfig).then(res => {
    if (res) {
      datalist.value = res.data.data
      currentlist.value = res.data.meta.pagination
    }
  })


  // loadLinks()
}
// 从服务器端请求数据
onMounted(() => {
  render()
})
const loadLinks = async () => {
  try {
    const res = await axios({
      baseURL: baseUrl,
      url: axiosConfig.value.url,
      method: axiosConfig.value.method,
      headers: headers,
      params: axiosConfig.value.params
    })
    if (axiosConfig.value.isReturn == true) {
      datalist.value = res.data.data
      currentlist.value = res.data.meta.pagination
      console.log(datalist.value)
    }
    else {
      render()
    }
    return 1
  } catch (err) {
    console.log(err)
    ElNotification({
      title: 'error',
      message: '请求失败',
      type: 'error'
    })
    render()
    return 0
  }
}
//分页改变触发函数
const handleCurrentChange = (num) => {
  if (IptData.value.statusRef != '') {
    axiosConfig.value.params = {
      current: num,
      status: IptData.value.statusRef
    }
  } else {
    axiosConfig.value.params = {
      current: num,
    }
  }
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/api/admin/links'
  httpInstance(axiosConfig).then(res => {
    if (res) {
      datalist.value = res.data.data
      currentlist.value = res.data.meta.pagination
      console.log('这个是httpinstace返回的数据：', res)
    } else {
      console.log('返回错误')
    }
  })
  // axiosConfig.value.isReturn = true
  // loadLinks()

}
//改变状态触发函数
const ChangeComments = () => {
  axiosConfig.value.params = {
    status: IptData.value.statusRef
  }
  if (IptData.value.trade_no != '') {
    axiosConfig.value.params.trade_no = IptData.value.trade_no
  }
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/api/admin/links'
  httpInstance(axiosConfig).then(res => {
    if (res) {
      datalist.value = res.data.data
      currentlist.value = res.data.meta.pagination
      console.log('这个是httpinstace返回的数据：', res)
    } else {
      console.log('返回错误')
    }
  })
  // loadLinks()
}
// 添加
const AddLinks = () => {
  axiosConfig.value.params = {}
  if (IptData.value.name == '' || IptData.value.img == '' || IptData.value.url == '') {
    ElNotification({
      title: 'Error',
      message: '链接名和链接logo图片不能为空',
      type: 'error',
    })
  } else {
    console.log(IptData.value)
    axiosConfig.value.params.name = IptData.value.name
    axiosConfig.value.params.img = IptData.value.img
    axiosConfig.value.params.url = IptData.value.url
    if (IptData.value.statusRef != '') {
      axiosConfig.value.params.status = alertFrom.value.status
    }
    axiosConfig.value.method = 'post'
    axiosConfig.value.url = '/apiadmin/links'


    // httpInstance(axiosConfig).then(res => {
    //   if (!res) {
    //     render()

    //   }
    // })
    axiosConfig.value.isReturn = false
    axiosFun()
  }
}
//编辑
const Editlink = (id, name, url, img, status) => {
  alertFrom.value = {
    name: name,
    url: url,
    img: img,
    status: status,
    id: id
  }
  isdisabled.value = false
  dialogFormVisible.value = true
  axiosConfig.value.params = {}

}
const Edit = async () => {
  if (alertFrom.value.name == '' || alertFrom.value.img == '' || alertFrom.value.url == '') {
    ElNotification({
      title: 'Error',
      message: '链接名和链接logo图片不能为空',
      type: 'error',
    })
  } else {
    axiosConfig.value.params = {
      name: alertFrom.value.name,
      img: alertFrom.value.img,
      url: alertFrom.value.url
    }
    if (IptData.value.statusRef != '') {
      axiosConfig.value.params.status = alertFrom.value.status
    }
    axiosConfig.value.method = 'put'
    axiosConfig.value.url = `/api/admin/links/${alertFrom.value.id}`
    axiosConfig.value.isReturn = false
    await axiosFun()
  }
}
const Judge = () => {
  dialogFormVisible.value = false
  if (isdisabled.value == false) {
    Edit()
  }
  isdisabled.value = true
}
//删除
const Delete = async (id) => {
  try {
    await axios({
      method: 'delete',
      baseURL: baseUrl,
      url: `/api/admin/links/${id}`,
      headers: headers
    })
    success()
  } catch (err) {
    error()
  }
  render()
}
//链接详情
const Detail = async (id) => {
  isdisabled.value = true
  const res = await axios.get(`https://api.shop.eduwork.cn/api/admin/links/${id}`, {
    headers: headers,
  })
  alertFrom.value = res.data
  dialogFormVisible.value = true
  axiosConfig.value.isReturn = true
}
//切换显示状态
const SwitchStatus = async (id) => {
  console.log(id)
  try {
    const res = await axios({
      baseURL: baseUrl,
      method: 'PATCH',
      url: `/api/admin/links/${id}/status`,
      headers: headers,
    })
    console.log(res)
    success()
  } catch (err) {
    error()
  }
}
const axiosFun = async () => {
  await loadLinks().then(res => {
    if (res == 1) {
      success()
    } else error()
  })
}
const success = () => {
  ElNotification({
    title: 'Success',
    message: '成功',
    type: 'success',
  })
}
const error = () => {
  ElNotification({
    title: 'Error',
    message: '失败',
    type: 'error',
  })
}
</script>