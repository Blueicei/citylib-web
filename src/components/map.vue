<template>
  <div class="page">
      <el-amap ref="map" :zoom="zoom" :zooms="[2, 30]" :center="center" :pitch="pitch" view-mode="3D"  class="amap-demo" @click="getMap"  @zoomchange="zoomChange" @init="initMap">
        <!--       地图 控件栏-->
        <el-amap-control-scale :visible="visible.control" ></el-amap-control-scale>
        <el-amap-control-tool-bar :visible="visible.control" ></el-amap-control-tool-bar>
        <el-amap-control-map-type :visible="visible.control" ></el-amap-control-map-type>
        <!--        控件-->

<!--        连线-->
        <el-amap-layer-canvas ref="layerCanvas" v-if="canvas" :canvas="canvas" :bounds="bounds" :visible="visible.layer" @init="initLayer" ></el-amap-layer-canvas>
<!--        连线-->

<!--        点标记-->
        <el-amap-label-marker :visible="visible.point" v-for="(marker, index) in POIData2" :key="index" :position="marker.point"  :title="marker.address" :icon="startIcon"></el-amap-label-marker>
        <el-amap-label-marker :visible="visible.point" v-for="(marker, index) in POIData1" :key="index" :position="marker.point"  :title="marker.address" :icon="endIcon"></el-amap-label-marker>
        <el-amap-layer-heat-map v-if="visible.heat"  :radius="radius"  :visible="visible.heat" :data-set="dataSet"></el-amap-layer-heat-map>
        <el-amap-marker v-if="visible.marker"   :visible="visible.marker" v-for="(marker, index) in points" :key="index" :position="marker.lnglat"  :title="marker.camAddress"
                        @click="(e) => {clickArrayMarker(marker, e)}" ref="marker"></el-amap-marker>
<!--        点标记-->

      </el-amap>
<!--    <info></info>-->
  </div>
