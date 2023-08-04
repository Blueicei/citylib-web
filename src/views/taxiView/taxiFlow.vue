<template>
  <el-container style="height: 100%">
    <el-main style="padding: 0">
      <div class="mapView">
        <!-- 顶部按钮-->
        <div class="switchButton">
          <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="date">
          </el-date-picker>
          <!--          <el-time-picker-->
          <!--            is-range-->
          <!--            v-model="hourRange"-->
          <!--            range-separator="至"-->
          <!--            value-format="HH:mm:ss"-->
          <!--            start-placeholder="开始时间"-->
          <!--            end-placeholder="结束时间"-->
          <!--            placeholder="选择时间范围"-->
          <!--          >-->
          <!--          </el-time-picker>-->
          <template>
            <div
              class="block"
              style="
                display: inline-block;
                width: 200px;
                margin-left: 25px;
                margin-right: 25px;
                vertical-align: middle;
              "
            >
              <el-slider
                v-model="hourRange"
                range
                :max="24"
                :format-tooltip="formatTooltip"
              ></el-slider>
            </div>
          </template>
          <el-switch
            style="margin-left: 10px"
            v-model="showHeatMap"
            @change="turnHeat"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="显示热力图"
            inactive-text="隐藏热力图"
          >
          </el-switch>
          <el-switch
            style="margin-left: 10px"
            v-model="showCluster"
            @change="turnCluster"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="显示点聚合"
            inactive-text="隐藏点聚合"
          >
          </el-switch>
          <el-button
            style="margin-left: 10px"
            type="primary"
            @click="clearOverlay"
            size="mini"
            >清空覆盖物
          </el-button>
        </div>
        <baidu-map
          class="map"
          :center="center"
          :zoom="zoom"
          @ready="handler"
          :auto-resize="true"
          :scroll-wheel-zoom="true"
        >
          <bml-heatmap
            id="heatmap"
            v-if="showHeatMap"
            :data="pointTable"
            :max="heatMapMax"
            :radius="20"
          ></bml-heatmap>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        </baidu-map>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { BmlHeatmap } from "vue-baidu-map";

