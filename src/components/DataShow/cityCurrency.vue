<!--城市流量分析-->
<template>
  <div class="info">
    <div class="info-title">城市流量分析
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="查询条件" name="first">
        <div >
          <el-form ref="ruleForm" :model="form" :rules="rules"  label-width="80px" >

            <el-form-item label="卡口组" prop="camIds">
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
          :row-key="getRowKey"
          :expand-row-keys="expandedRows"
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
              <div v-for="cf in props.row.cityFlowStats" >
                <el-row>类型:{{ cf.carType}}</el-row>
                <el-row>方向:{{ cf.direction}}</el-row>
                <el-row>流量:{{ cf.flow}}</el-row>
                <el-divider></el-divider>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="camId"
            label="卡口号"
            width="140">
          </el-table-column>
          <el-table-column
            prop="totalFlow"
            label="总流量"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>

        <el-select style="width: 150px;margin-right: 20px;" v-model="form.granularity" placeholder="请选择时间粒度">
          <el-option label="10min"  :value=10></el-option>
          <el-option label="30min"  :value=30></el-option>
          <el-option label="60min" :value=60></el-option>
        </el-select>
        <el-button type="primary" style="margin-top: 10px" @click="stat">数据统计</el-button>
<!--        <el-button type="primary" style="margin-top: 10px" @click="showMap1">流量比对统计</el-button>-->
<!--        <el-button type="primary" style="margin-top: 10px" @click="showMap2">外埠车辆统计</el-button>-->
      </el-tab-pane>

      <el-tab-pane label="数据统计" name="fifth">
        <el-select style="width: 150px;margin-right: 20px;" v-model="form.granularity" placeholder="请选择时间粒度" @change="stat">
          <el-option label="10min"  :value=10></el-option>
          <el-option label="30min"  :value=30></el-option>
          <el-option label="60min" :value=60></el-option>
        </el-select>
        <el-tabs>
          <el-tab-pane label="流量对比统计">
            <FlowChart1 id="flow-echart1"
                       class="flow-echart1"
                       :option="option1">

            </FlowChart1>

          </el-tab-pane>
          <el-tab-pane label="外埠车辆统计" name="six">
            <FlowChart2 id="flow-echart2"
                        class="flow-echart2"
                        :option="option2">
            </FlowChart2>

          </el-tab-pane>
        </el-tabs>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
