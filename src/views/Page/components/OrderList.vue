<template>
  <div>
    <el-table :data="datalist" style="width: 100%">
      <el-table-column prop="order_no" label="单号" />
      <!-- <el-table-column prop="amout" label="总价" /> -->
      <el-table-column prop="user_id" label="购买的用户" />
      <el-table-column prop="status" label="订单状态" />
      <el-table-column prop="address_id" label="收货地址" />
      <el-table-column label="快递类型">
        <template #default="scope">
          <el-button link @click="Detail(scope.row.id)">
            {{ scope.row.express_type }}001
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="express_type" label="快递类型" />
      <!-- <el-table-column prop="express_no" label="快递号" /> -->
      <el-table-column prop="pay_time" label="支付时间" />
      <el-table-column prop="pay_type" label="支付类型" />
      <!-- <el-table-column prop="trade_no" label="支付流水号" /> -->
      <el-table-column>
        <template #default="scope">
          <el-button @click="Toorder(scope.row.id, scope.row.status, scope.row.order_no)">支付</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="9"></el-col>
      <el-col :span="9">
        <!-- 分页 -->
        <el-pagination background layout="prev,pager,next" :page-size="currentlist.per_page"
          :current_page="currentlist.current_page" :total="currentlist.total_pages * 10"
          @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </el-row>
  </div>

  <el-row>
    <el-dialog v-model="dialogFormVisible" width="560px">
      <el-form :model="alertFrom">
        <el-form-item label="快递公司:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.ShipperCode" disabled />
        </el-form-item>
        <el-form-item label="快递单号:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.LogisticCode" disabled />
        </el-form-item>
        <el-form-item label="响应内容：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.Reason" disabled />
        </el-form-item>
        <el-form-item label="物流轨迹：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.Traces" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script setup>
import httpInstance from '../../../utils/api'
import { ref, onMounted } from 'vue'

const dialogFormVisible = ref(false)
const alertFrom = ref({})
const axiosConfig = ref({})
const datalist = ref([])
const currentlist = ref({})
const loader = async () => {
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/orders'
  // axiosConfig.value.params = {}
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 200) {
      datalist.value = res.data.data
      currentlist.value = res.data.meta.pagination
    }
  } catch (err) {
    console.log(err)
  }
}
onMounted(async () => {
  await loader()
})
//切换分页
const handleCurrentChange = async (num) => {
  axiosConfig.value.params = {
    page: num
  }
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/orders'
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 200) {
      datalist.value = res.data.data
    }
  } catch (err) {
    console.log(err)
  }
}
//支付
const Toorder = async (id, status, order_no) => {
  if (status == 1) {
    console.log(id)
    console.log(order_no)
    axiosConfig.value.methods = 'get'
    axiosConfig.value.url = `/api/orders/${order_no}/pay`
    axiosConfig.value.params = {
      type: "aliyun"
    }
    try {
      const res = await httpInstance(axiosConfig)
      if (res.status == 200) {
        // await getQrCode()
        loader()
      }

    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('已经支付过了亲')
  }

}
//物流
const Detail = async (id) => {
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = `/api/orders/${id}/express`
  axiosConfig.value.params = {}
  console.log(axiosConfig.value)
  await httpInstance(axiosConfig).then(res => {
    if (res.status == 200) {
      alertFrom.value = res.data
      dialogFormVisible.value = true
    }
  })
}
</script>