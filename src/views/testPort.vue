<template>
  <el-container style="height: 100%">
    <el-aside width="25%">
      <el-tag class="table_header" effect="dark">设备列表</el-tag>
      <el-table
          v-loading="deviceTableLoading"
          element-loading-text="加载数据中"
          highlight-current-row
          :data="deviceTable.slice((deviceCurrentPage-1) * 5, deviceCurrentPage * 5)"
          ref="deviceTable"
          style="width: 100%">
        <el-table-column
            prop="id"
            align="center"
            label="设备编号"
        />
      </el-table>
      <el-pagination
          :current-page="deviceCurrentPage"
          :total='deviceTable.length'
          layout="prev, pager, next"
          :page-size="5"
      />
      <div v-if="showGPS">
        <el-tag type="warning" class="GPS_header" effect="dark">{{devID}}-详细路径</el-tag>
        <el-table
            v-loading="gpsTableLoading"
            element-loading-text="加载数据中"
            :data="gpsTable.slice((gpsCurrentPage-1) * 9, gpsCurrentPage * 9)"
            ref="gpsTable"
            style="width: 100%;-webkit-user-select: none;">
          <el-table-column
              prop="time"
              align="center"
              label="时间"
          />
          <el-table-column
              prop="lng"
              align="center"
              label="经度"
          />
          <el-table-column
              prop="lat"
              align="center"
              label="维度"
          />
        </el-table>
        <el-pagination
            :current-page="gpsCurrentPage"
            :total='gpsTable.length'
            layout="prev, pager, next"
            :page-size="9"
        />
      </div>
    </el-aside>
    <el-main style="padding: 0">
      <div class="mapView">
        <baidu-map
            class="map"
            :center="center"
            :zoom="zoom"
            @ready="handler"
            :auto-resize="true"
            :scroll-wheel-zoom="true"
        >
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        </baidu-map>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "cityFlow",
  data() {
    return {
      center: '济南',
      zoom: 13,
      baiduMap: null,
      baidumap: null,
      showGPS: false,
      deviceTable: [],
      gpsTable: [],
      deviceTableLoading: false,
      gpsTableLoading: false,
      deviceCurrentPage: 1,
      gpsCurrentPage: 1,
      devID: '',
      arrPois: [],
      lushu: undefined,
      playPause: false,
      play: false

    }
  },
  methods: {
    handler ({BMap, map}) {
      this.baiduMap = BMap
      this.baidumap = map
    },
    getDeviceList() {
      this.deviceTable = []
      this.deviceTableLoading = true
      this.axios.get('/camTra/listByCarNum?carNumber=0000652551').then(res => {
          console.log(res.data)
      })
    }
  },
  created() {
    this.getDeviceList()
  },
  watch: {

  }
}
</script>

<style scoped>
.mapView {
  width: 100%;
  height: 95%;
}
.map {
  width: 100%;
  height: 100%;
  display: flex;
}
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
.switchButton {
  float: left;
  margin-top: 3px;
  margin-bottom: 3px;
  margin-left: 5px;
}
/* 用来设置当前页面element全局table 选中某行时的背景色*/
/deep/ .el-table__body tr.current-row>td{
  background-color: #FFF0F5 !important;
  font-weight: bold;
}
/deep/ .el-table thead {
  color: #626066;
}
</style>