var cam2=[]
var nativeData=[]
var otherData=[]
import FlowChart1 from "../echarts/flowChart1.vue";
import FlowChart2 from "../echarts/flowChart2.vue";
import {cityFlowStats,foreignVehiclesStats,compareVehiclesStats} from "../../api/map";
var flow=[]
var cam=[]
var colors = ['#FAE200', '#D27E37', '#C53634', '#C12B6E', '#A92E9A', '#67238A', '#211A50', '#18244E'].reverse();
var allData = []
var e = []
var a = []
const axios = require('axios');
export default {
  components:{
    FlowChart1,
    FlowChart2,
  },
  props:{
    camList:{}
  },
  data() {
    return {
      dataonLineListSelections: [],
      // options: [{
      //   value: 1,
      //   label: '1min'
      // }, {
      //   value: 30,
      //   label: '30min'
      // }, {
      //   value: 60,
      //   label: '60min'
      // }, ],
      allData:[],
      activeName: 'first',
      colors:[],
      form: {
        camIds: '',
        startTime:'2021-02-01 00:00:00',
        endTime:'2021-02-01 23:59:59',
        granularity:60,
      },
      tableData:[
        {
          camId:'',
          totalFlow:'',
        },
      ],
      foreignData:[
        {
          provincialCount:'',
          nonProvincialCount:'',
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
    this.$parent.start = []
    this.$parent.end = []
    this.$parent.camList = []
    this.$parent.polylinePath = []
    this.option1 = {}
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
      this.dataonLineListSelections = rows
      console.log(this.dataonLineListSelections)
    },
    handleFileChange1(event) {
      const file = event.target.files[0]; // 获取选择的文件
      const reader = new FileReader(); // 创建FileReader对象

      reader.onload = (e) => {
        const content = e.target.result; // 读取文件内容
        const processedContent = content.replace(/\r?\n|\r/g, "");
        this.$set(this.form, 'camIds', processedContent)

        // 可以在此处执行其他逻辑或对读取到的内容进行处理
      };

      reader.readAsText(file); // 以文本形式读取文件内容
    },

    close(){
      this.$parent.isCity=false
      this.$parent.point = []
      this.$parent.start = []
      this.option1 = {}
      this.$parent.end = []
      this.$parent.camList = []
      this.$parent.polylinePath = []
      this.colors = []
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
      } else {
        // 行被关闭
        this.collapseRow(row);

      }
    },
    async stat(){
      var c = []
      const length = this.dataonLineListSelections.length

      for(var i=0;i<length;i++){
        c.push(this.dataonLineListSelections[i].camId)
      }

      let f = {
        camIds: c,
        startTime: this.form.startTime,
        endTime:this.form.endTime,
        granularity: this.form.granularity
      }

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      let data = await compareVehiclesStats(f)

      var cams = data.msg.map(obj => obj.camId)
      var s = []
      for (var i=0; i<data.msg.length; i++){
        var array = data.msg[i].sliceCamTrajectories.map(obj => obj.count)

        s.push({
          name: data.msg[i].camId, // 系列名称
          type: 'line', // 类型：线
          data: array, // 数据
          markPoint: {
            // 标注图形数据
            data: [{
              type: 'max', // 类型
              symbol: 'pin', // 标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'），默认循环选择类型有：'circle' | 'rectangle' | 'triangle' | 'diamond' |'emptyCircle' | 'emptyRectangle' | 'emptyTriangle' | 'emptyDiamond' 另外，还支持五种更特别的标志图形'heart'（心形）、'droplet'（水滴）、'pin'（标注）、'arrow'（箭头）和'star'（五角星），这并不出现在常规的8类图形中，但无论是在系列级还是数据级上你都可以指定使用，同时，'star' + n（n>=3)可变化出N角星，如指定为'star6'则可以显示6角星
              name: '最大值'
            },
              {
                type: 'min', // 类型
                symbol: 'pin',
                name: '最小值'
              },
            ],
            // 特殊标注文字
            label: {
              normal: {
                show: true,
                //position: 'top', // 文字位置
                // 显示的文字
                formatter: '{b}：{c}',
              }
            }
          }
        })

      }

      this.option1={
        legend: {
          data: cams
        },
        xAxis: {
          type: "category",
          data: ["0时", "1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时",
            "10时", "11时", "12时", "13时", "14时", "15时", "16时", "17时", "18时", "19时",
            "20时", "21时", "22时", "23时",],
        },
        yAxis: {
          type: "value",
        },
        series: s,
      }

      this.foreignData=[]

      let response = await foreignVehiclesStats(f)

        if(response.code === 200){
          this.$message({
            message: '图表生成成功',
            type: 'success'
          });

          this.foreignData = response.msg

          console.log('fd', this.foreignData)
          // for (var i=0;i<this.foreignData.length;i++){
          //   cam2.push(this.foreignData[i].camId)
          //   for(var t=0;t<this.foreignData[i].sliceCamTrajectories.length;t++) {
          //     nativeData.push(this.foreignData[i].sliceCamTrajectories[t].provincialCount)
          //     otherData.push(this.foreignData[i].sliceCamTrajectories[t].nonProvincialCount)
          //   }
          // }



          var fd = []
          var cs = []
          for (var k=0; k<data.msg.length; k++){
            var a = this.foreignData[k].sliceCamTrajectories.map(obj => obj.provincialCount)
            console.log()
            cs.push(this.foreignData[k].camId+'省内数据')
            fd.push({
              name: this.foreignData[k].camId+'省内数据', // 系列名称
              type: 'line', // 类型：线
              data: a, // 数据
              markPoint: {
                // 标注图形数据
                // 特殊标注文字
                data: [{
                  type: 'max', // 类型
                  symbol: 'pin', // 标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'），默认循环选择类型有：'circle' | 'rectangle' | 'triangle' | 'diamond' |'emptyCircle' | 'emptyRectangle' | 'emptyTriangle' | 'emptyDiamond' 另外，还支持五种更特别的标志图形'heart'（心形）、'droplet'（水滴）、'pin'（标注）、'arrow'（箭头）和'star'（五角星），这并不出现在常规的8类图形中，但无论是在系列级还是数据级上你都可以指定使用，同时，'star' + n（n>=3)可变化出N角星，如指定为'star6'则可以显示6角星
                  name: '最大值'
                },
                  {
                    type: 'min', // 类型
                    symbol: 'pin',
                    name: '最小值'
                  },
                ],

                label: {
                  normal: {
                    show: true,
                    //position: 'top', // 文字位置
                    // 显示的文字
                    formatter: '{b}：{c}',
                  }
                }
              }
            })

          }
          for (var j=0; j<data.msg.length; j++){
            var r = this.foreignData[j].sliceCamTrajectories.map(obj => obj.nonProvincialCount)
            cs.push(this.foreignData[j].camId+'省外数据')
            fd.push({
              name: this.foreignData[j].camId+'省外数据', // 系列名称
              type: 'line', // 类型：线
              data: r, // 数据
              markPoint: {
                // 标注图形数据
                // 特殊标注文字
                data: [{
                  type: 'max', // 类型
                  symbol: 'pin', // 标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'），默认循环选择类型有：'circle' | 'rectangle' | 'triangle' | 'diamond' |'emptyCircle' | 'emptyRectangle' | 'emptyTriangle' | 'emptyDiamond' 另外，还支持五种更特别的标志图形'heart'（心形）、'droplet'（水滴）、'pin'（标注）、'arrow'（箭头）和'star'（五角星），这并不出现在常规的8类图形中，但无论是在系列级还是数据级上你都可以指定使用，同时，'star' + n（n>=3)可变化出N角星，如指定为'star6'则可以显示6角星
                  name: '最大值'
                },
                  {
                    type: 'min', // 类型
                    symbol: 'pin',
                    name: '最小值'
                  },
                ],
                label: {
                  normal: {
                    show: true,
                    //position: 'top', // 文字位置
                    // 显示的文字
                    formatter: '{b}：{c}',
                  }
                }
              }
            })
          }

          console.log('fd2', fd)
          this.option2={
            legend: {
              data: cs
            },
            xAxis: {
              type: "category",
              data: ["0时", "1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时",
                "10时", "11时", "12时", "13时", "14时", "15时", "16时", "17时", "18时", "19时",
                "20时", "21时", "22时", "23时",],
            },
            yAxis: {
              type: "value",
            },
            series: fd,
          }
        }else {
          this.$message.error('生成失败');
        }
      this.activeName = 'fifth'
      loading.close()

    },
    async showMap1( ){
      const length = this.selected.length
      console.log("selected",length)
      for(var i=0;i<length;i++){
        cam.push(this.dataonLineListSelections[i].camId)
        flow.push(this.dataonLineListSelections[i].totalFlow)
      }



      let data = await compareVehiclesStats(this.form)

      loading.close()
      console.log('compare',data.msg)
      var cams = data.msg.map(obj => obj.camId)
      var s = []
      for (var i=0; i<data.msg.length; i++){
        var array = data.msg[i].sliceCamTrajectories.map(obj => obj.count)
        console.log('array from --', array)
        s.push({
          name: data.msg[i].camId, // 系列名称
          type: 'line', // 类型：线
          data: array, // 数据
          markPoint: {
            // 标注图形数据
            data: [{
              type: 'max', // 类型
              symbol: 'pin', // 标志图形类型，默认自动选择（8种类型循环使用，不显示标志图形可设为'none'），默认循环选择类型有：'circle' | 'rectangle' | 'triangle' | 'diamond' |'emptyCircle' | 'emptyRectangle' | 'emptyTriangle' | 'emptyDiamond' 另外，还支持五种更特别的标志图形'heart'（心形）、'droplet'（水滴）、'pin'（标注）、'arrow'（箭头）和'star'（五角星），这并不出现在常规的8类图形中，但无论是在系列级还是数据级上你都可以指定使用，同时，'star' + n（n>=3)可变化出N角星，如指定为'star6'则可以显示6角星
              name: '最大值'
            },
              {
                type: 'min', // 类型
                symbol: 'pin',
                name: '最小值'
              },
            ],
            // 特殊标注文字
            label: {
              normal: {
                show: true,
                //position: 'top', // 文字位置
                // 显示的文字
                formatter: '{b}：{c}',
              }
            }
          }
        })

      }
      this.activeName='fifth'

      this.option1={
        legend: {
          data: cams
        },
        xAxis: {
          type: "category",
          data: ["0时", "1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时",
            "10时", "11时", "12时", "13时", "14时", "15时", "16时", "17时", "18时", "19时",
            "20时", "21时", "22时", "23时",],
        },
        yAxis: {
          type: "value",
        },
        series: s,
      }

    },
    async showMap2(){

      this.foreignData=[]
      if(typeof this.form.camIds === "string"){
        this.form.camIds.split(',')
      }
      // console.log("gagas",this.form)
      foreignVehiclesStats(this.form).then((response) => {
        if(response.code === 200){
          this.$message({
            message: '图表生成成功',
            type: 'success'
          });
          this.activeName = 'fifth'
          this.foreignData = response.msg
          console.log("foreign Data", this.foreignData)
          for (var i=0;i<this.foreignData.length;i++){
            cam2.push(this.foreignData[i].camId)
            for(var t=0;t<this.foreignData[i].sliceCamTrajectories.length;t++) {
              nativeData.push(this.foreignData[i].sliceCamTrajectories[t].provincialCount)
              otherData.push(this.foreignData[i].sliceCamTrajectories[t].nonProvincialCount)
            }
          }
          this.option2={
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            toolbox: {
              feature: {
                // dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
              }
            },
            legend: {
              data: ['省内车辆', '省外车辆']
            },
            xAxis: [
              {
                type: 'category',
                data: cam2,
                axisPointer: {
                  type: 'shadow'
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '车辆',
                min: 0,
                max: 100,
                interval: 10,
                axisLabel: {
                  formatter: '{value} '
                }
              },

            ],
            series: [
              {
                name: '省内车辆',
                type: 'bar',
                tooltip: {
                  valueFormatter: function (value) {
                    return value ;
                  }
                },
                data: nativeData
              },
              {
                name: '省外车辆',
                type: 'line',
                tooltip: {
                  valueFormatter: function (value) {
                    return value ;
                  }
                },
                data: otherData
              },
            ]
          }
        }else {
          this.$message.error('生成失败');
        }
      })

      // console.log("事件完成")


    },


    importFromMap() {
      var a = this.$parent.camList.map(function(marker) {
        return marker.camId
      })
      this.form.camIds = a.toString()
    },
    onSubmit(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.tableData = []

          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          cityFlowStats(this.form).then((response) => {
            if(response.code === 200){
              this.$message({
                message: '查询成功',
                type: 'success'
              });
              console.log('res', response)

              this.tableData = response.msg
              for (var i=0; i<this.tableData.length; i++){
                this.tableData[i].id = i
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

