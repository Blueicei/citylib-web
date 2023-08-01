<template>
  <el-container style="height: 100%">
    <el-main style="padding: 0">
      <div class="mapView">
        <!-- 顶部按钮-->
        <div class="switchButton">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleTimeRange"
          />
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="clearOverlay"
            size="mini"
            >清空覆盖物
          </el-button>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="getCityFlow"
            size="mini"
            >展示流量
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
      mapGL: null,
      gpsPoints: [],
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
      timeRange: ["2023-04-01 06:00:00", "2023-04-01 07:00:00"],
    };
  },
  methods: {
    initMap() {
      let map = new BMapGL.Map("map");
      map.centerAndZoom(this.center, 12); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      map.setMapStyle({ style: "midnight" });
      this.mapGL = map;
    },
    getCityFlow() {
      let view = new mapvgl.View({
        map: this.mapGL,
      });
      this.axios
        .post("/taxi/getGpsPoints", {
          minTime: this.timeRange[0],
          maxTime: this.timeRange[1],
        })
        .then((res) => {
          let data = [];
          res.data.msg.forEach((e) => {
            data.push({
              geometry: {
                type: "Point",
                coordinates: [e.lng, e.lat],
              },
              properties: {
                count: e.count,
              },
            });
          });
          let pointLayer = new mapvgl.HeatPointLayer({
            blend: "lighter",
            style: "grid",
            shape: "square",
            size: 1,
            min: 0,
            max: 1000,
            gradient: {
              0.0: "rgb(50, 50, 256)",
              0.1: "rgb(50, 250, 56)",
              0.5: "rgb(250, 250, 56)",
              1.0: "rgb(250, 50, 56)",
            },
          });
          view.addLayer(pointLayer);
          pointLayer.setData(data);
          console.log(data);
        });
    },
    clearOverlay() {
      let map = this.mapGL;
      map.clearOverlays();
      for (let key of this.isShow.keys()) {
        this.isShow.set(key, false);
      }
      for (let key of this.overlayMap.keys()) {
        this.overlayMap.set(key, undefined);
      }
    },
    handleTimeRange(timeRange) {
      this.timeRange = timeRange;
    },
  },
  created() {},
  mounted() {
    this.initMap();
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
