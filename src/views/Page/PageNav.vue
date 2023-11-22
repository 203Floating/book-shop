<template>
  <el-row class="tac">
    <el-col :span="24">
      <h5 class="mb-2">Custom colors</h5>
      <el-menu class="el-menu-vertical-demo" default-active="1" @open="handleOpen" @close="handleClose">



        <el-menu-item index="1" @click="router.push({
          name: 'FrontPage',
        })">
          <el-icon><icon-menu /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2" @click="router.push({
          name: 'Goods'
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>商品</span>
        </el-menu-item>
        <el-menu-item index="3" @click="router.push({
          name: 'UserCenter',
        })">
          <el-icon>
            <setting />
          </el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="4" @click="router.push({
          name: 'ShopingCart',
        })">
          <el-icon>
            <setting />
          </el-icon>
          <span>购物车</span>
        </el-menu-item>
        <el-menu-item index="5" @click="router.push({
          name: 'OrderView',
        })">
          <el-icon>
            <setting />
          </el-icon>
          <span>订单</span>
        </el-menu-item>
        <el-menu-item index="6" @click="router.push({
          name: 'PayView',
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>支付</span>
        </el-menu-item>
        <el-menu-item index="7" @click="router.push({
          name: 'AddressView',
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>地址管理</span>
        </el-menu-item>
        <el-menu-item index="8" @click="router.push({
          name: 'CollectView',
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>收藏</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Setting,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
