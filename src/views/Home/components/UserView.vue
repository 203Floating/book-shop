<template>
  <el-row>
    <el-col :span="10"></el-col>
    <el-col :span="2" style=" font-size: 30px; font-weight: 700;">用户管理</el-col>
  </el-row>
  <div style="height: 20px;"></div>

  <!-- 表格 -->
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-table :data="datalist" style="width: 100%">
        <el-table-column fixed prop="id" label="Id" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="ForEdit(scope.row.id)">禁用</el-button>
            <el-button link type="primary" size="small"
              @click="ForEdit(scope.row.id, scope.row.email, scope.row.name)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <!-- 输入用户名 -->
    <el-col :span="3"><el-input v-model="UserWord" placeholder="Name"></el-input></el-col><el-col
      :span="1"><!-- 空格 --></el-col>
    <!-- 输入邮箱 -->
    <el-col :span="3"><el-input v-model="EmailWord" placeholder="Email"></el-input></el-col><el-col :span="1"></el-col>
    <!-- 搜索事件 -->
    <el-col :span="2"><el-button @click="SerachUser()" type="danger">搜索</el-button></el-col>
    <!-- 添加用户和修改用户 -->
    <el-col :span="3">
      <el-button text @click="addBtn" type="danger">添加用户</el-button>
      <el-button text @click="reviseBtn" type="success">修改用户</el-button>
      <el-dialog v-model="dialogFormVisible" title="用户信息">
        <el-form :model="alertFrom">
          <!-- 修改指定id的用户 -->
          <el-form-item label="Id" :label-width="100 + 'px'" v-if="isId">
            <el-input v-model="alertFrom.id" />
          </el-form-item>
          <el-form-item label="Name" :label-width="100 + 'px'">
            <el-input v-model="alertFrom.name" />
          </el-form-item>
          <el-form-item label="Email" :label-width="100 + 'px'">
            <el-input v-model="alertFrom.email" />
          </el-form-item>
          <el-form-item label="Password" :label-width="100 + 'px'" v-if="isPass">
            <el-input v-model="alertFrom.password" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <!-- <el-button type="primary" @click="AddUser" dialogFormVisible.value = false>确认</el-button> -->
            <el-button type="primary" @click="Judge">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </el-col>
    <!-- 分页 start -->
    <el-col :span="4">
      <el-pagination background layout="prev, pager, next" :page-size="page.per_page" :current_page="page.current_page"
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
  id: '',
  name: '',
  email: '',
  password: ''
})
// 通过id和pass这两个弹出框的是否显示来判断执行的是编辑、更新、添加这三个的哪一个操作
//设置是否显示弹出框的id
const isId = ref(true)
//设置是否弹出密码输入框
const isPass = ref(true)
//用户名
const UserWord = ref()
// 用户邮箱
const EmailWord = ref()
//表格对象
const datalist = ref([])
//存储在本地的token
const token = ref({ token: sessionStorage.getItem('token') })
//分页数据
const page = ref({})
//基础地址
const baseURL = 'https://api.shop.eduwork.cn/api'
//新建一个对象，这个对象保存axios的配置
const axiosConfig = ref({
  //传递的方法
  type: '',
  //h后置的url
  url: '',
  //这个关键字保存的是传递的参数对象
  keyword: {

  },
  isData: true
})
//渲染的调用函数
const Transfer = () => {
  //关闭弹框，然后调用函数
  axiosConfig.value.isData = false
  loadUser(axiosConfig)
  alertFrom.id = ''
  alertFrom.name = ''
  alertFrom.email = ''
  axiosConfig.value.id = ''
}
//主函数,这个函数接受不同的参数来调用不同的请求,来实现不同的功能
const loadUser = (axiosobj) => {
  // 异步请求
  axios({
    method: axiosobj.value.type,
    baseURL: baseURL,
    url: axiosobj.value.url,
    headers: { 'Authorization': token.value.token },
    params: axiosobj.value.keyword,
  }).then((res) => {
    // 传入一个条件来处理没有返回值的情况
    if (axiosobj.value.isData) {
      datalist.value = res.data.data
      page.value = res.data.meta.pagination
    }
    //如果为false,说明这个无返回值,不能正确接受res,所以那就重新调用渲染的函数,重新渲染
    else {
      RenderUser()

    }
  }).catch((err) => {
    console.log(err)
  })

}
const RenderUser = () => {
  axiosConfig.value.type = "get"
  axiosConfig.value.url = "/admin/users"
  axiosConfig.value.keyword = {
    current: 1,
  }
  axiosConfig.value.isData = true
  loadUser(axiosConfig)
}
// 挂载后立刻渲染
onMounted(() => {
  RenderUser()
})
// 切换分页后立即重新渲染
function handleCurrentChange(num) {
  axiosConfig.value.type = "get"
  axiosConfig.value.url = "/admin/users"
  axiosConfig.value.keyword = {
    current: num,
  }
  axiosConfig.value.isData = true
  loadUser(axiosConfig)
}
//点击搜索用户详情
const SerachUser = () => {
  axiosConfig.value.type = "get"
  axiosConfig.value.url = "/admin/users"
  axiosConfig.value.keyword = {
    current: 1,
    name: UserWord.value,
    email: EmailWord.value
  }
  axiosConfig.value.isData = true
  loadUser(axiosConfig)
}
//添加用户
const AddUser = () => {
  dialogFormVisible.value = false
  if (alertFrom.name == '' || alertFrom.email == "" || alertFrom.password == "") {
    alert("用户名，邮箱，密码不能为空")
  }
  axiosConfig.value.type = "POST"
  axiosConfig.value.url = "/admin/users"
  axiosConfig.value.keyword = {
    name: alertFrom.name,
    email: alertFrom.email,
    password: alertFrom.password
  }
  Transfer()
}
//更新用户信息
const ReviseUser = () => {
  dialogFormVisible.value = false
  axiosConfig.value.type = "PUT"
  axiosConfig.value.url = `/admin/users/${alertFrom.id}`
  axiosConfig.value.keyword = {
    email: alertFrom.email,
    name: alertFrom.name
  }
  Transfer()
}
//禁用
const Forbidden = (id) => {
  console.log(id)
  axiosConfig.value.type = "PATCH"
  axiosConfig.value.url = "/admin/users/" + id + "/lock"
  Transfer()
}
//编辑
const EditUser = () => {
  axiosConfig.value.type = "PUT"
  axiosConfig.value.url = `/admin/users/${alertFrom.id}`
  axiosConfig.value.keyword = {
    email: alertFrom.email,
    name: alertFrom.name
  }
  Transfer()
}
//编辑按钮调出弹框
const ForEdit = (id, email, name) => {
  // 传递参数为真,说明要执行的是禁用操作
  if (email == '') {
    Forbidden(id)
  }
  // 传递参数为假,说明要执行的是编辑操作，切换状态码
  else {
    isId.value = false
    isPass.value = false
    //将当前行的id，name，email保存起来
    alertFrom.id = id
    alertFrom.name = name
    alertFrom.email = email
    //显示当前用户的密码和邮箱
    dialogFormVisible.value = true
  }
}
//判断函数,判断执行的是什么操作
const Judge = () => {
  dialogFormVisible.value = false
  if (isId.value == false && isPass.value == true) {
    AddUser()
  }
  if (isId.value == true && isPass.value == false) {
    ReviseUser()
  }
  if (isId.value == false && isPass.value == false) {
    EditUser()
  }
}
//添加按钮函数,切换显示状态，切换状态码
const addBtn = () => {
  isId.value = false
  isPass.value = true
  dialogFormVisible.value = true
}
//修改按钮函数,切换显示状态,切换状态码
const reviseBtn = () => {
  isId.value = true
  isPass.value = false
  dialogFormVisible.value = true
}

</script>
