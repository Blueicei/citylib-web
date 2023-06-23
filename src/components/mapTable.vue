<template>
  <div class="tableView">
    <el-tag class="table_header" effect="dark">车辆列表</el-tag>
    <el-table
        v-loading="car_loading"
        element-loading-text="加载数据中"
        highlight-current-row
        :data="carTable.slice((car_current_page-1) * 5, car_current_page * 5)"
        @current-change="handleCurrentChange"
        ref="carTable"
        style="width: 100%">
      <el-table-column
          prop="id"
          align="center"
          label="车牌"
      >
      </el-table-column>
      <el-table-column
          prop="type"
          align="center"
          label="车型"
      >
      </el-table-column>
    </el-table>
    <el-pagination
        :current-page="car_current_page"
        :total='carTable.length'
        @current-change="handleCARpageChange"
        layout="prev, pager, next"
        :page-size="5"
    >
    </el-pagination>
    <div v-show="showGPS">
      <el-tag type="warning" class="GPS_header" effect="dark">详细行程</el-tag>
      <el-table
          v-loading="gps_loading"
          highlight-current-row
          element-loading-text="加载数据中"
          :data="gpsTable.slice((gps_current_page-1) * 12, gps_current_page * 12)"
          @current-change="handleGPSChange"
          :row-class-name="tableRowClassName"
          ref="pathTable"
          style="width: 100%">
        <el-table-column
            prop="time"
            align="center"
            label="时间"
        >
        </el-table-column>
        <el-table-column
            prop="addr"
            align="center"
            label="途径点"
        >
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="gps_current_page"
          :total='gpsTable.length'
          layout="prev, pager, next"
          @current-change="handleGPSpageChange"
          :page-size="12"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: "tableView",
  // 父组件传过来的详细行程表index
  props: ['curPathIndex'],
  data() {
    return {
      // 控制车辆表格加载
      car_loading:false,
      // 控制轨迹表格加载
      gps_loading:false,
      car_current_page: 1,
      gps_current_page: 1,
      // 控制详细行程显示
      showGPS:false,
      // 当前选中行
      currentRow: null,
      carTable: [],
      // 轨迹列表
      gpsTable:[]
    }
  },
  methods: {
    // 车辆表翻页控制
    handleCARpageChange(val) {
      this.car_current_page = val
    },
    // 轨迹表翻页控制
    handleGPSpageChange(val) {
      this.gps_current_page = val
    },
    handleClearMarker() {
      this.showGPS = false
    },
    // 选中轨迹表行的操作
    handleGPSChange(val) {
      this.$emit("transAddData", val)
    },
    // 选中车辆表行后的操作
    handleCurrentChange(val) {
      this.showGPS = true
      if (val != null) {
        let params = {id: val.id}
        this.gps_loading = true
        let data = []
        data.push(val.id)
        this.axios.get("/getCarById", {params}).then(res => {
          this.gpsTable = res.data.info
          data.push(this.gpsTable)
          this.$emit("transCarData", data)
          this.gps_current_page = 1
          this.gps_loading = false
        })
      }
    },
    // 获取车辆列表
    getCarList() {
      this.car_loading = true
      this.axios.get("/getCarList").then(res => {
        this.carTable = res.data
        this.car_loading = false
      })
    },
    tableRowClassName({rowIndex}) {
      if (this.curPathIndex > 0) {
        if (this.curPathIndex%12 === rowIndex || (this.curPathIndex-1)%12 === rowIndex) {
          return 'success-row';
        }
      }
      return '';
    },
  },
  mounted() {
    this.getCarList()
  },
  watch: {
    // 监听详细行程选中行的变化，用来控制下一段按钮的翻页
    curPathIndex:function () {
      this.gps_current_page = Math.floor(this.curPathIndex / 12 + 1)
    }
  }
}
</script>

<style scoped>
.GPS_header {
  font-size: 18px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
  width: 100%;
}
.table_header {
  font-size: 18px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
  width: 100%;
}
</style>

<style scoped>
/* 用来设置当前页面element全局table 选中某行时的背景色*/
/deep/ .el-table__body tr.current-row>td{
  background-color: #FFF0F5 !important;
  font-weight: bold;
  /* color: #f19944; */  /* 设置文字颜色，可以选择不设置 */
}

.el-table >>> .warning-row {
  background: oldlace;
}

.el-table >>> .success-row {
  background: #FFF5EE;
  font-weight: bold;
}
</style>