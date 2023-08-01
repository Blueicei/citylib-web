<template>
  <el-container style="height: 100%">
    <el-main style="padding: 0">
      <div class="mapView">
        <!-- 顶部按钮-->
        <div class="switchButton">
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="clearOverlay"
            size="mini"
            >清空覆盖物
          </el-button>
        </div>
        <div
          style="overflow: hidden; width: 100%; height: 100%; margin: 0"
          id="map"
        ></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Template from "@/views/template";

export default {
  name: "taxiDetail",
  components: {
    Template,
  },
  data() {
    return {
      // 地图中心
      center: "济南",
      // 缩放大小
      zoom: 12,
      // 存百度地图实例
      mapgl: null,
      predefineColors: [
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "#c7158577",
      ],
      sts: [
        {
          url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m0.png",
          size: new BMap.Size(32, 32),
          offset: new BMap.Size(-10, -10),
        },
        {
          url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m1.png",
          size: new BMap.Size(32, 32),
          offset: new BMap.Size(-12, -12),
        },
        {
          url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m2.png",
          size: new BMap.Size(32, 32),
          offset: new BMap.Size(-18, -18),
        },
        {
          url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m3.png",
          size: new BMap.Size(32, 32),
          offset: new BMap.Size(-23, -23),
        },
        {
          url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m4.png",
          size: new BMap.Size(32, 32),
          offset: new BMap.Size(-26, -26),
        },
      ],
      timeRange: [],
    };
  },
  methods: {
    clearOverlay() {
      let map = this.baidumap;
      // this.showCamera = false
      // this.showHeatMap = false
      // this.showCluster = false
      map.clearOverlays();
      for (let key of this.isShow.keys()) {
        this.isShow.set(key, false);
      }
      for (let key of this.overlayMap.keys()) {
        this.overlayMap.set(key, undefined);
      }
    },
  },
  created() {},
  mounted() {
    let map = new BMapGL.Map("map");
    map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12); // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    this.mapgl = map;
  },
  updated() {},
  watch: {},
};
</script>

<style scoped>
.mapView {
  width: 100%;
  height: 95%;
}

.table_header {
  font-size: 18px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
  width: 100%;
}

.FLOW_header {
  font-size: 18px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
  width: 100%;
}

.map {
  width: 100%;
  height: 100%;
  display: flex;
}

.switchButton {
  float: left;
  margin-top: 0px;
  margin-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
}

/deep/ .el-table thead {
  color: #626066;
}
</style>
