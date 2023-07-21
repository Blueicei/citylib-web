<template>
  <div
    :id="id"
    :class="className"
    :style="{ height: height, width: width }"

  >

  </div>
</template>

<script>
import * as echarts from "echarts";


export default {
  props: {
    className: {
      type: String,
      default: "base-echart",
    },
    id: {
      type: String,
      default: "base-echart",
    },
    width: {
      type: String,
      default: "600px",
    },
    height: {
      type: String,
      default: "300px",
    },
    option: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    option() {
      this.initChart();
    },
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption(this.option);
    },
  }
}
</script>

<style scoped>

</style>