</template>
<script>
import info from "@/components/mapLayer/info";
import AMap from '@amap/amap-jsapi-loader';
import {getHeatMapData} from "../api/map";
const colors = ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'].reverse();
export default {
  props:{
    POI:{},
    end:{},
    lines:{},
    points:{},
    lineString:{},
    polylinePath:{},
    pulseLines:{},
    point:{}
  },
  data() {
    return {

      // icon: ,
      zoom: 15,
      radius:18,
      center: [117.120128,36.652069],
      firstPlayFlag: true,
      bounds: [116.83695000897586, 36.401302737152854 ,117.36915231402126, 36.84171521015678],
      // bounds: [-180, -85 , 180, 85],
      canvas: null,
      map: null,
      POIData1:[],
      POIData2:[],
      girdSize: 100,
      context: null,
      pitch:0,
      heatmapData:null,
      dataSet: {
        data: this.heatmapData,
        max: 100
      },
      startIcon: {
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
      },
      endIcon:{
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png'
      },
      visible: {
        control:true,
        line:false,
        marker:false,
        polyline:false,
        layer:false,
        point:false,
        pulseLine:false,
        heat:false,
      },
      sourceUrl: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json',
      mapStyle: 'amap://styles/916e03b38cfc09e90d195b3a566df71a',
      sourceUrlP:'https://geo.datav.aliyun.com/areas_v3/bound/370100_full.json',
      sourceUrlScatter:'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/sz_road_F.json',

      show: false,
      layerStylePulseLines:{
        altitude: 0,
        interval: 0.8,
        lineWidth:5,
        headColor: 'rgb(255,255,255)',
        trailColor: 'rgb(0,0,0)',
        duration: 30000,
      },
      layerStyle: {
        color: function (index, prop) {
          var i = index % colors.length;
          return colors[i];
        },
        lineWidth: (index, prop) => {
          var i = index % colors.length;
          return i * 0.1 + 2;
        },
        altitude: function (index, feature) {
          var i = index % colors.length;
          return 100 * i;
        },
        // dashArray: [10, 5, 10, 0],
        dashArray: [10, 0, 10, 0],
      },
      layerStyleScatter: {
        unit: 'px',
        size: [20, 20],
        borderWidth: 1,
        texture: 'static/p2.png',
        // texture: 'https://pic.616pic.com/ys_img/00/07/26/3JJnrZk3Dy.jpg',
        color: 'rgb(38,65,178)',
        duration: 500,
        // animate: true,
      }
    };
  },
  components: {
    info
  },
  created() {


  },
  mounted() {


  },
  methods: {
    clickArrayMarker(marker){
      const m = this.$refs.marker[marker.id].$$getInstance()
      if(this.points[marker.id].selected === 0){
        this.$parent.camList.push(marker)
        var iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_' + 'r' + '.png';
        m.setIcon(iconUrl)
        m.setOffset({x:-5, y:0})
        this.$parent.points[marker.id].selected = 1
      }else {
        this.$confirm('是否要删除卡口', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var iconUrl = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_' + 'b' + '.png';
          m.setIcon(iconUrl)
          this.$parent.camList = this.$parent.camList.filter(item => item.id !== marker.id);
          this.$parent.points[marker.id].selected = 0
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
      console.log('camList',this.$parent.camList)
    },
    init(layer){
    },
    // getTrace(){
    //   var map = this.$refs.map.$$getInstance()
    //   var origin = this.polylinePath[0]
    //   var destination = this.polylinePath[this.polylinePath.size-1]
    //   if(this.polylinePath>2){
    //     var waypoints = this.polylinePath.slider(1,this.polylinePath.size-2)
    //   }
    //   this.getDrivingRoute(map, origin, destination, waypoints).then(result => {
    //     // 获取驾车路线规划数据成功
    //     console.log(result);
    //
    //     // 绘制驾车路径
    //     const path = result.routes[0].path;
    //     const polyline = new this.$amap.Polyline({
    //       path: path,
    //       strokeColor: '#FF0000', // 线颜色
    //       strokeOpacity: 1, // 线透明度
    //       strokeWeight: 3, // 线宽度
    //       strokeStyle: 'solid', // 线样式
    //     });
    //     polyline.setMap(map);
    //   })
    //     .catch(error => {
    //       // 获取驾车路线规划数据失败
    //       console.error(error);
    //     });}
    // },
    // getDrivingRoute(map, origin, destination, waypoints) {
    //   return new Promise((resolve, reject) => {
    //     this.$amap.plugin('AMap.Driving', () => {
    //       const driving = new this.$amap.Driving({
    //         map: map,
    //         waypoints: waypoints,
    //       });
    //
    //       driving.search(origin, destination, (status, result) => {
    //         if (status === 'complete') {
    //           resolve(result);
    //         } else {
    //           reject(result);
    //         }
    //       });
    //     });
    //   });
    // },
    clickA(p){
      this.$alert('车牌号：'+p.carNumber+'<br>'+
      '车辆类型：'+p.carType+'<br>'+
      '轨迹长度：'+p.distance+'<br>'+
      '出发时间：'+p.startTime+'<br>'+
      '结束时间：'+ p.endTime, '轨迹信息', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        });
    },
    markerInit(e){
      console.log('marker init: ', e);
    },
    // async getHeatMap(){
    //   let data = {startTime:'2021-02-01 00:00:00', endTime:'2021-02-02 00:00:00'}
    //
    //   await getHeatMapData(data).then((response) => {
    //     if(response.code === 200){
    //       // this.dataSet.data = response.msg;
    //       this.$set(this.dataSet, 'data', response.msg)
    //     }else {
    //       this.$message.error('查询失败');
    //     }
    //   })
    //   console.log('finish')
    //   console.log(this.dataSet)
    //   // let { rel } = await getHeatMapData(data);
    //   // console.log("----------------")
    //   // console.log(rel)
    //   // console.log("----------------")
    //   // if(rel.code === 200){
    //   //       this.heatmapData = rel.msg
    //   //     }else {
    //   //       this.$message.error('查询失败');
    //   //     }
    // },
    zoomChange(){
    },
    initLoca(loca){
      loca.animate.start();
    },
    mousemove(feature){

    },
    getMap() {
      // bmap vue component
      console.log('$refs: ', this.$refs.map.$$getInstance())
    },
    getLocation(e) {
      console.log('getLocation: ', e)
    },
    // initMap(map){
    //   var canvas = document.createElement('canvas');
    //   var context = canvas.getContext('2d');
    //   // context.fillStyle = 'rgb(0,100,255)';
    //   // // context.strokeStyle = 'white';
    //   context.globalAlpha = 1;
    //   context.lineWidth = 1;
    //   canvas.width = canvas.height = 10000;
    //   this.canvas = canvas;
    //   this.context = context;
    //   this.firstPlayFlag = true;
    // },
    initLayer(layer){

      var draw = () => {
        console.log("draw")
        if (!this.firstPlayFlag){
          return;
        }
        console.log('start')
        var canvasWidth = this.context.canvas.width;
        var canvasHeight = this.context.canvas.height;

        var xLineTotals = Math.floor(canvasHeight / this.girdSize);

        this.context.clearRect(0,0,canvasWidth,canvasHeight)
        for(var i = 0; i< xLineTotals; i++){

          this.context.beginPath(); // 开启路径，设置不同的样式
          this.context.moveTo(0, this.girdSize * i); // -0.5是为了解决像素模糊问题
          this.context.lineTo(canvasWidth, this.girdSize * i);
          this.context.strokeStyle = "#ccc"; // 设置每个线条的颜色

          this.context.stroke();
        }
        var yLineTotals = Math.floor(canvasWidth / this.girdSize);
        for(var j = 0; j< yLineTotals; j++) {
          this.context.beginPath(); // 开启路径，设置不同的样式
          this.context.moveTo(this.girdSize * j, 0); // -0.5是为了解决像素模糊问题
          this.context.lineTo(this.girdSize * j, canvasHeight);
          this.context.strokeStyle = "#ccc"; // 设置每个线条的颜色

          this.context.stroke();
        }
        // 刷新渲染图层
        layer.reFresh();
        AMap.Util.requestAnimFrame(draw);
      };
      draw();
      this.firstPlayFlag = false;

    },
    initMap(map){
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 10000;

      var context = canvas.getContext('2d');
      context.fillStyle = 'rgb(0,100,255)';
      context.strokeStyle = 'white';
      context.globalAlpha = 1;
      context.lineWidth = 2;
      this.canvas = canvas;
      this.context = context;
      this.firstPlayFlag = true;
    },
    // initLayer(layer){
    //   var radious = 0;
    //   var draw = () => {
    //     this.context.clearRect(0, 0, 200, 200);
    //     this.context.globalAlpha = (this.context.globalAlpha - 0.01 + 1) % 1;
    //     radious = (radious + 1) % 100;
    //
    //     this.context.beginPath();
    //     this.context.arc(100, 100, radious, 0, 2 * Math.PI);
    //     this.context.fill();
    //     this.context.stroke();
    //
    //     // 刷新渲染图层
    //     layer.reFresh();
    //
    //     AMap.Util.requestAnimFrame(draw);
    //   };
    //   draw();
    // }


  }
}
</script>
<style>
#mymap {
  width: 100%;
  height: 100%;
  display: block;
}
.anchorBL {
  display: none;
}
.message_box_alert {
  word-break: break-all !important;
}
</style>

