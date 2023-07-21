<template>
  <div class="info">
    <div class="info-title">欢迎使用车辆轨迹分析系统
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
      <el-button type="primary" size="mini" icon="el-icon-setting" circle style="float:right" @click="help"></el-button>
    </div>
    <div class="info-title-desc">城市：济南</div>
    <div class="info-title-desc">数据更新至 2021-2-2 00:00:00</div>
    <div class="info-title-desc">数据日期
      <el-date-picker
        v-model="va1"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <el-tabs v-model="activeName" @tab-click="zoom">
      <el-tab-pane label="城市流量信息" name="first">
        <div class="wrap">
          <div class="cont">
            <div class="cont-item">
              <div class="cont-item-num">{{data.allCarCount}}</div>
              <div class="cont-item-title">车辆数</div>
              <div class="cont-item-desc">
              </div>
            </div>
            <div class="cont-item">
              <div
                class="cont-item-num now"
              >{{data.flow}}</div>
              <div class="cont-item-title">流量</div>
              <div class="cont-item-desc">
              </div>
            </div>
            <div class="cont-item">
              <div class="cont-item-num input">{{data.foreignCarCount}}</div>
              <div class="cont-item-title">外埠车次</div>
              <div class="cont-item-desc">
              </div>
            </div>
          </div>

          <div class="cont">
            <div class="cont-item">
              <div class="cont-item-num heal">{{data.localCarCount}}</div>
              <div class="cont-item-title">省内车次</div>
              <div class="cont-item-desc">
              </div>
            </div>
            <div class="cont-item">
              <div class="cont-item-num dead">{{data.allCamCount}}</div>
              <div class="cont-item-title">监控卡口数</div>
              <div class="cont-item-desc">
              </div>
            </div>
            <div class="cont-item">
              <div class="cont-item-num ext">{{data.highestFlowStartTime.split(' ')[1].split(':')[0] + '时-' + data.highestFlowEndTime.split(' ')[1].split(':')[0]+'时'}}</div>
              <div class="cont-item-title">最高峰时间段</div>
            </div>
          </div>
        </div>
        <el-button @click="showMore">城市流量细粒度分析</el-button>
      </el-tab-pane>
      <el-tab-pane label="车辆轨迹信息" name="second">
          <el-form>
            <el-form-item label="车辆类型:">
              <el-select v-model="carType"  multiple
                         filterable
                         collapse-tags
                         placeholder="请选择车辆类型"
                         @change = "selectChange">
                <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车牌号：">
              <el-select v-model="carNumber" filterable clearable placeholder="请选择">
                <el-option
                  v-for="item in allData"
                  :key="item.carNumber"
                  :label="item.carNumber"
                  :value="item.carNumber">
                </el-option>
              </el-select>
              <el-button @click="submit">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-table
                style="width: 100%"
                :data="tableData"
                height=500
                v-loading="load"
              >
                <el-table-column
                  prop="carNumber"
                  label="车牌号"
                  width="140">
                </el-table-column>
                <el-table-column
                  prop="carType"
                  label="车牌类型"
                  width="140">
                </el-table-column>
                <el-table-column
                  prop="count"
                  label="次数">
                </el-table-column>
                <el-table-column
                  label="操作">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
      </el-tab-pane>
      <el-tab-pane label="城市流量分析" name="third" >
        <el-form :label-position="labelPosition">
          <el-form-item>
            <el-button @click="showHeat">
              显示热力图
            </el-button>
            <el-button @click="hidHeat">
              关闭热力图
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="radio" @change="radioChange">
              <el-radio :label="1">查看全部数据</el-radio>
              <el-radio :label="2">仅查看外埠车辆数据</el-radio>
              <el-radio :label="3">仅查看省内车辆数据</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-divider></el-divider>
          </el-form-item>
          <el-form-item label="选择时间范围">
            <el-date-picker
              v-model="value1"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="startTime"
              end-placeholder="endTime">
            </el-date-picker>
            <el-slider
              v-model="value2"
              range
              show-stops
              @input="input2"
              :style="{ width: '400px',marginLeft:'80px' }"
              :max="100">
            </el-slider>
          </el-form-item>
          <el-form-item >
            <el-button @click="statistics">
              显示统计信息
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-divider></el-divider>
          </el-form-item>
          <el-form-item>
            <el-button @click="changeSliderShow">
              查看城市流量变化
            </el-button>
          </el-form-item>
          <el-form-item label="选择时间切分粒度">
            <el-select v-model="step" placeholder="请选择" >
              <el-option
                v-for="item in steps"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="showSlider" label="拖动查看流量变化">
              <div style="display: inline-block ; width:300px">
