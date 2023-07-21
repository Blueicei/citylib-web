<template>
    <div class="info">
      <h1>
       卡口组：
        <Select v-model="model1" style="width:260px">
          <Option v-for="item in bayonet" :value="item.value1" :key="item.value">{{ item.label }}</Option>
        </Select>
      </h1>

      <Button class="btn1" style="width: 120px;margin-top: 10px;margin-left: 130px;">批量导入</Button>
      <h2>
        车牌号：
        <Input v-model="carNumber" placeholder="请输入车牌号" style="width: 150px" />
      </h2>
      <h3>
        起始时间：
        <Select v-model="model3" style="width:220px;margin-right: 5px;">
          <Option v-for="item in startTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </h3>
      <h4>
        终止时间：
        <Select v-model="model4" style="width:220px;margin-right: 5px;">
          <Option v-for="item in endTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>

      </h4>
      <Button class="btn1" style="width: 120px;margin-top: 10px;margin-left: 130px;">统计</Button>
      <div>
        <Tabs value="name1">
          <TabPane label="出现次数统计表" name="name1">
            <div>
              <Table height="180px" border ref="selection" :columns="columns1" :data="data1"></Table>

            </div>
            <Button style="margin-left: 140px;margin-top: 10px;margin-right: 30px;">展示所选轨迹</Button>

          </TabPane>
          <TabPane label="卡口统计表" name="name2">标签二的内容</TabPane>
          <TabPane label="流量统计表" name="name3">标签二的内容</TabPane>
          <TabPane label="直方图" name="name4">标签二的内容</TabPane>
          <TabPane label="饼图" name="name5">标签三的内容</TabPane>
        </Tabs>
      </div>



    </div>

</template>

<script>
    export default {
      data() {

        return {
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
              title:'次数/天数',
              key:'trace1'
            },
            {
              title:'轨迹列表',
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
          bayonet:[
            {
              label:'卡口1',
              value:'bayonet1'
            },
            {
              label:'卡口2',
              value:'bayonet2'
            },
            {
              label:'卡口3',
              value:'bayonet3'
            },
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
        }
    }
</script>
<style lang="scss" scoped>
.info {
  height: 100%;
  left: 30px;
  top: 20px;
  background-color: #f1ecec;
  color: #034082B1;
  padding: 25px 35px;
  border-radius: 5px;
}
h1{
  margin-left: 5px;
  font-size: 16px;
}
h2{
  margin-top: 10px;
  margin-left: 5px;
  font-size: 16px;
}
h3 {
  margin-left: 5px;
  font-size: 16px;
  margin-top: 10px;
}
h4 {
  margin-left: 5px;
  font-size: 16px;
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
