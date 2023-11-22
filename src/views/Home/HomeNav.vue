<template>
  <el-row class="tac">
    <el-col :span="24">
      <h5 class="mb-2">Custom colors</h5>
      <el-menu class="el-menu-vertical-demo" default-active="1" @open="handleOpen" @close="handleClose">





        <el-menu-item index="1" @click="router.push({
          name: 'GoodsView'
        })">
          <el-icon><icon-menu /></el-icon>
          <span>商品</span>
        </el-menu-item>
        <el-menu-item index="2" @click="router.push({
          name: 'UserView'
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>用户</span>
        </el-menu-item>
        <el-menu-item index="3" @click="router.push({
          name: 'CateGory',
        })">
          <el-icon>
            <setting />
          </el-icon>
          <span>分类</span>
        </el-menu-item>
        <el-menu-item index="4" @click="router.push({
          name: 'Comments',
        })">
          <el-icon>
            <setting />
          </el-icon>
          <span>评价</span>
        </el-menu-item>
        <el-menu-item index="5" @click="router.push({
          name: 'OrderForm',
        })">
          <el-icon>
            <setting />
          </el-icon>
          <span>订单</span>
        </el-menu-item>
        <el-menu-item index="6" @click="router.push({
          name: 'Carousel'
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>轮播</span>
        </el-menu-item>
        <el-menu-item index="7" @click="router.push({
          name: 'Links'
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>友情链接</span>
        </el-menu-item>
        <el-menu-item index="8" @click="router.push({
          name: 'Menu'
        })">
          <el-icon>
            <document />
          </el-icon>
          <span>菜单管理</span>
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
