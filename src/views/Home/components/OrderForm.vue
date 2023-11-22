<template>
  <el-row>
    <el-col :span="10"></el-col>
    <el-col :span="2" style="font-size: 30px; font-weight: 700;">订单管理</el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="4">
      <!-- 分页搜索 -->
      <el-input v-model="IptData.order_no" placeholder="订单单号"></el-input>
    </el-col><el-col :span="2"></el-col>
    <el-col :span="4">
      <!-- 商品名模糊搜索 -->
      <el-input v-model="IptData.trade_no" placeholder="支付流水号"></el-input>
    </el-col><el-col :span="2"></el-col>
    <el-col :span="4">
      <!-- 评论等级 -->
      <el-select v-model="IptData.statusRef" @change="ChangeComments()">
        <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-col>
    <el-col :span="2">
      <el-button text @click="Search" type="danger">搜索</el-button>
    </el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="2"></el-col>
    <el-col :span="20">
      <el-table :data="datalist" style="width: :100%">
        <el-table-column prop="address_id" label="收货地址" />
        <el-table-column prop="user_id" label="创建者" />
        <el-table-column prop="order_no" label="订单单号" />
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column prop="amount" label="总价" width="120" />
        <el-table-column prop="express_type" label="快递类型" width="100" />
        <el-table-column prop="express_no" label="快递号" width="200" />
        <el-table-column prop="trade_no" label="流水号" />
        <!-- <e-table-column prop="pay_time" label="支付时间"/>
        <e-table-column prop="pay_type" label="支付类型"/> -->
        <el-table-column fixed="right" label="操作" width="160">
          <template #default="scope">
            <el-button link type="primary" size="small"
              @click="Detail(scope.row.id, scope.row.express_type, scope.row.express_no)">订单详情</el-button>
            <el-button link type="primary" size="small"
              @click="DelicerGoods(scope.row.id, scope.row.express_type, scope.row.express_no)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <div style="height: 20px;"></div>
  <el-row>
    <el-col :span="8"></el-col>
    <!-- 分页 -->
    <el-col :span="8">
      <el-pagination layout="prev,pager,next" :page-size="currentlist.per_page" :current_page="currentlist.current_page"
        :total="currentlist.total_pages" @current-change="handleCurrentChange">
      </el-pagination>
    </el-col>
  </el-row>
  <!-- //显示详细信息 -->
  <el-row>
    <el-dialog v-model="dialogFormVisible">
      <el-form :model="alertFrom">
        <el-form-item label="ID:" :label-width="80 + 'px'" v-if="isId">
          <el-input v-model="alertFrom.id" disabled />
        </el-form-item>
        <el-form-item label="单号:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.order_no" disabled />
        </el-form-item>
        <el-form-item label="创建者:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.user_id" disabled />
        </el-form-item>
        <el-form-item label="总价:" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.amount" disabled />
        </el-form-item>
        <el-form-item label="状态" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.status" disabled />
        </el-form-item>
        <el-form-item label="收获地址" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.address_id" disabled />
        </el-form-item>
        <el-form-item label="快递类型：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.express_type" disabled />
        </el-form-item>
        <el-form-item label="快递号：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.express_no" disabled />
        </el-form-item>
        <el-form-item label="支付时间：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.pay_time" disabled />
        </el-form-item>
        <el-form-item label="支付类型：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.pay_type" disabled />
        </el-form-item>
        <el-form-item label="支付流水号：" :label-width="100 + 'px'">
          <el-input v-model="alertFrom.trade_no" disabled />
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
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'

const alertFrom = ref({})
//弹出框的显示
const dialogFormVisible = ref(false)
const IptData = ref({
  order_no: '',
  trade_no: '',
})
//自定义的星级下拉列表
const status = ref([
  {
    id: '1',
    name: '下单'
  },
  {
    id: '2',
    name: '支付'
  },
  {
    id: '3',
    name: '发货'
  },
  {
    id: '4',
    name: '收获'
  },
  {
    id: '5',
    name: '过期'
  },
])
//获取储存在session里面的token
const token = sessionStorage.getItem('token')
const headers = { 'Authorization': token }
// 基地址
const baseUrl = 'https://api.shop.eduwork.cn/api'
//d定义一个对象存放请求的配置数据
const axiosConfig = ref({ params: {} })
//定义一数组接受表格数据
const datalist = ref([])
//定义数组接受分页数据
const currentlist = ref([])
// 从服务器端请求数据
onMounted(() => {
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/admin/orders'
  axiosConfig.value.params = {
    current: 1
  }
  loadComments()
})
const loadComments = async () => {
  await axios({
    baseURL: baseUrl,
    url: axiosConfig.value.url,
    method: axiosConfig.value.method,
    headers: headers,
    params: axiosConfig.value.params
  }).then(res => {
    datalist.value = res.data.data
    currentlist.value = res.data.meta.pagination
    console.log(datalist.value)
  })
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
  axiosConfig.value.url = '/admin/orders'
  loadComments()

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
  axiosConfig.value.url = '/admin/orders'
  loadComments()
}
// 搜索
const Search = () => {
  axiosConfig.value.params = {
    current: 1
  }
  if (IptData.value.trade_no != '') {
    axiosConfig.value.params.trade_no = IptData.value.trade_no
  }
  if (IptData.value.statusRef != '') {
    axiosConfig.value.params.status = IptData.value.statusRef
  }
  if (IptData.value.order_no != '') {
    axiosConfig.value.params.order_no = IptData.value.order_no
  }
  axiosConfig.value.method = 'get'
  axiosConfig.value.url = '/admin/orders'
  loadComments()
}
//订单详情
const Detail = async (order_id) => {
  const res = await axios.get(`https://api.shop.eduwork.cn/api/admin/orders/${order_id}`, {
    headers: headers,
  })
  console.log(res.data)
  alertFrom.value = res.data
  dialogFormVisible.value = true
}
//订单发货
const DelicerGoods = async (id, type, no) => {
  if (type == '' || no == '') {
    ElNotification({
      title: 'Warning',
      message: '该商品不能发货',
      type: 'warning',
    })
  } else {
    try {
      await axios({
        url: `https://api.shop.eduwork.cn/api/admin/orders/${id}/post`,
        method: 'patch',
        headers: headers,
        params: {
          express_type: type,
          express_no: no
        }
      })
      ElNotification({
        title: 'Success',
        message: '发货成功',
        type: 'success',
      })
    } catch (err) {
      ElNotification({
        title: 'Error',
        message: 'T发货失败',
        type: 'error',
      })
    }

  }

}

</script>