<!--城市流量网格可视化-->
<template>
  <div class="info">
    <div class="info-title">城市流量网格可视化
      <el-button type="danger" size="mini" icon="el-icon-circle-close" circle style="float:right" @click="close"></el-button>
      <el-button type="primary" size="mini" icon="el-icon-setting" circle style="float:right" @click="help"></el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="查询条件" name="first">
        <div >
          <el-form ref="ruleForm" :model="form" :rules="rules"  label-width="80px" >
            <el-form-item label="网格粒度" prop="camIds">
              <el-select v-model="grid" placeholder="请选择" @change="gridChange">
                <el-option
                  v-for="item in girds"
                  :key="item"
                  :label="item+'*' +item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
<!--            <el-form-item label="时间粒度" prop="camIds">-->
<!--              <el-select v-model="time" placeholder="请选择">-->
<!--                <el-option-->
<!--                  v-for="item in times"-->
<!--                  :key="item"-->
<!--                  :label="item+'分钟'"-->
<!--                  :value="item">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
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
      <el-tab-pane label="查询结果" name="third">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="500"
          :row-key="getRowKey"
          v-loading="load"
          :expand-row-keys="expandedRows"
          @selection-change="handleSelectionChange"
          @expand-change="expandChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="girdId"
            label="网格"
            width="140">
          </el-table-column>
          <el-table-column
            prop="count"
            label="流量"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="poi"
            label="区域标志建筑"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-button type="primary" style="margin-top: 10px" @click="drawChart">流量比对统计</el-button>
      </el-tab-pane>
<!--      <el-tab-pane label="数据统计" name="fifth">-->
      <el-tab-pane label="数据统计" name="fifth">
        <div>
          <div ref="chart" style="width: 400px; height: 400px;"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {cityFlowStats, gridFlowCount} from "../../api/map";
