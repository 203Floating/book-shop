<template>
  <el-row>
    <el-col :span="10"></el-col>
    <el-col :span="2" style="font-size: 30px; font-weight: 700;">分类管理</el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="2">
      <el-button @click="dialogFormVisible_levels = true" type="danger">添加用户</el-button>
    </el-col>
    <!-- 添加 -->
    <el-dialog v-model="dialogFormVisible_levels" title="用户信息" width="500px">
      <el-radio-group v-model="addcgy.levels" style="margin-left: 30px;">
        <el-radio :label="0">一级分类</el-radio>
        <el-radio :label="1">二级分类</el-radio>
      </el-radio-group>
      <div style="height: 20px;"></div>
      <el-form-item label="一级分类" v-if="addcgy.levels == 1" label-width="100">
        <el-select v-model="addcgy.level1" class="m-2" placeholder="分组" size="large">
          <el-option v-for="item in datalist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" label-width="100">
        <el-input v-model="addcgy.name" autocomplete="off"></el-input>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible_levels = false">取消</el-button>
          <el-button type="primary" @click="AddOneCategoty(0)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <!-- 添加子类 -->
    <el-dialog v-model="dialogFormVisible_son" title="用户信息" width="500px">
      <div style="height: 20px;"></div>
      <el-form-item label="分类名称" label-width="100">
        <el-input v-model="addcgy.name" autocomplete="off"></el-input>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible_son = false">取消</el-button>
          <el-button type="primary" @click="AddOneCategoty(1)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>

  <el-row>
    <!-- 添加 -->
    <el-dialog v-model="dialogFormVisible_update" title="用户信息" width="500px">
      <div style="height: 20px;"></div>
      <el-form-item label="一级分类" label-width="100" v-if="addcgy.isShow_Update">
        <el-select v-model="addcgy.level1" class="m-2" placeholder="分组" size="large">
          <el-option v-for="item in datalist" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" label-width="100">
        <el-input v-model="addcgy.name" autocomplete="off"></el-input>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible_update = false">取消</el-button>
          <el-button type="primary" @click="ToUpdate">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>

  <!-- 数据栏 -->
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-table :data="datalist" style="width: 100%; margin-bottom: 20px" row-key="id" border>
        <!-- default-expand-all属性是默认展开的 -->
        <el-table-column prop="id" label="ID" sortable />
        <el-table-column prop="name" label="Name" sortable />
        <el-table-column prop="level" label="Level" sortable />
        <el-table-column prop="status" label="Status" sortable />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="ForEdit(scope.row.id)">禁用</el-button>
            <el-button link type="primary" size="small" @click="GetPid(scope.row.id)"
              v-if="scope.row.level == 1">添加子类</el-button>
            <el-button link type="primary" size="small" @click="Updated(scope.row.id, scope.row.pid)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import httpInstance from '../../../utils/api'

const AddPid = ref()
const dialogFormVisible_son = ref(false)
const dialogFormVisible_levels = ref(false)
const dialogFormVisible_update = ref(false)
//定义数据列表
const datalist = ref([])
//基地址
//定义一个axios的配置对象
const axiosConfig = ref({
  url: '', //请求地址
  methods: '', //请求方法
})

const addcgy = ref({
  levels: 0,
  levels2: [],
  isShow_Update: false
})

// 挂在后立刻渲染
onMounted(async () => {
  await loader()
})
//渲染完成后加载
//加载函数
const loader = async () => {
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/admin/category'
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 200) {
      datalist.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}
const GetPid = (id) => {
  AddPid.value = id
  dialogFormVisible_son.value = true
}
//添加分类
const AddOneCategoty = async (num) => {
  if (num == 0) {
    if (addcgy.value.levels == 0) {
      axiosConfig.value.params = {
        name: addcgy.value.name
      }
    } else {
      axiosConfig.value.params = {
        pid: addcgy.value.level1,
        name: addcgy.value.name
      }
    }
  } else {
    axiosConfig.value.params = {
      pid: AddPid.value,
      name: addcgy.value.name
    }
  }
  axiosConfig.value.methods = 'post'
  axiosConfig.value.url = '/api/admin/category'
  try {
    console.log(axiosConfig.value)
    const res = await httpInstance(axiosConfig)
    if (res) {
      if (res.status == 201) {
        dialogFormVisible_levels.value = false
        dialogFormVisible_son.value = false
        addcgy.value = ''
        loader()
      }
    }
  } catch (err) {
    console.log(err)
  }
}
//更新
const Updated = (id, pid) => {
  addcgy.value.id = id
  if (pid == 0) {
    addcgy.value.isShow_Update = false
  }
  dialogFormVisible_update.value = true
}
const ToUpdate = async () => {
  dialogFormVisible_update.value = false
  axiosConfig.value.params = {
    name: addcgy.value.name
  }
  if (addcgy.value.level1 != 0) {
    axiosConfig.value.params.pid = addcgy.value.level1
  }
  axiosConfig.value.methods = 'put'
  axiosConfig.value.url = `/api/admin/category/${addcgy.value.id}`
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 204) {
      loader()
    }
  } catch (err) {
    console.log(err)
  }
}
//禁止模块
const ForEdit = async (id) => {
  axiosConfig.value.methods = 'PATCH'
  axiosConfig.value.params = {}
  axiosConfig.value.url = `/api/admin/category/${id}/status`
  try {
    console.log(axiosConfig.value)
    await httpInstance(axiosConfig).then(res => {
      if (res.status == 204) {
        loader()
      }
    })
  } catch (err) {
    console.log(err)
  }
}
</script>
