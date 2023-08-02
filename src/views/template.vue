<template>
    <el-container style="height: 100%">
        <el-aside width="25%">
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
export default {
    name: "template",
    components: {},
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
            // 缩放大小
            zoom: 12,
            // 存百度地图实例
            baiduMap: null,
            baidumap: null,
        }
    },
    methods: {
        handler({BMap, map}) {
            this.baiduMap = BMap
            this.baidumap = map
            // this.initGrid()

        },
        clearOverlay() {
            let map = this.baidumap
            this.showCamera = false
            map.clearOverlays();
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
            console.log(e.point.lng, e.point.lat)
        },
        infoWindowClose() {
            this.showInfo = false
        },
        infoWindowOpen() {
            this.showInfo = true
        },

    },
    created() {
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
</style>
