<template>
  <el-container style="height: 100%">
    <el-header>
      <layout-header/>
    </el-header>
    <el-main style="padding: 0">
      <transition name="el-fade-in-linear">
        <router-view/>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import layoutHeader from "@/components/header";

export default {
  name: "index",
  components: {
    layoutHeader
  },
}
</script>

<style scoped>
.el-header {
  padding: 0;
}
</style>