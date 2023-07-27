<template>
    <el-container style="height: 100%">
        <el-aside width="35%">
            <el-drawer
                title="我是标题"
                :visible.sync="drawer"
                :direction="direction">
              <el-table
                  v-loading="tra_loading"
                  element-loading-text="加载数据中"
                  highlight-current-row
                  :data="traTable.slice((tra_current_page-1) * 5, tra_current_page * 5)"
                  @row-click="handleTraRowClick"
                  ref="traTable"
                  style="width: 100%">
                <el-table-column
                    prop="carNumber"
                    align="center"
                    label="车牌号"
                >
                </el-table-column>
                <el-table-column
                    prop="startTime"
                    align="center"
                    label="出发时间"
                >
                </el-table-column>
                <el-table-column
                    prop="endTime"
                    align="center"
                    label="结束时间"
                >
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
                    {{ distanceFun(scope.row.distanceCal) }}
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                  :current-page="tra_current_page"
                  :total='traTable.length'
                  @current-change="handleTraPageChange"
                  layout="prev, pager, next"
                  :page-size="5"
              >
              </el-pagination>
            </el-drawer>
            <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card" :stretch="true">
                <el-tab-pane label="轨迹" name="tra">
                    <el-tag class="table_header" effect="dark">轨迹列表</el-tag>
                  <el-table
                      v-loading="car_loading"
                      highlight-current-row
                      element-loading-text="加载数据中"
                      :data="carTable"
                      ref="carTable"
                      style="width: 100%">
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
                        {{ fun(scope.row.totalTime) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                        sortable
                        prop="totalDistance"
                        align="center"
                        label="总出行距离/km"
                    >
                      <template slot-scope="scope">
                        {{ fun(scope.row.totalDistance) }}
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
                        {{ fun(scope.row.avgTime) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                        sortable
                        prop="avgDistance"
                        align="center"
                        label="平均出行距离/km"
                    >
                      <template slot-scope="scope">
                        {{ fun(scope.row.avgDistance) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                        sortable
                        prop="avgSpeed"
                        align="center"
                        label="平均出行速度km/h"
                    >
                      <template slot-scope="scope">
                        {{ fun(scope.row.avgSpeed) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                        sortable
                        prop="avgTimePerDay"
                        align="center"
                        label="平均一天的出行时间/h"
                    >
                      <template slot-scope="scope">
                        {{ fun(scope.row.avgTimePerDay) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                        sortable
                        prop="avgDistancePerDay"
                        align="center"
                        label="平均一天的出行距离/km"
                    >
                      <template slot-scope="scope">
                        {{ fun(scope.row.avgDistancePerDay) }}
                      </template>
                    </el-table-column>

                    <el-table-column
                        prop="color"
                        label="颜色">
                      <template slot-scope="scope">
                        <el-color-picker
                            v-model="scope.row.color"
                            :predefine="predefineColors"
                            size="mini" show-alpha
                            @change="changeColor(scope.row)"></el-color-picker>
                      </template>
                    </el-table-column>

                    <el-table-column
                        align="center"
                        label="详情"
                        fixed="right"
                    >
                      <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="showTra(scope.$index, carTable)"
                            type="text"
                            size="small">
                          查看
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                    <el-pagination
                            :current-page="car_current_page"
                            :total='carTable.length'
                            @current-change="handleCarPageChange"
                            layout="prev, pager, next"
                            :page-size="5"
                    >
                    </el-pagination>
                    <div v-show="showPoint">
                        <el-tag type="warning" class="FLOW_header" effect="dark">轨迹点</el-tag>
                        <el-table
                                v-loading="point_loading"
                                highlight-current-row
                                element-loading-text="加载数据中"
                                :data="pointTable.slice((point_current_page-1) * 5, point_current_page * 5)"
                                @row-click="handlePointRowClick"
                                ref="pointTable"
                                style="width: 100%">
                            <el-table-column
                                    prop="time"
                                    align="center"
                                    label="时间"
                            >
                                <template slot-scope="scope">
                                    {{ timeFun(scope.row.time) }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="lng"
                                    align="center"
                                    label="经度"
                            >
                                <template slot-scope="scope">
                                    {{ fun(scope.row.lng) }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="lat"
                                    align="center"
                                    label="纬度"
                            >
                                <template slot-scope="scope">
                                    {{ fun(scope.row.lat) }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                                :current-page="point_current_page"
                                :total='pointTable.length'
                                layout="prev, pager, next"
                                @current-change="handlePOINTpageChange"
                                :page-size="5"
                        >
                        </el-pagination>
                    </div>
                </el-tab-pane>
<!--                <el-tab-pane label="流向" name="third">-->
<!--                    <el-tag class="table_header" effect="dark">拖动查看流向变化</el-tag>-->
<!--                    <div style="display: inline-block ; width:300px">-->
<!--                        &lt;!&ndash;                滑块部分&ndash;&gt;-->
<!--                        &lt;!&ndash;                滑块有两个事件，change和input 不同点， change 值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发） input 	数据改变时触发（使用鼠标拖曳时，活动过程实时触发）&ndash;&gt;-->
<!--                        <el-slider v-model="slider" :step="step" :max="24-step" :format-tooltip="formatTooltip"-->
<!--                                   @change="change" @input="input" :disabled="!showCluster"></el-slider>-->
<!--                    </div>-->
<!--                </el-tab-pane>-->
            </el-tabs>
        </el-aside>
        <el-main style="padding: 0">
            <div class="mapView">
                <!-- 顶部按钮-->
                <div class="switchButton">
                    <el-page-header @back="goBack" content="" style="float: left"/>
<!--                    <el-switch-->
<!--                            v-model="showCamera"-->
<!--                            active-color="#13ce66"-->
<!--                            inactive-color="#ff4949"-->
<!--                            active-text="显示摄像头"-->
<!--                            inactive-text="隐藏摄像头">-->
<!--                    </el-switch>-->
<!--                    <el-switch-->
<!--                            style="margin-left: 10px"-->
<!--                            v-model="showHeatMap"-->
<!--                            active-color="#13ce66"-->
<!--                            inactive-color="#ff4949"-->
<!--                            active-text="显示热力图"-->
<!--                            inactive-text="隐藏热力图">-->
<!--                    </el-switch>-->
<!--                    <el-switch-->
<!--                            style="margin-left: 10px"-->
<!--                            v-model="showCluster"-->
<!--                            @change="turnCluster"-->
<!--                            active-color="#13ce66"-->
<!--                            inactive-color="#ff4949"-->
<!--                            active-text="显示点聚合"-->
<!--                            inactive-text="隐藏点聚合">-->
<!--                    </el-switch>-->
                    <el-button
                            style="margin-left: 10px"
                            type="success"
                            size="mini"
                            :disabled="pointTable.length===0 || play"
                            @click="handlePlay"
                            icon="el-icon-video-play"
                    >开始动画
                    </el-button>
                    <el-button
                            style="margin-left: 10px"
                            type="warning"
                            size="mini"
                            :disabled="pointTable.length===0 || !play"
                            @click="handlePause"
                            icon="el-icon-video-pause"
                    >暂停动画
                    </el-button>
                    <el-button
                            style="margin-left: 10px"
                            type="primary"
                            @click="clearOverlay"
                            size="mini"
                    >清空覆盖物
                    </el-button>
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
                  <el-switch v-model="showOrigin"
                    style="margin-left: 10px"
                    @change="handleOriginTra"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="展示原始轨迹"
                    inactive-text="隐藏原始轨迹">
                  </el-switch>
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
                    <bml-heatmap v-if="showHeatMap" :data="heatMapInfo" :max="heatMapMax" :radius="20">
                    </bml-heatmap>
                    <!--                    <bml-marker-clusterer v-if="showCluster"  :averageCenter="true">-->
                    <!--                        <bm-marker v-for="marker of camera_info" :key="marker.id" :position="{lng: marker.lng, lat: marker.lat}"></bm-marker>-->
                    <!--                    </bml-marker-clusterer>-->
                    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                    <!-- 海量点部分-->
                    <div v-if="showCamera">
                        <bm-point-collection
                                :points="camera_info"
                                shape="BMAP_POINT_SHAPE_STAR"
                                color="#4169E1"
                                :size="sizeDot"
                                @click="clickHandler"
                        />
                        <!-- 海量点信息窗部分-->
                        <bm-info-window
                                :position="infoPosition"
                                :show="showInfo"
                                title="摄像头信息："
                                @close="infoWindowClose"
                                @open="infoWindowOpen">
                            <p v-html="infoCont"></p>
                        </bm-info-window>
                    </div>
                </baidu-map>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import {BmlHeatmap} from 'vue-baidu-map';
import {BmlMarkerClusterer} from 'vue-baidu-map'
import {dateFormat} from '../../utils/trans'

export default {
    name: "taxiDetail",
    components: {
        BmlHeatmap,
        BmlMarkerClusterer
    },
    data() {
        return {
            slider: 0,
            step: 1,
            play: false,
            playPause: false,
            // 地图中心
            center: '济南',
            // 车牌信息
            carID: '',
            // 海量点信息
            camera_info: [],
            heatMapInfo: [],
            heatMapMax: 100,
            // 单独点信息
            point_info: null,
            // 窗口位置信息
            infoPosition: {lng: 0, lat: 0},
            // 信息窗口内容
            infoCont: '',
            // 点图标大小
            sizeDot: 'BMAP_POINT_SIZE_BIG',
            // 控制信息窗口显示
            showInfo: false,
            // 控制摄像头图标显示
            showCamera: false,
            // 缩放大小
            zoom: 12,
            // 存百度地图实例
            baiduMap: null,
            baidumap: null,
            cam_loading: false,
            cam_current_page: 1,
            camTable: [],
            showHeatMap: false,
            carNumber: '鲁A0000265022',
            activeTab: 'tra',
            tra_loading: false,
            tra_current_page: 1,
            traTable: [],
            point_loading: false,
            point_current_page: 1,
            pointTable: [],
            showPoint: false,

            //原始轨迹点
            originPointTable: [],

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
            sts: [{
                url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m0.png",
                size: new BMap.Size(32, 32),
                offset: new BMap.Size(-10, -10)
            }, {
                url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m1.png",
                size: new BMap.Size(32, 32),
                offset: new BMap.Size(-12, -12)
            }, {
                url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m2.png",
                size: new BMap.Size(32, 32),
                offset: new BMap.Size(-18, -18)
            }, {
                url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m3.png",
                size: new BMap.Size(32, 32),
                offset: new BMap.Size(-23, -23)
            }, {
                url: "http://api.map.baidu.com/library/TextIconOverlay/1.2/src/images/m4.png",
                size: new BMap.Size(32, 32),
                offset: new BMap.Size(-26, -26)
            }],
          timeRange: [],
          //原始轨迹的时间范围
          showOrigin:false,
          originTraTimeRange: ['2023-04-01 00:00:00','2023-04-01 23:59:59'],
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
          drawer: false,
          direction: 'ltr',
          defaultColor: '#409eff',
        }
    },
    methods: {
        handler({BMap, map}) {
            this.baiduMap = BMap
            this.baidumap = map
            // this.initGrid()

        },
        goBack() {
            this.$router.back()
        },
        clearOverlay() {
            let map = this.baidumap
            // this.showCamera = false
            // this.showHeatMap = false
            // this.showCluster = false
            map.clearOverlays();
            for(let key of this.isShow.keys()){
              this.isShow.set(key,false);
            }
            for(let key of this.overlayMap.keys()){
              this.overlayMap.set(key,undefined);
            }
        },
        handleTraPageChange(val) {
            this.tra_current_page = val
        },
        handleCarPageChange(val) {
          this.car_current_page = val
        },
        handlePOINTpageChange(val) {
            this.point_current_page = val
        },
        handleMapClick(e) {
            console.log(e.point.lng, e.point.lat)
        },
        handleTabClick(tab, event) {
            // console.log(tab, event);
        },
        colorChange(val) {
            console.log(val)
        },
        infoWindowClose() {
            this.showInfo = false
        },
        infoWindowOpen() {
            this.showInfo = true
        },
        changOriTimeRange(timeRange){
          this.originTraTimeRange = timeRange
        },
      changeColor(row){
        let carNumber = row.carNumber
        this.carInfo.get(carNumber).color = row.color
      },
        // 点图标点击事件
        clickHandler(e) {
            this.infoPosition.lng = e.point.lng
            this.infoPosition.lat = e.point.lat
            this.camera_info.forEach(item => {
                if (item.lng === this.infoPosition.lng && item.lat === this.infoPosition.lat) {
                    this.infoCont = '编号：' + item.id + '<br/>' + '地址：' + item.info
                    this.showInfo = true
                }
            })

        },
        // 缩放后执行
        zoomEnd() {
            this.showInfo = false
        },
        // 获取摄像头信息
        getCameraList() {
            this.axios.post("/camTra/getAllCamInfo").then(res => {
                this.camera_info = res.data.msg
            })
        },
        handleCamRowClick(row) {

            this.center = {lng: row.lng, lat: row.lat}
            this.zoom = 15
            let map = this.baidumap
            let clickPoint = new BMap.Point(row.lng, row.lat)
            const markerPoint = new BMap.Marker(clickPoint)
            markerPoint.name = row.camId
            map.addOverlay(markerPoint);
        },
        async handleTraRowClick(row) {
            let map = this.baidumap
            let traId = row.traId
            await this.getPointByTra(traId)
            // this.showPoint = true
            if(this.isShow.get(traId)){
              let idx;
              let overlayArr = this.overlayMap.get(traId)
              for(idx in overlayArr){
                map.removeOverlay(overlayArr[idx])
              }
              this.isShow.set(traId,false)
            }else {

              this.drawLine(this.pointTable, this.carInfo.get(row.carNumber).color, traId)
            }
            // this.playPause = false
            // this.play = false
            // this.drawLine(this.pointTable, row.color, rowID)
            // this.showCamera = false
            // this.showHeatMap = false
        },
        handlePointRowClick(row) {
            this.center = {lng: row.lng, lat: row.lat}
            this.zoom = 15
            let map = this.baidumap
            let clickPoint = new BMap.Point(row.lng, row.lat)
            const markerPoint = new BMap.Marker(clickPoint)
            markerPoint.name = row.camId
            map.addOverlay(markerPoint);
        },
        handleOriginTra(val){
            let map = this.baidumap
            if (val){
              this.showOriginTra()
            }else {
              let idx;
              let overlayArr = this.overlayMap.get("originTra")
              for(idx in overlayArr){
                map.removeOverlay(overlayArr[idx])
              }
            }
        },
        showTra(idx,carTable){
          this.carNumber = carTable[idx].carNumber
          this.getTraByCar()
          this.drawer = true
        },
        async showOriginTra(){
          if (this.originPointTable.length === 0){
            await this.getOriginTra()
          }
          this.drawLine(this.originPointTable,"#E00B0BFF", "originTra")
        },
        async getOriginTra() {
          this.originPointTable = []
          await this.axios.post("/taxi/getGpsPointByCar",{
            "carNumber": this.carNumber,
            "minTime": this.originTraTimeRange[0],
            "maxTime": this.originTraTimeRange[1],
          }).then(res => {
            res.data.msg.forEach(item => {
              this.originPointTable.push(
                  {
                    carNumber: item.carNumber,
                    lng: item.lng,
                    lat: item.lat,
                    time: dateFormat('yyyy-MM-dd HH:mm:ss',new Date(item.time)),
                    traId: item.traId
                  })
            })
          })
        },
        change(v) {
            console.log('change', v)
        },
        input(v) {
            console.log('input', v)
            let val = ''
            const map = this.baidumap
            if(v<10){
                val = '0' + v
            }else {
                val = '' + v
            }
            const clusterFlowLine = this.clusterFlowLine
            for(const key of Object.keys(clusterFlowLine)){
                if(key == val && clusterFlowLine[key].length > 0){
                    let potArr = []
                    potArr.push(new BMap.Point(clusterFlowLine[key][0].lng, clusterFlowLine[key][0].lat))
                    potArr.push(new BMap.Point(clusterFlowLine[key][1].lng, clusterFlowLine[key][1].lat))
                    let sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                        scale: 0.6,//图标缩放大小
                        strokeColor: '#fff',//设置矢量图标的线填充颜色
                        strokeWeight: 2,//设置线宽
                    });
                    let icons = new BMap.IconSequence(sy, '100%', '10%', false);//设置为true，可以对轨迹进行编辑

                    let trackLine = new BMap.Polyline(potArr, {
                        strokeColor: "#18a45b",//设置颜色
                        strokeWeight: 8,//宽度
                        strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                        enableEditing: false,//是否启用线编辑，默认为false
                        enableClicking: false,//是否响应点击事件，默认为true
                        icons: [icons]
                    });
                    trackLine.name = key
                    map.addOverlay(trackLine);
                }
                else{
                    const allOverlay = map.getOverlays()
                    for (let i=0;i<allOverlay.length;i++) {

                        if (allOverlay[i].name === key) {
                            map.removeOverlay(allOverlay[i])
                        }
                    }
                }
            }
        },
        formatTooltip(v) {
            var s = v + '时 - '
            v = v + this.step
            s = s + v + '时'
            return s
        },
        fun(val) {
            return Number(val).toFixed(6);
        },
        distanceFun(val) {
            return Number(val).toFixed(2);
        },
        timeFun(val) {
            return String(val);
        },
        getTraByCar() {
            this.tra_loading = true
            this.traTable = []
            this.axios.post("/taxi/getTraByCar", {
              "carNumber": this.carNumber,
              "minTime": this.timeRange[0],
              "maxTime": this.timeRange[1]
            }).then(res => {
                res.data.msg.forEach(item => {
                    if(!this.isShow.has(item.traId)){
                      this.isShow.set(item.traId,false)
                    }
                    this.traTable.push(
                        {
                            traId: item.traId,
                            carNumber: item.carNumber,
                            startTime: dateFormat('yyyy-MM-dd hh:mm:ss',new Date(item.startTime)),
                            endTime: dateFormat('yyyy-MM-dd hh:mm:ss',new Date(item.endTime)),
                            distanceCarry: item.distanceCarry,
                            distanceEmpty: item.distanceEmpty,
                            distanceCal: item.distanceCal,
                        })
                })
                this.tra_loading = false
            })
        },
        async getPointByTra(traId) {
          this.point_loading = true
          this.pointTable = []
          await this.axios.get("/taxi/getGpsPointByTra?traId=" + traId).then(res => {
            res.data.msg.forEach(item => {
              this.pointTable.push(
                  {
                    carNumber: item.carNumber,
                    lng: item.lng,
                    lat: item.lat,
                    time: dateFormat('yyyy-MM-dd hh:mm:ss',new Date(item.time)),
                    traId: item.traId
                  })
            })
            this.point_loading = false
          })
        },
        drawLine(arrLngLat, color, traId) {
            this.arrPois = []
            const map = this.baidumap
            //该轨迹点中的marker
            let makerArr = this.overlayMap.get(traId)
            if (makerArr === undefined){
              makerArr = [];
            }

            let startIcon = new BMap.Icon('https://webapi.amap.com/theme/v1.3/markers/n/start.png', new BMap.Size(28, 30), {anchor: new BMap.Size(10, 25)});
            let endIcon = new BMap.Icon('https://webapi.amap.com/theme/v1.3/markers/n/end.png', new BMap.Size(28, 30), {anchor: new BMap.Size(10, 25)});
            for (let i = 0; i < arrLngLat.length; i++) {
                this.arrPois.push(new BMap.Point(arrLngLat[i].lng, arrLngLat[i].lat))
            }
            let startPoint = new BMap.Point(arrLngLat[0].lng, arrLngLat[0].lat)
            const startMaker = new BMap.Marker(startPoint, {icon: startIcon})
            map.addOverlay(startMaker);
            makerArr.push(startMaker)

            let endPoint = new BMap.Point(arrLngLat[arrLngLat.length - 1].lng, arrLngLat[arrLngLat.length - 1].lat)
            const endMaker = new BMap.Marker(endPoint, {icon: endIcon})
            map.addOverlay(endMaker);
            makerArr.push(endMaker)

            const line = new BMap.Polyline(this.arrPois, {
                strokeColor: color,
                strokeWeight: '4',
                strokeOpacity: 0.9,  // 折线的透明度，取值范围0 - 1
            })
            map.addOverlay(line);
            map.setViewport(this.arrPois);
            makerArr.push(line)

            this.overlayMap.set(traId,makerArr)

            this.isShow.set(traId,true)
        },
        /** 路书初始化*/
        initLushu(map, arrPois) {
            const fly = 'data:image/png;base64,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';
            const curZoom = map.getZoom()
            let drawSpeed = 4000
            if (curZoom === 17) {
                drawSpeed = 500
            } else if (curZoom === 13) {
                drawSpeed = 5500
            } else if (curZoom === 15) {
                drawSpeed = 5000
            } else if (curZoom === 16) {
                drawSpeed = 1000
            } else if (curZoom === 14) {
                drawSpeed = 6000
            } else if (curZoom === 19) {
                drawSpeed = 200
            } else if (curZoom === 18) {
                drawSpeed = 300
            }

            this.lushu = new BMapLib.LuShu(map, arrPois, {
                defaultContent: this.carNumber,
                autoView: true,
                icon: new BMap.Icon(fly, new BMap.Size(48, 48), {anchor: new BMap.Size(24, 24)}),
                speed: drawSpeed,
                enableRotation: true,
                landmarkPois: []
            });
        },
        turnCluster(val) {
            if (!val) {
                this.markerCluster.clearMarkers()
                let map = this.baidumap
                map.clearOverlays();
            } else {
                this.initCluster()
                // this.findNotIncludePoint()
                this.getClusterFlow()
            }
        },
        handlePlay() {
            this.play = true
            let map = this.baidumap
            // map.disableScrollWheelZoom()
            if (!this.playPause) {
                this.initLushu(map, this.arrPois)
            }
            this.lushu.start()
        },
        initCluster() {
            let map = this.baidumap
            let markers = []
            this.camera_info.forEach(item => {
                let markerPoint = new BMap.Marker(new BMap.Point(item.lng, item.lat))
                markerPoint.name = item.id
                markers.push(markerPoint);
            })

            // let markerCluster = new BMapLib.MarkerClusterer(map, {markers: markers, isAverageCenter: true, styles: this.sts});
            let markerCluster = new BMapLib.MarkerClusterer(map, {markers: markers, isAverageCenter: true});
            this.markerCluster = markerCluster
        },
        findNotIncludePoint() {
            //cluster遍历不到地图zoom范围内没有显示的点。
            let markerCluster = this.markerCluster
            let arr = []
            let cluster = markerCluster._clusters;
            for (let i = 0; i < cluster.length; i++) {
                // if (cluster[i]._markers.length < 2) continue;
                cluster[i]._markers.forEach(item => {
                    arr.push(item)
                })
            }
            markerCluster.getMarkers().forEach(item => {
                let name = item.name
                let flag = true
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].name == name) {
                        flag = false
                    }
                }
                if (flag) {
                    console.log('not include:' + item.name)
                }
            })
        },
        handlePause() {
            this.playPause = true
            this.lushu.pause()
            this.play = false
        },
        getClusterFlow() {
            this.clusterFlowLine = {}
            const map = this.baidumap
            const markerCluster = this.markerCluster
            const traTable = this.traTable
            let clusterArr = []
            let cluster = markerCluster._clusters;
            let geocoder = new BMap.Geocoder();
            for (let i = 0; i < cluster.length; i++) {
                let pointArr = []
                cluster[i]._markers.forEach(item => {
                    pointArr.push(item.name)
                })
                // let labelPoint=new BMap.Point(cluster[i]._center.lng,cluster[i]._center.lat);
                // let addr = ''
                // geocoder.getLocation(labelPoint, (result) => {
                //     addr = result.address;
                //     let label = new BMap.Label(addr, {position: labelPoint});
                //     label.setStyle({
                //         color: "#fff",
                //         backgroundColor: "rgba(0, 0, 0, 0.5)",
                //         borderRadius: "10px",
                //         padding: "0 10px",
                //         fontSize: "14px",
                //         lineHeight: "20px",
                //         border :"0",
                //         transform:'translateX(-50%)'
                //     });
                //     map.addOverlay(label);
                // });
                clusterArr.push({
                    clusterId: i,
                    center: cluster[i]._center,
                    points: pointArr,
                    startCount: 0,
                    endCount: 0
                })
            }
            let keyArray = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]
            let clusterCountMap = {}
            keyArray.forEach(item => {
                clusterCountMap[item] = JSON.parse(JSON.stringify(clusterArr))
            })
            for (let i = 0; i < traTable.length; i++) {
                let hour = traTable[i].startTime.split(' ')[1].split(':')[0]
                let tempCluster = clusterCountMap[hour]
                const startPoint = traTable[i].points[0].camId
                const endPoint = traTable[i].points[traTable[i].points.length - 1].camId
                for (let j = 0; j < tempCluster.length; j++) {
                    if (tempCluster[j].points.includes(startPoint)) {
                        tempCluster[j].startCount += 1
                    }
                    if (tempCluster[j].points.includes(endPoint)) {
                        tempCluster[j].endCount += 1
                    }
                }
                clusterCountMap[hour] = tempCluster
            }
            for (const key of keyArray) {
                let startMax = 0
                let startMaxCluster = null
                let endMax = 0
                let endMaxCluster = null
                let lineArr = []
                clusterCountMap[key].forEach(item => {
                    if (item.startCount > startMax) {
                        startMax = item.startCount
                        startMaxCluster = item.center
                    }
                    if (item.endCount > endMax) {
                        endMax = item.endCount
                        endMaxCluster = item.center
                    }
                })
                if (startMax > 0 && endMax > 0 && startMaxCluster != endMaxCluster) {
                    lineArr.push(startMaxCluster)
                    lineArr.push(endMaxCluster)
                }
                this.clusterFlowLine[key] = lineArr
            }
            // this.axios.post("/camTra/getClusterFlow", clusterArr).then(res => {
            //     console.log(res.data.msg)
            // })
        },

    },
    created() {
        this.car_loading = true
        let selected = this.$route.query.selected
        if(typeof selected[0] == 'object'){
          sessionStorage.setItem('selected',JSON.stringify(selected))
        }
        let carTable = JSON.parse(sessionStorage.getItem('selected'))
      for(let idx in carTable){
        carTable[idx].color = this.defaultColor
        let carNumber = carTable[idx].carNumber
        if (this.carInfo.get(carNumber) === undefined){
          let info = {}
          info.color = this.defaultColor
          this.carInfo.set(carNumber,info)
        }
      }

        this.carTable = carTable
        this.car_loading = false
        this.timeRange = this.$route.query.timeRange;

    },
    mounted() {
    },
    updated() {
    },
    watch: {}
}
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
