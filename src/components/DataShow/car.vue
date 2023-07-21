<!--车辆卡口统计   一辆彻经过所有卡口信息 输出：某车辆在每个卡口的出现次数，最后出现时间，最后出现卡口-->
<script src="../../api/stream.js"></script>
<template>
  <div class="info">
    <div class="info-title">车辆轨迹查询
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
      <el-button type="primary" size="mini" icon="el-icon-setting" circle style="float:right" @click="help"></el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="查询条件" name="first">
        <div >
          <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px" >
            <el-form-item label="车牌号" prop="carNumber">
<!--              <el-input v-model="form.carNumber" placeholder="请输入车牌号"></el-input>-->
              <el-select v-model="form.carNumber" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in allData"
                  :key="item.carNumber"
                  :label="item.camNumber"
                  :value="item.carNumber">
                </el-option>
              </el-select>
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

              <el-button size="medium" type="primary" @click="onSubmit" style="width: 200px;">查询</el-button>
              <el-button size="medium" type="primary" @click="back" style="width: 200px;">返回主界面</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="查询结果" name="third">
        <el-tabs v-model="tableActive">
          <el-tab-pane label="卡口信息" name="cam">
            <el-table
              ref="multipleTable"
              :data="tableData"
              height="500"
              :default-sort="{ prop: 'count', order: 'descending'}"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column
                prop="camID"
                label="卡口"
                width="120">
              </el-table-column>
              <el-table-column
                prop="count"
                sortable
                label="出现次数"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="lastTime"
                label="最后出现时间"
                sortable
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="轨迹信息" name="tra">
            <el-table
              ref="multipleTable1"
              :data="infos"
              height="500"
              v-loading="load"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              style="width: 100%">
              <el-table-column
                type="selection"
                width="100">
              </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="车牌号">
                      <span>{{ props.row.carNumber }}</span>
                    </el-form-item>
                    <el-form-item label="车牌类型">
                      <span>{{ props.row.carType }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
<!--              <el-table-column-->
<!--                label="里程(公里)"-->
<!--                sortable-->
<!--                prop="distance"-->
<!--                width="120">-->
<!--              </el-table-column>-->
              <el-table-column
                label="日期"
                sortable
                prop="date"
                width="120">
              </el-table-column>
              <el-table-column
                label="时间"
                prop="time"
                width="240">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-button type="primary" style="margin-top: 10px" @click="getTrace">展示轨迹</el-button>
      </el-tab-pane>
      <el-tab-pane label="数据统计" name="fourth">
        <el-tabs>
          <el-tab-pane label="直方图">
            <CamChart1 id="cam-echart1"
                       class="cam-echart1"
                       :option="option1">
            </CamChart1>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="轨迹分析" name="fifth">
        <el-tabs v-model="activeNames" @tab-click="handleClicks">
        <el-tab-pane label="查看热力图" name="hot">
          <el-button type="success" @click="showHeatMapDatas">查看热力图</el-button>
          <el-button type="success" @click="closeHeatMapDatas">关闭热力图</el-button>
        </el-tab-pane>
        <el-tab-pane label="POI分析" name="sixth">
          <el-table
            :data="POIData1"
            stripe
            style="width: 100%">
            <el-table-column label="常见目的地">
              <template slot-scope="scope">
                {{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleClickkk(scope.row)" type="text" >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="POIData2"
            stripe
            style="width: 100%">
            <el-table-column label="常见出发地">
              <template slot-scope="scope">
                {{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleClickkk(scope.row)" type="text" >查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-button @click="showPOIPoint">展示POI</el-button>
          <el-button @click="closePoiPoint">隐藏POI</el-button>
        </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
var ID=[]
var count=[]
var lines=[]
import CamChart1 from "../echarts/camChart1.vue";
import CamChart2 from "../echarts/camChart2.vue";
import {camCountByCar, listByCarNumberOrderInTimeRange, getHeatMapByCar, POISearch} from "../../api/map";
const axios = require('axios');
export default {
  components:{
    CamChart1,
    CamChart2,
  },
  props:{
    camList:{}
  },
  data() {
    return {
      tableActive:'cam',
      activeName: 'first',
      form: {
        carNumber: '',
        startTime:'2021-02-01 00:00:00',
        endTime:'2021-02-01 23:59:59',
      },
      load:false,
      alreadyDriving:[],
      expandedRows: [],
      selected: [],
      lines:[],
      infos:[],
      allData:[],
      activeNames:'hot',
      tableData:[
        {
          camID:"",
          count:"",
          lastTime:"",

        },
      ],
      rules:{
        carNumber: [
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
      HeatMapDatas:[],
      POIData1:[],
      POIData2:[],
      tablePOIData:[],
    }
  },
  created() {
    this.$parent.point = []
    this.$parent.polylinePath = []
    this.$parent.end = []
    this.$parent.pulseLines={}
    this.$parent.start = []
    this.$parent.camList = []
    this.$parent.$refs.mapView.center = [117.120128,36.652069]
    this.$parent.$refs.mapView.visible.point = false

  },
  methods: {
    help(){
      this.$alert('车辆轨迹统计是用于查询若干辆车的功能，输入(或从文件中导入)车牌号，就可以查询车辆在一段时间(默认为1天)内的车辆轨迹；查询结果为轨迹在所经过卡口的信息，展示形式为表格，直方图，饼图', '帮助', {
        confirmButtonText: '确定',
      })
    },
    showPOIPoint(){
      this.$parent.$refs.mapView.POIData1 = this.POIData1
      this.$parent.$refs.mapView.POIData2 = this.POIData2
      this.$parent.$refs.mapView.visible.point = true
    },
    closePoiPoint(){
      this.$parent.$refs.mapView.visible.point = false
    },
    closeHeatMapDatas(){
      this.$parent.$refs.mapView.visible.heat = false
    },
    close(){
      this.$parent.point = []
      this.$parent.polylinePath = []
      this.infos = []
      this.lines = []
      this.tableData = []
      this.$parent.camList = []
      this.$parent.isCar=false
      this.deleteDriving()
      this.$parent.$refs.mapView.visible.point = false
      this.$parent.$refs.mapView.visible.heat = false
    },
    back(){
      this.$parent.isCar = false
      this.$parent.isMain = true
      this.infos = []
      this.lines = []
      this.tableData = []
      this.$parent.$refs.mapView.visible.point = false
      this.$parent.$refs.mapView.visible.heat = false
      this.deleteDriving()
    },
    handleSelectionChange(rows) {
      this.selected = rows.map(function(rows) {
        return rows.id
      })
    },
    async showData() {
      this.infos = []

      var a =[]
      a.push(this.form.carNumber)
      let form = {
        carNumbers:a,
        startTime:this.form.startTime,
        endTime:this.form.endTime,
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.load = true
      let response =  await listByCarNumberOrderInTimeRange(form)
      this.$parent.pulseLines = response.msg
      console.log('res form car',response)
      lines = response.msg.features.map(function (obj){
        return obj.geometry.coordinates
      })
      this.infos= response.msg.features.map(function(obj) {
        obj = obj.properties
        const date = obj.startTime.split(' ')[0].toString()
        const time = obj.startTime.split(' ')[1].toString() +'-'+ obj.endTime.split(' ')[1].toString();
        obj.distance = obj.distance/1000
        return {...obj, date, time};
      });
      let id = 0;

      for (let i = 0; i < this.infos.length; i++) {
        this.infos[i].id = id++;
      }
      this.load = false
      console.log('infos', this.infos)
      console.log('lines', lines)
      // this.tableActive='tra'
      loading.close();
    },
    handleClick(){
      if(this.activeName !== 'fifth'){
        this.$parent.$refs.mapView.visible.heat = false
        this.$parent.$refs.mapView.visible.radius = 18
      }
      if(this.activeName ==='fifth'){
        this.$parent.$refs.mapView.visible.radius = 30
        this.$parent.$refs.mapView.zoom = 11.5
      }
      if(this.activeName !== 'fourth'){
       this.deleteDriving()
      }
    },
    handleClicks(){
      if(this.activeNames !== 'hot'){
        this.$parent.$refs.mapView.visible.heat = false
        this.$parent.$refs.mapView.visible.radius = 18
      }
    },

    deleteDriving(){
      for(var i =0;i<this.alreadyDriving.length;i++){
        this.alreadyDriving[i].clear()
      }
      this.alreadyDriving = []
    },
    getTrace(){
      const length = this.selected.length
      if (length === 0) {
        this.$alert('请选择轨迹', '提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {
        // this.showData()
        this.lines = []
        for (var i=0; i<length; i++){
          this.lines.push(lines[this.selected[i]])
        }
        console.log('lines----from gerTrace()', this.lines)
        this.plotTrace()
      }
    },
    handleClickkk(row){
      var center = row.point
      this.$parent.$refs.mapView.center = center
      this.$parent.$refs.mapView.zoom = 20
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


    onSubmit(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // Form is valid, proceed with submission
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.POIInfo();
          this.getHeatMapByCarNumber()
          this.tableData = []
          camCountByCar(this.form).then((response) => {
            if(response.code === 200){
              this.$message({
                message: '查询成功',
                type: 'success'
              });

              this.tableData=response.msg

              var a = []
             for(var i=0;i<this.tableData.length;i++){
               ID[i] = this.tableData[i].camID
               count[i] = this.tableData[i].count
               let data={
                 name:this.tableData[i].camID,
                 value:this.tableData[i].count,
               }
               a.push(data)
             //   // console.log("aggsg"+ID[i])
             }


             var a= []
              var b=[]
              a.push(ID)
              b.push(count)
             this.option1={
               title: {
                 text: '卡口出现次数',
                 left:'center'
               },
               xAxis: {
                 type: 'category',
                 data: ID,
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
               this.option2={
                 title: {
                   text: '卡口出现次数',
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

              },
              this.showData()
              this.activeName = 'third'
              loading.close()
            }else {
              this.$message.error('查询失败');
            }

          })
        } else {
          // Form is invalid, show error messages
        }
      });
    },
    showHeatMapDatas(){
      // this.$set(this.$parent.$refs.mapView.dataset,"data",this.HeatMapData)
      // this.$parent.$refs.mapView.visible.heat = true
      console.log("showHeatMapDatas")
      this.$parent.$refs.mapView.zoom = 11.5
      this.$set(this.$parent.$refs.mapView.dataSet,'data', this.HeatMapDatas)
      this.$parent.$refs.mapView.visible.heat = true

    },
    async getHeatMapByCarNumber(){
      await getHeatMapByCar(this.form).then((response)=>{
        if(response.code === 200){
          this.HeatMapDatas=response.msg

        }
      })
    },
    async POIInfo(){
      var poi = null
      this.POIData1 = []
      this.POIData2 = []
      await POISearch(this.form.carNumber).then((response)=>{
        if(response.code === 200){
          poi = response.msg
        }else {
          this.$message.error('查询失败');
        }
      })
      var poi1 = [] //出发地
      var poi2 = [] //目的地
      for(var i=0;i<poi.length;i++){
        if(poi[i].label === 1){
          poi2.push([poi[i].lon,poi[i].lat])
        }else {
          poi1.push([poi[i].lon,poi[i].lat])
        }
      }

      for(var i=0;i<poi1.length;i++){
        AMap.plugin('AMap.Geocoder',(status, result)=>{
          var placeSearch = new AMap.Geocoder()

          var lnglat = poi1[i]

          placeSearch.getAddress(lnglat, (status, result)=> {
            var data = {
              "address":result.regeocode.formattedAddress,
              "point":lnglat
            }
            this.POIData2.push(data)
          })
        })
      }

      for(var i=0;i<poi2.length;i++){
        AMap.plugin('AMap.Geocoder',(status, result)=>{
          var placeSearch = new AMap.Geocoder()

          var lnglat = poi2[i]

          placeSearch.getAddress(lnglat, (status, result)=> {
            var data = {
              "address":result.regeocode.formattedAddress,
              "point":lnglat
            }
            this.POIData1.push(data)
          })
        })
      }

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
  background-color: rgba(255, 255, 255, 1);
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




