<template>
  <el-dialog :title="openFlagInfo?'新增资源':'编辑资源'" ref="AddAndEditDialog" :visible.sync="AddAndEditQxGnShowOrHiddenFlag" :close-on-click-modal="false" top="8vh" class="customDia" :center="true" width="710px" append-to-body>
    <el-form label-width="98px" ref="AddAndEditForm" size="medium" :inline="true" :model="formData"  style="text-align: left">
      <el-row>
        <el-form-item label="上级资源:">
          <el-button type="primary" size="small" plain  icon="el-icon-zoom-in" style="width: 215px;text-align: left" @click="clickSelectParent">{{formData.parent_id ? formData.parent_name : '请选择上级资源'}}</el-button>
        </el-form-item>
        <el-form-item label="资源序号:" prop="sort">
          <el-input v-model.number="formData.sort" type="number" style="width: 215px;" placeholder="请输入资源序号"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="资源名称:" prop="name">
          <el-input v-model="formData.name" type="text" style="width: 215px;" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源路径:" prop="url">
          <el-input v-model="formData.url" type="text" style="width: 215px;" placeholder="请输入资源路径"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="资源类型:" prop="mark">
          <el-select v-model="formData.mark" placeholder="请选择资源类型" style="width: 215px;">
            <el-option v-for="item in MARKList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源图标:" prop="icon_url">
          <el-input v-model="formData.icon_url" type="text" style="width: 215px;" placeholder="请输入资源图标"></el-input>
        </el-form-item>
      </el-row>
      <el-row style="text-align: center">
        <el-button type="primary" size="small"  @click="clickSubmitAddAndEditMenu">确认提交</el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
  import axios from 'axios';
  import Bus from '../../../utils/bus'
  export default {
    name: "qx-gn-tree-add-and-edit",
    data() {
      return {
        openFlagInfo: '', // 新增或修改的标识
        AddAndEditQxGnShowOrHiddenFlag: false, //是否显示标志
        formData: { //表单提交数据
          name: '',
          url: '',
          sort: '',
          mark: '1', //默认为接口
          icon_url: '',
          parent_id: '',
          parent_name: '',
          parent_mark: '',
        },
        MARKList:[ //资源类型
          {value: '1',label: '页面'},
          {value: '0',label: '功能'},
          {value: '2',label: '按钮'}
        ],
      }
    },
    methods: {
      clickSubmitAddAndEditMenu(){ // 点击确认提交
        if(this.checkSubmitMenuData() && this.openFlagInfo){ //新增
          axios.post('/aisino/insertMenu',this.formData).then(response => {
            let responseData = response.data;
            if (responseData.status == "0") {
              this.openMsgAlert('success',responseData.msg);
              Bus.$emit('QxGnTreeAddAndEditReloadTable', true); //发送消息
              this.AddAndEditQxGnShowOrHiddenFlag = false;
            } else {
              this.openMsgAlert('error',responseData.msg);
            }
          }).catch(response => {
            this.openMsgAlert('error','网络错误');
          })
          return;
        }
        if(this.checkSubmitMenuData() && !this.openFlagInfo){ // 编辑
          axios.post('/aisino/updateMenu',this.formData).then(response => {
            let responseData = response.data;
            if (responseData.status == "0") {
              this.openMsgAlert('success',responseData.msg);
              Bus.$emit('QxGnTreeAddAndEditReloadTable', true); //发送消息
              this.AddAndEditQxGnShowOrHiddenFlag = false;
            } else {
              this.openMsgAlert('error',responseData.msg);
            }
          }).catch(response => {
            this.openMsgAlert('error','网络错误');
          })
          return;
        }
      },
      clickSelectParent(){ // 点击选择上级资源
        Bus.$emit('QxGnTreeSjSelectDialogShow', true); //发送消息
      },
      checkSubmitMenuData(){ // 提交新增时数据校验
        if(this.formData.mark == "1" && this.formData.parent_id == ''){ // 选择的是页面时，资源图标不能为空
          if(this.formData.icon_url == ''){
            this.openMsgAlert('error','添加菜单父页面时,资源图标必填');
            return false;
          }
        }
        if(this.formData.name == ''){
          this.openMsgAlert('error','资源名称不能为空');
          return false;
        }
        if(this.formData.url == '' && this.formData.mark != 1){
          this.openMsgAlert('error','资源路径不能为空');
          return false;
        }
        if(this.formData.sort == '' && this.formData.sort != 0){
          this.openMsgAlert('error','资源序号不能为空');
          return false;
        }
        return true;
      },
      openMsgAlert(typeStr,msg){ //提示
        this.$message({
          type: typeStr,
          showClose: true,
          message: msg
        });
      }
    },
    mounted () {// 两个子组件传递数据
      Bus.$on('QxGnTreeAddAndEditDialogShow', res => { // 接收消息显示新增弹框
        this.AddAndEditQxGnShowOrHiddenFlag = true;
        if(res.flag == 'add'){
          this.openFlagInfo = true;
          Object.assign(this.$data.formData, this.$options.data().formData);
        }else if(res.flag == 'edit'){
          this.openFlagInfo = false;
          let rowData = res.rowdata;
          this.formData = rowData;
        }
      });
      Bus.$on('clickSubmitSelectSj', res => { // 接收选择上级资源
        this.formData.parent_name = res.name;
        this.formData.parent_id = res.id;
        this.formData.parent_mark = res.mark;
      });
      Bus.$on('clickClearSelectSj', res => { // 接收点击清除上级资源
        this.formData.parent_name = '';
        this.formData.parent_id = '';
        this.formData.parent_mark = '';
      });
    },
      beforeDestroy() {
          Bus.$off('QxGnTreeAddAndEditDialogShow');
          Bus.$off('clickSubmitSelectSj');
          Bus.$off('clickClearSelectSj');
      },
  }
</script>

<style scoped>

</style>
