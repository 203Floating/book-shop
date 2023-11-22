<template>
  <el-row>
    <el-col :span="10"></el-col>
    <el-col :span="2" style="font-size: 30px; font-weight: 700;">商品管理</el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="3"></el-col>
    <!-- 输入用户名 -->
    <el-col :span="4"><el-input v-model="goodsTitle" placeholder="Title"></el-input></el-col><el-col
      :span="2"><!-- 空格 --></el-col>
    <!-- 输入邮箱 -->
    <el-col :span="4"><el-input v-model="goodsCategory" placeholder="Category"></el-input></el-col><el-col
      :span="2"></el-col>
    <!-- 搜索事件 -->
    <el-col :span="2"><el-button @click="SerachGoods()" type="danger">搜索</el-button></el-col>
    <!-- 添加用户和修改用户 -->
    <el-col :span="6">
      <el-button @click="addBtn" type="danger">添加商品</el-button>
      <el-button @click="reviseBtn" type="success">修改商品</el-button>
      <el-dialog v-model="dialogFormVisible" title="用户信息">
        <el-form :model="alertFrom">
          <!-- 修改指定id的用户 -->
          <el-form-item label="ID:" :label-width="100 + 'px'" v-if="isId">
            <el-input v-model="alertFrom.id" />
          </el-form-item>
          <el-form-item label="分类:" :label-width="100 + 'px'">
            <el-input v-model="alertFrom.category_id" />
          </el-form-item>
          <el-form-item label="标题:" :label-width="100 + 'px'">
            <el-input v-model="alertFrom.title" />
          </el-form-item>
          <el-form-item label="描述:" :label-width="100 + 'px'">
            <el-input v-model="alertFrom.description" />
          </el-form-item>
          <el-form-item label="价格" :label-width="100 + 'px'">
            <el-input v-model="alertFrom.price" />
          </el-form-item>
          <el-form-item label="库存" :label-width="100 + 'px'">
            <el-input v-model="alertFrom.stock" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="Judge">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </el-col>
  </el-row>
  <div style="height: 20px;"></div>

  <!-- 表格 -->
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-table :data="datalist" style="width: 100%">
        <el-table-column fixed prop="id" label="Id" />
        <el-table-column prop="title" label="标题" width="200px" />
        <el-table-column prop="category_id" label="类名" />
        <el-table-column prop="description" label="描述" width="360px" />
        <el-table-column prop="stock" label="库存" />
        <el-table-column prop="sales" label="销量" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="is_on" label="是否下架" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="ForEdit(scope.row.id, 1)">下架/上架</el-button>
            <el-button link type="primary" size="small" @click="ForEdit(
              scope.row.id, 0, scope.row.category_id, scope.row.title, scope.row.description, scope.row.stock, scope.row.price
            )">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <div style="height: 20px;"></div>

  <!-- 分页 start -->
  <el-row>
    <el-col :span="18"></el-col>
    <el-col :span="4">
      <el-pagination layout="prev, pager, next" :page-size="page.per_page" :current_page="page.current_page"
        :total="page.total_pages" @current-change="handleCurrentChange" />
    </el-col>
  </el-row>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import axios from 'axios'
