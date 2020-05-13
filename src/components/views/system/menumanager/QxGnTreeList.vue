<template>
  <div>
    <div class="fnBtnBox">
      <el-row style="text-align: right">
        <el-button type="primary" v-if="userInfo.features.qxGnTreeTablePage.xzzyBtn" @click="clickAddMenu">新增资源</el-button>
      </el-row>
    </div>
    <el-table :data="allQxGnData"  style="width: 100%;margin-bottom: 20px;" row-key="id" border :tree-props="{children: 'children'}" max-height="620">
      <el-table-column header-align="center" prop="name" label="资源名称" :show-overflow-tooltip="true" width="230"></el-table-column>
      <el-table-column header-align="center" prop="url" label="资源路径" :show-overflow-tooltip="true" width="300"></el-table-column>
      <el-table-column header-align="center"  label="资源图标" align="center" :show-overflow-tooltip="true" width="200">
        <template slot-scope="scope">
          <i :class="scope.row.icon_url" style="font-size: 16px;"></i>
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="资源类型" align="center" :show-overflow-tooltip="true"  width="200"><template slot-scope="scope">{{markMb(scope.row.mark)}}</template></el-table-column>
      <el-table-column header-align="center" prop="sort" label="资源序号" align="center" :show-overflow-tooltip="true" width="80"></el-table-column>
      <el-table-column label="操作" width="180" align="center" v-if="userInfo.features.qxGnTreeTablePage.xzzyBtn || userInfo.features.qxGnTreeTablePage.zyxgBtn">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="clickDelMenu(scope.row)" v-if="userInfo.features.qxGnTreeTablePage.xzzyBtn">删除</el-button>
          <el-button type="text" size="small" @click="clickEditMenu(scope.row)" v-if="userInfo.features.qxGnTreeTablePage.zyxgBtn">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios';
  import {mapState} from 'vuex'
  import Tree from '@/components/utils/tree';
  import Bus from '../../../utils/bus'
  export default {
    name: "qx-gn-tree-list",
    data(){
      return {
        allQxGnData:[],
        isExpand: false,
        loading: false,
      }
    },
    methods:{
      clickAddMenu(){ // 点击新增
        Bus.$emit('QxGnTreeAddAndEditDialogShow', {"flag":"add"}); //发送消息
      },
      clickEditMenu(rowdata){ //点击编辑
        Bus.$emit('QxGnTreeAddAndEditDialogShow', {"flag":"edit","rowdata":JSON.parse(JSON.stringify(rowdata))}); //发送消息
      },
      clickDelMenu(rowdata){ // 点击删除资源
        this.$confirm('是否确定删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post('/aisino/deleteMenu',{"id":rowdata.id}).then(response => {
            let responseData = response.data;
            if (responseData.status == "0") {
              this.selectAllMenu();
              this.openMsgAlert('success',responseData.msg);
            } else {
              this.openMsgAlert('error',responseData.msg);
            }
          }).catch(response => {
            this.openMsgAlert('error','网络错误');
          })
        }).catch(() => {
        });
      },
      openMsgAlert(typeStr,Msg){ //提示
        this.$message({
          type: typeStr,
          showClose: true,
          message: Msg
        });
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
            //  debugger
            this.allQxGnData = Tree(responseData.data,'id','parent_id',0);

          } else {
            this.allQxGnData = [];
          }
          this.loading = false;
        }).catch(response => {
          this.openMsgAlert('error','网络错误');
        });
      },
    },
    created () {// 初始化页面执行的东西

      this.selectAllMenu();
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted () {// 两个子组件传递数据
      Bus.$on('QxGnTreeAddAndEditReloadTable', res => { // 接收消息刷新表格
        this.selectAllMenu();
      });
    },
      beforeDestroy() {
          Bus.$off('QxGnTreeAddAndEditReloadTable')
      },
  }
</script>

<style scoped>

</style>
