<template>
  <el-container style="height: 100%">
    <el-aside width="35%">
      <el-dialog title="轨迹列表" :visible.sync="dialog" :direction="direction">
        <el-table
          v-loading="tra_loading"
          element-loading-text="加载数据中"
          highlight-current-row
          :data="
            traTable.slice((tra_current_page - 1) * 5, tra_current_page * 5)
          "
          ref="traTable"
          @selection-change="handleTraSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" align="center"> </el-table-column>
          <el-table-column prop="carNumber" align="center" label="车牌号">
          </el-table-column>
          <el-table-column prop="startTime" align="center" label="出发时间">
          </el-table-column>
          <el-table-column prop="endTime" align="center" label="结束时间">
          </el-table-column>
          <el-table-column
            prop="distanceCarry"
            align="center"
            label="载客里程(km)"
          >
          </el-table-column>
          <el-table-column
            prop="distanceEmpty"
            align="center"
            label="空驶里程(km)"
          >
          </el-table-column>
          <el-table-column
            prop="distanceCal"
            align="center"
            label="行驶距离(km)"
          >
            <template slot-scope="scope">
              {{ formatValue(scope.row.distanceCal, 2) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="tra_current_page"
          :total="traTable.length"
          @current-change="handleTraPageChange"
          layout="prev, pager, next"
          :page-size="5"
        >
        </el-pagination>
        <el-button type="primary" @click="addTraClick">添加</el-button>
      </el-dialog>
      <el-tabs v-model="activeTab" type="card" :stretch="true">
        <el-tab-pane label="轨迹" name="tra">
          <el-tag class="table_header" effect="dark">车辆列表</el-tag>
          <el-table
            v-loading="car_loading"
            highlight-current-row
            element-loading-text="加载数据中"
            :data="carTable"
            ref="carTable"
            style="width: 100%"
          >
            <el-table-column
              fixed="left"
              prop="carNumber"
              align="center"
              label="车牌号"
            >
            </el-table-column>
            <el-table-column
              sortable
              prop="traCount"
              align="center"
              label="轨迹数"
            >
            </el-table-column>
            <el-table-column
              sortable
              prop="totalTime"
              align="center"
              label="总出行时间/h"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.totalTime, 1) }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="totalDistance"
              align="center"
              label="总出行距离/km"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.totalDistance, 2) }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="dayCount"
              align="center"
              label="总出行天数"
            >
            </el-table-column>
            <el-table-column
              sortable
              prop="avgTime"
              align="center"
              label="平均出行时间/h"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.avgTime, 1) }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="avgDistance"
              align="center"
              label="平均出行距离/km"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.avgDistance, 2) }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="avgSpeed"
              align="center"
              label="平均出行速度km/h"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.avgSpeed, 2) }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="avgTimePerDay"
              align="center"
              label="平均一天的出行时间/h"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.avgTimePerDay, 1) }}
              </template>
            </el-table-column>
            <el-table-column
              sortable
              prop="avgDistancePerDay"
              align="center"
              label="平均一天的出行距离/km"
            >
              <template slot-scope="scope">
                {{ formatValue(scope.row.avgDistancePerDay, 2) }}
              </template>
            </el-table-column>

            <el-table-column prop="color" label="颜色">
              <template slot-scope="scope">
                <el-color-picker
                  v-model="scope.row.color"
                  :predefine="predefineColors"
                  size="mini"
                  show-alpha
                  @change="changeColor(scope.row)"
                ></el-color-picker>
              </template>
            </el-table-column>

            <el-table-column align="center" label="详情" fixed="right">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="showTra(scope.$index, carTable)"
                  type="text"
                  size="small"
                >
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            :current-page="car_current_page"
            :total="carTable.length"
            @current-change="handleCarPageChange"
            layout="prev, pager, next"
            :page-size="5"
          >
          </el-pagination>
          <div v-show="showSelectedTra">
            <el-tag type="warning" class="FLOW_header" effect="dark"
              >选中的轨迹列表</el-tag
            >
            <el-table
              v-loading="selectedTraLoading"
              element-loading-text="加载数据中"
              highlight-current-row
              :data="
                selectedTraTable.slice(
                  (selected_tra_current_page - 1) * 5,
                  selected_tra_current_page * 5
                )
              "
              ref="traTable"
              style="width: 100%"
            >
              <el-table-column prop="carNumber" align="center" label="车牌号">
              </el-table-column>
              <el-table-column prop="startTime" align="center" label="出发时间">
              </el-table-column>
              <el-table-column prop="endTime" align="center" label="结束时间">
              </el-table-column>
              <el-table-column
                prop="distanceCarry"
                align="center"
                label="载客里程(km)"
              >
              </el-table-column>
              <el-table-column
                prop="distanceEmpty"
                align="center"
                label="空驶里程(km)"
              >
              </el-table-column>
              <el-table-column
                prop="distanceCal"
                align="center"
                label="行驶距离(km)"
              >
                <template slot-scope="scope">
                  {{ formatValue(scope.row.distanceCal, 2) }}
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-dropdown
                    size="small"
                    trigger="click"
                    @command="handleCommand($event, scope.row)"
                  >
                    <el-button type="primary">
                      操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="showTra"
                        >展示轨迹</el-dropdown-item
                      >
                      <el-dropdown-item command="clearTra"
                        >清除轨迹</el-dropdown-item
                      >
                      <el-dropdown-item command="play"
                        >开始动画</el-dropdown-item
                      >
                      <el-dropdown-item command="removeTra"
                        >移除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="selected_tra_current_page"
              :total="selectedTraTable.length"
              @current-change="handleSelectTraPageChange"
              layout="prev, pager, next"
              :page-size="5"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-aside>
    <el-main style="padding: 0">
      <div class="mapView">
        <!-- 顶部按钮-->
        <div class="switchButton">
          <el-page-header @back="goBack" content="" style="float: left" />
          <el-date-picker
            v-model="originTraTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="changOriTimeRange"
          />
          <el-select
            v-model="carNumber"
            placeholder="请选择"
            style="padding-left: 10px"
          >
            <el-option
              v-for="item in carTable"
              :key="item.carNumber"
              :label="item.carNumber"
              :value="item.carNumber"
            >
            </el-option>
          </el-select>
          <el-switch
            v-model="showOriginGps"
            style="padding-left: 10px"
            @change="handleOriginGps"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="展示Gps轨迹"
          >
          </el-switch>
          <el-switch
            v-model="showOriginCam"
            style="padding-left: 10px"
            @change="handleOriginCam"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="展示卡口轨迹"
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
          @zoomend="zoomEnd"
          @ready="handler"
          :auto-resize="true"
          :scroll-wheel-zoom="true"
          @click="handleMapClick"
        >
          <bml-heatmap
            v-if="showHeatMap"
            :data="heatMapInfo"
            :max="heatMapMax"
            :radius="20"
          >
          </bml-heatmap>

          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        </baidu-map>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { BmlHeatmap } from "vue-baidu-map";
