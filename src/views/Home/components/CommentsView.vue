import axios from 'axios';
<template>
  <el-row>
    <el-col style="text-align: center; font-size: 30px; font-weight: 700;">评级管理</el-col>
  </el-row>
  <div style="height: 20px;"></div>


  <el-row>
    <el-dialog v-model="dialogFormVisible" width="560px">
      <el-form :model="alertFrom">
        <el-form-item label="id:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.id" disabled />
        </el-form-item>
        <el-form-item label="创建者:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.user_id" disabled />
        </el-form-item>
        <el-form-item label="分类:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.goods_id" disabled />
        </el-form-item>
        <el-form-item label="标题:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.content" disabled />
        </el-form-item>
        <el-form-item label="价格：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.rate" disabled />
        </el-form-item>
        <el-form-item label="库存：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.star" disabled />
        </el-form-item>
        <el-form-item label="小图集：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.status" disable />
        </el-form-item>
        <el-form-item label="添加时间：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.created_at" disabled />
        </el-form-item>
        <el-form-item label="更新时间：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.update_at" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
  <!-- 数据表 -->
  <div class="hieght_div"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-table :data="datalist" style="width: :100%;">
        <el-table-column fixed prop="user_id" label="创建者" @click="Detail" />
        <el-table-column prop="goods_id" label="分类" />
        <el-table-column prop="content" label="评价内容" />
        <el-table-column prop="rate" label="评级级别" width="120" />
        <el-table-column prop="star" label="星级" width="100" />
        <el-table-column prop="reply" label="回复的内容" width="200" />
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="Reply(scope.row.id)">回复</el-button>
            <el-button link type="primary" size="small" @click="Delete(scope.row.id)">删除</el-button>
            <el-button link type="primary" size="small" @click="Detail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <div class="hieght_div"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="4">
      <!-- 分页搜索 -->
      <el-input v-model="IptData.current" placeholder="分页数"></el-input>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="5">
      <!-- 评论等级 -->
      <el-select v-model="IptData.rateRef" @change="ChangeComments()">
        <el-option v-for="item in levels" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-col>
    <el-col :span="2">
      <el-button text @click="Search" type="danger">搜索</el-button>
    </el-col>
    <el-col :span="4"></el-col>
    <!-- 分页 -->
    <el-col :span="6">
      <el-pagination background layout="prev,pager,next" :page-size="currentlist.per_page"
        :current_page="currentlist.current_page" :total="currentlist.total_pages" @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

const alertFrom = ref({})
const dialogFormVisible = ref(false)
//d定义一个对象存放请求的配置数据
const axiosConfig = ref({
  params: {
  }
})
//定义一数组接受表格数据
const datalist = ref([
])
//定义数组接受分页数据
const currentlist = ref([
])
const render = () => {
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/admin/comments'
  axiosConfig.value.isReturn = true
  axiosConfig.value.params = {
    current: 1
  }
  loadComments()
}
// 从服务器端请求数据
onMounted(() => {
  render()
})
const loadComments = async () => {
  try {
    const res = await axios({
      baseURL: baseUrl,
      url: axiosConfig.value.url,
      method: axiosConfig.value.method,
      headers: headers,
      params: axiosConfig.value.params
    })
    if (axiosConfig.value.isReturn != false) {
      datalist.value = res.data.data
      currentlist.value = res.data.meta.pagination
    } else {
      render()
    }

    return 1
  } catch (err) {
    console.log(err)
    console.log(0)
    return 0
  }

}
//分页改变触发函数
const handleCurrentChange = (num) => {
  axiosConfig.value.params = {
    current: num
  }
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/admin/comments'
  axiosConfig.value.isReturn = true
}
//改变星级触发函数
const ChangeComments = () => {
  axiosConfig.value.params = {
    rate: IptData.value.rateRef
  }
  if (IptData.value.goodsName != '') {
    axiosConfig.value.params.goods_title = IptData.value.goodsName
  }
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/admin/comments'
  axiosConfig.value.isReturn = true
  axiosFun()

}
// 搜索
const Search = () => {
  axiosConfig.value.params = {
    current: 1
  }
  if (IptData.value.goodsName != '') {
    axiosConfig.value.params.goods_title = IptData.value.goodsName
  }
  if (IptData.value.rateRef != '') {
    axiosConfig.value.params.rate = IptData.value.rateRef
  }
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/admin/comments'
  axiosConfig.value.isReturn = true
  axiosFun()
}
//详情
const Detail = async (id) => {
  console.log(id)
  try {
    const res = await axios({
      method: 'get',
      headers: headers,
      baseURL: baseUrl,
      url: `/admin/comments/${id}`
    })
    console.log(res)
    alertFrom.value = res.data
    dialogFormVisible.value = true
  } catch (err) {
    console.log(err)
  }
}
//删除评价
const Delete = id => {
  axiosConfig.value.params = {
  }
  axiosConfig.value.method = 'DELETE'
  axiosConfig.value.url = `/admin/comments/${id}/delete`
  axiosConfig.value.isReturn = false
  axiosFun()
}
//回复
const Reply = (id) => {
  console.log(id)
  ElMessageBox.prompt('请输入回复的内容：', 'Tip', {
    confirmButtonText: 'OK',    //确定按钮的文本
    cancelButtonText: 'Cancel', //取消按钮的文本
    inputPattern: /\S+/,            //正则，用于只有输入与这个匹配时才能点击确认
    inputErrorMessage: '输入不能为空！',         //输入不符合时现实的错误提示信息 
  }).then((res) => {
    console.log(res.value)
    axiosConfig.value.params = {
      reply: res.value
    }
    axiosConfig.value.method = 'PATCH'
    axiosConfig.value.url = `/admin/comments/${id}/reply`
    axiosConfig.value.isReturn = false
    axiosFun()
  }).catch(() => {
    ElMessage({
      type: 'Error',
      message: '回复失败',
    })
  })
}
const axiosFun = () => {
  loadComments().then(res => {
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
const IptData = ref({
  goodsName: '',
  rateRef: 1,
})
//自定义的星级下拉列表
const levels = ref([
  {
    id: '1',
    name: '一星'
  },
  {
    id: '2',
    name: '二星'
  },
  {
    id: '3',
    name: '三星'
  },
])
//获取储存在session里面的token
const token = sessionStorage.getItem('token')
const headers = {
  'Authorization': token
}
// 基地址
const baseUrl = 'https://api.shop.eduwork.cn/api'


</script>
<style scoped>
.hieght_div {
  height: 20px;
}
</style>