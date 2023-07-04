<template>
    <el-container style="height: 100%">
        <el-aside width="25%">
            <el-tag class="table_header" effect="dark">摄像头列表</el-tag>
            <el-table
                v-loading="cam_loading"
                element-loading-text="加载数据中"
                highlight-current-row
                :data="camTable.slice((cam_current_page-1) * 5, cam_current_page * 5)"
                @current-change="handleCurrentChange"
                ref="camTable"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    align="center"
                    label="摄像头"
                >
                </el-table-column>
                <el-table-column
                    prop="info"
                    align="center"
                    label="地址"
                >
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="deleteRow(scope.$index, camTable)"
                            type="text"
                            size="small">
                            移除
                        </el-button>
                    </template>
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
            <div v-show="showFlow">
                <el-tag type="warning" class="FLOW_header" effect="dark">卡口流量</el-tag>
                <el-table
                    v-loading="flow_loading"
                    highlight-current-row
                    element-loading-text="加载数据中"
                    :data="flowTable.slice((flow_current_page-1) * 12, flow_current_page * 12)"
                    ref="flowTable"
                    style="width: 100%">
                    <el-table-column
                        prop="startTime"
                        align="center"
                        label="开始时间"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="endTime"
                        align="center"
                        label="终止时间"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="count"
                        align="center"
                        label="交通流量"
                    >
                    </el-table-column>
                </el-table>
                <el-pagination
                    :current-page="flow_current_page"
                    :total='flowTable.length'
                    layout="prev, pager, next"
                    @current-change="handleFLOWpageChange"
                    :page-size="12"
                >
                </el-pagination>
            </div>
        </el-aside>
        <el-main style="padding: 0">
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
                    <el-date-picker
                        style="margin-left: 10px;"
                        v-model="timeRange"
                        :default-value="defaultDate"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                    <el-select style="margin-left: 10px" v-model="timeGranularity" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button
                        style="margin-left: 10px"
                        type="primary"
                        @click="getCityFlow"
                        size="mini"
                    >查询</el-button>
                    <el-switch
                        style="margin-left: 10px"
                        v-model="showChart"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="显示图表"
                        inactive-text="隐藏图表">
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
                <div id="myChart" v-show="showChart" style="width:1000px;height:500px;"></div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import { Loading } from 'element-ui';
export default {
    name: "cityFlow",
    components: {
    },
    data() {
        return {
            showChart: false,
            showFlow: false,
            flow_loading: false,
            flowTable: [],
            flow_current_page: 1,

            // 地图中心
            center: '济南',
            // 车牌信息
            carID: '',
            // 海量点信息
            camera_info: [],
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
            defaultDate: new Date(2021, 1, 1, 0, 0),
            timeRange: [],
            cityFlow: null,
            options: [
                {
                    value: 10,
                    label: '10min'
                },
                {
                    value: 30,
                    label: '30min'
                },
                {
                    value: 60,
                    label: '1hour'
                }
            ],
            timeGranularity: null,
            cam_loading: false,
            cam_current_page: 1,
            camTable: []
        }
    },
    methods: {
        handler({BMap, map}) {
            this.baiduMap = BMap
            this.baidumap = map
        },
        eChartsInit(data) {
            let xAxis = []
            let series = []
            let legend = []
            data[0].camFlows.forEach( item => {
                let tempTime = item.startTime.substr(11,5) + '-' + item.endTime.substr(11,5)
                xAxis.push(tempTime)
            })
            data.forEach( item1 => {
                let tempSeries = {
                    name: item1.camId,
                    data: [],
                    type: 'line',
                    stack: 'x'
                }
                legend.push(item1.camId)
                item1.camFlows.forEach( item2 => {
                    tempSeries['data'].push(item2.count)
                })
                series.push(tempSeries)
            })
            let option = {
                title: {
                    text: '卡口流量变化比较', // 标题名称
                },
                xAxis: {
                    data: xAxis
                },
                yAxis: {},
                series: series,
                legend: {
                    data: legend
                }
            }
            let myChart = this.$echarts.init(document.getElementById("myChart"));
            myChart.setOption(option)
            // this.showChart = true
        },
        handleCAMpageChange(val) {
            this.cam_current_page = val
        },
        handleFLOWpageChange(val) {
            this.flow_current_page = val
        },
        handleMapClick(e) {
            console.log(e.point.lng, e.point.lat)
        },
        infoWindowClose() {
            this.showInfo = false
        },
        infoWindowOpen() {
            this.showInfo = true
        },
        handleCurrentChange(val) {
            this.showFlow = true
            if (val != null) {
                this.flow_loading = true
                this.cityFlow.forEach(item => {
                    if (item.camId === val.id)
                    {
                        this.flowTable = item.camFlows
                        console.log(this.flowTable)
                        this.flow_loading = false
                    }
                })
            }
        },
        deleteRow(index, rows) {
            let row = rows[index].id
            rows.splice(index, 1);
            let map = this.baidumap
            const allOverlay = map.getOverlays()
            for (let i=0;i<allOverlay.length;i++) {
                if (allOverlay[i].name === row) {
                    map.removeOverlay(allOverlay[i])
                }
            }
        },
        // 点图标点击事件
        clickHandler(e) {
            let map = this.baidumap
            let clickPoint = new BMap.Point(e.point.lng, e.point.lat)
            const markerPoint = new BMap.Marker(clickPoint)
            this.infoPosition.lng = e.point.lng
            this.infoPosition.lat = e.point.lat
            this.camera_info.forEach(item => {
                if (item.lng === this.infoPosition.lng && item.lat === this.infoPosition.lat) {
                    this.infoCont = '编号：' + item.id + '<br/>' + '地址：' + item.info
                    this.camTable.push({id: item.id, info: item.info})
                    const label = new BMap.Label(item.id, {offset: new BMap.Size(-20, 0)});
                    markerPoint.setLabel(label);
                    markerPoint.name = item.id
                    map.addOverlay(markerPoint);
                }
            })
            // this.showInfo = true
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
        getCityFlow() {
            let camIds = []
            this.camTable.forEach(item => {camIds.push(item.id)})
            let param = {
                // camIds: ["3701126493", "3701126286"],
                camIds: camIds,
                startTime: this.timeRange[0],
                endTime: this.timeRange[1],
                timeGranularity: this.timeGranularity
            }
            console.log(param)
            let loading = Loading.service({ fullscreen: true, text: 'Loading'});
            this.axios.post("/camTra/countCityFlow", param).then(res => {
                this.cityFlow = res.data.msg
                this.eChartsInit(res.data.msg)
                console.log(this.cityFlow)
                setTimeout(() => {
                    loading.close();
                }, 1000);

            })
        }
    },
    created() {
        this.getCameraList()
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