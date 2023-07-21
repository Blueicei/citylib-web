<!--车辆出现统计：上传一批车，统计在某段时间范围，出现的次数。生成直方图饼图-->
<template>
  <div class="info">
    <div class="info-title">车辆轨迹统计
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
      <el-button type="primary" size="mini" icon="el-icon-setting" circle style="float:right" @click="help"></el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="查询条件" name="first">
        <div >
          <el-form ref="ruleForm" :model="form"  label-width="80px" :rules="rules">
            <el-form-item label="车牌号" prop="carNumbers" >
              <el-input v-model="form.carNumbers" placeholder="输入多个用英文逗号分开,或者从本地文件中上传"></el-input>
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
              <el-button size="medium" type="primary" @click="onSubmit" style="width: 100px;">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="常用查询" name="second">
        <el-form>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill1">用例1</el-button></div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill2">用例2</el-button></div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill3">用例3</el-button></div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24"><div style="background: #d3dce6; border-radius: 4px; min-height: 36px;"><el-button type="text" @click="fill4">用例4</el-button></div></el-col>
          </el-row>
        </el-form>


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
      </el-tab-pane>
      <el-tab-pane label="轨迹设置" name="fourth">
        <el-table
          :data="colors"
          height="500">
          <el-table-column
            label="车牌号">
            <template  slot-scope="scope">
              <el-button type="text" @click="focusTra(scope.row.first)">
                {{scope.row.carNumber}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="颜色">
            <template  slot-scope="scope">
              <el-color-picker v-model="scope.row.color"></el-color-picker>
            </template>
          </el-table-column>
        </el-table>
<!--        <div v-for="p in this.colors" style="margin-top: 5px">-->
<!--          <el-col>-->
<!--            {{p.carNumber}}-->
<!--          </el-col>-->
<!--          <el-col>-->
<!--            <el-color-picker v-model="p.color"></el-color-picker>-->
<!--          </el-col>-->
<!--        </div>-->
      </el-tab-pane>
      <el-tab-pane label="数据统计" name="fifth">
        <el-tabs>
          <el-tab-pane label="直方图">
            <ShowChart1 id="show-echart1"
                        class="show-echart1"
                        :option="option1">
            </ShowChart1>

          </el-tab-pane>
          <el-tab-pane label="饼图">
            <ShowChart2 id="show-echart2"
                        class="show-echart2"
                        :option="option2">
            </ShowChart2>

          </el-tab-pane>
        </el-tabs>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ShowChart1 from "../echarts/showChart1.vue";
import ShowChart2 from "../echarts/showChart2.vue";
import {vehicleAppearanceByCarStats, listByCarNumberOrderInTimeRange} from "../../api/map";
var colors = ['#FAE200', '#D27E37', '#C53634', '#C12B6E', '#A92E9A', '#67238A', '#211A50', '#18244E'].reverse();
var allData = []
var e = []
var a = []
const axios = require('axios');
export default {
  components:{
    ShowChart1,
    ShowChart2,
  },
  props:{
    camList:{}
  },
  data() {
    return {
      activeName: 'first',
      colors:[],
      form: {
        camNumbers: '',
        startTime:'',
        endTime:'',
      },
      tableData:[
        {
        carNumber:'',
        count:'',
        },
      ],
      // currentPage: 1, // 当前页码
      // pageSize: 5, // 每页显示的条数
      // totalItems: 0, // 总条数
      expandedRows: [],
      selected: [],
      points: [],
      rules:{
        carNumbers: [
          { required: true, message: '请输入车牌号', trigger: 'change' }
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
    this.$parent.pulseLines={}
    this.$parent.polylinePath = []
    this.$parent.camList = []
    this.$parent.end = []
    this.$parent.start = []
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
    focusTra(point){
      this.$parent.$refs.mapView.center = point
    },
    handleSelectionChange(rows) {
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
        this.$set(this.form, 'carNumbers', processedContent)

        // 可以在此处执行其他逻辑或对读取到的内容进行处理
      };

      reader.readAsText(file); // 以文本形式读取文件内容
    },
    help(){
      this.$alert('车辆轨迹统计是用于查询若干辆车的功能，输入(或从文件中导入)车牌号，就可以查询车辆在一段时间(默认为1天)内的车辆轨迹', '帮助', {
        confirmButtonText: '确定',
      })
    },
    close(){
      this.$parent.isCars=false
      this.$parent.point = []
      this.$parent.end = []
      this.$parent.start = []
      this.$parent.polylinePath = []
      this.$parent.camList = []
      this.$parent.$refs.mapView.center = [117.120128,36.652069]
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
        console.log('form', form)
        if(this.tableData[row.id].features.geometry.coordinates.length === 0 ){
          listByCarNumberOrderInTimeRange(form).then((response) => {
            row.features = response.msg.features[0]
            this.tableData[row.id].features = response.msg.features[0]
            this.expandedRows = e
          })
        }

      } else {
        // 行被关闭
        this.collapseRow(row);

      }
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

        if (b) {
          for (var k = 0; k < length; k++) {
            var id = this.selected[k].id
            for (var j = 0; j < this.tableData[id].features.geometry.coordinates.length; j++) {
              if ( j === 0){
                this.$parent.start.push({
                  lnglat: this.tableData[id].features.geometry.coordinates[j],
                  camAddress: ' '
                })
              }else if(j === this.tableData[id].features.geometry.coordinates.length-1){
                this.$parent.end.push({
                  lnglat: this.tableData[id].features.geometry.coordinates[j],
                  camAddress: ' '
                })
              }
              // else {
              //   this.$parent.point.push({
              //     lnglat: this.tableData[id].features.geometry.coordinates[j],
              //     camAddress: ' '
              //   })
              // }
            }
            this.$parent.polylinePath.push({
              id:id,
              path: this.tableData[id].features.geometry.coordinates,
              color: colors[id % colors.length],
              message: this.tableData[id].features.properties
            })
            this.colors.push({
              id:id,
              color: colors[id % colors.length],
              carNumber: this.tableData[id].carNumber,
              first: this.tableData[id].features.geometry.coordinates[0]
            })
          }
        }

        this.$parent.$refs.mapView.center = this.$parent.start[0].lnglat
        this.$parent.$refs.mapView.visible.polyline = true;
        this.$parent.$refs.mapView.visible.point = true;

        loading.close();
        this.activeName = "fourth"
      }else {
        this.$alert('请选择轨迹','提示',{
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      }
    },
    onSubmit(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // Form is valid, proceed with submission
          this.tableData = []
          this.$parent.point = []
          this.$parent.polylinePath = []
          this.$parent.camList = []
          this.colors = []
          if(typeof this.form.carNumbers === "string"){
            this.form.carNumbers = this.form.carNumbers.split(',')
          }
            vehicleAppearanceByCarStats(this.form).then((response) => {
            if(response.code === 200){

              this.$message({
                message: '查询成功',
                type: 'success'
              });
              console.log(response)
              this.tableData = response.msg
              for(var i=0; i<this.tableData.length; i++){
                this.tableData[i].id = i
                this.tableData[i].features = {
                  geometry:{coordinates:[]}
                }
              }
              var number=[]
              var count =[]
              var a = []
              for(var i=0;i<this.tableData.length;i++){
                number[i] = this.tableData[i].carNumber
                count[i] = this.tableData[i].count
                let data1={
                  name:this.tableData[i].carNumber,
                  value:this.tableData[i].count,
                }
                a.push(data1)
                // console.log("aggsg"+ID[i])
              }

              this.option1={
                title: {
                  text: '车辆出现次数',
                  left:'center'
                },
                xAxis: {
                  type: 'category',
                  data: number,
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
                  text: '车辆出现次数',
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

              } ,

              this.activeName = 'third'
            }else {
              this.$message.error('查询失败');
            }

          })
        } else {
          // Form is invalid, show error messages
        }
      });
    },
    fill1(){
      this.form = {
        startTime:"2021-02-01 00:00:00",
        endTime:"2021-02-01 8:00:00",
        carNumbers:"鲁A0000002841,鲁A0000004492,鲁A0000006266"
      }
      this.activeName = 'first'
    },
    fill2(){
      this.activeName = 'first'
    },
    fill3(){
      this.activeName = 'first'
    },
    fill4(){
      this.activeName = 'first'
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



