<template>
    <el-container style="height: 100%">
        <el-aside width="25%">
            <el-tabs v-model="activeTab" @tab-click="handleTabClick" type="card" :stretch="true">
                <el-tab-pane label="卡口" name="first">
                    <el-form label-position="left">
                        <el-form-item>
                            <el-radio-group v-model="radio" @change="radioChange">
                                <el-radio :label="1">查看全部数据</el-radio>
                                <el-radio :label="2">仅查看外埠车辆数据</el-radio>
                                <el-radio :label="3">仅查看省内车辆数据</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="选择日期范围">
                            <el-date-picker
                                    v-model="timeRange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="startTime"
                                    end-placeholder="endTime">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="选择时间切分粒度">
                            <el-select v-model="step" placeholder="请选择">
                                <el-option
                                        style="width:250px"
                                        v-for="item in steps"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="拖动查看流量变化">
                            <div style="display: inline-block ; width:300px">
                                <!--                滑块部分-->
                                <!--                滑块有两个事件，change和input 不同点， change 值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发） input 	数据改变时触发（使用鼠标拖曳时，活动过程实时触发）-->
                                <el-slider v-model="slider" :step="step" :max="24-step" :format-tooltip="formatTooltip"
                                           @change="change" @input="input" :disabled="sliderDisable"></el-slider>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="changeSliderShow">
                                查看城市流量变化
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-tag class="table_header" effect="dark">摄像头列表</el-tag>
                    <el-table
                            v-loading="cam_loading"
                            element-loading-text="加载数据中"
                            highlight-current-row
                            :data="camTable.slice((cam_current_page-1) * 5, cam_current_page * 5)"
                            @row-click="handleCamRowClick"
                            ref="camTable"
                            :default-sort="{prop:'count',order:'descending'}"
                            style="width: 100%">
                        <el-table-column
                                prop="camId"
                                align="center"
                                label="摄像头"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="count"
                                align="center"
                                sortable
                                label="流量"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="camAddress"
                                align="center"
                                label="地址"
                        >
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            :current-page="cam_current_page"
                            :total='camTable.length'
                            @current-change="handleCAMpageChange"
                            layout="prev, pager, next"
                            :page-size="5"
                    >
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="流向" name="second">
                    <el-tag class="table_header" effect="dark">聚合点列表</el-tag>
                    <el-table
                            v-loading="cluster_loading"
                            element-loading-text="加载数据中"
                            highlight-current-row
                            :data="clusterTable.slice((cluster_current_page-1) * 5, cluster_current_page * 5)"
                            @current-change="handleClusterRowClick"
                            ref="clusterTable"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                align="center"
                                label="聚合点"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="camNumber"
                                align="center"
                                label="摄像头数目"
                        >
                        </el-table-column>
                        <el-table-column
                                align="center"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        @click.native.prevent="deleteRow(scope.$index, clusterTable)"
                                        type="text"
                                        size="small">
                                    移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            :current-page="cluster_current_page"
                            :total='clusterTable.length'
                            layout="prev, pager, next"
                            @current-change="handleCLUSTERpageChange"
                            :page-size="5"
                    >
                    </el-pagination>
                    <el-form label-position="left">
                        <el-form-item>
                            <el-radio-group v-model="asOrigin" @change="radioChange">
                                <el-radio :label="true">作为起点</el-radio>
                                <el-radio :label="false">作为终点</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="选择日期">
                            <el-date-picker
                                    v-model="clusterDate"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="date"
                                    placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="选择时间切分粒度">
                            <el-select v-model="clusterStep" placeholder="请选择">
                                <el-option
                                        style="width:250px"
                                        v-for="item in steps"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="拖动查看流量变化">
                            <div style="display: inline-block ; width:300px">
                                <!--                滑块部分-->
                                <!--                滑块有两个事件，change和input 不同点， change 值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发） input 	数据改变时触发（使用鼠标拖曳时，活动过程实时触发）-->
                                <el-slider v-model="clusterSlider" :step="clusterStep" :max="24-step"
                                           :format-tooltip="formatTooltip"
                                           @change="change1" @input="input1"
                                           :disabled="clusterSliderDisable"></el-slider>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="clusterFlowSearch">
                                查看聚合点流向变化
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-tag class="table_header" effect="dark">流向列表</el-tag>
                    <el-table
                            v-loading="flow_loading"
                            element-loading-text="加载数据中"
                            highlight-current-row
                            :data="flowTable.slice((flow_current_page-1) * 5, flow_current_page * 5)"
                            @current-change="handleFlowRowClick"
                            :default-sort="{prop:'count',order:'descending'}"
                            ref="flowTable"
                            style="width: 100%">
                        <el-table-column
                                prop="targetCluster"
                                align="center"
                                label="起点"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="arrowToCluster"
                                align="center"
                                label="终点"
                        >
                        </el-table-column>
                        <el-table-column
                                sortable
                                prop="count"
                                align="center"
                                label="轨迹数目">
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            :current-page="flow_current_page"
                            :total='flowTable.length'
                            layout="prev, pager, next"
                            @current-change="handleFLOWpageChange"
                            :page-size="5"
                    >
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-aside>
        <el-main style="padding: 0;">
            <div class="mapView">
                <!-- 顶部按钮-->
                <div class="switchButton">
                    <el-switch
                            v-model="showCamera"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="显示摄像头"
                            inactive-text="隐藏摄像头">
                    </el-switch>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="showHeatMap"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="显示热力图"
                            inactive-text="隐藏热力图">
                    </el-switch>
                    <el-switch
                            style="margin-left: 10px"
                            v-model="showCluster"
                            @change="turnCluster"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="显示点聚合"
                            inactive-text="隐藏点聚合">
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
                    <bml-heatmap v-if="showHeatMap" :data="heatMapInfo" :max="heatMapMax" :radius="20"></bml-heatmap>
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
import {Loading} from 'element-ui';
import {BmlHeatmap} from "vue-baidu-map";