var colors = ['#FAE200', '#D27E37', '#C53634', '#C12B6E', '#A92E9A', '#67238A', '#211A50', '#18244E'].reverse();
var allData = []
var e = []
var a = []
const axios = require('axios');
export default {
  props:{
    camList:{}
  },
  data() {
    return {
      activeName: 'first',
      colors:[],
      form: {
        camIds: '',
        startTime:'2021-02-01 00:00:00',
        endTime:'2021-02-01 23:59:59',
      },
      grid: 50,
      time: 60,
      girds:[10,20,50,100, 200],
      times:[30,45,60],
      tableData:[],
      load:false,
      // currentPage: 1, // 当前页码
      // pageSize: 5, // 每页显示的条数
      // totalItems: 0, // 总条数
      expandedRows: [],
      selected: [],
      points: [],
      rules:{
        grid: [
          { required: true, message: '请选择网格粒度', trigger: 'change' }
        ],
        time:[
          { required: true, message: '请选择时间粒度', trigger: 'change' }
        ],
        startTime: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        endTime: [
          { type: 'string', required: true, message: '请选择时间', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    // this.onSubmit()
  },
  created() {
    this.$parent.point = []
    this.$parent.start = []
    this.$parent.end = []
    this.$parent.camList = []
    this.$parent.polylinePath = []
    this.colors = []

  },
  methods: {
    help(){
      this.$alert('提示信息xxxxxxxxxxxx', '帮助', {
        confirmButtonText: '确定',
      })
    },
    gridChange(){
      this.$parent.$refs.mapView.girdSize = 10000/this.grid
      this.$parent.$refs.mapView.Gridgranularity = this.grid
      this.$parent.$refs.mapView.firstPlayFlag = true
      this.$parent.$refs.mapView.initLayer(this.$parent.$refs.mapView.$refs.layerCanvas.$amapComponent)

    },
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
      this.selected = rows.map(function(rows) {
        return {
          count: rows.count,
          id:rows.girdId
        };
      })
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
      this.$parent.isGrid=false
      this.$parent.$refs.mapView.visible.layer = false
      this.$parent.point = []
      this.$parent.start = []
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

    async showData() {
      console.log("select:",this.selected)
      // this.$parent.point = []
      // this.$parent.polylinePath = []
      // this.$parent.camList = []
      // this.colors = []
      // const length = this.selected.length
      //
      // var requests = []
      // var needed = []
      // for (var i=0; i<length; i++){
      //   if (this.selected[i].features.geometry.coordinates.length === 0){
      //     var a = []
      //     a.push(this.tableData[this.selected[i].id].carNumber)
      //     let form = {
      //       startTime: this.form.startTime,
      //       endTime: this.form.endTime,
      //       carNumbers: a,
      //     }
      //     const request = listByCarNumberOrderInTimeRange(form)
      //     requests.push(request)
      //     needed.push(this.selected[i].id)
      //   }
      //
      //
      // }
      // var b = true
      // await Promise.all(requests).then((responses) => {
      //
      //
      //   for (var j=0; j<responses.length; j++){
      //     if (responses[j].code !== 200){
      //       b = false;
      //       break;
      //     }
      //   }
      //   if (b){
      //     this.$message({
      //       message: '查询成功',
      //       type: 'success'
      //     });
      //     for (var i=0; i<responses.length; i++){
      //       const id =  needed[i]
      //       this.tableData[id].features = responses[i].msg.features[0]
      //     }
      //   }else {
      //     this.$message.error('查询失败');
      //   }
      // })
      //
      // if (b) {
      //
      //   for (var k = 0; k < length; k++) {
      //     var id = this.selected[k].id
      //     for (var j = 0; j < this.tableData[id].features.geometry.coordinates.length; j++) {
      //       this.$parent.point.push({
      //         lnglat: this.tableData[id].features.geometry.coordinates[j],
      //         camAddress: ' '
      //       })
      //     }
      //     this.$parent.polylinePath.push({
      //       path: this.tableData[id].features.geometry.coordinates,
      //       color: colors[id % colors.length],
      //       message: this.tableData[id].features.properties.toString()
      //     })
      //     this.colors.push({
      //       color:colors[id % colors.length],
      //       carNumber: this.tableData[id].carNumber
      //     })
      //   }
      //   // this.$parent.$refs.mapView.zoom = [this.$parent.point[0].lnglat]
      //
      // }
      //
      // this.$parent.$refs.mapView.visible.polyline = true;
      // this.activeName = "fourth"
    },

    importFromMap() {
      var a = this.$parent.camList.map(function(marker) {
        return marker.camId
      })
      this.form.camIds = a.toString()

    },
    onSubmit(){
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {

          var data = {
            left: this.$parent.$refs.mapView.bounds[0],
            right: this.$parent.$refs.mapView.bounds[2],
            up: this.$parent.$refs.mapView.bounds[3],
            down: this.$parent.$refs.mapView.bounds[1],
            // cut: this.grid,
            cut:20,
            startTime: this.form.startTime,
            endTime: this.form.endTime
          }
          console.log("传参：",data)
          this.load = true

          // await gridFlowCount(data).then((response) => {
          //   if (response.code === 200) {
          //     this.tableData = response.msg
          //     for(var i=0;i<this.tableData.length;i++){
          //         this.getPOI(this.tableData[i].centralLon,this.tableData[i].centralLat,i)
          //       // this.tableData[i].poi = this.getPOI(this.tableData[i].left,this.tableData[i].right,this.tableData[i].up,this.tableData[i].down)
          //     }
          //   } else {
          //     this.$message.error('查询失败');
          //   }
          // })
          this.activeName = 'third'
          setTimeout(() => {
            this.load = false
          this.tableData = [{
            "girdId": "网格2-2",
            "count": 11388347,
            "centralLon": 117.03665637607902,
            "centralLat": 36.67664022154926,
            "poi": "",
            "row": 2,
            "col": 2,
            "left": 116.9699315584,
            "up": 36.731539481457304,
            "right": 117.10326314919821,
            "down": 36.62164890896986
          }, {
            "girdId": "网格2-3",
            "count": 6257411,
            "centralLon": 117.16966763135716,
            "centralLat": 36.67666397669755,
            "poi": "",
            "row": 2,
            "col": 3,
            "left": 117.1032758391316,
            "up": 36.73182886899553,
            "right": 117.23602221433408,
            "down": 36.62147401900186
          }, {
            "girdId": "网格2-1",
            "count": 4870941,
            "centralLon": 116.90332905322038,
            "centralLat": 36.67636430220963,
            "poi": "",
            "row": 2,
            "col": 1,
            "left": 116.83694814550655,
            "up": 36.73153838359695,
            "right": 116.96991950465892,
            "down": 36.621359529256814
          }, {
            "girdId": "网格3-2",
            "count": 1475003,
            "centralLon": 117.03664394911307,
            "centralLat": 36.566464898904734,
            "poi": "",
            "row": 3,
            "col": 2,
            "left": 116.96991950465892,
            "up": 36.62135952925681,
            "right": 117.10325051795819,
            "down": 36.5114786673226
          }, {
            "girdId": "网格2-4",
            "count": 1392548,
            "centralLon": 117.30254981761034,
            "centralLat": 36.67659496359091,
            "poi": "",
            "row": 2,
            "col": 4,
            "left": 117.23603470680577,
            "up": 36.73165399545588,
            "right": 117.36916567691925,
            "down": 36.62162398509028
          }, {
            "girdId": "网格3-1",
            "count": 873702,
            "centralLon": 116.9033172370895,
            "centralLat": 36.56618898764297,
            "poi": "",
            "row": 3,
            "col": 1,
            "left": 116.83693621406604,
            "up": 36.6213584445639,
            "right": 116.96990750619675,
            "down": 36.5111892954414
          }, {
            "girdId": "网格1-2",
            "count": 460783,
            "centralLon": 117.03666886066378,
            "centralLat": 36.786824171158955,
            "poi": "",
            "row": 1,
            "col": 2,
            "left": 116.969943667762,
            "up": 36.84172661846164,
            "right": 117.1032758391316,
            "down": 36.73182886899553
          }, {
            "girdId": "网格1-3",
            "count": 191317,
            "centralLon": 117.1696802784277,
            "centralLat": 36.78684793905422,
            "poi": "",
            "row": 1,
            "col": 3,
            "left": 117.10328858811984,
            "up": 36.84201601381847,
            "right": 117.23603470680577,
            "down": 36.73165399545588
          }, {
            "girdId": "网格1-4",
            "count": 104152,
            "centralLon": 117.30256244273373,
            "centralLat": 36.78677894041459,
            "poi": "",
            "row": 1,
            "col": 4,
            "left": 117.2360472572106,
            "up": 36.841841156710366,
            "right": 117.36917852010876,
            "down": 36.73180397195289
          }, {
            "girdId": "网格3-3",
            "count": 102371,
            "centralLon": 117.16965504274596,
            "centralLat": 36.56648864130506,
            "poi": "",
            "row": 3,
            "col": 3,
            "left": 117.10326314919821,
            "up": 36.62164890896985,
            "right": 117.23600977944034,
            "down": 36.511303760929486
          }, {
            "girdId": "网格1-1",
            "count": 73765,
            "centralLon": 116.90334092367507,
            "centralLat": 36.786548243747795,
            "poi": "",
            "row": 1,
            "col": 1,
            "left": 116.83696013194225,
            "up": 36.841725507434354,
            "right": 116.9699315584,
            "down": 36.731539481457304
          }, {
            "girdId": "网格1-5",
            "count": 15742,
            "centralLon": 117.43567275244058,
            "centralLat": 36.7869116530154,
            "poi": "",
            "row": 1,
            "col": 5,
            "left": 117.36919142310536,
            "up": 36.841991143612326,
            "right": 117.50193677066375,
            "down": 36.731664287467325
          }, {
            "girdId": "网格4-2",
            "count": 10959,
            "centralLon": 117.03663157941307,
            "centralLat": 36.45630000232363,
            "poi": "",
            "row": 4,
            "col": 2,
            "left": 116.96990750619675,
            "up": 36.5111892954414,
            "right": 117.1032379450531,
            "down": 36.401319154435164
          }, {
            "girdId": "网格3-4",
            "count": 7219,
            "centralLon": 117.30253725078461,
            "centralLat": 36.566419613732386,
            "poi": "",
            "row": 3,
            "col": 4,
            "left": 117.23602221433408,
            "up": 36.62147401900185,
            "right": 117.3691528931709,
            "down": 36.51145371660563
          }, {
            "girdId": "网格4-4",
            "count": 284,
            "centralLon": 117.30252474189966,
            "centralLat": 36.45625468993727,
            "poi": "",
            "row": 4,
            "col": 4,
            "left": 117.23600977944034,
            "up": 36.511303760929486,
            "right": 117.36914016850082,
            "down": 36.40129417688036
          }, {
            "girdId": "网格1-6",
            "count": 0,
            "centralLon": 117.568189575499,
            "centralLat": 36.78658934464486,
            "poi": "",
            "row": 1,
            "col": 6,
            "left": 117.50194947419335,
            "up": 36.841851474905475,
            "right": 117.6346218273827,
            "down": 36.73148880106223
          }, {
            "girdId": "网格1-7",
            "count": 0,
            "centralLon": 117.70121262642802,
            "centralLat": 36.78669719008531,
            "poi": "",
            "row": 1,
            "col": 7,
            "left": 117.63463422664448,
            "up": 36.84167600494329,
            "right": 117.76770350196159,
            "down": 36.73165450878657
          }, {
            "girdId": "网格1-8",
            "count": 0,
            "centralLon": 117.83402680878179,
            "centralLat": 36.78665711881527,
            "poi": "",
            "row": 1,
            "col": 8,
            "left": 117.7677161648433,
            "up": 36.84184172278073,
            "right": 117.90033576178145,
            "down": 36.73147594473859
          }, {
            "girdId": "网格1-9",
            "count": 0,
            "centralLon": 117.96685725379298,
            "centralLat": 36.78664435803806,
            "poi": "",
            "row": 1,
            "col": 9,
            "left": 117.90034804479933,
            "up": 36.84166317523276,
            "right": 118.03350802471068,
            "down": 36.73174255062725
          }, {
            "girdId": "网格1-10",
            "count": 0,
            "centralLon": 118.10006460270195,
            "centralLat": 36.78694123856828,
            "poi": "",
            "row": 1,
            "col": 10,
            "left": 118.03352070105527,
            "up": 36.841929789362666,
            "right": 118.16639361765104,
            "down": 36.7317807391872
          }, {
            "girdId": "网格2-5",
            "count": 0,
            "centralLon": 117.43565982372155,
            "centralLat": 36.67672766546476,
            "poi": "",
            "row": 2,
            "col": 5,
            "left": 117.36917852010875,
            "up": 36.73180397195289,
            "right": 117.50192412581475,
            "down": 36.62148428482845
          }, {
            "girdId": "网格2-6",
            "count": 0,
            "centralLon": 117.56817719003601,
            "centralLat": 36.67640533793043,
            "poi": "",
            "row": 2,
            "col": 6,
            "left": 117.50193677066375,
            "up": 36.731664287467325,
            "right": 117.6346094851055,
            "down": 36.621308781983636
          }, {
            "girdId": "网格2-7",
            "count": 0,
            "centralLon": 117.70120006187976,
            "centralLat": 36.676513172182844,
            "poi": "",
            "row": 2,
            "col": 7,
            "left": 117.6346218273827,
            "up": 36.73148880106223,
            "right": 117.76769089745484,
            "down": 36.6214744795909
          }, {
            "girdId": "网格2-8",
            "count": 0,
            "centralLon": 117.83401436318479,
            "centralLat": 36.67647308698215,
            "poi": "",
            "row": 2,
            "col": 8,
            "left": 117.76770350196159,
            "up": 36.73165450878657,
            "right": 117.90032353503157,
            "down": 36.62129589904619
          }, {
            "girdId": "网格2-9",
            "count": 0,
            "centralLon": 117.9668449039419,
            "centralLat": 36.67646031278066,
            "poi": "",
            "row": 2,
            "col": 9,
            "left": 117.90033576178143,
            "up": 36.73147594473859,
            "right": 118.03349540672946,
            "down": 36.621562496687496
          }, {
            "girdId": "网格2-10",
            "count": 0,
            "centralLon": 118.10005181078907,
            "centralLat": 36.676757185627864,
            "poi": "",
            "row": 2,
            "col": 10,
            "left": 118.03350802471068,
            "up": 36.73174255062725,
            "right": 118.16638101666916,
            "down": 36.62160067276732
          }, {
            "girdId": "网格3-5",
            "count": 0,
            "centralLon": 117.4356469549076,
            "centralLat": 36.56655230487597,
            "poi": "",
            "row": 3,
            "col": 5,
            "left": 117.36916567691924,
            "up": 36.621623985090274,
            "right": 117.5019115392867,
            "down": 36.51131400057002
          }, {
            "girdId": "网格3-6",
            "count": 0,
            "centralLon": 117.56816486148341,
            "centralLat": 36.566229958184195,
            "poi": "",
            "row": 3,
            "col": 6,
            "left": 117.50192412581475,
            "up": 36.62148428482844,
            "right": 117.6345971994626,
            "down": 36.511138481288754
          }, {
            "girdId": "网格3-7",
            "count": 0,
            "centralLon": 117.70118755517265,
            "centralLat": 36.56633778124579,
            "poi": "",
            "row": 3,
            "col": 7,
            "left": 117.6346094851055,
            "up": 36.62130878198363,
            "right": 117.76767835096481,
            "down": 36.51130416877492
          }, {
            "girdId": "网格3-8",
            "count": 0,
            "centralLon": 117.83400197474009,
            "centralLat": 36.56629768211481,
            "poi": "",
            "row": 3,
            "col": 8,
            "left": 117.76769089745484,
            "up": 36.621474479590894,
            "right": 117.90031136420329,
            "down": 36.511125571736784
          }, {
            "girdId": "网格3-9",
            "count": 0,
            "centralLon": 117.96683261068037,
            "centralLat": 36.56628489448883,
            "poi": "",
            "row": 3,
            "col": 9,
            "left": 117.90032353503156,
            "up": 36.62129589904618,
            "right": 118.03348284675319,
            "down": 36.511392161124576
          }, {
            "girdId": "网格3-10",
            "count": 0,
            "centralLon": 118.10003907782563,
            "centralLat": 36.56658175964623,
            "poi": "",
            "row": 3,
            "col": 10,
            "left": 118.03349540672946,
            "up": 36.62156249668749,
            "right": 118.16636847355738,
            "down": 36.51143032472297
          }, {
            "girdId": "网格4-1",
            "count": 0,
            "centralLon": 116.9033054749483,
            "centralLat": 36.456024099146134,
            "poi": "",
            "row": 4,
            "col": 1,
            "left": 116.83692433728238,
            "up": 36.51118822391645,
            "right": 116.96989556267435,
            "down": 36.401029790392535
          }, {
            "girdId": "网格4-3",
            "count": 0,
            "centralLon": 117.16964251223645,
            "centralLat": 36.45632373197499,
            "poi": "",
            "row": 4,
            "col": 3,
            "left": 117.10325051795819,
            "up": 36.5114786673226,
            "right": 117.2359974017722,
            "down": 36.40114423162023
          }, {
            "girdId": "网格4-5",
            "count": 0,
            "centralLon": 117.43563414563266,
            "centralLat": 36.45638737034726,
            "poi": "",
            "row": 4,
            "col": 5,
            "left": 117.36915289317089,
            "up": 36.51145371660563,
            "right": 117.50189901072285,
            "down": 36.40115444507351
          }, {
            "girdId": "网格4-6",
            "count": 0,
            "centralLon": 117.56815258949187,
            "centralLat": 36.45606500450446,
            "poi": "",
            "row": 4,
            "col": 6,
            "left": 117.5019115392867,
            "up": 36.51131400057002,
            "right": 117.63458497010669,
            "down": 36.40097890935909
          }, {
            "girdId": "网格4-7",
            "count": 0,
            "centralLon": 117.70117510595205,
            "centralLat": 36.45617281637245,
            "poi": "",
            "row": 4,
            "col": 7,
            "left": 117.6345971994626,
            "up": 36.511138481288754,
            "right": 117.76766586213628,
            "down": 36.401144586720086
          }, {
            "girdId": "网格4-8",
            "count": 0,
            "centralLon": 117.83398964309679,
            "centralLat": 36.45613270331154,
            "poi": "",
            "row": 4,
            "col": 8,
            "left": 117.76767835096481,
            "up": 36.51130416877492,
            "right": 117.90029924895302,
            "down": 36.4009659731919
          }, {
            "girdId": "网格4-9",
            "count": 0,
            "centralLon": 117.96682037366052,
            "centralLat": 36.45611990226086,
            "poi": "",
            "row": 4,
            "col": 9,
            "left": 117.90031136420328,
            "up": 36.511125571736784,
            "right": 118.0334703444265,
            "down": 36.401232554319925
          }, {
            "girdId": "网格4-10",
            "count": 0,
            "centralLon": 118.10002640345037,
            "centralLat": 36.456416759721606,
            "poi": "",
            "row": 4,
            "col": 10,
            "left": 118.03348284675319,
            "up": 36.511392161124576,
            "right": 118.16635598796097,
            "down": 36.40127070543559
          }, {
            "girdId": "网格5-1",
            "count": 0,
            "centralLon": 116.90329376646538,
            "centralLat": 36.345869828249434,
            "poi": "",
            "row": 5,
            "col": 1,
            "left": 116.83691251482006,
            "up": 36.40102873203605,
            "right": 116.96988367375545,
            "down": 36.290880381656244
          }, {
            "girdId": "网格5-2",
            "count": 0,
            "centralLon": 117.03661926662915,
            "centralLat": 36.34614572333618,
            "poi": "",
            "row": 5,
            "col": 2,
            "left": 116.96989556267435,
            "up": 36.401029790392535,
            "right": 117.10322543012745,
            "down": 36.29116973785348
          }, {
            "girdId": "网格5-3",
            "count": 0,
            "centralLon": 117.16963003947393,
            "centralLat": 36.346169440237574,
            "poi": "",
            "row": 5,
            "col": 3,
            "left": 117.1032379450531,
            "up": 36.401319154435164,
            "right": 117.23598508098031,
            "down": 36.29099479862006
          }, {
            "girdId": "网格5-4",
            "count": 0,
            "centralLon": 117.30251229060157,
            "centralLat": 36.346100383735816,
            "poi": "",
            "row": 5,
            "col": 4,
            "left": 117.2359974017722,
            "up": 36.40114423162023,
            "right": 117.36912750254912,
            "down": 36.29114473346043
          }, {
            "girdId": "网格5-5",
            "count": 0,
            "centralLon": 117.43562139553373,
            "centralLat": 36.34623305340884,
            "poi": "",
            "row": 5,
            "col": 5,
            "left": 117.3691401685008,
            "up": 36.40129417688036,
            "right": 117.50188653976947,
            "down": 36.29100498588489
          }, {
            "girdId": "网格5-6",
            "count": 0,
            "centralLon": 117.56814037371502,
            "centralLat": 36.345910668421546,
            "poi": "",
            "row": 5,
            "col": 6,
            "left": 117.50189901072285,
            "up": 36.40115444507351,
            "right": 117.6345727966933,
            "down": 36.29082943374067
          }, {
            "girdId": "网格5-7",
            "count": 0,
            "centralLon": 117.70116271386622,
            "centralLat": 36.34601846909309,
            "poi": "",
            "row": 5,
            "col": 7,
            "left": 117.63458497010669,
            "up": 36.40097890935909,
            "right": 117.76765343061696,
            "down": 36.29099510097239
          }, {
            "girdId": "网格5-8",
            "count": 0,
            "centralLon": 117.8339773679069,
            "centralLat": 36.34597834210264,
            "poi": "",
            "row": 5,
            "col": 8,
            "left": 117.76766586213628,
            "up": 36.401144586720086,
            "right": 117.90028718894006,
            "down": 36.29081647095757
          }, {
            "girdId": "网格5-9",
            "count": 0,
            "centralLon": 117.96680819253743,
            "centralLat": 36.345965527627044,
            "poi": "",
            "row": 5,
            "col": 9,
            "left": 117.900299248953,
            "up": 36.4009659731919,
            "right": 118.03345789939692,
            "down": 36.29108304381952
          }, {
            "girdId": "网格5-10",
            "count": 0,
            "centralLon": 118.10001378730503,
            "centralLat": 36.34626237738419,
            "poi": "",
            "row": 5,
            "col": 10,
            "left": 118.0334703444265,
            "up": 36.401232554319925,
            "right": 118.16634355952807,
            "down": 36.29112118245112
          }, {
            "girdId": "网格6-1",
            "count": 0,
            "centralLon": 116.90328211131215,
            "centralLat": 36.23572473853682,
            "poi": "",
            "row": 6,
            "col": 1,
            "left": 116.83690074634633,
            "up": 36.29087933646874,
            "right": 116.96987183910646,
            "down": 36.1807388734332
          }, {
            "girdId": "网格6-2",
            "count": 0,
            "centralLon": 117.0366070104143,
            "centralLat": 36.23600062552625,
            "poi": "",
            "row": 6,
            "col": 2,
            "left": 116.96988367375545,
            "up": 36.290880381656244,
            "right": 117.10321297282873,
            "down": 36.18102822177814
          }, {
            "girdId": "网格6-3",
            "count": 0,
            "centralLon": 117.16961762410662,
            "centralLat": 36.236024329676674,
            "poi": "",
            "row": 6,
            "col": 3,
            "left": 117.10322543012745,
            "up": 36.29116973785348,
            "right": 117.2359728167182,
            "down": 36.18085326612963
          }, {
            "girdId": "网格6-4",
            "count": 0,
            "centralLon": 117.30249989653935,
            "centralLat": 36.23595525871191,
            "poi": "",
            "row": 6,
            "col": 4,
            "left": 117.23598508098031,
            "up": 36.29099479862006,
            "right": 117.36911489495893,
            "down": 36.18100319054642
          }, {
            "girdId": "网格6-5",
            "count": 0,
            "centralLon": 117.4356087042508,
            "centralLat": 36.236087917644554,
            "poi": "",
            "row": 6,
            "col": 5,
            "left": 117.3691275025491,
            "up": 36.29114473346043,
            "right": 117.50187412607575,
            "down": 36.180863427204805
          }, {
            "girdId": "网格6-6",
            "count": 0,
            "centralLon": 117.56812821380932,
            "centralLat": 36.23576551351937,
            "poi": "",
            "row": 6,
            "col": 6,
            "left": 117.50188653976947,
            "up": 36.29100498588489,
            "right": 117.63456067888082,
            "down": 36.18068785863419
          }, {
            "girdId": "网格6-7",
            "count": 0,
            "centralLon": 117.70115037856638,
            "centralLat": 36.235873302991614,
            "poi": "",
            "row": 6,
            "col": 7,
            "left": 117.6345727966933,
            "up": 36.29082943374067,
            "right": 117.7676410560575,
            "down": 36.18085351573248
          }, {
            "girdId": "网格6-8",
            "count": 0,
            "centralLon": 117.83396514882531,
            "centralLat": 36.23583316207202,
            "poi": "",
            "row": 6,
            "col": 8,
            "left": 117.76765343061696,
            "up": 36.29099510097239,
            "right": 117.90027518382648,
            "down": 36.180674869234494
          }, {
            "girdId": "网格6-9",
            "count": 0,
            "centralLon": 117.96679606696897,
            "centralLat": 36.23582033417131,
            "poi": "",
            "row": 6,
            "col": 9,
            "left": 117.90028718894004,
            "up": 36.29081647095757,
            "right": 118.03344551131492,
            "down": 36.18094143382397
          }, {
            "girdId": "网格6-10",
            "count": 0,
            "centralLon": 118.10000122903432,
            "centralLat": 36.23611717621784,
            "poi": "",
            "row": 6,
            "col": 10,
            "left": 118.03345789939692,
            "up": 36.29108304381952,
            "right": 118.1663311879098,
            "down": 36.18097955997019
          }, {
            "girdId": "网格7-1",
            "count": 0,
            "centralLon": 116.90327050916267,
            "centralLat": 36.12558594262781,
            "poi": "",
            "row": 7,
            "col": 1,
            "left": 116.83688903153124,
            "up": 36.18073784141518,
            "right": 116.96986005839665,
            "down": 36.07060177575879
          }, {
            "girdId": "网格7-2",
            "count": 0,
            "centralLon": 117.03659481042442,
            "centralLat": 36.1258618215133,
            "poi": "",
            "row": 7,
            "col": 2,
            "left": 116.96987183910646,
            "up": 36.1807388734332,
            "right": 117.10320057280731,
            "down": 36.07089111624448
          }, {
            "girdId": "网格7-3",
            "count": 0,
            "centralLon": 117.16960526578568,
            "centralLat": 36.12588551291173,
            "poi": "",
            "row": 7,
            "col": 3,
            "left": 117.10321297282873,
            "up": 36.18102822177814,
            "right": 117.23596060864224,
            "down": 36.0707161441843
          }, {
            "girdId": "网格7-4",
            "count": 0,
            "centralLon": 117.30248755936492,
            "centralLat": 36.12581642748502,
            "poi": "",
            "row": 7,
            "col": 4,
            "left": 117.2359728167182,
            "up": 36.18085326612963,
            "right": 117.36910234537628,
            "down": 36.07086605817367
          }, {
            "girdId": "网格7-5",
            "count": 0,
            "centralLon": 117.43559607142684,
            "centralLat": 36.12594907567385,
            "poi": "",
            "row": 7,
            "col": 5,
            "left": 117.36911489495891,
            "up": 36.18100319054642,
            "right": 117.50186176929375,
            "down": 36.07072627906863
          }, {
            "girdId": "网格7-6",
            "count": 0,
            "centralLon": 117.56811610943406,
            "centralLat": 36.125626652417466,
            "poi": "",
            "row": 7,
            "col": 6,
            "left": 117.50187412607575,
            "up": 36.180863427204805,
            "right": 117.63454861633045,
            "down": 36.07055069407506
          }, {
            "girdId": "网格7-7",
            "count": 0,
            "centralLon": 117.70113809970658,
            "centralLat": 36.125734430687515,
            "poi": "",
            "row": 7,
            "col": 7,
            "left": 117.63456067888082,
            "up": 36.18068785863419,
            "right": 117.7676287381114,
            "down": 36.07071634103572
          }, {
            "girdId": "网格7-8",
            "count": 0,
            "centralLon": 117.83395298550978,
            "centralLat": 36.125694275839194,
            "poi": "",
            "row": 7,
            "col": 8,
            "left": 117.7676410560575,
            "up": 36.18085351573248,
            "right": 117.9002632332772,
            "down": 36.07053767805808
          }, {
            "girdId": "网格7-9",
            "count": 0,
            "centralLon": 117.96678399661586,
            "centralLat": 36.125681434513154,
            "poi": "",
            "row": 7,
            "col": 9,
            "left": 117.90027518382647,
            "up": 36.180674869234494,
            "right": 118.03343317983386,
            "down": 36.07080423436863
          }, {
            "girdId": "网格7-10",
            "count": 0,
            "centralLon": 118.0999887282859,
            "centralLat": 36.125978268841976,
            "poi": "",
            "row": 7,
            "col": 10,
            "left": 118.03344551131492,
            "up": 36.18094143382397,
            "right": 118.16631887276013,
            "down": 36.07084234802812
          }, {
            "girdId": "网格8-1",
            "count": 0,
            "centralLon": 116.90325895969372,
            "centralLat": 36.01544945550327,
            "poi": "",
            "row": 8,
            "col": 1,
            "left": 116.83687737004752,
            "up": 36.070600756910764,
            "right": 116.96984833129794,
            "down": 35.96046473140384
          }, {
            "girdId": "网格8-2",
            "count": 0,
            "centralLon": 117.03658266631822,
            "centralLat": 36.015725326278115,
            "poi": "",
            "row": 8,
            "col": 2,
            "left": 116.96986005839665,
            "up": 36.07060177575878,
            "right": 117.10318822971648,
            "down": 35.96075406402323
          }, {
            "girdId": "网格8-3",
            "count": 0,
            "centralLon": 117.16959296416515,
            "centralLat": 36.015749004923535,
            "poi": "",
            "row": 8,
            "col": 3,
            "left": 117.10320057280731,
            "up": 36.070891116244475,
            "right": 117.23594845641168,
            "down": 35.96057907555487
          }, {
            "girdId": "网格8-4",
            "count": 0,
            "centralLon": 117.3024752787331,
            "centralLat": 36.015679905035945,
            "poi": "",
            "row": 8,
            "col": 4,
            "left": 117.23596060864224,
            "up": 36.070716144184296,
            "right": 117.36908985345016,
            "down": 35.96072897911292
          }, {
            "girdId": "网格8-5",
            "count": 0,
            "centralLon": 117.43558349670782,
            "centralLat": 36.015812542477484,
            "poi": "",
            "row": 8,
            "col": 5,
            "left": 117.36910234537626,
            "up": 36.070866058173664,
            "right": 117.50184946907846,
            "down": 35.96058918424715
          }, {
            "girdId": "网格8-6",
            "count": 0,
            "centralLon": 117.56810406025139,
            "centralLat": 36.015490100096685,
            "poi": "",
            "row": 8,
            "col": 6,
            "left": 117.50186176929375,
            "up": 36.07072627906862,
            "right": 117.63453660870623,
            "down": 35.960413582834114
          }, {
            "girdId": "网格8-7",
            "count": 0,
            "centralLon": 117.7011258769438,
            "centralLat": 36.01559786716163,
            "poi": "",
            "row": 8,
            "col": 7,
            "left": 117.63454861633045,
            "up": 36.07055069407505,
            "right": 117.76761647643505,
            "down": 35.96057921965291
          }, {
            "girdId": "网格8-8",
            "count": 0,
            "centralLon": 117.8339408776209,
            "centralLat": 36.015557698384995,
            "poi": "",
            "row": 8,
            "col": 8,
            "left": 117.7676287381114,
            "up": 36.07071634103571,
            "right": 117.90025133695987,
            "down": 35.96040054019919
          }, {
            "girdId": "网格8-9",
            "count": 0,
            "centralLon": 117.96677198114163,
            "centralLat": 36.01554484363344,
            "poi": "",
            "row": 8,
            "col": 9,
            "left": 117.90026323327719,
            "up": 36.07053767805807,
            "right": 118.03342090460995,
            "down": 35.96066708822428
          }, {
            "girdId": "网格8-10",
            "count": 0,
            "centralLon": 118.09997628471031,
            "centralLat": 36.015841670237364,
            "poi": "",
            "row": 8,
            "col": 10,
            "left": 118.03343317983386,
            "up": 36.07080423436862,
            "right": 118.16630661373591,
            "down": 35.96070518939568
          }, {
            "girdId": "网格9-1",
            "count": 0,
            "centralLon": 116.90324746258473,
            "centralLat": 35.90531068220703,
            "poi": "",
            "row": 9,
            "col": 1,
            "left": 116.83686576157062,
            "up": 35.96046372572632,
            "right": 116.96983665748499,
            "down": 35.85032304978113
          }, {
            "girdId": "网格9-2",
            "count": 0,
            "centralLon": 117.03657057775726,
            "centralLat": 35.90558654486445,
            "poi": "",
            "row": 9,
            "col": 2,
            "left": 116.96984833129794,
            "up": 35.96046473140384,
            "right": 117.10317594321238,
            "down": 35.85061237452709
          }, {
            "girdId": "网格9-3",
            "count": 0,
            "centralLon": 117.1695807189019,
            "centralLat": 35.90561021075584,
            "poi": "",
            "row": 9,
            "col": 3,
            "left": 117.10318822971648,
            "up": 35.96075406402323,
            "right": 117.23593635968852,
            "down": 35.85043736965408
          }, {
            "girdId": "网格9-4",
            "count": 0,
            "centralLon": 117.30246305430151,
            "centralLat": 35.905541096408456,
            "poi": "",
            "row": 9,
            "col": 4,
            "left": 117.23594845641168,
            "up": 35.96057907555487,
            "right": 117.36907741883246,
            "down": 35.850587262776905
          }, {
            "girdId": "网格9-5",
            "count": 0,
            "centralLon": 117.4355709797426,
            "centralLat": 35.90567372309919,
            "poi": "",
            "row": 9,
            "col": 5,
            "left": 117.36908985345015,
            "up": 35.96072897911292,
            "right": 117.50183722508766,
            "down": 35.850447452153105
          }, {
            "girdId": "网格9-6",
            "count": 0,
            "centralLon": 117.56809206592618,
            "centralLat": 35.90535126160085,
            "poi": "",
            "row": 9,
            "col": 6,
            "left": 117.50184946907846,
            "up": 35.96058918424715,
            "right": 117.63452465567491,
            "down": 35.85027183432417
          }, {
            "girdId": "网格9-7",
            "count": 0,
            "centralLon": 117.70111370993779,
            "centralLat": 35.905459017457744,
            "poi": "",
            "row": 9,
            "col": 7,
            "left": 117.63453660870623,
            "up": 35.960413582834114,
            "right": 117.76760427068766,
            "down": 35.850437460996794
          }, {
            "girdId": "网格9-8",
            "count": 0,
            "centralLon": 117.83392882482201,
            "centralLat": 35.90541883475323,
            "poi": "",
            "row": 9,
            "col": 8,
            "left": 117.76761647643505,
            "up": 35.96057921965291,
            "right": 117.90023949454486,
            "down": 35.85025876507062
          }, {
            "girdId": "网格9-9",
            "count": 0,
            "centralLon": 117.96676002021258,
            "centralLat": 35.90540596657596,
            "poi": "",
            "row": 9,
            "col": 9,
            "left": 117.90025133695985,
            "up": 35.96040054019919,
            "right": 118.03340868530223,
            "down": 35.85052530480364
          }, {
            "girdId": "网格9-10",
            "count": 0,
            "centralLon": 118.09996389796103,
            "centralLat": 35.90570278544774,
            "poi": "",
            "row": 9,
            "col": 10,
            "left": 118.03342090460995,
            "up": 35.96066708822428,
            "right": 118.16629441049677,
            "down": 35.85056339348561
          }, {
            "girdId": "网格10-1",
            "count": 0,
            "centralLon": 116.90323601751777,
            "centralLat": 35.79516498197543,
            "poi": "",
            "row": 10,
            "col": 1,
            "left": 116.83685420577865,
            "up": 35.85032205727463,
            "right": 116.96982503663511,
            "down": 35.740172284407116
          }, {
            "girdId": "网格10-2",
            "count": 0,
            "centralLon": 117.03655854440585,
            "centralLat": 35.79544083650856,
            "poi": "",
            "row": 10,
            "col": 2,
            "left": 116.96983665748499,
            "up": 35.85032304978113,
            "right": 117.10316371295394,
            "down": 35.740461601272436
          }, {
            "girdId": "网格10-3",
            "count": 0,
            "centralLon": 117.16956852965566,
            "centralLat": 35.795464489644885,
            "poi": "",
            "row": 10,
            "col": 3,
            "left": 117.10317594321238,
            "up": 35.85061237452709,
            "right": 117.2359243181376,
            "down": 35.74028657999836
          }, {
            "girdId": "网格10-4",
            "count": 0,
            "centralLon": 117.30245088573064,
            "centralLat": 35.79539536083883,
            "poi": "",
            "row": 10,
            "col": 4,
            "left": 117.23593635968852,
            "up": 35.85043736965408,
            "right": 117.3690650411779,
            "down": 35.740436462681984
          }, {
            "girdId": "网格10-5",
            "count": 0,
            "centralLon": 117.43555852018288,
            "centralLat": 35.79552797677522,
            "poi": "",
            "row": 10,
            "col": 5,
            "left": 117.36907741883245,
            "up": 35.850587262776905,
            "right": 117.50182503698194,
            "down": 35.740296636302936
          }, {
            "girdId": "网格10-6",
            "count": 0,
            "centralLon": 117.56808012612612,
            "centralLat": 35.7952054961663,
            "poi": "",
            "row": 10,
            "col": 6,
            "left": 117.50183722508766,
            "up": 35.850447452153105,
            "right": 117.634512756906,
            "down": 35.740121002061684
          }, {
            "girdId": "网格10-7",
            "count": 0,
            "centralLon": 117.7011015983511,
            "centralLat": 35.79531324081216,
            "poi": "",
            "row": 10,
            "col": 7,
            "left": 117.63452465567491,
            "up": 35.85027183432417,
            "right": 117.76759212053123,
            "down": 35.740286618583816
          }, {
            "girdId": "网格10-8",
            "count": 0,
            "centralLon": 117.83391682677927,
            "centralLat": 35.795273044180206,
            "poi": "",
            "row": 10,
            "col": 8,
            "left": 117.76760427068766,
            "up": 35.850437460996794,
            "right": 117.90022770570528,
            "down": 35.74010790618884
          }, {
            "girdId": "网格10-9",
            "count": 0,
            "centralLon": 117.96674811349774,
            "centralLat": 35.79526016257705,
            "poi": "",
            "row": 10,
            "col": 9,
            "left": 117.90023949454485,
            "up": 35.85025876507062,
            "right": 118.03339652157257,
            "down": 35.740374437623124
          }, {
            "girdId": "网格10-10",
            "count": 0,
            "centralLon": 118.09995156769433,
            "centralLat": 35.79555697370933,
            "poi": "",
            "row": 10,
            "col": 10,
            "left": 118.03340868530223,
            "up": 35.85052530480364,
            "right": 118.1662822627052,
            "down": 35.740412513814285
          }]
            for(var i=0;i<this.tableData.length;i++){
              this.getPOI(this.tableData[i].centralLon,this.tableData[i].centralLat,i)
              // this.tableData[i].poi = this.getPOI(this.tableData[i].left,this.tableData[i].right,this.tableData[i].up,this.tableData[i].down)
            }

          }, 5000);


          console.log("-----------tableData",this.tableData)

          // this.tableData = []
          // if(typeof this.form.camIds === "string"){
          //   this.form.camIds.split(',')
          // }
          // cityFlowStats(this.form).then((response) => {
          //   if(response.code === 200){
          //     this.$message({
          //       message: '查询成功',
          //       type: 'success'
          //     });
          //     console.log('res', response)
          //     this.tableData = response.msg
          //
          //     this.activeName = 'third'
          //   }else {
          //     this.$message.error('查询失败');
          //   }
          //
          // })
        } else {
          // Form is invalid, show error messages
          console.log('error submit!!');
          return false;
        }
      });
    },
    getPOI(lon,lat,i) {

      AMap.plugin('AMap.Geocoder',(status, result)=>{
        var placeSearch = new AMap.Geocoder()

        var lnglat = [lon,lat]

        placeSearch.getAddress(lnglat, (status, result)=> {
          if (status === 'complete') {
                  // 查询成功，结果有效
                  this.tableData[i].poi = result.regeocode.formattedAddress
          } else {
            this.tableData[i].poi= '暂无数据'
          }
        })
      })
      // AMap.plugin('AMap.PlaceSearch', (status, result) => {
      //   var placeSearch = new AMap.PlaceSearch({
      //     // 配置参数
      //   });
      //
      //   // var bounds = new AMap.Bounds([left, down], [right, up]);
      //   var bounds = new AMap.Bounds([ -74.0060, 40.7120], [-74.0050, 40.7128]);
      //
      //
      //   var rectangle = new AMap.Rectangle({
      //     bounds: bounds
      //   });
      //
      //
      //   // 执行范围查询
      //
      //   placeSearch.searchInBounds("", rectangle.getBounds(), (status, result) => {
      //
      //     if (status === 'complete') {
      //       // 查询成功，结果有效
      //       console.log('查询结果：', result);
      //     } else if (status === 'error') {
      //       // 查询出错
      //       console.error('查询出错');
      //     } else if (status === 'no_data') {
      //       // 没有查询到数据
      //       console.log('没有查询到数据');
      //     }
      // })
    // })
    },
    fill1(){
      this.form = {
        camIds:["3701999862"],
        startTime:"2021-02-01 13:00:00",
        endTime:"2021-02-01 13:05:00"
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
    drawChart() {
      // Create an instance of ECharts and provide the DOM element for rendering
      const chart = echarts.init(this.$refs.chart);

      // Define the data for the pie chart
      var data=[]
      for(var i =0;i<this.selected.length;i++){
        var daaa = {
          value:this.selected[i].count,
          name:this.selected[i].id
        }
        data.push(daaa)
      }

      // Configure the options for the pie chart
      const options = {
        title: {
          text: 'Pie Chart',
          x: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: 'Data',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      // Render the pie chart with the provided options
      chart.setOption(options);
      this.activeName='fifth'
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

