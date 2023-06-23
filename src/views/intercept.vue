<template>
  <div style="height: 100%;background-color: #4A4A4A;">
    <div style="padding-top: 20%">
      <span style="color: white;font-size: 16px;font-weight: bold;margin-right: 20px">邀请码</span>
      <div class="textArea">
        <el-input v-model="code" @keyup.enter.native="onSubmit"></el-input>
      </div>
      <el-button
          type="primary"
          @click="onSubmit"
          style="margin-left: 20px"
      >确定</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "intercept",
  data() {
    return {
      code: '',
      names: [
          'jinan'
      ]
    }
  },
  methods: {
    onSubmit() {
      if (this.names.includes(this.code)){
        let token = this.code
        sessionStorage.setItem("token", token)
        this.$router.push({
          path: "/traSearch"
        })
      }else {
        this.$message.error("邀请码错误！")
        this.code = ''
      }
    }
  }
}
</script>

<style scoped>
.textArea{
  display: inline-block;
}
/deep/ .el-form-item__label {
  color: white;
  font-weight: bold;
  font-size: 16px;
}
</style>