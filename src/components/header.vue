<template>
  <el-header>
    <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        router
        background-color="#545c64"
        text-color="#fff"
        @select="handleSelect"
        active-text-color="#ffd04b"
        style="border-bottom: 0;"
    >
      <el-menu-item index="/traSearch">轨迹查询</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>

export default {
  name: "layoutHeader",
  data() {
    return {
      activeIndex: '/allCars',
    }
  },
  methods: {
    handleSelect(index) {
      sessionStorage.setItem("activeIndex", index)
    }
  },
  created() {
    if (sessionStorage.getItem("activeIndex")) {
      this.activeIndex = sessionStorage.getItem("activeIndex")
    }
  },
  watch: {
  }
}
</script>

<style scoped>
/deep/ .el-menu--horizontal>.el-menu-item.is-active {
  font-weight: bold;
}

/deep/ .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
  font-weight: bold;
}
</style>