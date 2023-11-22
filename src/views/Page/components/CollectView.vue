<!--
 * @Author: Harriette Renner 203877404@qq.com
 * @Date: 2023-11-01 16:35:13
 * @LastEditors: Harriette Renner 203877404@qq.com
 * @LastEditTime: 2023-11-07 15:14:37
 * @FilePath: \book-shop-js\src\views\Page\components\CollectView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
import { ref, onMounted } from 'vue';
<template>
  <div>
    <el-row>
      <el-col>
        <el-table :data="datalist" style="width: 100%">
          <el-table-column label="商品">
            <template #default="scope">
              <el-col v-if="scope.row.goods">
                <el-image :src="scope.row.goods.cover_url" style="width: 100px; height: 100px" />
              </el-col>
              <el-col v-else>
                <el-icon>
                  <icon-picture />
                </el-icon>
              </el-col>
            </template>
          </el-table-column>
          <!-- 第一个表格的列 -->
          <!-- <el-table-column fixed prop="user_id" label="用户名" class="custom-table-cell" /> -->
          <el-table-column prop="goods_id" label="商品名" />
          <el-table-column prop="created_at" label="添加时间" />
          <el-table-column prop="updated_at" label="修改时间" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button link @click="Uncollect(scope.row.goods_id)">取消收藏</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-row>
      <el-pagination layout="prev,pager,next" :current_page="paginationlist.current_page"
        :total="paginationlist.total_pages * 10" @current-change="handleCurrentChange"
        :page-size="paginationlist.per_page">
      </el-pagination>
    </el-row>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import httpInstance from '../../../utils/api'
//配置对象
const axiosConfig = ref({})
//接收数据
const datalist = ref([])
const paginationlist = ref({})
const current = ref(1)//当前分页
onMounted(async () => {
  await loader()
})
//loader
const loader = async () => {
  axiosConfig.value.methods = 'get'
  axiosConfig.value.url = '/api/collects'
  axiosConfig.value.params = {
    page: current.value
  }
  console.log(axiosConfig.value)
  try {
    await httpInstance(axiosConfig).then(res => {
      datalist.value = res.data.data
      paginationlist.value = res.data.meta.pagination
      console.log('paginationlist.value：', paginationlist.value)
      console.log('paginationlist.value.per_page：', paginationlist.value.per_page)
      console.log('paginationlist.value.current_page：', paginationlist.value.current_page)
    })
  } catch (err) {
    console.log(err)
  }
}
//取消收藏
const Uncollect = async (id) => {
  axiosConfig.value.methods = 'post'
  axiosConfig.value.url = `/api/collects/goods/${Number(id)}`

  console.log(axiosConfig.value)
  try {
    await httpInstance(axiosConfig).then(res => {
      console.log(res)
      loader()
    })
  } catch (err) {
    console.log(err)
  }
}
//切换分页
const handleCurrentChange = (num) => {
  console.log('当前分页是：', num)
  current.value = num
  loader()
}
</script>