import { BmlMarkerClusterer } from "vue-baidu-map";
import { dateFormat } from "../../utils/trans";
import Template from "@/views/template";

export default {
  name: "taxiDetail",
  components: {
    Template,
    BmlHeatmap,
    BmlMarkerClusterer,
  },
  data() {
    return {
      slider: 0,
      step: 1,
      play: false,
      playPause: false,
      // 地图中心
      center: "济南",
      // 车牌信息
      carID: "",
      // 海量点信息
      camera_info: [],
      heatMapInfo: [],
      heatMapMax: 100,
      // 单独点信息
      point_info: null,
      // 窗口位置信息
      infoPosition: { lng: 0, lat: 0 },
      // 信息窗口内容
      infoCont: "",
      // 点图标大小
      sizeDot: "BMAP_POINT_SIZE_BIG",
      // 控制信息窗口显示
      showInfo: false,
      // 控制摄像头图标显示
      showcam: false,
      // 缩放大小
      zoom: 12,
      // 存百度地图实例
      baiduMap: null,
      baidumap: null,
      cam_loading: false,
      cam_current_page: 1,
      camTable: [],
      showHeatMap: false,
      carNumber: null,
      activeTab: "tra",
      tra_loading: false,
      tra_current_page: 1,
      traTable: [],
      point_loading: false,
      pointTable: [],
      showSelectedTra: false,

      //原始轨迹点
      originGpsPointTable: [],
      originCamPointTable: [],

      showCluster: false,
      markerCluster: null,
      clusterFlowLine: {},
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
      //原始轨迹的时间范围
      showOriginGps: false,
      showOriginCam: false,
      originTraTimeRange: ["2023-04-01 00:00:00", "2023-04-01 23:59:59"],
      //记录轨迹是否展示
      isShow: new Map(),
      overlayMap: new Map(),
      car_loading: false,
      //已选中的车辆
      carTable: [],
      car_current_page: 1,
      //车辆信息
      carInfo: new Map(),
      //抽屉是否展示
      dialog: false,
      direction: "ltr",
      defaultColor: "#409eff",
      selectedTraLoading: false,
      selected_tra_current_page: 1,
      selectedTraTable: [],
      selection: [],
    };
  },
  methods: {
    handler({ BMap, map }) {
      this.baiduMap = BMap;
      this.baidumap = map;
      // this.initGrid()
    },
    goBack() {
      this.$router.back();
    },
    handleTraPageChange(val) {
      this.tra_current_page = val;
    },
    handleSelectTraPageChange(val) {
      this.selected_tra_current_page = val;
    },
    handleCarPageChange(val) {
      this.car_current_page = val;
    },
    handleMapClick(e) {
      console.log(e.point.lng, e.point.lat);
    },
    handleCommand(cmd, row) {
      console.log(this.isShow.get(row.traId));
      switch (cmd) {
        case "showTra":
          this.drawTra(row);
          break;
        case "clearTra":
          this.clearTra(row);
          break;
        case "play":
          this.handlePlay(row);
          break;
        case "removeTra":
          this.removeTra(row);
          break;
        default:
          break;
      }
      console.log(this.isShow.get(row.traId));
    },
    changOriTimeRange(timeRange) {
      this.originTraTimeRange = timeRange;
    },
    changeColor(row) {
      let carNumber = row.carNumber;
      this.carInfo.get(carNumber).color = row.color;
    },
    // 缩放后执行
    zoomEnd() {
      this.showInfo = false;
    },
    async drawTra(row) {
      let traId = row.traId;
      if (!this.isShow.get(traId)) {
        await this.getPointByTra(traId);
        this.drawLine(
          this.pointTable,
          this.carInfo.get(row.carNumber).color,
          traId
        );
      }
    },
    async clearTra(row) {
      let traId = row.traId;
      let map = this.baidumap;
      if (this.isShow.get(traId)) {
        let idx;
        let overlayArr = this.overlayMap.get(traId);
        for (idx in overlayArr) {
          map.removeOverlay(overlayArr[idx]);
        }
        this.isShow.set(traId, false);
      }
    },
    handleOriginGps(val) {
      let map = this.baidumap;
      if (val) {
        if (this.carNumber == null) {
          this.$message("先选择车辆");
          this.showOriginGps = false;
        } else {
          this.showOriginGpsTra();
        }
      } else {
        let idx;
        let overlayArr = this.overlayMap.get("originGpsTra");
        for (idx in overlayArr) {
          map.removeOverlay(overlayArr[idx]);
        }
      }
    },
    handleOriginCam(val) {
      let map = this.baidumap;
      if (val) {
        if (this.carNumber == null) {
          this.$message("先选择车辆");
          this.showOriginCam = false;
        } else {
          this.showOriginCamTra();
        }
      } else {
        let idx;
        let overlayArr = this.overlayMap.get("originCamTra");
        for (idx in overlayArr) {
          map.removeOverlay(overlayArr[idx]);
        }
      }
    },
    handleTraSelectionChange(row) {
      this.selection = row;
    },
    addTraClick() {
      this.dialog = false;
      this.selectedTraLoading = true;
      for (let idx in this.selection) {
        let selected = false;
        for (let j in this.selectedTraTable) {
          if (this.selectedTraTable[j].traId === this.selection[idx].traId) {
            selected = true;
            break;
          }
        }
        if (!selected) this.selectedTraTable.push(this.selection[idx]);
      }
      this.selectedTraLoading = false;
      this.showSelectedTra = true;
    },
    removeTra(row) {
      this.clearTra(row);

      this.selectedTraLoading = true;
      let table = this.selectedTraTable;
      this.selectedTraTable = [];
      for (let i in table) {
        if (table[i].traId !== row.traId) {
          this.selectedTraTable.push(table[i]);
        }
      }
      this.selectedTraLoading = false;
    },
    showTra(idx, carTable) {
      let carNumber = carTable[idx].carNumber;
      this.getTraByCar(carNumber);
      this.dialog = true;
    },
    async showOriginGpsTra() {
      await this.getOriginGpsTra();
      this.drawLine(this.originGpsPointTable, "#2B79D2FF", "originGpsTra");
    },
    async showOriginCamTra() {
      await this.getOriginCamTra();
      this.drawLine(this.originCamPointTable, "#E53B4CFF", "originCamTra");
    },
    async getOriginGpsTra() {
      this.originGpsPointTable = [];
      await this.axios
        .post("/taxi/getGpsPointByCar", {
          carNumber: this.carNumber,
          minTime: this.originTraTimeRange[0],
          maxTime: this.originTraTimeRange[1],
        })
        .then((res) => {
          res.data.msg.forEach((item) => {
            this.originGpsPointTable.push({
              carNumber: item.carNumber,
              lng: item.lng,
              lat: item.lat,
              time: dateFormat("yyyy-MM-dd HH:mm:ss", new Date(item.time)),
              traId: item.traId,
            });
          });
        });
    },
    async getOriginCamTra() {
      this.originCamPointTable = [];
      await this.axios
        .post("/taxi/getCamPointByCar", {
          carNumber: this.carNumber,
          minTime: this.originTraTimeRange[0],
          maxTime: this.originTraTimeRange[1],
        })
        .then((res) => {
          res.data.msg.forEach((item) => {
            this.originCamPointTable.push({
              carNumber: item.carNumber,
              lng: item.camLon,
              lat: item.camLat,
              time: dateFormat("yyyy-MM-dd HH:mm:ss", new Date(item.photoTime)),
              traId: null,
            });
          });
        });
    },
    getTraByCar(carNumber) {
      this.tra_loading = true;
      this.traTable = [];
      this.axios
        .post("/taxi/getTraByCar", {
          carNumber: carNumber,
          minTime: this.timeRange[0],
          maxTime: this.timeRange[1],
        })
        .then((res) => {
          res.data.msg.forEach((item) => {
            if (!this.isShow.has(item.traId)) {
              this.isShow.set(item.traId, false);
            }
            this.traTable.push({
              traId: item.traId,
              carNumber: item.carNumber,
              startTime: dateFormat(
                "yyyy-MM-dd hh:mm:ss",
                new Date(item.startTime)
              ),
              endTime: dateFormat(
                "yyyy-MM-dd hh:mm:ss",
                new Date(item.endTime)
              ),
              distanceCarry: item.distanceCarry,
              distanceEmpty: item.distanceEmpty,
              distanceCal: item.distanceCal,
            });
          });
          this.tra_loading = false;
        });
    },
    async getPointByTra(traId) {
      this.point_loading = true;
      this.pointTable = [];
      await this.axios
        .get("/taxi/getGpsPointByTra?traId=" + traId)
        .then((res) => {
          res.data.msg.forEach((item) => {
            this.pointTable.push({
              carNumber: item.carNumber,
              lng: item.lng,
              lat: item.lat,
              time: dateFormat("yyyy-MM-dd hh:mm:ss", new Date(item.time)),
              traId: item.traId,
            });
          });
          this.point_loading = false;
        });
    },
    drawLine(arrLngLat, color, traId) {
      this.arrPois = [];
      const map = this.baidumap;
      //该轨迹点中的marker
      let makerArr = this.overlayMap.get(traId);
      if (makerArr === undefined) {
        makerArr = [];
      }

      let startIcon = new BMap.Icon(
        "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
        new BMap.Size(28, 30),
        { anchor: new BMap.Size(10, 25) }
      );
      let endIcon = new BMap.Icon(
        "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
        new BMap.Size(28, 30),
        { anchor: new BMap.Size(10, 25) }
      );
      for (let i = 0; i < arrLngLat.length; i++) {
        this.arrPois.push(new BMap.Point(arrLngLat[i].lng, arrLngLat[i].lat));
      }
      let startPoint = new BMap.Point(arrLngLat[0].lng, arrLngLat[0].lat);
      const startMaker = new BMap.Marker(startPoint, { icon: startIcon });
      map.addOverlay(startMaker);
      makerArr.push(startMaker);

      let endPoint = new BMap.Point(
        arrLngLat[arrLngLat.length - 1].lng,
        arrLngLat[arrLngLat.length - 1].lat
      );
      const endMaker = new BMap.Marker(endPoint, { icon: endIcon });
      map.addOverlay(endMaker);
      makerArr.push(endMaker);

      const line = new BMap.Polyline(this.arrPois, {
        strokeColor: color,
        strokeWeight: "4",
        strokeOpacity: 0.9, // 折线的透明度，取值范围0 - 1
      });
      map.addOverlay(line);
      makerArr.push(line);

      this.overlayMap.set(traId, makerArr);

      this.isShow.set(traId, true);
    },
    /** 路书初始化*/
    initLushu(map, arrPois) {
      console.log(arrPois);
      const fly =
        "data:image/png;base64,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";
      const curZoom = map.getZoom();
      let drawSpeed = 4000;
      if (curZoom === 17) {
        drawSpeed = 500;
      } else if (curZoom === 13) {
        drawSpeed = 5500;
      } else if (curZoom === 15) {
        drawSpeed = 5000;
      } else if (curZoom === 16) {
        drawSpeed = 1000;
      } else if (curZoom === 14) {
        drawSpeed = 6000;
      } else if (curZoom === 19) {
        drawSpeed = 200;
      } else if (curZoom === 18) {
        drawSpeed = 300;
      }

      this.lushu = new BMapLib.LuShu(map, arrPois, {
        autoView: true,
        icon: new BMap.Icon(fly, new BMap.Size(48, 48), {
          anchor: new BMap.Size(24, 24),
        }),
        speed: drawSpeed,
        enableRotation: true,
        landmarkPois: [],
      });
    },
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
    async handlePlay(row) {
      this.play = true;
      let map = this.baidumap;
      let traId = row.traId;
      if (!this.playPause) {
        await this.getPointByTra(traId);
        let arrPois = [];
        for (let i = 0; i < this.pointTable.length; i++) {
          arrPois.push(
            new BMap.Point(this.pointTable[i].lng, this.pointTable[i].lat)
          );
        }
        this.initLushu(map, arrPois);
      }
      this.lushu.start();
    },
    handlePause() {
      this.playPause = true;
      this.lushu.pause();
      this.play = false;
    },
    formatValue(val, digits) {
      return Number(val).toFixed(digits);
    },
    timeFun(val) {
      return String(val);
    },
  },
  created() {
    this.car_loading = true;
    let selected = this.$route.query.selected;
    if (typeof selected[0] == "object") {
      sessionStorage.setItem("selected", JSON.stringify(selected));
    }
    let carTable = JSON.parse(sessionStorage.getItem("selected"));
    for (let idx in carTable) {
      carTable[idx].color = this.defaultColor;
      let carNumber = carTable[idx].carNumber;
      if (this.carInfo.get(carNumber) === undefined) {
        let info = {};
        info.color = this.defaultColor;
        this.carInfo.set(carNumber, info);
      }
    }

    this.carTable = carTable;
    this.car_loading = false;
    this.timeRange = this.$route.query.timeRange;
  },
  mounted() {},
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