export default {
    name: "camFlow",
    components: {
        BmlHeatmap,
    },
    data() {
        return {
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
            showHeatMap: false,
            // 缩放大小
            zoom: 12,
            // 存百度地图实例
            baiduMap: null,
            baidumap: null,
            activeTab: 'first',
            cam_loading: false,
            cam_current_page: 1,
            camTable: [],
            cluster_loading: false,
            cluster_current_page: 1,
            clusterTable: [],
            labelPosition: 'left',
            lastCluster: null,
            startTime: new Date(2021, 2, 1, 0, 0),
            endTime: new Date(2021, 2, 2, 0, 0),
            //滑块绑定的值
            slider: 0,
            //滑块滑动的步长
            step: 1,
            timeRange: [
                '2021-02-01 00:00:00',
                '2021-02-02 00:00:00'
            ],
            steps: [{value: 1, label: '1小时'}, {value: 2, label: '2小时'}, {value: 4, label: '4小时'}, {
                value: 6,
                label: '6小时'
            }, {value: 8, label: '8小时'}],
            radio: 1,
            sliderDisable: true,
            HeatMapList: [],
            firstFlag: true,
            firstClusterFlag: true,
            showCluster: false,
            markerCluster: null,
            asOrigin: true,
            ClusterFlowList: [],
            clusterDate: '2021-02-01 00:00:00',
            clusterStep: 1,
            clusterSlider: 0,
            clusterSliderDisable: true,
            flow_loading: false,
            flow_current_page: 1,
            flowTable: [],
        }
    },
    methods: {
        handler({BMap, map}) {
            this.baiduMap = BMap
            this.baidumap = map
        },
        clearOverlay() {
            let map = this.baidumap
            this.showCamera = false
            this.showHeatMap = false
            map.clearOverlays();
        },
        handleTabClick(tab, event) {
            // console.log(tab, event);
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
            // console.log(e.target.getZoom())
            this.showInfo = false
        },
        // 获取摄像头信息
        getCameraList() {
            this.axios.post("/camTra/getAllCamInfo").then(res => {
                this.camera_info = res.data.msg
            })
        },
        handleMapClick(e) {
            const map = this.baidumap
            if ((this.lastCluster != map.currentCluster.name) && this.activeTab == 'second') {
                console.log(map.currentCluster)
                this.lastCluster = map.currentCluster.name
                this.clusterTable.push(map.currentCluster)
            }
            console.log(e.point.lng, e.point.lat)
        },
        infoWindowClose() {
            this.showInfo = false
        },
        infoWindowOpen() {
            this.showInfo = true
        },
        handleCAMpageChange(val) {
            this.cam_current_page = val
        },
        getHotMapInfoByTime() {
            let data = {startTime: '2021-02-01 00:00:00', endTime: '2021-02-02 00:00:00'}
            this.cam_loading = true
            this.camTable = []
            this.heatMapInfo = []
            let max = 0
            this.axios.post("/camTra/getHotMapInfoByTime", data).then(res => {
                res.data.msg.forEach(item => {
                    if (item.count > max) {
                        max = item.count
                    }
                    this.heatMapInfo.push({lng: item.camInfo.camLon, lat: item.camInfo.camLat, count: item.count})
                    this.camTable.push(
                        {
                            camId: item.camId,
                            count: item.count,
                            camAddress: item.camInfo.camAddress,
                            lng: item.camInfo.camLon,
                            lat: item.camInfo.camLat
                        })
                })
                this.heatMapMax = max
                this.showHeatMap = true
                this.cam_loading = false
            })
        },
        handleCamRowClick(row) {
            console.log(row)
            this.center = {lng: row.lng, lat: row.lat}
            this.zoom = 15
            let map = this.baidumap
            let clickPoint = new BMap.Point(row.lng, row.lat)
            const markerPoint = new BMap.Marker(clickPoint)
            markerPoint.name = row.camId
            map.addOverlay(markerPoint);
        },
        handleClusterRowClick(row) {
            console.log(row)
        },
        handleFlowRowClick(row) {
            console.log(row)
        },
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        handleCLUSTERpageChange(val) {
            this.cluster_current_page = val
        },
        handleFLOWpageChange(val) {
            this.cluster_current_page = val
        },
        radioChange() {
            console.log(this.radio)
        },
        changeSliderShow() {
            let param = {
                startTime: this.timeRange[0],
                endTime: this.timeRange[1],
                cutTime: this.step
            }
            this.cam_loading = true
            this.camTable = []
            this.heatMapInfo = []

            this.axios.post("/camTra/getHotMapInfoByTimeAndCut", param).then(res => {
                this.HeatMapList = res.data.msg
                this.showHeatMap = true
                this.cam_loading = false
                this.sliderDisable = false;
                this.input(0)
            })

        },
        clusterFlowSearch() {
            this.getClusterFlow()
        },
        formatTooltip(v) {
            var s = v + '时 - '
            v = v + this.step
            s = s + v + '时'
            return s
        },
        change(v) {
            console.log('change', v)
        },
        change1(v) {
            console.log('change1', v)
        },
        input(v) {
            if (!this.firstFlag) {
                console.log('input', v)
                console.log(this.radio)
                this.heatMapInfo = []
                this.camTable = []
                let index = this.slider / this.step
                console.log('index', index)
                this.HeatMapList[index].forEach(item => {
                    this.heatMapInfo.push({lng: item.camInfo.camLon, lat: item.camInfo.camLat, count: item.count})
                    this.camTable.push(
                        {
                            camId: item.camId,
                            count: item.count,
                            camAddress: item.camInfo.camAddress,
                            lng: item.camInfo.camLon,
                            lat: item.camInfo.camLat
                        })
                })
                this.heatMapMax = 1000
            }
            this.firstFlag = false
        },
        input1(v) {
            if (!this.firstClusterFlag) {
                console.log('input1', v)
                let index = this.clusterSlider / this.clusterStep
                console.log('index1', index)
                const map = this.baidumap
                let markerCluster = this.markerCluster
                let cluster = markerCluster._clusters;
                this.flowTable = []
                const allOverlay = map.getOverlays()
                for (let i = 0; i < allOverlay.length; i++) {
                    if (allOverlay[i].name === 'flowLine') {
                        map.removeOverlay(allOverlay[i])
                    }
                }
                this.ClusterFlowList[index].forEach(item => {
                    let that = item
                    this.flowTable.push(that)
                    let startPoint = null
                    let endPoint = null
                    if (that.targetCluster != that.arrowToCluster) {
                        for (let i = 0; i < cluster.length; i++) {
                            if (that.targetCluster == cluster[i]._name) {
                                startPoint = new BMap.Point(cluster[i]._center.lng, cluster[i]._center.lat)
                            }
                            if (that.arrowToCluster == cluster[i]._name) {
                                endPoint = new BMap.Point(cluster[i]._center.lng, cluster[i]._center.lat)
                            }
                        }
                        let count = that.count
                        // let sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                        //     scale: 0.6,//图标缩放大小
                        //     strokeColor: '#fff',//设置矢量图标的线填充颜色
                        //     strokeWeight: 2,//设置线宽
                        // });
                        // let icons = new BMap.IconSequence(sy, '100%', '10%', false);//设置为true，可以对轨迹进行编辑
                        // let trackLine = new BMap.Polyline([startPoint, endPoint], {
                        //     strokeColor: "#18a45b",//设置颜色
                        //     strokeWeight: 8,//宽度
                        //     strokeOpacity: 1,//折线的透明度，取值范围0 - 1
                        //     enableEditing: false,//是否启用线编辑，默认为false
                        //     enableClicking: false,//是否响应点击事件，默认为true
                        //     icons: [icons]
                        // });
                        let trackLine = new BMap.Polyline([startPoint, endPoint], {
                            strokeColor: "#18a45b",
                            strokeWeight: '4',
                            strokeOpacity: 0.9,  // 折线的透明度，取值范围0 - 1
                        })
                        trackLine.name = 'flowLine'
                        map.addOverlay(trackLine);
                    }


                })
            }
            this.firstClusterFlag = false
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
        turnCluster(val) {
            let map = this.baidumap
            if (!val) {
                this.markerCluster.clearMarkers()
                map.clearOverlays();
                map.enableDoubleClickZoom(true) //禁止缩放
                map.enableDragging(true);     //禁止拖拽
                map.enableScrollWheelZoom(true);//禁止缩放
            } else {
                map.disableDoubleClickZoom() //禁止缩放
                map.disableDragging();     //禁止拖拽
                map.disableScrollWheelZoom();//禁止缩放
                this.initCluster()
            }
        },
        getClusterFlow() {
            let markerCluster = this.markerCluster
            let clusterTable = this.clusterTable
            let allCluster = []
            let targetCluster = []
            let cluster = markerCluster._clusters;
            for (let i = 0; i < cluster.length; i++) {
                allCluster.push({clusterName: cluster[i]._name, points: cluster[i]._points, asOrigin: null})
            }
            for (let i = 0; i < clusterTable.length; i++) {
                targetCluster.push({
                    clusterName: clusterTable[i].name,
                    points: clusterTable[i].points,
                    asOrigin: this.asOrigin
                })
            }
            let param = {
                targetCluster: targetCluster,
                allCluster: allCluster,
                searchDate: this.clusterDate,
                cutTime: this.clusterStep,
            }
            this.flow_loading = true
            this.axios.post("/stat/getClusterFlow", param).then(res => {
                console.log(res.data.msg)
                this.ClusterFlowList = res.data.msg
                this.showCluster = true
                this.clusterSliderDisable = false
                this.input1(0)
                this.flow_loading = false
            })
        },
    },
    created() {
        this.getCameraList()
        // this.getHotMapInfoByTime()
    },
    mounted() {
    },
    watch: {}
}
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
