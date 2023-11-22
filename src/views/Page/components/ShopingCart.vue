<template>
  <div class="goods_list">
    <!-- 表格 -->
    <el-table ref="multipleTableRef" :data="datalist" class="shopping-table" @selection-change="handleSelectionChange">
      <!-- 第一个表格的列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column fixed prop="user_id" label="用户名" class="custom-table-cell" />
      <el-table-column prop="goods_id" label="商品名" />
      <el-table-column label="数量">
        <template #default="scope">
          <el-button link @click="ChangeNum(scope.row.id, scope.row.num, 0)">
            <!-- SubNum(scope.row.id, scope.row.num) -->
            <el-icon>
              <Minus />
            </el-icon>
          </el-button>
          <div class="goods_num">{{ scope.row.num }}</div>
          <el-button link @click="ChangeNum(scope.row.id, scope.row.num, 1)">
            <el-icon>
              <Plus />
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-popconfirm width="220" confirm-button-text="必须滴" cancel-button-text="不了" :icon="InfoFilled"
            icon-color="#626AEF" title="你确定要将该商 品移出购物车?" @confirm="RemoveCart(scope.row.id)" @cancel="Nothing">
            <template #reference>
              <el-button link type="primary" size="small">移出购物车</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 地址 -->
    <el-row>
      <el-col :span="18"></el-col>
      <el-col :span="3">
        <el-button type='success' @click="Submit">提交购物车</el-button>
      </el-col>

    </el-row>
  </div>
</template>


<script setup>
import { onMounted, ref } from "vue"
import httpInstance from "../../../utils/api"
// import axios from "axios"
import { useRouter } from "vue-router"
import { ElMessage } from 'element-plus'
import {
  Plus,
  Minus,
  // ShoppingTrolley
} from "@element-plus/icons-vue"

const router = useRouter()

const selectlist = ref([])//定义一个选中行的列表
//表格对象
const datalist = ref([])
//新建一个对象，这个对象保存axios的配置
const axiosConfig = ref({})


const loader = async () => {
  axiosConfig.value.methods = "get"
  axiosConfig.value.url = "/api/carts"
  await httpInstance(axiosConfig).then((res) => {
    datalist.value = res.data.data
  })
}
//渲染商品列表
onMounted(async () => {
  await loader()

})
//商品减少
//商品数量增加
const ChangeNum = async (id, num, temp) => {
  if (temp === 0) {
    if (num > 1) num = num - 1
    else num = 1
  }
  else {
    num = num + 1
  }
  console.log(id)
  console.log(num)
  axiosConfig.value.methods = 'put'
  axiosConfig.value.url = `/api/carts/${String(id)}`
  axiosConfig.value.params = {
    num: String(num)
  }
  await httpInstance(axiosConfig).then(function () {
    loader()
  })
} //移除商品
const RemoveCart = async (id) => {
  axiosConfig.value.methods = "delete"
  axiosConfig.value.url = `/api/carts/${id}`

  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 204) {
      ElMessage({
        type: 'success',
        message: '移除成功'
      })
      loader()
    }
  } catch (err) {
    ElMessage({
      type: 'error',
      message: '移出失败'
    })
  }
}
// 选中商品
const handleSelectionChange = (selectedRows) => {
  console.log(selectedRows)
  selectlist.value = []
  selectedRows.forEach((item) => {
    selectlist.value.push(item.id)
  })
}

const Submit = () => {
  axiosConfig.value.methods = "PATCH"
  axiosConfig.value.url = "/api/carts/checked"
  axiosConfig.value.params = {
    cart_ids: selectlist.value
  }
  httpInstance(axiosConfig).then((res) => {
    if (res.status == 204) {
      router.push({
        name: "OrderView",
      })
    }
  })
}



</script>

<style scoped>
.goods_list {
  width: 1200px;
  margin: 0 auto;
}

.goods_num {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: red;
  margin: 0 4px 0 4px;
  border-bottom: 1px solid red;
}


.shopping-table {
  width: 100%;
  margin-bottom: 20px;
}
</style>
