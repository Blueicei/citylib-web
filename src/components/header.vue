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
      style="border-bottom: 0"
    >
      <el-menu-item
        ><el-select
          v-model="dataSource"
          :placeholder="dataSourcePlaceHolder"
          @change="handleDataSource"
        >
          <el-option
            v-for="item in dataSourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
      ></el-menu-item>
      <el-menu-item index="/cityFlow">城市流量可视化</el-menu-item>
      <el-menu-item index="/dataProcess">数据预处理</el-menu-item>
      <el-menu-item index="/carTrajectory">车辆轨迹</el-menu-item>
      <el-menu-item index="/camFlow">卡口流量</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
import { Loading } from "element-ui";
export default {
  name: "layoutHeader",
  data() {
    return {
      activeIndex: "/allCars",
      dataSource: "",
      dataSourcePlaceHolder: "请选择数据源",
      dataSourceOptions: [],
    };
  },
  methods: {
    handleSelect(index) {
      sessionStorage.setItem("activeIndex", index);
    },
    getSources() {
      this.dataSourceOptions = [];
      this.axios.get("/camTra/getCamTraTableNameList").then((res) => {
        res.data.msg.forEach((item) => {
          this.dataSourceOptions.push({
            value: item,
            label: item,
          });
        });
      });
    },
    getCurrentTable() {
      this.axios.get("/camTra/getCurrentTable").then((res) => {
        this.dataSource = res.data.msg;
      });
    },
    handleDataSource() {
      let loading = Loading.service({ fullscreen: true, text: "Loading" });
      console.log(this.dataSource);
      this.axios
        .post("/camTra/changeDataSource?tableName=" + this.dataSource)
        .then((res) => {
          loading.close();
          console.log(res.data.msg);
        });
    },
  },
  created() {
    if (sessionStorage.getItem("activeIndex")) {
      this.activeIndex = sessionStorage.getItem("activeIndex");
    }
    // this.getSources()
  },
  mounted() {
    this.getSources();
    this.getCurrentTable();
  },
  watch: {},
};
</script>

<style scoped>
/deep/ .el-menu--horizontal > .el-menu-item.is-active {
  font-weight: bold;
}

/deep/ .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  font-weight: bold;
}
</style>
