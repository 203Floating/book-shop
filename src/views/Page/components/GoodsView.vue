<template>
  <el-row class="header">
    <el-col :span="8"></el-col>
    <el-col :span="6">
      <el-input v-model="Search" placeholder="商品名模糊搜索" /> </el-col><el-col :span="1"></el-col>
    <el-col :span="2">
      <el-button type="primary" @click="SearchTitle">搜索</el-button>
    </el-col>
    <el-col :span="4"></el-col>
    <el-col :span="1">
      <el-button link @click="
        router.push({
          name: 'ShopingCart',
        })
        ">
        <el-icon>
          <ShoppingTrolley />
        </el-icon></el-button>
    </el-col>
    <el-col :span="1">
      <el-button type="primary" link @click="
        router.push({
          name: 'CollectView',
        })
        ">
        <el-icon>
          <Star />
        </el-icon>
      </el-button>
    </el-col>
    <el-col :span="1">
      <el-button type="primary" link @click="
        router.push({
          name: 'AddressView',
        })
        ">
        <el-icon>
          <LocationInformation />
        </el-icon>
      </el-button>
    </el-col>
  </el-row>
  <div class="slider">
    <FrontPage></FrontPage>
  </div>
  <div class="goods_nav">
    <!-- 导航栏 -->
    <el-row>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
        :style="{ 'max-width': '1200px' }">
        <el-sub-menu v-for="item in categories" :key="item.id" :index="item.id">
          <template #title>{{ item.name }}</template>
          <el-menu-item v-for="i in item.children" :key="i.id" :index="i.id" @click="changeGoods(item.id)">
            {{ i.name }}
          </el-menu-item>
        </el-sub-menu>
        <el-col :span="4"></el-col>
        <el-menu-item>
          <el-button link @click="Sort(1)">销量</el-button>
        </el-menu-item>
        <el-menu-item>
          <el-button link @click="Sort(2)">价格</el-button>
        </el-menu-item>
        <el-menu-item>
          <el-button link @click="Sort(3)">推荐</el-button>
        </el-menu-item>
        <el-menu-item>
          <el-button link @click="Sort(4)">评价</el-button>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
  <!-- 商品和分页 -->
  <div class="demo-image goods">
    <div v-for="fit in goods.data" :key="fit.id" class="block">
      <el-image style="width: 100px; height: 100px" :src="fit.cover_url" />
      <el-row>
        <el-col :span="4"></el-col>
        <el-col>
          <el-text class="w-150px mb-2" truncated>
            {{ fit.title }}
          </el-text>
          <el-text line-clamp="2">
            {{ fit.description }}
          </el-text>
          <div :style="{ height: 5 + 'px' }"></div>
          <el-row class="w-150px mb-2">
            <el-col :span="6"></el-col>
            <el-text>
              <span :style="{ color: 'red', fontSize: 20 + 'px' }">
                {{ fit.price }}
              </span>
              : 00
            </el-text>
            <el-text> <span>&nbsp; 库存:</span>{{ fit.stock }} </el-text>
          </el-row>
          <el-row>
            <el-col class="el-icon">
              <el-button link @click="ToShopping(fit.id)">
                <el-icon>
                  <ShoppingTrolley />
                </el-icon></el-button>
              <el-button link @click="Tocollect(fit.id)">
                <el-icon>
                  <Star />
                </el-icon></el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <!-- 分页 -->
    <el-row>
      <el-col :span="17"></el-col>
      <el-col :span="6">
        <el-pagination layout="prev,pager,next" :page-size="goods.per_page" :current_page="goods.current_page"
          :total="230" @current-change="handleCurrentChange" default-page-size="12">
          <!-- :total="currentlist.total_pages" -->
        </el-pagination>
      </el-col>
    </el-row>
  </div>
  <div class="Recomment_nav">
    <h1>热门推荐</h1>
  </div>
  <!-- 热门推荐 -->
  <div class="demo-image recommend">
    <div v-for="fit in recommend_goods" :key="fit.id" class="block">
      <el-image style="width: 100px; height: 100px" :src="fit.cover_url" />
      <el-row>
        <el-col :span="4"></el-col>
        <el-col>
          <el-text class="w-150px mb-2" truncated>
            {{ fit.title }}
          </el-text>
          <el-text line-clamp="2">
            {{ fit.description }}
          </el-text>
          <div :style="{ height: 5 + 'px' }"></div>
          <el-row class="w-150px mb-2">
            <el-col :span="6"></el-col>
            <el-text>
              <span :style="{ color: 'red', fontSize: 20 + 'px' }">
                {{ fit.price }}
              </span>
              : 00 <span>&nbsp; 库存:</span>{{ fit.stock }}
            </el-text>
          </el-row>
          <el-row>
            <el-col class="el-icon">
              <el-button link @click="ToShopping(fit.id)">
                <el-icon>
                  <ShoppingTrolley />
                </el-icon></el-button>
              <el-button link @click="Tocollect(fit.id)">
                <el-icon>
                  <Star />
                </el-icon></el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
