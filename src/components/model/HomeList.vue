<template>
  <div>
    <div class="fnBtnBox">
      <el-row style="text-align: right">
        <el-button type="primary" plain v-if="userInfo.features.Home.searchBtn" icon="el-icon-search" @click="clickHomeSearch">过滤</el-button>
        <el-button type="primary" plain v-if="userInfo.features.Home.searchBtn" icon="eel-icon-help" @click="clickHomeSearchReset">重置</el-button>
        <el-button type="primary" v-if="userInfo.features.Home.kpBtn" @click="clickKp">开票</el-button>
        <el-button type="danger" v-if="userInfo.features.Home.zffpBtn">作废发票</el-button>
      </el-row>
    </div>
    <div>
      <el-table :data="TableList" stripe border v-loading="TableLoad" max-height="610" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"> <!--多选-->
        </el-table-column>
        <el-table-column type="index" width="50" align="center"> <!--序号-->
        </el-table-column>
        <el-table-column prop="FPDM" label="发票代码" width="120" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="FPHM" label="发票号码" width="120" :show-overflow-tooltip="true" align="center" sortable>
        </el-table-column>
        <el-table-column prop="DJHM" label="单据号码" width="160" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="DJHM" label="合计金额" width="160" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="DJHM" label="单据号码" width="160" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="DJHM" label="购方名称" width="160" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="DJHM" label="合计金额" width="160" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <el-table-column prop="DJHM" label="合计税额" width="160" :show-overflow-tooltip="true" align="center">
        </el-table-column>
        <!--操作-->
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginbox" v-show="paginationData.total > 10">
        <el-pagination v-if="PaginationType" @size-change="handleSizeChange" @current-change="handleCurrentChange" :hide-on-single-page="!(paginationData.total > 10)" :page-sizes="[10, 30, 50]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="paginationData.total" />
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import axios from 'axios';
  import Bus from '../utils/bus';
  export default {
    name: 'home-list',
    data () { // 声明全局变量
      return {
        tokenSessionStorage: sessionStorage.getItem('gyxxfpnekot'), // 从sessionStorage中获取token
        tokenVuex: this.$store.state.userInfo.token, // 从vuex中获取token
        paginationData: { // 分页数据
          total: 0,
          pageSize: 10,
          pageNum: 1
        },
        PaginationType: true, // 分页是否显示
        searchData: {}, // 搜索数据集
        TableLoad: false, // 数据加载动画
        TableList: [], // 列表数据
        multipleSelection: [] // 当前获取的多选的数据
      };
    },
    methods: { // 方法声明
      clickKp () { // 点击开票
        // eslint-disable-next-line eqeqeq
        if (this.multipleSelection.length == 0) {
          this.$message({
            type: 'error',
            showClose: true,
            message: '请至少勾选一条数据'
          });
        } else {
          this.$confirm('是否确定开票', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              showClose: true,
              message: '开票成功'
            });
          }).catch(() => {
            this.$message({
              type: 'success',
              showClose: true,
              message: '取消成功'
            });
          });
        }
      },
      clickHomeSearchReset () { // 点击重置按钮
        this.searchData = {};
        this.select();
        Bus.$emit('HomeSearchDataReset', true); // 发送消息清空搜索栏
      },
      clickHomeSearch () { // 点击过滤
        Bus.$emit('openHomeSearchDialog', true); // 发送消息
      },
      handleSelectionChange (val) { // 获取多选数据
        this.multipleSelection = val;
      },
      handleClick (row) { // 点击查看
        console.log(row);
      },
      select () { // 搜索
        this.searchData.limit = this.paginationData.pageSize;
        this.searchData.page = this.paginationData.pageNum;
        this.searchData.XFXXID = 'stiven';
        this.TableLoad = true;
        axios.post('/aisino/orderhead/filter', this.searchData).then(response => {
          let responseData = response.data;
          // eslint-disable-next-line eqeqeq
          if (responseData.status == '0') {
            this.paginationData.total = responseData.count;
            this.TableList = responseData.data;
          } else {
            this.TableList = [];
          }
          this.TableLoad = false;
        });
      },
      handleSizeChange (val) { // 更改显示数量方法
        this.paginationData.pageSize = val;
        this.select();
        parent.postMessage({
          scrollTop: 200
        }, '*');
      },
      handleCurrentChange (val) { // 上下翻页方法
        this.paginationData.pageNum = val;
        this.select();
        window.scrollTo(0, 0);
      }

    },
    created () { // 初始化页面执行的东西
      this.select();
    },
    mounted () { // 两个子组件传递数据
      Bus.$on('HomeSearchData', res => { // 接收搜索数据请求
        this.searchData = res;
        console.log(this.searchData);
        this.select();
      });
    },
    beforeDestroy () {
      Bus.$off('HomeSearchData');
    },

    watch: {// 监听页面元素

    },
    components: {// 注册页面所用到的元素（标签）
    },
    computed: {
      ...mapState(['userInfo'])
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
