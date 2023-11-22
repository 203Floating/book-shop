<template>
  <el-row>


    <el-dialog v-model="dialogFormVisible_switch">
      <el-col :span="3">
        <el-button @click="updatedCarousel">更新</el-button>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="3">
        <el-button @click="DetailCarousel(0)">详情</el-button>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="3">
        <el-button @click="DeleteCarousel">删除</el-button>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="3">
        <el-button @click="ForbiddenCarousel">禁用</el-button>
      </el-col>
    </el-dialog>
  </el-row>
  <!-- 轮播 -->
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <div class="container">
        <el-carousel :interval="4000" type="card" height="300px" @change="handleCarouselChange">
          <el-carousel-item v-for="item in CarouselList" :key="item.id">
            <el-image :src="item.img_url" alt="item.title" title="item.title" v-if="item.status != 0" :fit="fit"
              @click="dialogFormVisible_switch = true" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-col>

  </el-row>
  <!-- 详情 -->
  <el-row>
    <el-dialog v-model="dialogFormVisible" width="600px">
      <el-form :model="alertFrom">
        <el-form-item label="轮播id:" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.id" disabled />
        </el-form-item>
        <el-form-item label="轮播名称:" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.title" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="跳转链接:" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.url" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="轮播图片:" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.img" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="轮播图片地址：" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.img_url" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="排序：" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.seq" disabled />
        </el-form-item>
        <el-form-item label="状态：" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.status" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="添加时间：" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.created_at" disabled />
        </el-form-item>
        <el-form-item label="更新时间：" :label-width="120 + 'px'">
          <el-input v-model="alertFrom.update_at" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Switch">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
  <div style="height: 100px;"></div>

  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="1">
      <el-button @click="dialogFormVisible_add = true" type="primary">添加</el-button>
    </el-col>
    <el-col :span="2"></el-col>
    <el-col :span="2">
      <el-input v-model="idRef" placeholder="名称：" />
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="1">
      <el-button type="danger" @click="Delete">删除</el-button>
    </el-col>
  </el-row>
  <div style="height: 10px;"></div>


  <!-- 添加的模态框 -->
  <el-row>
    <el-dialog v-model="dialogFormVisible_add" title="用户信息" width="500px">
      <div style="height: 20px;"></div>
      <el-form-item label="图片名称：" label-width="100">
        <el-input v-model="AddFrom.addtitle" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图片地址：" label-width="100">
        <el-input v-model="AddFrom.addimg" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接：" label-width="100">
        <el-input v-model="AddFrom.addurl" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否启用？：" label-width="100">
        <el-select v-model="AddFrom.addstatus">
          <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible_add = false">取消</el-button>
          <el-button type="primary" @click="AddCarousel">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import httpInstance from '../../../utils/api'

const dialogFormVisible_add = ref(false)


const dialogFormVisible_switch = ref(false)
const dialogFormVisible = ref(false)
// const imgDetail = ref({})
const idRef = ref()
const axiosConfig = ref({})           //定义请求的配置
const CarouselList = ref([])           //响应过来的数据
const AddFrom = ref({ addstatus: 0 })                 //添加
const alertFrom = ref({})                //弹出图片详情
const status = ref([{ id: 0, name: '不启用' }, { id: 1, name: '启用' },])
const isdisable = ref(false)


onMounted(async () => {
  await render()
})
const render = async () => {
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/admin/slides'
  axiosConfig.value.params = {
    current: 1
  }
  try {
    const res = await httpInstance(axiosConfig)
    if (res) {
      CarouselList.value = res.data.data
    }
  } catch (err) {
    console.log(err)
  }
}
//获取当前焦点图片的索引
const handleCarouselChange = (index) => {
  //获取当前焦点图片的id
  if (index != 0) {
    idRef.value = CarouselList.value[index].id
  }
}
//添加
const AddCarousel = async () => {
  axiosConfig.value.url = '/api/admin/slides'
  axiosConfig.value.methods = 'post'
  axiosConfig.value.params = {
    title: AddFrom.value.addtitle,
    img: AddFrom.value.addimg,
    url: AddFrom.value.addurl,
    status: Number(AddFrom.value.addstatus)
  }
  try {
    console.log(axiosConfig.value)
    const res = await httpInstance(axiosConfig)
    if (res.status == 201) {
      alert('成功了')
      render()
      dialogFormVisible_add.value = false
    }
  } catch (err) {
    console.log(err)
  }
}
//详情
const DetailCarousel = async (num) => {
  isdisable.value = true
  dialogFormVisible_switch.value = false
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = `/api/admin/slides/${idRef.value}`
  axiosConfig.value.params = {}
  try {
    const res = await httpInstance(axiosConfig)
    alertFrom.value = res.data
    if (num != 1) {
      dialogFormVisible.value = true
    }
  } catch (err) {
    console.log(err)
  }
}
//删除
const DeleteCarousel = async () => {
  console.log(idRef.value)
  axiosConfig.value.methods = 'DELETE'
  axiosConfig.value.url = `/api/admin/slides/${idRef.value}`
  axiosConfig.value.params = {}
  dialogFormVisible_switch.value = false
  try {
    await httpInstance(axiosConfig)
    render()
  } catch (err) {
    alert('err')
    console.log(err)
  }
  // axiosConfig.value.method = 'DELETE'
  // axiosConfig.value.url = `/admin/slides/${idRef.value}`
  // axiosConfig.value.params = {}
  // dialogFormVisible_switch.value = false
}
// 修改
const updatedCarousel = async () => {
  await DetailCarousel(1)
  dialogFormVisible_switch.value = false
  isdisable.value = false
  dialogFormVisible.value = true


}
const Switch = async () => {
  dialogFormVisible.value = false
  if (isdisable.value == false) {
    axiosConfig.value.url = `/api/admin/slides/${alertFrom.value.id}`
    axiosConfig.value.methods = 'put'
    axiosConfig.value.params = {
      title: alertFrom.value.title,
      img: alertFrom.value.img_url
    }
    if (alertFrom.value.url != '') { axiosConfig.value.params.url = alertFrom.value.url }
    if (alertFrom.value.status != '') { axiosConfig.value.params.status = alertFrom.value.status }
    try {
      // console.log(axiosConfig.value)
      const res = await httpInstance(axiosConfig)
      if (res.status == 204) {
        render()
      }
    } catch (err) {
      console.log(err)
    }

  }
}

const Delete = () => {
  if (idRef.value != '') {
    DeleteCarousel()
  }
}
//禁用
const ForbiddenCarousel = async () => {
  axiosConfig.value.methods = 'PATCH'
  axiosConfig.value.url = `/api/admin/slides/${idRef.value}/status`
  axiosConfig.value.params = {}
  dialogFormVisible_switch.value = false
  try {
    await httpInstance(axiosConfig)
    render()
  } catch (err) {
    console.log(err)
  }
}
// const Forbidden = () => {
//   if (idRef.value != '') {
//     DeleteCarousel()
//   }
// }



</script>


<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
  margin-top: 30px;
}

el-image {
  /* width: 910px; */
  height: 420px;
}
</style>