//导入element图标
import {
  Star,
  ShoppingTrolley,
  LocationInformation,
} from "@element-plus/icons-vue"
//导入首页得轮播图
import FrontPage from "./FrontPage.vue"
import { ref, onMounted } from "vue"
import httpInstance from "../../../utils/api"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
const router = useRouter()
const activeIndex = ref("1")

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
const Search = ref()
const recommend_goods = ref()
//推荐商品数据
const goods = ref([0])
//分类数据
const categories = ref()
const sort_data = ref({
  sales: 1,
  recommend: 1,
  price: 1,
  comments_count: 1,
})
const category_id = ref()
onMounted(async () => {
  axiosConfig.value.url = "/api/goods"
  axiosConfig.value.params = {}
  axiosConfig.value.method = "get"
  httpInstance(axiosConfig).then((res) => {
    console.log(res)
    recommend_goods.value = res.data.recommend_goods
    categories.value = res.data.categories
    goods.value = res.data.goods
  })
})
//分页改变触发函数
const handleCurrentChange = (num) => {
  axiosConfig.value.url = "/api/goods"
  axiosConfig.value.params = {
    page: num,
  }
  axiosConfig.value.method = "get"
  httpInstance(axiosConfig).then((res) => {
    console.log(res)
    recommend_goods.value = res.data.recommend_goods
    categories.value = res.data.categories
    goods.value = res.data.goods
  })
}
//分类筛选
const changeGoods = async (id) => {
  axiosConfig.value.url = "/api/goods"
  category_id.value = id
  axiosConfig.value.params = {
    category_id: id,
  }
  axiosConfig.value.method = "get"
  await httpInstance(axiosConfig).then((res) => {
    console.log(res)
    recommend_goods.value = res.data.recommend_goods
    categories.value = res.data.categories
    goods.value = res.data.goods
  })
}

const SearchTitle = () => {
  axiosConfig.value.url = "/api/goods"
  axiosConfig.value.params = {
    title: Search.value,
  }
  axiosConfig.value.method = "get"
  try {
    httpInstance(axiosConfig).then((res) => {
      goods.value = res.data.goods
    })
  } catch (err) {
    console.log(err)
  }
  Search.value = ""
}
//排序判断函数
const Sort = async (num) => {
  if (num == 1) {
    axiosConfig.value.params = {
      sales: sort_data.value.sales == 1 ? 2 : 1,
    }
  }
  if (num == 2) {
    axiosConfig.value.params = {
      price: sort_data.value.price == 1 ? 2 : 1,
    }
  }
  if (num == 3) {
    axiosConfig.value.params = {
      recommend: sort_data.value.recommend == 1 ? 2 : 1,
    }
  }
  if (num == 4) {
    axiosConfig.value.params = {
      comments_countSort: sort_data.value.comments_countSort == 1 ? 2 : 1,
    }
  }
  if (category_id.value != "") {
    axiosConfig.value.params.id = category_id.value
  }
  axiosConfig.value.url = "/api/goods"
  axiosConfig.value.method = "get"
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 200) {
      recommend_goods.value = res.data.recommend_goods
      categories.value = res.data.categories
      goods.value = res.data.goods
      success("排序成功")
    }
  } catch (err) {
    error(err)
  }
}
//加入购物车
const ToShopping = async (id) => {
  axiosConfig.value.url = "/api/carts"
  axiosConfig.value.params = {
    goods_id: id,
    num: 1,
  }
  axiosConfig.value.methods = "post"
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 201) {
      success("添加成功")
    }
  } catch (err) {
    error(err)
  }
}
//收藏
const Tocollect = async (id) => {
  axiosConfig.value.url = `/api/collects/goods/${id}`
  axiosConfig.value.methods = "post"
  try {
    const res = await httpInstance(axiosConfig)
    if (res.status == 201) {
      success("收藏成功")
    }
  } catch (err) {
    error(err)
  }
}

const success = (title) => {
  ElMessage({
    type: "success",
    message: title,
  })
}
const error = (title) => {
  ElMessage({
    type: "error",
    message: title,
  })
}
//定义一个对象存放请求的配置数据
const axiosConfig = ref({ params: {} })
</script>

<style scoped>
/* //购物车图标 */
.el-icon {
  font-size: 14px;
  margin-left: 20%;
  margin-top: 4px;
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

.slider {
  margin-top: 30px;
}

.Recomment_nav {
  height: 50px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
