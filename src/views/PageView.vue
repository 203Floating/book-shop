<script setup>
// import PageNav from "./Page/PageNav.vue"
import Header from './HeaderView.vue'

// import MainPage from "./Page/MainPage.vue"

</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <div class="container">
          <keep-alive>
            <router-view></router-view>

          </keep-alive>
        </div>
        <!-- <MainPage></MainPage> -->
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>

  </div>
</template>


<style scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
</style>
