<template>
  <div class="info">
    <h1>
      车辆类型：
      <Select v-model="model1" style="width:100px">
        <Option v-for="item in carType" :value="item.value1" :key="item.value">{{ item.label }}</Option>
      </Select>

      卡口组：
      <Input v-model="bayonet" placeholder="请输入卡口组" style="width: 100px" />
    </h1>
    <Button class="btn1" style="margin-top:10px; font-size: 20px;" @click="import1">批量导入</Button>
    <h2>
      轨迹切分：
      <Select v-model="model2" style="width:100px;margin-right: 5px;">
        <Option v-for="item in trace" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      车牌号：
      <Input v-model="carNumber" placeholder="车牌号" style="width: 100px" />
    </h2>
    <Button class="btn4" style="margin-top: 10px;font-size: 20px"> 批量导入</Button>
    <h3>
      起始时间：
      <Select v-model="model3" style="width:90px;margin-right: 5px;">
        <Option v-for="item in startTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>



      终止时间：
      <Select v-model="model4" style="width:90px;margin-right: 5px;">
        <Option v-for="item in endTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>

    </h3>
    <Button class="btn2" style="margin-top:10px; font-size: 20px;">起止时间导入</Button>
    <div>
      <Button class="btn3" style="margin-top: 10px; font-size:20px;"> 查询</Button>
    </div>
    <div>
      <Tabs value="name1">
        <TabPane label="表格" name="name1">
          <div>
            <Table height="180px" border ref="selection" :columns="columns1" :data="data1"></Table>

          </div>
          <Button style="margin-left: 0;margin-top: 10px;margin-right: 30px;">展示所选轨迹</Button>
          <Button style="margin-top: 10px;">导出所选轨迹</Button>
        </TabPane>
        <TabPane label="直方图" name="name2">标签二的内容</TabPane>
        <TabPane label="饼图" name="name3">标签三的内容</TabPane>
      </Tabs>
    </div>


  </div>
</template>

<script>

export default {
  data() {
    return {
      bayonet: '',
      info: {},
      columns1:[
        {
          type:'selection',
          width:40,
          align:'center',
        },
        {
          title:'车牌号',
          key:'carNumber'
        },
        {
          title:'轨迹点1',
          key:'trace1'
        },
        {
          title:'轨迹点2',
          key:'trace2'
        },

      ],
      data1:[
        {

        },
        {

        },
        {

        },
        {

        },

      ],
      // list: [],


      carType: [
        {
          label: '小型汽车号牌（可多选）',
          value: 'carType1'
        },
        {
          label: '大型汽车号牌',
          value: 'carType2'
        },
        {
          label: '小型新能源汽车号牌',
          value: 'carType3'
        },
        {
          label: '外地号牌',
          value: 'carType4'
        },

      ],
      model1: '',
      trace:[
        {
          label:'30min',
          value:'trace1'
        },
        {
          label:'45min',
          value:'trace2'
        },
        {
          label:'60min',
          value:'trace3'
        }
      ],
      startTime:[
        {
          label:'2021-02-10 9:00:00',
          value:'timeStart1'
        },
        {
          label:'2021-02-10 12:00:00',
          value:'timeStart2'
        }
      ],
      endTime:[
        {
          label:'2021-02-10 9:00:00',
          value:'timeStop1'
        },
        {
          label:'2021-02-10 12:00:00',
          value:'timeStop2'
        }
      ],


    }

  },
  methods:{
    import1:function (event) {


    }
  }

}
</script>

<style lang="scss" scoped>
.info {
  position: fixed;
  width: 500px;
  left: 30px;
  top: 20px;
  background-color: rgba(3, 64, 130, 0.698);
  color: #ffffff;
  padding: 25px 35px;
  border-radius: 5px;

}
.text1{
  font-size: 20px;
  margin-left: 10px;
}
h1{
  margin-left: 10px;
  font-size: 18px;
}
h2 {
  margin-left: 5px;
  font-size: 18px;
  margin-top: 10px;
  height: 26px;
}
h3 {
  margin-left: 5px;
  font-size: 18px;
  margin-top: 10px;
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
</style>


