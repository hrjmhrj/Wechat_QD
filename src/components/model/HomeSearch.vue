<template>
  <el-dialog title="搜索过滤" :visible.sync="HomeSearchShowOrHiddenFlag" :close-on-click-modal="false" top="8vh" class="customDia" :center="true" width="710px" append-to-body>
    <el-form label-width="98px" ref="form" size="medium" :inline="true" :model="formData"  :rules="formRules"  style="text-align: left">
      <el-row>
        <el-form-item label="销方名称:" :required="true" prop="XFMC">
          <el-input v-model="formData.XFMC" type="text" style="width: 215px;" placeholder="请输入销方名称"></el-input>
        </el-form-item>
        <el-form-item label="发票号码:" :required="false" >
          <el-input v-model="formData.FPHM" type="text" style="width: 215px;" placeholder="请输入发票号码"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="发票种类:" :required="false" >
          <el-select v-model="formData.FPZL" placeholder="请选择发票种类" style="width: 215px;">
            <el-option v-for="item in FPZLList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据号码:" :required="false" >
          <el-input v-model="formData.DJHM" type="text" style="width: 215px;" placeholder="请输入单据号码"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="按钮:" :required="false">
          <el-button type="primary" size="small" plain  icon="el-icon-zoom-in" style="width: 215px;">点击打开一个列表</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="开票日期:" :required="false">
          <el-date-picker v-model="formData.KPRQ" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-row>
      <el-row style="text-align: center">
        <el-button type="primary" size="small"  @click="checkSubmit">确认提交</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import Bus from '../utils/bus';
  export default {
    name: 'home-search',
    data () {
      return {
        HomeSearchShowOrHiddenFlag: false, // 是否显示弹框
        formData: { // form表单数据
          XFMC: '',
          FPHM: '',
          DJHM: '',
          FPZL: '',
          KPRQ: ''
        },
        FPZLList: [
          {value: '1', label: '电子发票'},
          {value: '2', label: '专用发票'},
          {value: '3', label: '普通发票'}
        ],
        formRules: { // form表单必填项提示
          XFMC: [
            { required: true, message: '请输入销方名称', trigger: 'change' },
            { required: true, message: '请输入销方名称', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      checkSubmit () { // 点击提交数据
        Bus.$emit('HomeSearchData', this.formData); // 发送消息
        this.HomeSearchShowOrHiddenFlag = false;
      }
    },
    mounted () { // 两个子组件传递数据
      // 接收打开弹框的消息
      Bus.$on('openHomeSearchDialog', res => {
        this.HomeSearchShowOrHiddenFlag = res;
      });
      Bus.$on('HomeSearchDataReset', res => {
        Object.assign(this.$data, this.$options.data());
      });
    },
    beforeDestroy () {
      Bus.$off('openHomeSearchDialog');
      Bus.$off('HomeSearchDataReset');
    }
  };
</script>

<style scoped>
</style>
