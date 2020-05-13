<template>
  <el-dialog title="搜索过滤" :visible.sync="HomeSearchShowOrHiddenFlag" :close-on-click-modal="false" top="8vh"
             class="customDia" :center="true" width="710px" append-to-body>
    <el-form label-width="98px" ref="form" size="medium" :inline="true" :model="formData" style="text-align: left">
      <el-row>
        <el-form-item label="数据状态:">
          <el-select v-model="formData.DATA_STATUS" placeholder="请选择" style="width:215px;">
            <el-option
              v-for="item in DATA_STATUSS"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户号:">
          <el-input v-model="formData.S_CID" type="text" style="width: 215px;" placeholder="请输入用户号"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="结算户名:">
          <el-input v-model="formData.S_TouDiR" type="text" style="width: 215px;" placeholder="请输入结算号"></el-input>
        </el-form-item>
        <el-form-item label="收费员:">
          <el-input v-model="formData.S_ShouFeiY" type="text" style="width: 215px;" placeholder="请输入收费员"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="户名:">
          <el-input v-model="formData.S_HM" type="text" style="width: 215px;" placeholder="请输入户名"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="收费时间:">
          <el-date-picker v-model="formData.KPRQ" type="daterange" range-separator="至" start-placeholder="开始日期"
                          end-placeholder="结束日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-row>
      <el-row style="text-align: center">
        <el-button type="primary" size="small" @click="checkSubmit">确认提交</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import Bus from "../../utils/bus";

  export default {
    name: "home-search",
    data() {
      return {
        HomeSearchShowOrHiddenFlag: false, //是否显示弹框
        formData: { //form表单数据
          S_CID: '',
          S_TouDiR: '',
          KPRQ: '',
          S_ShouFeiY: '',
          S_HM: '',
          DATA_STATUS: '0',
        },
        DATA_STATUSS: [
          {value: "0", label: "未处理"},
          {value: "1", label: "已处理"},
          {value: "2", label: "已开具"},
          {value: "3", label: "已作废"},
        ]
      }
    },
    methods: {
      checkSubmit() { // 点击提交数据
        if (this.formData.KPRQ) {
          // 全局替换指定字符
          this.formData.startTime = this.formData.KPRQ[0].replace(/-/g, "")
          this.formData.endTime = this.formData.KPRQ[1].replace(/-/g, "")
        }else{
          this.formData.startTime = ""
          this.formData.endTime = ""
        }
        Bus.$emit('WkFpSearchData', this.formData); //发送消息
        this.HomeSearchShowOrHiddenFlag = false;
      },
      dateFormat(fmt, date) {
        let ret;
        let opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "m+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "M+": date.getMinutes().toString(),         // 分
          "S+": date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          }
        }
        return fmt;
      }
    },
    created() {
      // console.log(new Date());
      let today = new Date();
      let todaystr = this.dateFormat("YYYY-mm-dd", today)
      this.formData.KPRQ = [todaystr, todaystr]
    },
    mounted() {// 两个子组件传递数据
      // 接收打开弹框的消息
      Bus.$on('openHomeSearchDialog', res => {
        this.HomeSearchShowOrHiddenFlag = res;
      });
      Bus.$on('WkfpSearchDataReset', res => {
        Object.assign(this.$data, this.$options.data())
        let today = new Date();
        let todaystr = this.dateFormat("YYYY-mm-dd", today)
        this.formData.KPRQ = [todaystr, todaystr]
      });
    },
    beforeDestroy() {
      Bus.$off('openHomeSearchDialog');
      Bus.$off('HomeSearchDataReset');
    }
  }
</script>

<style scoped>
</style>
