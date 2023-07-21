<template>
    <el-container style="height: 100%">
        <el-aside width="23%">
            <div id="timeDistributeChart" v-show="showChart" class="chart"></div>
            <div id="distanceDistributeChart" v-show="showChart" class="chart"></div>
            <div id="hourDistributeChart" v-show="showChart"  class="chart"></div>
            <div id="dayDistributeChart" v-show="showChart"  class="chart"></div>
        </el-aside>
        <el-main style="padding: 0;">
            <div class="switchButton">
                <el-input placeholder="等待加载" v-model="carTotalNumber" :disabled="true" style="width: 300px;">
                    <template slot="prepend">车辆总数:</template>
                </el-input>
                <el-input placeholder="等待加载" v-model="traTotalNumber" :disabled="true" style="width: 300px;margin-left: 20px">
                    <template slot="prepend">轨迹总数:</template>
                </el-input>
                <el-input placeholder="等待加载" v-model="pointTotalNumber" :disabled="true" style="width: 300px;margin-left: 20px">
                    <template slot="prepend">轨迹点总数:</template>
                </el-input>
            </div>
            <div >
                <el-tag type="warning" class="table_header" effect="dark">车辆列表</el-tag>
                <el-table
                        v-loading="car_loading"
                        highlight-current-row
                        element-loading-text="加载数据中"
                        :data="carTable.slice((car_current_page-1) * 10, car_current_page * 10)"
                        ref="carTable"
                        @row-click="handleRowClick"
                        style="width: 100%">
                    <el-table-column
                            prop="carNumber"
                            align="center"
                            label="车牌号"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="carType"
                            align="center"
                            label="车牌类型"
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
                        align="center"
                        label="详情">
                        <template slot-scope="scope">
                            <el-button
                                @click.native.prevent="goDetail(scope.$index, carTable)"
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
                        layout="prev, pager, next"
                        @current-change="handleCarPageChange"
                        :page-size="12"
                >
                </el-pagination>
            </div>

        </el-main>
    </el-container>
</template>

<script>
import {Loading} from 'element-ui';

export default {
    name: "carTrajectory",
    components: {},
    data() {
        return {
            carTotalNumber: null,
            pointTotalNumber: null,
            traTotalNumber: null,
            car_loading: false,
            showChart: false,
            carTable: [],
            carInfo: null,
            car_current_page: 1,
        }
    },
    methods: {
        initBarChart(domId, title,keyArray, dict){
            let xAxis = []
            let series = []
            let tempSeries = {
                data: [],
                type: 'bar'
            }
            keyArray.forEach((item) => {
                xAxis.push(item)
                tempSeries['data'].push(dict[item])
            })
            series.push(tempSeries)
            let option = {
                title: {
                    text: title, // 标题名称
                },
                xAxis: {
                    data: xAxis,
                    axisLabel: {
                        interval:0,
                        rotate:40
                    },
                },
                yAxis: {
                    type: 'value'
                },
                series: series,

            }
            let eChart = this.$echarts.init(document.getElementById(domId));
            eChart.setOption(option)
        },
        handleRowClick(row) {
            // this.showForm = true
            // this.tra.tableName = row.tableName
            console.log(row)
            let keyArray = ['0-30min', '30min-1h', '1h-2h', '2h<']
            this.initBarChart("timeDistributeChart", '行程时间分布', keyArray, row.traTimeDistribute)
            keyArray = ["0-1km","1-2km","3-4km","5-6km","7-8km","8-9km","9-10km","10-20km","20-30km","30-40km","40-50km","50-60km","60-70km","70-80km","80-90km","90-100km","100km<"]
            let tempDistanceDistribute = {}
            let tempKeyArray = []
            let flag = false
            keyArray.forEach((item) => {
                if(flag){
                    tempDistanceDistribute["30km<"] += row.traDistanceDistribute[item]
                }
                else {
                    if(item == "30-40km"){
                        tempDistanceDistribute["30km<"] = row.traDistanceDistribute[item]
                        tempKeyArray.push("30km<")
                        flag = true
                    }
                    else {
                        tempDistanceDistribute[item] = row.traDistanceDistribute[item]
                        tempKeyArray.push(item)
                    }
                }
            })
            this.initBarChart("distanceDistributeChart", '行程距离分布', tempKeyArray, tempDistanceDistribute)
            keyArray = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
            this.initBarChart("hourDistributeChart", '行程出发时间分布/h', keyArray, row.traStartTimePerHour)
            keyArray = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
            this.initBarChart("dayDistributeChart", '行程出发时间分布/day', keyArray, row.traStartTimePerDay)

            this.showChart = true
        },
        handleCarPageChange(val) {
            this.car_current_page = val
        },
        goDetail(index, rows) {
            let row = rows[index]
            console.log(row)
            this.$router.push({path:'/carDetail',query:{carNumber:row.carNumber}});
        },
        getCarInfoList() {
            this.carTable = []
            let loading = Loading.service({ fullscreen: true, text: 'Loading'});
            this.axios.get("/camTra/getCarInfoList").then(res => {
                this.carTotalNumber = res.data.msg.carCount
                this.pointTotalNumber = res.data.msg.pointCount
                this.traTotalNumber = res.data.msg.traCount
                for(const key in res.data.msg.carMap)
                {
                    let tempCar = res.data.msg.carMap[key]
                    this.carTable.push(tempCar)
                }
                setTimeout(() => {
                    loading.close();
                }, 1000);
            }).catch(err => {
                console.log(err)
                loading.close()
            })
        },
        fun(val){
            return Number(val).toFixed(2);
        },
    },
    created() {
        this.getCarInfoList()
    },
    mounted() {
    },
    watch: {}
}
</script>

<style scoped>
.table_header {
    //margin-top: 10px;
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
.chart {
    width:460px;
    height:220px;
}
</style>