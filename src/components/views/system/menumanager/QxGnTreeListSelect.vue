<template>
  <el-dialog title="选择上级资源" :visible.sync="SjSelectQxGnShowOrHiddenFlag" :close-on-click-modal="false" top="8vh" class="customDia" :center="true" width="710px" append-to-body>
    <div style="max-height:60vh;overflow:auto;">
      <el-table :data="allQxGnData"  style="width: 100%;margin-bottom: 20px;" row-key="id" border :tree-props="{children: 'children'}" highlight-current-row  @current-change="handleCurrentChange">
        <el-table-column header-align="center" prop="name" label="资源名称" :show-overflow-tooltip="true" width="250"></el-table-column>
        <el-table-column header-align="center" prop="url" label="资源路径" :show-overflow-tooltip="true" width="260"></el-table-column>
        <el-table-column header-align="center" label="资源类型" align="center" :show-overflow-tooltip="true"  width="130"><template slot-scope="scope">{{markMb(scope.row.mark)}}</template></el-table-column>
      </el-table>
    </div>
    <el-row style="text-align: center">
      <el-button type="primary" plain size="small"  @click="clickClearSelectSj">清除</el-button>
      <el-button type="primary" size="small"  @click="clickSubmitSelectSj">确认选择</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
  import axios from 'axios';
  import Tree from '@/components/utils/tree';
  import Bus from '../../../utils/bus'
  export default {
    name: "qx-gn-tree-list-select",
    data(){
      return {
        SjSelectQxGnShowOrHiddenFlag: false, // 显示标志
        allQxGnData:[], // 数据
        loading: false, // 加载
        selectSjData:{ // 选择的数据
          name: '',
          id: '',
          mark: ''
        }
      }
    },
    methods: {
      clickClearSelectSj(){ // 点击清除上级资源选择
        this.selectSjData.name = '';
        this.selectSjData.id = '';
        this.selectSjData.mark = '';
        Bus.$emit('clickClearSelectSj', true); //发送消息
        this.SjSelectQxGnShowOrHiddenFlag = false;
      },
      clickSubmitSelectSj(){ // 点击选择上级资源确认选择
        Bus.$emit('clickSubmitSelectSj', this.selectSjData); //发送消息
        this.SjSelectQxGnShowOrHiddenFlag = false;
      },
      markMb(mark){ // 资源类型模板类型
        switch(mark) {
          case '0':
            return "功能";
            break;
          case '1':
            return "页面";
            break;
          case '2':
            return "按钮";
            break;
          default:
            return "";
        }
      },
      selectAllMenu(){ // 查询所有菜单
        let data = {};
        this.loading = true;
        axios.post('/aisino/selectAllMenu',data).then(response => {
          let responseData = response.data;
          if (responseData.status == "0") {
            this.allQxGnData = Tree(responseData.data,'id','parent_id',0);
          } else {
            this.allQxGnData = [];
          }
          this.loading = false;
        });
      },
      handleCurrentChange(row){ // 点击数据时
        this.selectSjData.name = row.name;
        this.selectSjData.id = row.id;
        this.selectSjData.mark = row.mark;
      },
    },
    created () {// 初始化页面执行的东西
      this.selectAllMenu();
    },
    mounted () {// 两个子组件传递数据
      Bus.$on('QxGnTreeSjSelectDialogShow', res => {
        this.SjSelectQxGnShowOrHiddenFlag = true;
        this.selectAllMenu();
      });
    },
      beforeDestroy() {
          Bus.$off('QxGnTreeSjSelectDialogShow')
      },
  }
</script>
<style scoped>

</style>
