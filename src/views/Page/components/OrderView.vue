<template>
  <div>
    <el-row>
      <el-col>
        <el-table :data="carts" style="width: 100%">
          <el-table-column label="商品">
            <template #default="scope">
              <el-col>
                <el-image :src="scope.row.goods.cover_url" :title="scope.row.goods.title"
                  style="width: 100px; height: 100px" />
              </el-col>
            </template>
          </el-table-column>
          <!-- 第一个表格的列 -->
          <!-- <el-table-column fixed prop="user_id" label="用户名" class="custom-table-cell" /> -->
          <el-table-column prop="goods_id" label="商品名" />
          <el-table-column prop="user_id" label="购买的用户" />
          <el-table-column prop="num" label="数量" />
          <el-table-column prop="goods.price" label="价格" />
          <el-table-column label="总价">
            <template #default="scope">
              总价：{{ scope.row.goods.price * scope.row.num }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">总计：{{ total_price }}</el-col>
      <el-col :span="2"></el-col>
      <el-col :span="8">
        <el-select v-model="addressId">
          <el-option v-for="item in address" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col><el-col :span="1"></el-col>
      <!-- <el-col :span="2"><el-button type="primary" @click="Payment(0)">微信支付</el-button></el-col> -->
      <el-col :span="2"><el-button type="primary" @click="Payment(1)">支付宝支付</el-button></el-col>

      <el-col :span="1"></el-col>
      <!-- <el-col :span="2"><el-button type="primary" @click="ToOrder()">地址</el-button></el-col> -->
      <el-col :span="2"><el-button type="primary" @click="router.push({
        name: 'OrderList',
      })">订单</el-button></el-col>
    </el-row>
  </div>
</template>

<script setup>

//导入element图标
import {
  // Plus,
  // Minus,
  // ShoppingTrolley
} from '@element-plus/icons-vue'
// import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import httpInstance from "../../../utils/api"
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()

//获取地址列表
const addressId = ref()
const orderId = ref()
//接受地址和购物车信息
const address = ref('选择地址')
const carts = ref([])
//加载数据
onMounted(async () => {
  await loader()

})

const loader = () => {
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/orders/preview'
  httpInstance(axiosConfig).then(res => {
    address.value = res.data.address
    carts.value = res.data.carts
  })
}

//总价
const total_price = computed(() => {
  let total = 0
  carts.value.forEach(item => {
    total += item.goods.price
  })
  return total
})


//提交订单
const ToOrder = async () => {
  // router.push({
  //   name: 'AddressView',
  // })
  axiosConfig.value.params = {
    address_id: String(addressId.value)
  }
  axiosConfig.value.url = '/api/orders'
  axiosConfig.value.methods = 'post'
  console.log(axiosConfig.value)
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 200) {
      orderId.value = res.data.id
      loader()
    }
  } catch (err) {
    console.log(err)
  }
}
// const aliyun = ref()
// const weichat = ref()
//支付
const Payment = async () => {
  await ToOrder()
  axiosConfig.value.methods = 'patch'
  axiosConfig.value.url = `/api/orders/${orderId.value}/paytest`
  axiosConfig.value.params = {
    type: "aliyun"
  }
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 200) {
      // await getQrCode()
      ElMessage({
        type: 'success',
        message: "支付成功"
      })
      loader()
    }
  } catch (err) {
    console.log(err)
  }
}
//获取支付二维码
// const getQrCode = async () => {
//   axiosConfig.value.methods = 'get'
//   axiosConfig.value.url = `/api/orders/${orderId.value}/pay`
//   axiosConfig.value.params = {
//     type: "aliyun"
//   }
//   try {
//     const res = await httpInstance(axiosConfig)
//     console.log(res)
//     if (res.status == 200) {
//       alert('成功')
//     }

//   } catch (err) {
//     console.log(err)
//   }
// }

//定义一个对象存放请求的配置数据
const axiosConfig = ref({ params: {} })




</script>