//弹出框
const dialogFormVisible = ref(false)
//弹出框的各个值
const alertFrom = reactive({
  category_id: '',
  title: '',
  description: '',
  price: '',
  stock: '',
  cover: '',
  details: '',
  id: ''
})
// 定义一个状态参数来判断要执行的是编辑、更新、添加这三个函数的哪一个
const templID = ref()
//商品的id,来控制修改的商品的
const isId = ref()
//商品的名字
const goodsTitle = ref()
// 商品的分类
const goodsCategory = ref()
//表格对象
const datalist = ref([])
//存储在本地的token
const token = ref({
  token: sessionStorage.getItem('token')
})
//分页数据
const page = ref({})
//基础地址
const baseURL = 'https://api.shop.eduwork.cn/api'
//新建一个对象，这个对象保存axios的配置
const axiosConfig = ref({})
//主函数,这个函数接受不同的参数来调用不同的请求,来实现不同的功能
const loadGoods = (axiosobj) => {
  // 异步请求
  axios({
    method: axiosobj.value.type,
    baseURL: baseURL,
    url: axiosobj.value.url,
    headers: { 'Authorization': token.value.token },
    params: axiosobj.value.keyword,
  }).then((res) => {
    if (axiosobj.value.isData) {
      // 传入一个条件来处理没有返回值的情况
      if (res.data.data == '') {
        RenderGoods()
      }
      else {
        datalist.value = res.data.data
        page.value = res.data.meta.pagination
      }
    }
    //如果为false,说明这个无返回值,不能正确接受res,所以那就重新调用渲染的函数,重新渲染
    else {
      RenderGoods()
    }
  }).catch((err) => {
    console.log(err)
  })

}
const RenderGoods = () => {
  axiosConfig.value.type = "get"
  axiosConfig.value.url = "/admin/goods"
  axiosConfig.value.keyword = {
    current: 1,
  }
  axiosConfig.value.isData = true
  loadGoods(axiosConfig)
}
// 挂载后立刻渲染
onMounted(() => {
  RenderGoods()
})
// 切换分页后立即重新渲染
function handleCurrentChange(num) {
  axiosConfig.value.type = "get"
  axiosConfig.value.url = "/admin/goods"
  axiosConfig.value.keyword = {
    current: num,
  }
  axiosConfig.value.isData = true
  loadGoods(axiosConfig)
}
//点击搜索用户详情
const SerachGoods = () => {
  axiosConfig.value.type = "get"
  axiosConfig.value.url = "/admin/goods"
  axiosConfig.value.keyword = {
    current: 1,
    title: goodsTitle.value,
    category_id: goodsCategory.value
  }
  axiosConfig.value.isData = true
  loadGoods(axiosConfig)
}
//添加商品
const AddGoods = () => {
  dialogFormVisible.value = false
  if (alertFrom.category_id == '' || alertFrom.title == "" || alertFrom.description == "" || alertFrom.price == "" || alertFrom.stock == "" || alertFrom.details == "") {
    alert("请输入完整!")
  }
  axiosConfig.value.type = "POST"
  axiosConfig.value.url = "/admin/goods"
  axiosConfig.value.keyword = {
    category_id: alertFrom.category_id,
    title: alertFrom.title,
    description: alertFrom.description,
    price: alertFrom.price,
    stock: alertFrom.stock,
    cover: alertFrom.cover,
    details: alertFrom.details
  }
  axiosConfig.value.isData = false
  loadGoods(axiosConfig)
  Reset()
}
//修改商品信息
const ReviseGoods = () => {
  dialogFormVisible.value = false
  axiosConfig.value.type = "PUT"
  axiosConfig.value.url = `/admin/goods/${alertFrom.id}`
  axiosConfig.value.keyword = {
    category_id: alertFrom.category_id,
    title: alertFrom.title,
    description: alertFrom.description,
    price: alertFrom.price,
    stock: alertFrom.stock,
    cover: alertFrom.cover,
    details: alertFrom.details
  }
  axiosConfig.value.isData = false
  loadGoods(axiosConfig)
  Reset()
}
//禁用
const Forbidden = (id) => {
  axiosConfig.value.type = "PATCH"
  axiosConfig.value.url = "/admin/goods/" + id + "/on"
  axiosConfig.value.isData = false
  loadGoods(axiosConfig)
}
//编辑
const EditGoods = () => {
  axiosConfig.value.type = "PUT"
  axiosConfig.value.url = `/admin/goods/${alertFrom.id}`
  axiosConfig.value.keyword = {
    category_id: alertFrom.category_id,
    title: alertFrom.title,
    description: alertFrom.description,
    price: alertFrom.price,
    stock: alertFrom.stock,
    cover: alertFrom.cover,
    details: alertFrom.details
  }
  axiosConfig.value.isData = false
  loadGoods(axiosConfig)
  // Reset()
}
//编辑按钮调出弹框
const ForEdit = (id, res, category_id, title, description, stock, price) => {
  // 传递参数为真,说明要执行的是禁用操作
  if (res == 1) {
    dialogFormVisible.value = false
    Forbidden(id)
  }
  // 传递参数为假,说明要执行的是编辑操作
  else {
    isId.value = false
    alertFrom.id = id
    alertFrom.category_id = category_id
    alertFrom.title = title
    alertFrom.description = description
    alertFrom.stock = stock
    alertFrom.price = price
    dialogFormVisible.value = true
    templID.value = 3
  }
}
//判断函数,判断执行的是什么操作
const Judge = () => {
  dialogFormVisible.value = false
  if (templID.value == 1) {
    AddGoods()
  }
  if (templID.value == 2) {
    ReviseGoods()
  }
  if (templID.value == 3) {
    EditGoods()
  }
}
//添加按钮函数,切换显示状态,执行的是添加函数
const addBtn = () => {
  isId.value = false
  templID.value = 1
  dialogFormVisible.value = true
}
//修改按钮函数,切换显示状态,执行的是修改函数
const reviseBtn = () => {
  isId.value = true
  templID.value = 2
  dialogFormVisible.value = true
}
// 重置弹出框的参数
const Reset = () => {
  alertFrom.id = ''
  alertFrom.category_id = ''
  alertFrom.title = ''
  alertFrom.description = ''
  alertFrom.stock = ''
  alertFrom.price = ''
  alertFrom.details = ''
  alertFrom.cover = ''
}
</script>