<!--                滑块部分-->
<!--                滑块有两个事件，change和input 不同点， change 值改变时触发（使用鼠标拖曳时，只在松开鼠标后触发） input 	数据改变时触发（使用鼠标拖曳时，活动过程实时触发）-->
                <el-slider v-model="slider"  :step="step" :max="24-step" :format-tooltip="formatTooltip" @change="change" @input="input" :disabled="Shilderdisable"></el-slider>
              </div>
          </el-form-item>
          <el-form-item>
            <el-divider></el-divider>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-select v-model="step" placeholder="请选择">-->
<!--              <el-option-->
<!--                v-for="item in steps"-->
<!--                :key="item.value"-->
<!--                :label="item.label"-->
<!--                :value="item.value">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="统计图表" name="six">
        <el-button @click="showMap">
          生成统计图表
        </el-button>
        <TotalChart id="total-echart1"
                    class="total-echart1"
                    :option="option">
        </TotalChart>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {sizeCalculable} from "echarts/lib/util/layout";
import { listAllInfo, getAllCarNumber, getAllFlowStats,listAllCarNumberAndCarTypeByCount, getHeatMapData, getLocalHeatMapData,getForeignHeatMapData,getHeatMapDataList, getForeignHeatMapDataList, getLocalHeatMapDataList} from "@/api/map";
import TotalChart from "../echarts/totalChart.vue";
var stime=[]
var flow1=[]
export default {
  components: {TotalChart},
  data() {
    return {
      info: {},
      list: [],
      data: {},
      va1: '2021-02-01',
      allData: [],
      value1:[
        '2021-02-01 00:00:00',
        '2021-02-02 00:00:00'
      ],
      value2:[0,100],
      Shilderdisable:true,
      options:["小型汽车号牌", "大型汽车号牌", "其它号牌", "小型新能源汽车号牌", "大型新能源汽车号牌", "教练汽车号牌", "警用汽车号牌", "使馆汽车号牌", "农用运输车号牌", "轻便摩托车号牌", "挂车号牌", "两、三轮摩托车号牌", "临时入境汽车号牌"],
      steps:[{value:1, label:'1小时'},{value:2, label:'2小时'},{value:4, label:'4小时'},{value:6, label:'6小时'},{value:8, label:'8小时'}],
      carNumber:'',
      labelPosition: 'left',
      carType:[],
      carNumbers: '',
      tableData:[],
      localHeatMapData:[],
      foreignHeatMapData:[],
      HeatMapData:[],
      radio:1,
      load:false,
      showSlider:true,
      HeatMapList:null,
      LocalHeatMapList:null,
      ForeignHeatMapList:null,
      startTime:'2021-02-01 00:00:00',
      endTime:'2021-02-02 00:00:00',
      startToEndTime:{
        startTime:'2021-02-01 00:00:00',
        endTime:'2021-02-02 00:00:00'
      },
      //滑块绑定的值
      slider:0,
      //滑块滑动的步长
      step:1,
      option:{},
      activeName:'first',
      value: [0, 24],
      marks: {
        0: '0时',
        8: '8时',
        24: '24时',
        17: {
          style: {
            color: '#e04747'
          },
          label: this.$createElement('strong', '17时')
        },
        18: {
          style: {
            color: '#a81111'
          },
          label: this.$createElement('strong', '18时')
        }

      }
    }
  },
  created() {

  },
  mounted() {
    this.getData()
    this.getTableData()
    this.getHeatMap()
    this.getLocalHeatMap()
    this.getForeignHeatMap()
    this.getHeatMapLists()
    this.getLocalHeatMapLists()
    this.getForeignHeatMapLists()

    // this.load = true
  },
  methods: {
    help(){
      this.$alert('提示信息xxxxxxxxxxxx', '帮助', {
        confirmButtonText: '确定',
      })
    },
    //c -----------------------------
    // slider的监听事件
    // v是slider绑定的值
    change(v){
      console.log('change', v)
    },
    input(v){
      console.log('input', v)
      console.log(this.radio)
      if(this.radio===1){
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.HeatMapList[this.slider])
      }else if(this.radio===2){
        console.log(this.ForeignHeatMapList)
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.ForeignHeatMapList[this.slider])
      }else {
        console.log(this.LocalHeatMapList)
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.LocalHeatMapList[this.slider])
      }
    },
    input2(v){
      var startdate = new Date(this.value1[0]);
      var endDate = new Date(this.value1[1]);
      var dif = endDate-startdate;
      var difstart = this.value2[0] * dif / 100
      var difend = (this.value2[1]-100) * dif / 100
      console.log(this.value2[1])
      console.log(difend)
      var date1 = new Date(startdate.getTime() + difstart)
      var date2 = new Date(endDate.getTime() + difend)
      const year = date1.getFullYear();
      const month = String(date1.getMonth() + 1).padStart(2, '0');
      const day = String(date1.getDate()).padStart(2, '0');
      const hours = String(date1.getHours()).padStart(2, '0');
      const minutes = String(date1.getMinutes()).padStart(2, '0');
      const seconds = String(date1.getSeconds()).padStart(2, '0');

      date1 = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const year2 = date2.getFullYear();
      const month2 = String(date2.getMonth() + 1).padStart(2, '0');
      const day2 = String(date2.getDate()).padStart(2, '0');
      const hours2 = String(date2.getHours()).padStart(2, '0');
      const minutes2 = String(date2.getMinutes()).padStart(2, '0');
      const seconds2 = String(date2.getSeconds()).padStart(2, '0');

      date2 = `${year2}-${month2}-${day2} ${hours2}:${minutes2}:${seconds2}`;
      this.startTime = date1
      this.endTime = date2
    },
    radioChange(){
      console.log(this.radio)
    },
    async statistics(){
      var data = {
        startTime:this.startTime,
        endTime:this.endTime
      }
      console.log("start",this.startTime)
      console.log("end",this.endTime)
      console.log("data",data)
      await getHeatMapData(data).then((response) => {
        if(response.code === 200){
          // this.dataSet.data = response.msg;
          this.HeatMapData = response.msg

        }else {
          this.$message.error('查询失败');
        }
      })

      await getForeignHeatMapData(data).then((response) => {
        if(response.code === 200){
          // this.dataSet.data = response.msg;
          this.foreignHeatMapData = response.msg

        }else {
          this.$message.error('查询失败');
        }
      })

      await getLocalHeatMapData(data).then((response) => {
        if(response.code === 200){
          this.localHeatMapData = response.msg

        }else {
          this.$message.error('查询失败');
        }
      })

      if(this.radio === 1){
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.HeatMapData)
      }else if(this.radio === 2){
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.foreignHeatMapData)
      }else {
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.localHeatMapData)
      }

    },
    changeSliderShow(){
      this.Shilderdisable = false;
    },
    // ------------------------------
    close(){
      this.$parent.$refs.mapView.visible.heat = false


      this.$parent.point = []
      this.$parent.camList = []
      this.$parent.start = []
      this.$parent.end = []
      this.$parent.pulseLines = {}
      this.$parent.polylinePath = []
      this.$parent.isMain=false
    },
    //城市流量细粒度分析
    submit(){
      if(this.carNumber !== ''){
        this.tableData = this.allData.filter(item => item.carNumber === this.carNumber);
      }else {
        this.tableData = this.allData
      }
    },
    showMore(){
      this.$parent.$refs.mapView.visible.heat = false
      this.$parent.isMain = false
      this.$parent.isCity = true
    },
    selectChange(){
      if(this.carType.length !== 0){
        this.tableData = this.allData.filter(item => this.carType.includes(item.carType));
      }else {
        this.tableData = this.allData
      }
    },
    handleClick(v){
      this.$parent.$refs.mapView.visible.heat = false
      this.$parent.$refs.car.form.carNumber = v.carNumber
      this.$parent.isMain = false
      this.$parent.$refs.car.activeName = 'first'
      this.$parent.isCar =  true
    },
    async getTableData(){
      this.load = true
      let data = await  listAllCarNumberAndCarTypeByCount()

      if(data.code === 200){
        this.$message({
          message:'车辆信息加载成功',
          type: 'success'
        })
        console.log('data-----------', data)
        data.msg = data.msg.slice(3)
        this.allData = data.msg
        this.$parent.$refs.car.allData = data.msg
        this.tableData = data.msg
        this.load = false
      }else {
        this.$message({
          message:'车辆信息加载失败',
          type: 'error'
        })
      }
    },
    // 格式化滑块显示部分
    formatTooltip(v){
      var s = v+'时 - '
      v = v + this.step
      s = s + v + '时'
      return  s
    },

    async getData() {
      let  data  = await listAllInfo();
      if(data.code === 200){
        this.$message({
          message:'城市流量加载成功',
          type: 'success'
        })
        this.data = data.msg
      }else {
        this.$message({
          message:'城市流量加载失败',
          type: 'error'
        })
      }
    },

    zoom(){
      if (this.activeName === 'third'){
        this.$parent.$refs.mapView.zoom = 11.5
        this.$parent.$refs.mapView.center = [117.120128,36.652069]
      }
    },
    hidHeat(){
      this.$parent.$refs.mapView.visible.heat = false
    },
    async showHeat(){

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0)'
      });

      await this.getHeatMap()
      await this.getLocalHeatMap()
      await this.getForeignHeatMap()
      if(this.radio == 1){
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.HeatMapData)
      }else if(this.radio == 2){
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.foreignHeatMapData)
      }else {
        this.$set(this.$parent.$refs.mapView.dataSet,'data', this.localHeatMapData)
      }
      this.$parent.$refs.mapView.visible.heat = true

      this.showSlider = true
      loading.close();
    },
    async getCars() {

    },
    async showMap(){
      await getAllFlowStats().then((response) => {
        if(response.code === 200){
          this.totalData=response.msg
          console.log('totalData', this.totalData)
          for (var i=0;i<this.totalData.length;i++){
            stime.push(this.totalData[i].startTime.split(' ')[1].toString())
            flow1.push(this.totalData[i].flowCount)
          }
          this.activeName="six"

        }else {
          this.$message.error('查询失败');
        }
      })
      this.option={
        xAxis: {
          type: 'category',
          name:'起始时间',
          data: stime,
          axisLabel: {         //interval设置成 0 强制显示所有标签
            interval: 0,
            rotate: 30     //可以通过旋转解决标签显示不下的问题
          },
        },
        yAxis: {
          type: 'value',
          name:'流量',
          axisLabel: {         //interval设置成 0 强制显示所有标签
            interval: 0,
            rotate: 30     //可以通过旋转解决标签显示不下的问题
          },
        },
        series: [
          {
            data: flow1,
            type: 'line',
            smooth: true
          }
        ]
      }
    },

    async getHeatMap(){
      var data = {startTime:'2021-02-01 00:00:00', endTime:'2021-02-02 00:00:00'}
      await getHeatMapData(data).then((response) => {
        if(response.code === 200){
          this.HeatMapData = response.msg

        }else {
          this.$message.error('查询失败');
        }
      })

    },
    async getLocalHeatMap(){
      var data = {startTime:'2021-02-01 00:00:00', endTime:'2021-02-02 00:00:00'}
      await getLocalHeatMapData(data).then((response) => {
        if(response.code === 200){
          // this.$set(this.$parent.$refs.mapView.dataSet,'data', response.msg)
          this.localHeatMapData = response.msg
        }else {
          this.$message.error('查询失败');
        }
      })

    },
    async getForeignHeatMap(){
      var data = {startTime:'2021-02-01 00:00:00', endTime:'2021-02-02 00:00:00'}
      await getForeignHeatMapData(data).then((response) => {
        if(response.code === 200){
          this.foreignHeatMapData = response.msg

        }else {
          this.$message.error('查询失败');
        }
      })

    },
    async getHeatMapLists(){
      var data = {
        startTime:this.startToEndTime.startTime,
        endTime:this.startToEndTime.endTime,
        cutTime:this.step
      }
      await getHeatMapDataList(data).then((response) => {
        if(response.code === 200){
          // this.dataSet.data = response.msg;
          this.HeatMapList =response.msg;
        }else {
          this.$message.error('查询失败');
        }
      })

      // await getLocalHeatMapDataList(data).then((response) => {
      //   if(response.code === 200){
      //     this.LocalHeatMapList =response.msg;
      //   }else {
      //     this.$message.error('查询失败');
      //   }
      // })
      //
      // await getForeignHeatMapDataList(data).then((response) => {
      //   if(response.code === 200){
      //     this.ForeignHeatMapList =response.msg;
      //     console.log(this.ForeignHeatMapList)
      //   }else {
      //     this.$message.error('查询失败');
      //   }
      // })

    },

    async getLocalHeatMapLists(){
      console.log("____________________")
      var data = {
        startTime:this.startToEndTime.startTime,
        endTime:this.startToEndTime.endTime,
        cutTime:this.step
      }
      await getLocalHeatMapDataList(data).then((response) => {
        if(response.code === 200){
          // this.dataSet.data = response.msg;
          this.LocalHeatMapList = response.msg;
          console.log("local:",this.LocalHeatMapList)
        }else {
          this.$message.error('查询失败');
        }
      })

    },
    async getForeignHeatMapLists(){
      var data = {
        startTime:this.startToEndTime.startTime,
        endTime:this.startToEndTime.endTime,
        cutTime:this.step
      }
      await getForeignHeatMapDataList(data).then((response) => {
        if(response.code === 200){
          // this.dataSet.data = response.msg;
          this.ForeignHeatMapList =response.msg;
        }else {
          this.$message.error('查询失败');
        }
      })

    }
  },
}
</script>

<style lang="scss" scoped>
.info {
  position: fixed;
  width: 650px;
  left: 30px;
  top: 20px;
  background-color: rgb(255, 255, 255);
  color: #000000;
  padding: 25px 35px;
  border-radius: 5px;
  &-title {
    font-size: 28px;
    line-height: 32px;
    padding-bottom: 20px;
    &-desc {
      font-size: 18px;
      color: #000000;
      text-align: left;
    }
  }

  .cont {
    color: #000000;
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
        color: #000000;
      }
      &-desc {
        color: #000000;
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
      .slider {
        margin-left: 10px;
        margin-right: 10px;
      }
    }
  }
}
</style>


