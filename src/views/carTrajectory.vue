<template>
  <el-container style="height: 100%">
    <el-dialog title="数据库总览" :visible.sync="dialogVisible" width="80%">
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div>
              <el-statistic
                group-separator=","
                :value="traCount"
                title="轨迹总数"
              ></el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-statistic
                group-separator=","
                :value="carNumberCount"
                title="车辆总数"
              ></el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-statistic
                group-separator=","
                :value="carTypeCount"
                title="车辆类型总数"
              ></el-statistic>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-statistic
                group-separator=","
                :value="pointNumberCount"
                title="轨迹点总数"
              ></el-statistic>
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="carTypeTraCountMapTableChart" class="tableChart"></div>
          </el-col>
          <el-col :span="12">
            <div id="dateTraCountMapTableChart" class="tableChart"></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="timeDistributeTableChart" class="tableChart"></div>
          </el-col>
          <el-col :span="12">
            <div id="distanceDistributeTableChart" class="tableChart"></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="hourDistributeTableChart" class="tableChart"></div>
          </el-col>
          <el-col :span="12">
            <div id="dayDistributeTableChart" class="tableChart"></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <div id="traCountByCarTableChart" class="tableChartPlus"></div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-aside width="23%">
      <div id="timeDistributeChart" v-show="showChart" class="chart"></div>
      <div id="distanceDistributeChart" v-show="showChart" class="chart"></div>
      <div id="hourDistributeChart" v-show="showChart" class="chart"></div>
      <div id="dayDistributeChart" v-show="showChart" class="chart"></div>
    </el-aside>
    <el-main style="padding: 0">
      <div class="switchButton">
        <!--                <el-input placeholder="等待加载" v-model="carTotalNumber" :disabled="true" style="width: 300px;">-->
        <!--                    <template slot="prepend">车辆总数:</template>-->
        <!--                </el-input>-->
        <!--                <el-input placeholder="等待加载" v-model="traTotalNumber" :disabled="true"-->
        <!--                          style="width: 300px;margin-left: 20px">-->
        <!--                    <template slot="prepend">轨迹总数:</template>-->
        <!--                </el-input>-->
        <!--                <el-input placeholder="等待加载" v-model="pointTotalNumber" :disabled="true"-->
        <!--                          style="width: 300px;margin-left: 20px">-->
        <!--                    <template slot="prepend">轨迹点总数:</template>-->
        <!--                </el-input>-->
        <el-input
          placeholder="请输入车牌号"
          style="width: 150px; margin-bottom: 4px; margin-left: 10px"
          v-model="carNumberFilter"
        ></el-input>
        <el-date-picker
          v-model="timeRange"
          style="margin-left: 10px"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changRange"
        />
        <el-button
          style="margin-left: 10px"
          type="primary"
          @click="clickSearchButton"
          >查询
        </el-button>
      </div>
      <div>
        <el-tag type="warning" class="table_header" effect="dark"
          >车辆列表</el-tag
        >
        <el-table
          v-loading="car_loading"
          highlight-current-row
          element-loading-text="加载数据中"
          :data="carTable"
          ref="carTable"
          @row-click="handleRowClick"
          @sort-change="sortChange"
          style="width: 100%"
        >
          <el-table-column prop="carNumber" align="center" label="车牌号">
          </el-table-column>
          <el-table-column prop="carType" align="center" label="车牌类型">
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
          <el-table-column align="center" label="详情">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="goDetail(scope.$index, carTable)"
                type="text"
                size="small"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageNum"
          :total="total"
          layout="prev, pager, next"
          @current-change="handleCarPageChange"
          @next-click="handleNextClick"
          @prev-click="handlePrevClick"
          :page-size="pageSize"
        >
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { Loading } from "element-ui";

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
      //当前页码
      pageNum: 1,
      //当前页码
      pageSize: 10,
      //数据总数
      total: 0,
      //排序字段
      orderBy: null,
      //是否降序
      isDesc: false,
      //过滤时间范围
      timeRange: ["2021-02-01 00:00:00", "2021-02-01 23:59:59"],
      //车辆的统计信息
      carStat: null,
      dialogVisible: false,
      traCount: null,
      carTypeCount: null,
      carNumberCount: null,
      pointNumberCount: null,
      carNumberFilter: "",
    };
  },
  methods: {
    initBarChart(domId, title, keyArray, dict) {
      let xAxis = [];
      let series = [];
      let tempSeries = {
        data: [],
        type: "bar",
      };
      keyArray.forEach((item) => {
        xAxis.push(item);
        tempSeries["data"].push(dict[item]);
      });
      series.push(tempSeries);
      let option = {
        title: {
          text: title, // 标题名称
        },
        xAxis: {
          data: xAxis,
          axisLabel: {
            interval: 0,
            rotate: 40,
          },
        },
        yAxis: {
          type: "value",
        },
        series: series,
      };
      let eChart = this.$echarts.init(document.getElementById(domId));
      eChart.setOption(option);
    },
    getTableStatByTime() {
      this.dialogVisible = true;
      this.axios
        .post("/stat/getTableStatByTime", {
          startTime: this.timeRange[0],
          endTime: this.timeRange[1],
        })
        .then((res) => {
          let stat = res.data.msg;
          console.log(stat);
          this.traCount = stat.traCount;
          this.carTypeCount = stat.carTypeCount;
          this.carNumberCount = stat.carNumberCount;
          this.pointNumberCount = stat.pointNumberCount;

          let carTypeTraCountMap = stat.carTypeTraCountMap;
          let chartData = [];
          for (let key of Object.keys(carTypeTraCountMap)) {
            if (carTypeTraCountMap[key] > 10) {
              chartData.push({ name: key, value: carTypeTraCountMap[key] });
            }
          }
          let option = {
            title: {
              text: "车辆类型轨迹数饼图",
              left: "center",
            },
            tooltip: {
              trigger: "item",
            },
            legend: {
              orient: "vertical",
              left: "left",
            },
            series: [
              {
                type: "pie",
                radius: "50%",
                data: chartData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };
          let eChart = this.$echarts.init(
            document.getElementById("carTypeTraCountMapTableChart")
          );
          eChart.setOption(option);
          let dateTraCountMap = stat.dateTraCountMap;
          let keyArray = Object.keys(dateTraCountMap);
          keyArray.sort(function (a, b) {
            let aNum =
              parseInt(a.split("/")[0]) * 100 + parseInt(a.split("/")[1]);
            let bNum =
              parseInt(b.split("/")[0]) * 100 + parseInt(b.split("/")[1]);
            return aNum - bNum;
          });
          this.initBarChart(
            "dateTraCountMapTableChart",
            "日期轨迹数分布",
            keyArray,
            dateTraCountMap
          );
          let traDistanceDistribute = stat.traDistanceDistribute;
          keyArray = [
            "0-1km",
            "1-2km",
            "2-3km",
            "3-4km",
            "4-5km",
            "5-6km",
            "6-7km",
            "7-8km",
            "8-9km",
            "9-10km",
            "10-20km",
            "20-30km",
            "30-40km",
            "40-50km",
            "50-60km",
            "60-70km",
            "70-80km",
            "80-90km",
            "90-100km",
            "100km+",
          ];
          let flag = false;
          let tempDistanceDistribute = {};
          let tempKeyArray = [];
          keyArray.forEach((item) => {
            if (flag) {
              tempDistanceDistribute["30km<"] += traDistanceDistribute[item];
            } else {
              if (item === "30-40km") {
                tempDistanceDistribute["30km<"] = traDistanceDistribute[item];
                tempKeyArray.push("30km<");
                flag = true;
              } else {
                tempDistanceDistribute[item] = traDistanceDistribute[item];
                tempKeyArray.push(item);
              }
            }
          });
          this.initBarChart(
            "distanceDistributeTableChart",
            "行程距离分布",
            tempKeyArray,
            tempDistanceDistribute
          );

          let traTimeDistribute = stat.traTimeDistribute;
          keyArray = ["0-30min", "30min-1h", "1-2h", "2h+"];
          this.initBarChart(
            "timeDistributeTableChart",
            "行程时间分布",
            keyArray,
            traTimeDistribute
          );

          let traStartTimePerHour = stat.traStartTimePerHour;
          keyArray = Object.keys(traStartTimePerHour);
          this.initBarChart(
            "hourDistributeTableChart",
            "出发时间分布/h",
            keyArray,
            traStartTimePerHour
          );

          let traStartTimePerDay = stat.traStartTimePerDay;
          keyArray = Object.keys(traStartTimePerDay);
          this.initBarChart(
            "dayDistributeTableChart",
            "出发时间分布/day",
            keyArray,
            traStartTimePerDay
          );

          let traCountByCar = stat.traCountByCar;
          keyArray = Object.keys(traCountByCar);
          this.initBarChart(
            "traCountByCarTableChart",
            "车辆轨迹数分布图",
            keyArray,
            traCountByCar
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleRowClick(row) {
      this.axios
        .post("/stat/getStatByCar", {
          carNumber: row.carNumber,
          minTime: this.timeRange[0],
          maxTime: this.timeRange[1],
        })
        .then((res) => {
          let stat = res.data.msg;
          let traDistanceDistribute = stat["traDistanceDistribute"];
          let keyArray = [
            "0-1km",
            "1-2km",
            "2-3km",
            "3-4km",
            "4-5km",
            "5-6km",
            "6-7km",
            "7-8km",
            "8-9km",
            "9-10km",
            "10-20km",
            "20-30km",
            "30-40km",
            "40-50km",
            "50-60km",
            "60-70km",
            "70-80km",
            "80-90km",
            "90-100km",
            "100km+",
          ];
          let flag = false;
          let tempDistanceDistribute = {};
          let tempKeyArray = [];
          keyArray.forEach((item) => {
            if (flag) {
              tempDistanceDistribute["30km<"] += traDistanceDistribute[item];
            } else {
              if (item === "30-40km") {
                tempDistanceDistribute["30km<"] = traDistanceDistribute[item];
                tempKeyArray.push("30km<");
                flag = true;
              } else {
                tempDistanceDistribute[item] = traDistanceDistribute[item];
                tempKeyArray.push(item);
              }
            }
          });
          this.initBarChart(
            "distanceDistributeChart",
            "行程距离分布",
            tempKeyArray,
            tempDistanceDistribute
          );

          let traTimeDistribute = stat["traTimeDistribute"];
          keyArray = ["0-30min", "30min-1h", "1-2h", "2h+"];
          this.initBarChart(
            "timeDistributeChart",
            "行程时间分布",
            keyArray,
            traTimeDistribute
          );

          let traStartTimePerHour = stat["traStartTimePerHour"];
          keyArray = Object.keys(traStartTimePerHour);
          this.initBarChart(
            "hourDistributeChart",
            "出发时间分布/h",
            keyArray,
            traStartTimePerHour
          );

          let traStartTimePerDay = stat["traStartTimePerDay"];
          keyArray = Object.keys(traStartTimePerDay);
          this.initBarChart(
            "dayDistributeChart",
            "出发时间分布/day",
            keyArray,
            traStartTimePerDay
          );

          this.showChart = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleCarPageChange(val) {
      this.pageNum = val;
      this.getCarInfoList();
    },
    changRange(timeRange) {
      this.timeRange = timeRange;
    },
    handlePrevClick(val) {
      if (val > 1) {
        this.pageNum = val - 1;
        this.getCarInfoList();
      }
    },
    handleNextClick(val) {
      if (val * this.pageSize > this.total) {
        this.pageNum = val + 1;
        this.getCarInfoList();
      }
    },
    sortChange(column) {
      this.orderBy = column.prop;
      this.isDesc = column.order === "descending";
      this.getCarInfoList();
    },
    goDetail(index, rows) {
      let row = rows[index];
      console.log(row);
      this.$router.push({
        path: "/carDetail",
        query: { carNumber: row.carNumber },
      });
    },
    clickSearchButton() {
      this.getCarInfoList();
      this.getTableStatByTime();
    },
    getCarInfoList() {
      let loading = Loading.service({ fullscreen: true, text: "Loading" });
      this.axios
        .post("/stat/getStatList", {
          carNumber: this.carNumberFilter,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          minTime: this.timeRange[0],
          maxTime: this.timeRange[1],
          orderBy: this.orderBy,
          isDesc: this.isDesc,
        })
        .then((res) => {
          console.log(res.data.msg);
          this.carTable = res.data.msg.records;
          this.total = res.data.msg.total;
          loading.close();
        })
        .catch((err) => {
          console.log(err);
          loading.close();
        });
    },
    fun(val) {
      return Number(val).toFixed(2);
    },
    getTotal() {
      //todo 获取车辆总数、轨迹总数的接口未完成，待更新
      this.axios
        .post("/stat/info", {
          minTime: this.timeRange[0],
          maxTime: this.timeRange[1],
        })
        .then((res) => {
          this.carTotalNumber = res.data.msg.carNum;
          this.pointTotalNumber = res.data.msg.pointNum;
          this.traTotalNumber = res.data.msg.traNum;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.pageNum = 1;
    this.getCarInfoList();
    // this.getTotal();
    // this.getTableStatByTime()
  },
  mounted() {},
  watch: {},
};
</script>

<style scoped>
.table_header {
  //margin-top: 10px; font-size: 18px; font-weight: bold; font-family: "Microsoft YaHei"; width: 100%;
}

.switchButton {
  float: left;
  margin-top: 3px;
  margin-bottom: 3px;
  margin-left: 5px;
}

.chart {
  width: 460px;
  height: 220px;
}

.tableChart {
  width: 750px;
  height: 250px;
}
.tableChartPlus {
  width: 1500px;
  height: 250px;
}
</style>
