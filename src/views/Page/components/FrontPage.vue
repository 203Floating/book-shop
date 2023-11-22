<template>
  <!-- 轮播图 -->
  <div>
    <el-carousel :interval="4000" type="card" height="300px" @change="handleCarouselChange">
      <el-carousel-item v-for="item in slider" :key="item.id">
        <el-image :src="item.img_url" alt="item.title" title="item.title" v-if="item.status != 0"
          @click="dialogFormVisible_switch = true" width="400px" />
      </el-carousel-item>
    </el-carousel>
  </div>
  <div class="h-6" />
</template>

<script setup>
// import axios from 'axios'
import { ref, onMounted } from 'vue'
import httpInstance from "../../../utils/api"
//推荐商品数据
const goods = ref([])
//轮播图数据
const slider = ref([])
//分类数据
const categories = ref()
onMounted(async () => {
  axiosConfig.value.url = '/api/index'
  axiosConfig.value.params = {}
  axiosConfig.value.method = 'get'

  httpInstance(axiosConfig).then(res => {
    slider.value = res.data.slides
    categories.value = res.data.categories
    goods.value = res.data.goods.data
    datalist.value = res.data
  })
})

// 处理分类数据
//定义一数组接受表格数据
const datalist = ref([])
// const headers = { 'Authorization': token }
//d定义一个对象存放请求的配置数据
const axiosConfig = ref({ params: {} })

</script>
<!-- <style scoped>
.example-showcase .el-dropdown-link {
  outline: none;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}


.demo-image .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}

.demo-image .block:last-child {
  border-right: none;
}

.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style> -->
