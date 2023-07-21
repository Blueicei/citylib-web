<!--车辆次数统计 某段时间内通过卡口的车辆及对应次数，所经过的卡口，该车辆轨迹-->
<template>
  <div class="info">
    <div class="info-title">卡口轨迹统计
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="查询条件" name="first">
        <div >
          <el-form ref="ruleForm" :model="form" :rules="rules"  label-width="80px" >
            <el-form-item label="卡口组" prop="camIds">
<!--              <el-input v-model="form.camIds" placeholder="输入多个用英文逗号分开,或者从本地文件中上传"></el-input>-->
              <el-select v-model="form.camIds" filterable clearable collapse-tags multiple  placeholder="请选择">
                <el-option
                  v-for="item in allData"
                  :label="item.camAddress"
                  :value="item.camId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <input type="file" ref="fileInput" @change="handleFileChange1">
            </el-form-item>
            <el-form-item required label="起止时间">
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-date-picker
                    v-model="form.startTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd hh:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    placeholder="选择日期时间"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd hh:mm:ss"
                  >
                  </el-date-picker>
                </el-form-item>

              </el-col>
            </el-form-item>

            <el-form-item>
              <el-button size="medium" type="primary" @click="importFromMap">导入地图上的卡口</el-button>
              <el-button size="medium" type="primary" @click="onSubmit" style="width: 100px;">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="查询结果" name="third">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="500"
          v-loading="loading1"
          :row-key="getRowKey"
          :expand-row-keys="expandedRows"
          :default-sort="{ prop: 'count', order: 'descending'}"
          @selection-change="handleSelectionChange"
          @expand-change="expandChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="expand"
            width="55">
            <template slot-scope="props">
              <div v-for="point in props.row.features.geometry.coordinates">{{point}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="carNumber"
            label="车牌号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="count"
            label="次数"
            sortable
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="cams"
            label="经过卡口"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
<!--        <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="currentPage"-->
<!--          :page-sizes="[10, 20, 30, 40]"-->
<!--          :page-size="pageSize"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="totalItems">-->
<!--        </el-pagination>-->

        <el-button type="primary" style="margin-top: 10px" @click="showData">展示所选轨迹</el-button>
        <el-button type="primary" style="margin-top: 10px" @click="showMap">生成图表</el-button>
      </el-tab-pane>
<!--      <el-tab-pane label="轨迹设置" name="fourth">-->
<!--        <el-table-->
<!--          :data="colors"-->
<!--          height="500">-->
<!--          <el-table-column-->
<!--            label="车牌号">-->
<!--            <template  slot-scope="scope">-->
<!--              <el-button type="text" @click="focusTra(scope.row.first)">-->
<!--                {{scope.row.carNumber}}-->
<!--              </el-button>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column-->
<!--            label="颜色">-->
<!--            <template  slot-scope="scope">-->
<!--              <el-color-picker v-model="scope.row.color"></el-color-picker>-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--        </el-table>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="数据统计" name="fifth">
        <el-tabs>
          <el-tab-pane label="直方图">
            <CountChart1 id="count-echart1"
                       class="count-echart1"
                       :option="option1">
            </CountChart1>
          </el-tab-pane>
          <el-tab-pane label="饼图">
            <CountChart2 id="count-echart2"
                       class="count-echart2"
                       :option="option2">

            </CountChart2>

          </el-tab-pane>

        </el-tabs>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
var car1=[]
var count = []
import CountChart1 from "../echarts/countChart1.vue";
import CountChart2 from "../echarts/countChart2.vue";
import {vehicleCamStats, listByCarNumberOrderInTimeRange} from "../../api/map";
// import CamChart1 from "../echarts/camChart1.vue";
// import CamChart2 from "../echarts/camChart2.vue";

var colors = ['#FAE200', '#D27E37', '#C53634', '#C12B6E', '#A92E9A', '#67238A', '#211A50', '#18244E'];
var allData = []
var e = []
var a = []
const axios = require('axios');
export default {
  props:{
    camList:{}
  },
  components: {
    CountChart1,
    CountChart2,
  },
  data() {
    return {
      // dataonLineListSelections: [],
      allData:[],
      alreadyDriving:[],
      loading1:false,
      lines:[],
      activeName: 'first',
      colors:[],
      form: {
        camIds: '',
        startTime:'2021-02-01 00:00:00',
        endTime:'2021-02-01 23:59:59',
      },
      tableData:[
        {
          carNumber:'',
          count:'',
          cams:'',
        }
      ],
      // currentPage: 1, // 当前页码
      // pageSize: 5, // 每页显示的条数
      // totalItems: 0, // 总条数
      expandedRows: [],
      selected: [],
      points: [],
      rules:{
        camIds: [
          { required: true, message: '请输入卡口号', trigger: 'change' }
        ],
        startTime: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        endTime: [
          { type: 'string', required: true, message: '请选择时间', trigger: 'change' }
        ],
       },
      option1:{},
      option2:{},
    }
  },
  created() {
    this.$parent.point = []
    this.$parent.polylinePath = []
    this.$parent.pulseLines={}
    this.$parent.end = []
    this.$parent.start = []
    this.$parent.camList = []
    this.$parent.$refs.mapView.center = [117.120128,36.652069]
    this.colors = []
  },
  methods: {
    getRowKey(row) {
      return row.id; // 使用唯一标识作为行的 key
    },
    expandRow(row) {
      e.push(row.id); // 将行的唯一标识添加到展开数组中
    },
    collapseRow(row) {
      const index = e.indexOf(row.id);
      if (index !== -1) {
        e.splice(index, 1); // 从展开数组中移除行的唯一标识
      }
    },
    handleSelectionChange(rows) {
      this. dataonLineListSelections=rows
      this.selected = rows.map(function(rows) {
        return {
          id: rows.id,
          features: rows.features
        };
      })
    },
    handleFileChange1(event) {
      const file = event.target.files[0]; // 获取选择的文件
      const reader = new FileReader(); // 创建FileReader对象

      reader.onload = (e) => {
        const content = e.target.result; // 读取文件内容
        const processedContent = content.replace(/\r?\n|\r/g, "");
        const a = processedContent.split(',')
        this.$set(this.form, 'camIds', a)

        // 可以在此处执行其他逻辑或对读取到的内容进行处理
      };

      reader.readAsText(file); // 以文本形式读取文件内容
    },
    close(){
      this.$parent.isCount=false
      this.$parent.point = []
      this.$parent.end = []
      this.$parent.start = []
      this.$parent.camList = []
      this.$parent.polylinePath = []
      this.$parent.$refs.mapView.center = [117.120128,36.652069]
      this.colors = []
      this.deleteDriving()
    },
    expandChange(row, expandedRows){
      if (expandedRows.includes(row)) {
        this.expandRow(row)
        var a = []
        a.push(row.carNumber)
        let form = {
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          carNumbers: a,
        }

        if(this.tableData[row.id].features.geometry.coordinates.length === 0 ){
          this.loading1 = true
          listByCarNumberOrderInTimeRange(form).then((response) => {
            row.features = response.msg.features[0]
            this.tableData[row.id].features = response.msg.features[0]
            this.expandedRows = e
          })
          this.loading1 = false
        }

      } else {
        // 行被关闭
        this.collapseRow(row);

      }
    },
    showMap(){
      const length = this.selected.length
      if(length === 0){
        this.$alert('请选择轨迹', '提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      }else {
        var a = []
        // console.log("res",this. dataonLineListSelections)
        for (var i = 0; i < length; i++) {
          car1[i] = this.tableData[this.selected[i].id].carNumber
          count[i] = this.tableData[this.selected[i].id].count
          let data = {
            name: this.tableData[this.selected[i].id].carNumber,
            value: this.tableData[this.selected[i].id].count,
          }
          a.push(data)
        }
        this.option1 = {
          title: {
            text: '车牌号出现次数',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: car1,
            axisLabel: {
              color: '#6c706f',
              interval: 0
            },
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              barWidth: '50%',
              data: count,
              type: 'bar'
            }
          ]
        },
          this.option2 = {
            title: {
              text: '车牌号出现次数',
              // subtext: 'Fake Data',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: a,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
        this.activeName = 'fifth'
      }
    },
    deleteDriving(){
      for(var i =0;i<this.alreadyDriving.length;i++){
        this.alreadyDriving[i].clear()
      }
      this.alreadyDriving = []
    },
    async showData() {
      this.$parent.point = []
      this.$parent.end = []
      this.$parent.start = []
      this.$parent.polylinePath = []
      this.$parent.camList = []
      this.colors = []
      const length = this.selected.length
      var requests = []
      var needed = []
      if(length > 0) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        for (var i = 0; i < length; i++) {
          if (this.selected[i].features.geometry.coordinates.length === 0) {
            var a = []
            a.push(this.tableData[this.selected[i].id].carNumber)
            let form = {
              startTime: this.form.startTime,
              endTime: this.form.endTime,
              carNumbers: a,
            }
            const request = listByCarNumberOrderInTimeRange(form)
            requests.push(request)
            needed.push(this.selected[i].id)
          }
        }
        var b = true
        await Promise.all(requests).then((responses) => {
          for (var j = 0; j < responses.length; j++) {
            if (responses[j].code !== 200) {
              b = false;
              break;
            }
          }
          if (b) {
            this.$message({
              message: '查询成功',
              type: 'success'
            });
            for (var i = 0; i < responses.length; i++) {
              const id = needed[i]
              this.tableData[id].features = responses[i].msg.features[0]
            }
          } else {
            this.$message.error('查询失败');
          }
        })

        console.log('tabledata', this.tableData)
        if (b) {
          for (var k = 0; k < length; k++) {
            var id = this.selected[k].id
            this.$parent.polylinePath.push({
              id:id,
              path: this.tableData[id].features.geometry.coordinates,
              color: colors[id % colors.length],
              message: this.tableData[id].features.properties
            })
          }
        }
        this.lines =   this.$parent.polylinePath.map(function (obj){
          return obj.path
        })

        console.log('lines form idnex', this.lines)
        loading.close();
        this.plotTrace()
        // this.$parent.$refs.mapView.center = this.$parent.start[0].lnglat
        // this.$parent.$refs.mapView.visible.polyline = true;
        // this.$parent.$refs.mapView.visible.point = true;

      }else {
        this.$alert('请选择轨迹','提示',{
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      }

    },
    getTrace(){
      const length = this.selected.length
      if (length === 0) {
        this.$alert('请选择轨迹', '提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {


      }
    },
    plotTrace(){
      var map = this.$parent.$refs.mapView.$refs.map.$$getInstance()

      this.deleteDriving()
      var Path = this.lines

      for(var i = 0;i<Path.length;i++) {
        var information = Path[i]
        var origin = information[0]
        var destination = information[information.length - 1]
        // console.log('info',information)
        if (information.length > 2) {
          // console.log("有中间点")
          var waypoints = information.slice(1, information.length - 1)
        } else {
          var waypoints = []
        }
        AMap.plugin('AMap.Driving', (status, result) => {
          var driving = new AMap.Driving({
            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            policy: AMap.DrivingPolicy.LEAST_TIME,
            // map 指定将路线规划方案绘制到对应的AMap.Map对象上
            map: map,
            waypoints: waypoints,
            // path:waypoints
          })

          // 搜索完成后，将自动绘制路线到地图上
          driving.search(origin, destination, (status, result) => {
            // if(status==='complete'){
            //
            //   var paths = result.routes[0].path;
            //    this.$parent.paths.push(paths.map(path => path.split(',')))
            // }
          })
          this.alreadyDriving.push(driving)

        })
      }
    },
    importFromMap() {
      var a = this.$parent.camList.map(function(marker) {
        return marker.camId
      })
        this.form.camIds = a

    },
    async onSubmit(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // Form is valid, proceed with submission
          this.tableData = []
          this.$parent.point = []
          this.$parent.polylinePath = []
          this.$parent.camList = []
          this.colors = []
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          vehicleCamStats(this.form).then((response) => {
            if(response.code === 200){
              this.$message({
                message: '查询成功',
                type: 'success'
              });
              this.tableData = response.msg
              // var d = []
              for(var i=0; i<this.tableData.length; i++){
                this.tableData[i].id = i
                this.tableData[i].features = {
                  geometry:{coordinates:[]}
                }

              }
              loading.close()
              this.activeName = 'third'
            }else {
              this.$message.error('查询失败');
            }

          })
        } else {
          // Form is invalid, show error messages
          console.log('error submit!!');
          return false;
        }
      });

    },

    focusTra(point){
      this.$parent.$refs.mapView.center = point
    },
  },
}
</script>

<style lang="scss" scoped>
.info {
  position: fixed;
  width: 600px;
  left: 30px;
  top: 20px;
  background-color: rgb(255, 255, 255);
  color: #4f4d4d;
  padding: 25px 35px;
  border-radius: 5px;
  &-title {
    font-size: 28px;
    line-height: 32px;
    padding-bottom: 20px;
    &-desc {
      font-size: 14px;
      color: #9e9e9e;
      text-align: left;
    }
  }
  .cont {
    color: #ffffff;
    display: flex;
    &-item {
      flex: 33%;
      padding: 15px;
      &-num {
        color: #e91e63;
        font-size: 26px;
      }
      &-title {
        font-size: 18px;
        color: #ffffff;
      }
      &-desc {
        color: #adadad;
        font-size: 16px;
        &-num {
          color: #e91e63;
        }
      }
      .now {
        color: #ff5722;
      }
      .input {
        color: #f90;
      }
      .heal {
        color: #19be6b;
      }
      .dead {
        color: #a2a2a2;
        // text-decoration: line-through;
      }
      .ext {
        color: #00bcd4;
      }
    }
  }
}
</style>

<style lang="scss">
.info {
  .ivu-tabs-nav .ivu-tabs-tab {
    color: #aaaaaa;
  }
  .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #ffffff;
  }
  .ivu-tabs-ink-bar {
    background-color: #ffffff;
  }
}
.el-row {
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>