export default {
  name: "camFlow",
  components: {
    BmlHeatmap,
  },
  data() {
    return {
      // 地图中心
      center: "济南",
      heatMapMax: 100,
      // 点图标大小
      sizeDot: "BMAP_POINT_SIZE_BIG",
      // 控制摄像头图标显示
      showHeatMap: false,
      // 缩放大小
      zoom: 12,
      // 存百度地图实例
      baiduMap: null,
      baidumap: null,
      lastCluster: null,
      //滑块相关
      hourRange: [0, 1],

      //选中日期
      date: "2023-04-01",

      //轨迹点集合
      pointTable: [],
      odTable: [],

      //展示点聚合
      showCluster: false,
      //点聚合结果
      markerCluster: null,
      fromCluster: new Map(),
      toCluster: new Map(),
      clusterInfo: new Map(),
      curCluster: null,
    };
  },
  methods: {
    handler({ BMap, map }) {
      this.baiduMap = BMap;
      this.baidumap = map;
    },
    clearOverlay() {
      let map = this.baidumap;
      this.showHeatMap = false;
      map.clearOverlays();
    },
    showHeat() {
      let param = {
        minTime: this.formatTimeRange(this.date, this.hourRange[0]),
        maxTime: this.formatTimeRange(this.date, this.hourRange[1]),
      };

      this.axios.post("/taxi/getGpsPoints", param).then((res) => {
        this.pointTable = res.data.msg;
        this.cam_loading = false;
        this.sliderDisable = false;
        if (this.showCluster) {
          this.initCluster();
        }
      });
    },
    formatTimeRange(date, hour) {
      if (hour < 10) {
        hour = "0" + hour;
      }
      return date + " " + hour + ":00:00";
    },
    initCluster() {
      let markers = [];
      this.axios
        .post("/taxi/getODs", {
          minTime: this.formatTimeRange(this.date, this.hourRange[0]),
          maxTime: this.formatTimeRange(this.date, this.hourRange[1]),
        })
        .then((res) => {
          this.odTable = res.data.msg;
          this.odTable.forEach((item) => {
            for (let i = 0; i < item.count; i++) {
              let markerPoint = new BMap.Marker(
                new BMap.Point(item.lng, item.lat)
              );
              markerPoint.name = item.lng + "," + item.lat;
              markers.push(markerPoint);
            }
          });
          if (this.markerCluster) {
            this.markerCluster.clearMarkers();
          }

          let map = this.baidumap;
          this.markerCluster = new BMapLib.MarkerClusterer(map, {
            markers: markers,
            isAverageCenter: true,
          });
          this.addClusterClickListener();
        });
    },
    addClusterClickListener() {
      let map = this.baidumap;
      let markerCluster = this.markerCluster;
      let minTime = this.formatTimeRange(this.date, this.hourRange[0]);
      let maxTime = this.formatTimeRange(this.date, this.hourRange[1]);
      let axios = this.axios;
      let clusters = markerCluster._clusters;
      markerCluster._clusters.forEach((cluster) => {
        //cluster边界，正方形
        let thatBounds = cluster.getBounds();
        let that = this;
        cluster._clusterMarker.addEventListener("click", function (event) {
          let param = {
            minLng: thatBounds.Ne,
            minLat: thatBounds.$d,
            maxLng: thatBounds.Je,
            maxLat: thatBounds.Yd,
            minTime: minTime,
            maxTime: maxTime,
          };
          console.log(that.clusterInfo);
          if (that.clusterInfo.get("showFlow")) {
            that.clusterInfo.get("ployLines").forEach((line) => {
              map.removeOverlay(line);
            });
            that.clusterInfo = new Map();
            return;
          }
          that.clusterInfo = new Map();

          axios
            .post("/taxi/getODsByCluster", param)
            .then((res) => {
              let fromList = res.data.msg.from;
              let toList = res.data.msg.to;
              let fromCluster = new Map(),
                toCluster = new Map();
              for (let i = 0; i < fromList.length; i++) {
                let point = fromList[i];
                for (let j = 0; j < clusters.length; j++) {
                  let clu = clusters[j];
                  let flag = false;
                  for (let k = 0; k < clu._points.length; k++) {
                    if (clu._points[k] === point.lng + "," + point.lat) {
                      flag = true;
                      break;
                    }
                  }
                  if (flag) {
                    let key = clu._center.lng + "," + clu._center.lat;
                    if (fromCluster.has(key)) {
                      fromCluster.set(key, fromCluster.get(key) + point.count);
                    } else {
                      fromCluster.set(key, point.count);
                    }
                    break;
                  }
                }
              }

              for (let i = 0; i < toList.length; i++) {
                let point = toList[i];
                for (let j = 0; j < clusters.length; j++) {
                  let clu = clusters[j];
                  let flag = false;
                  for (let k = 0; k < clu._points.length; k++) {
                    if (clu._points[k] === point.lng + "," + point.lat) {
                      flag = true;
                      break;
                    }
                  }
                  if (flag) {
                    let key = clu._center.lng + "," + clu._center.lat;
                    if (toCluster.has(key)) {
                      toCluster.set(key, toCluster.get(key) + point.count);
                    } else {
                      toCluster.set(key, point.count);
                    }
                    break;
                  }
                }
              }
              that.clusterInfo.set("cluster", cluster);
              that.clusterInfo.set("from", fromCluster);
              that.clusterInfo.set("to", toCluster);
              that.showFlow();
            })
            .catch();
        });
      });
    },
    turnCluster(val) {
      let map = this.baidumap;
      if (!val) {
        this.markerCluster.clearMarkers();
        map.enableDoubleClickZoom(true); //禁止缩放
        map.enableDragging(true); //禁止拖拽
        map.enableScrollWheelZoom(true); //禁止缩放
      } else {
        map.disableDragging(); //禁止拖拽
        this.initCluster();
      }
    },
    turnHeat(val) {
      if (!val) {
        this.showHeatMap = false;
      } else {
        this.showHeat();
      }
    },
    //展示流向
    showFlow() {
      if (!this.clusterInfo) {
        return;
      }
      let map = this.baidumap;
      let point = new BMap.Point(
        this.clusterInfo.get("cluster")._center.lng,
        this.clusterInfo.get("cluster")._center.lat
      );

      let fromCluster = this.clusterInfo.get("from"),
        toCluster = this.clusterInfo.get("to");
      let polyLines = [];
      if (fromCluster) {
        fromCluster.forEach((val, key) => {
          let fromPoint = new BMap.Point(key.split(",")[0], key.split(",")[1]);
          let trackLine = new BMap.Polyline([fromPoint, point], {
            strokeColor: "#0745A1FF",
            strokeWeight: "4",
            strokeOpacity: 0.9, // 折线的透明度，取值范围0 - 1
          });
          trackLine.name = "fromLine";
          map.addOverlay(trackLine);
          polyLines.push(trackLine);
        });
      }

      if (toCluster) {
        toCluster.forEach((val, key) => {
          let toPoint = new BMap.Point(key.split(",")[0], key.split(",")[1]);
          let trackLine = new BMap.Polyline([point, toPoint], {
            strokeColor: "#AD1136FF",
            strokeWeight: "4",
            strokeOpacity: 0.9, // 折线的透明度，取值范围0 - 1
          });
          trackLine.name = "toLine";
          map.addOverlay(trackLine);
          polyLines.push(trackLine);
        });
      }
      this.clusterInfo.set("ployLines", polyLines);
      this.clusterInfo.set("showFlow", true);
    },
    formatTooltip(v) {
      return v + ":00";
    },
  },
  created() {},
  mounted() {},
  watch: {},
};
</script>

<style scoped>
.mapView {
  width: 100%;
  height: 95%;
}

.el-header {
  padding: 0;
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

.table_header {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
  width: 100%;
}

.el-form-item__label-wrap {
  margin-left: 0px !important;
}
</style>
