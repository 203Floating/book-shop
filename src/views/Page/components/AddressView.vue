<template>
  <div>
    <h3>地址管理</h3>

    <el-table :data="datalist" style="width: 100%">
      <el-table-column label="收货人">
        <template #default="scope">
          <el-button link @click="Detail(scope.row.id)">
            {{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template #default="scope">
          <el-button link @click="Detail(scope.row.id)">
            {{ scope.row.phone }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="省" />
      <el-table-column prop="city" label="市" />
      <el-table-column prop="county" label="区" />
      <el-table-column prop="address" label="详细地址" />
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
            icon-color="#626AEF" title="你确定要将该商品移出购物车?" @confirm="Delete(scope.row.id)" @cancel="Nothing">
            <template #reference>
              <el-button link type="primary" size="small">删除地址</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
            icon-color="#626AEF" title="确定要更新吗?" @confirm="Updata(scope.row.id)" @cancel="Nothing">
            <template #reference>
              <el-button link type="primary" size="small">更新地址</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
            icon-color="#626AEF" title="确定要设置为默认吗?" @confirm="Acquiesce(scope.row.id)" @cancel="Nothing">
            <template #reference>
              <el-button link type="primary" size="small">设为默认</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" width="560px">
      <el-form :model="alertFrom">
        <el-form-item label="收货人姓名:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.name" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="手机号:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.phone" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="省：" :label-width="100 + 'px'" v-if="!isdisable">
          <template #default>
            <el-select v-model="addresslist.level1" @change="changeCity" :disabled="isdisable">
              <el-option v-for="item in addresslist.province" :key="item.id" :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="省：" :label-width="100 + 'px'" v-else>
          <el-input v-model="alertFrom.province" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="市：" :label-width="100 + 'px'" v-if="!isdisable">
          <template #default>
            <el-select v-model="addresslist.level2" @change="changeCounty" :disabled="isdisable">
              <el-option v-for="item in addresslist.city" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="市：" :label-width="100 + 'px'" v-else>
          <el-input v-model="alertFrom.city" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="县：" :label-width="100 + 'px'" v-if="!isdisable">
          <template #default>
            <el-select v-model="addresslist.level3" :disabled="isdisable">
              <el-option v-for="item in addresslist.county" :key="item.id" :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="县：" :label-width="100 + 'px'" v-else>
          <el-input v-model="alertFrom.county" :disabled="isdisable" />
        </el-form-item>
        <el-form-item label="详细地址：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.address" :disabled="isdisable" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ToUpdate">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-row>
      <el-col :span="3">
        <el-input v-model="addresslist.name" placeholder="收货人" />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="3">
        <el-input v-model="addresslist.phone" placeholder="手机号" />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-select v-model="addresslist.level1" @change="changeCity">
          <el-option v-for="item in addresslist.province" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-select v-model="addresslist.level2" @change="changeCounty">
          <el-option v-for="item in addresslist.city" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="2">
        <el-select v-model="addresslist.level3">
          <el-option v-for="item in addresslist.county" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col><el-col :span="1"></el-col>
      <el-col :span="3">
        <el-input v-model="addresslist.address" placeholder="详细地址" />
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="3">
        <el-button type="success" @click="Address">添加地址</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import httpInstance from '../../../utils/api'
import { ref, onMounted } from 'vue'



const isdisable = ref(true)
const alertFrom = ref({})
//打开或关闭模态框
const dialogFormVisible = ref(false)
const axiosConfig = ref({})
const addresslist = ref({
  province: [],
  city: [],
  county: [],
})
const datalist = ref([])
// 渲染获取地址
const loader = async () => {
  try {
    axiosConfig.value.methods = 'get'
    axiosConfig.value.url = '/api/address'
    const res = await httpInstance(axiosConfig)
    console.log(res)
    datalist.value = res.data.data
  } catch (err) {
    console.log(err)
  }
}
//添加地址
const Address = async () => {
  axiosConfig.value.methods = 'post'
  axiosConfig.value.url = '/api/address'
  axiosConfig.value.params = {
    name: addresslist.value.name,
    phone: addresslist.value.phone,
    address: addresslist.value.address,
    province: addresslist.value.province[String(addresslist.value.level1)].name,
    city: addresslist.value.city[String(addresslist.value.level2)].name,
    county: addresslist.value.county[String(addresslist.value.level3)].name
  }
  try {
    await httpInstance(axiosConfig)
    loader()
  } catch (err) {
    console.log(err)
  }
}
const ToUpdate = async () => {
  if (isdisable.value == false && dialogFormVisible.value == true) {
    axiosConfig.value.methods = 'put'
    axiosConfig.value.url = `/api/address/${alertFrom.value.id}`
    axiosConfig.value.params = {
      name: alertFrom.value.name,
      phone: alertFrom.value.phone,
      address: alertFrom.value.address,
      province: addresslist.value.province[String(addresslist.value.level1)].name,
      city: addresslist.value.city[String(addresslist.value.level2)].name,
      county: addresslist.value.county[String(addresslist.value.level3)].name
    }
    try {
      console.log(axiosConfig.value)
      await httpInstance(axiosConfig).then(res => {
        if (res.status == 204) {
          loader()
          dialogFormVisible.value = false
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}
//更新
const Updata = async (id) => {
  isdisable.value = false
  dialogFormVisible.value = true
  alertFrom.value.id = id

}
//详情
const Detail = async (id) => {
  axiosConfig.value.url = `/api/address/${id}`
  axiosConfig.value.methods = 'get'
  axiosConfig.value.params = {}
  try {
    const res = await httpInstance(axiosConfig)
    console.log(res)
    alertFrom.value.name = res.data.name
    alertFrom.value.phone = res.data.phone
    alertFrom.value.address = res.data.address
    alertFrom.value.province = res.data.province
    alertFrom.value.city = res.data.city
    alertFrom.value.county = res.data.county
  } catch (err) {
    console.log(err)
  }
  dialogFormVisible.value = true
}

//删除
const Delete = async (id) => {
  axiosConfig.value.url = `/api/address/${id}`
  axiosConfig.value.methods = 'delete'
  axiosConfig.value.params = {}
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 204) {
      loader()
    }
  } catch (err) {
    console.log(err)
  }
}

//设置为默认
const Acquiesce = async (id) => {
  axiosConfig.value.url = `/api/address/${id}/default`
  axiosConfig.value.methods = 'patch'
  axiosConfig.value.params = {}
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 204) {
      loader()
    }
  } catch (err) {
    console.log(err)
  }
}










//获取省
const getprovince = async () => {
  axiosConfig.value.params = {}
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/city'
  try {
    const res = await httpInstance(axiosConfig)
    addresslist.value.province = res.data
  } catch (err) {
    console.log(err)
  }
}
const changeCity = async () => {
  axiosConfig.value.params = {
    pid: addresslist.value.level1
  }
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/city'
  try {
    const res = await httpInstance(axiosConfig)
    addresslist.value.city = res.data
  } catch (err) {
    console.log(err)
  }
}
const changeCounty = async () => {
  axiosConfig.value.params = {
    pid: addresslist.value.level2
  }
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/city'
  try {
    const res = await httpInstance(axiosConfig)
    addresslist.value.county = res.data
    console.log('addresslist.value.county', addresslist.value.county)
  } catch (err) {
    console.log(err)
  }
}
onMounted(async () => {
  await loader()
  await getprovince()
})
</script>
