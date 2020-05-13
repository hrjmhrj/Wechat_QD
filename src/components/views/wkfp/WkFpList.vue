<template>
  <div v-loading="divload">
    <div class="fnBtnBox">
      <el-row style="text-align: right">
        <el-button type="primary" plain v-if="userInfo.features.WkFpPage.chaxunBtn" icon="el-icon-search"
                   @click="select">查询
        </el-button>
        <el-button type="primary" plain v-if="userInfo.features.WkFpPage.WkGlBtn" icon="el-icon-search"
                   @click="clickHomeSearch">过滤
        </el-button>
        <el-button type="primary" plain v-if="userInfo.features.WkFpPage.WKCZBtn" icon="eel-icon-help" :disabled="isdisabled"
                   @click="clickHomeSearchReset">重置
        </el-button>
        <el-button type="primary" v-if="userInfo.features.WkFpPage.SCDKFPBtn" @click="showCreateDkfp">生成待开发票</el-button>
      </el-row>
    </div>

    <el-table :data="TableList" border v-loading="TableLoad" max-height="710" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"> <!--多选-->
      </el-table-column>
      <el-table-column type="index" width="50" align="center"> <!--序号-->
      </el-table-column>
      <el-table-column prop="DATA_STATUS" label="数据状态" width="120" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.DATA_STATUS == '0' || scope.row.DATA_STATUS == null">未处理</span>
          <span v-if="scope.row.DATA_STATUS == '1'">已处理</span>
          <span v-if="scope.row.DATA_STATUS == '2'">已开具</span>
          <span v-if="scope.row.DATA_STATUS == '3'">已作废</span>
        </template>
      </el-table-column>
      <el-table-column prop="S_CID" label="用户号" width="120" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="I_Y" label="年" width="80" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="I_M" label="月" width="50" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="N_JE" label="水费" width="100" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="N_PaiShuiF" label="污水费" width="100" :show-overflow-tooltip="true" align="center" sortable>
      </el-table-column>
      <el-table-column prop="N_ShiShouZNJ" label="违约金" width="100" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="DL_ShouFei" label="收费时间" width="160" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column label="购方名称" width="240" :show-overflow-tooltip="true" align="center">
        <template slot-scope="{row}">
          <el-select v-model="row.GFVALUE" placeholder="请选择">
            <el-option
              v-for="item in row.GFMC"
              :key="item"
              :value="item">
              {{item}}
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="S_ShouFeiY" label="收费员" width="160" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="S_HM" label="户名" width="160" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="S_TouDiR" label="结算户名" width="160" :show-overflow-tooltip="true" align="center">
      </el-table-column>
      <el-table-column prop="I_FEEID" label="水费号" width="120" :show-overflow-tooltip="true" align="center">
      </el-table-column>
    </el-table>
    <div class="paginbox" v-show="paginationData.total >=0">
      <el-pagination v-if="PaginationType" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :hide-on-single-page="!(paginationData.total >=0)" :page-sizes="[10, 30, 50,1000]"
                     :page-size="20"
                     layout="total, sizes, prev, pager, next, jumper" :total="paginationData.total"/>
    </div>

    <el-dialog title="发票种类选择" :visible.sync="dkfpChooseTypeShow" :close-on-click-modal="false" top="8vh"
               class="customDia" :center="true" width="500px" append-to-body>
      <el-form label-width="98px" ref="form" size="medium" :inline="true" style="text-align: left">
        <el-row>
          <el-form-item label="发票种类:">
            <el-select v-model="fptype" placeholder="请选择" style="width:215px;">
              <el-option
                v-for="item in fpTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center">
          <el-button type="primary" size="small" @click="createDkfp">确认提交</el-button>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios';
  import Bus from "../../utils/bus";

  export default {
    name: 'WpFpList',
    data() { // 声明全局变量
      return {
        paginationData: { // 分页数据
          total: 0,
          pageSize: 10,
          pageNum: 1
        },
        PaginationType: true, // 分页是否显示
        searchData: {
          DATA_STATUS: "0",
          USER_TYPE: "3",
          startTime: '',
          endTime: '',
        }, // 搜索数据集
        TableLoad: false, // 数据加载动画
        divload: false,//按钮点击加载动画
        isdisabled:false,//重置按钮是否可点击
        TableList: [], // 列表数据
        multipleSelection: [], // 当前获取的多选的数据
        dkfpChooseTypeShow: false,
        fptype: '51',
        fpTypes: [
          {
            value: '51',
            label: '电票'
          },
          {
            value: '0',
            label: '专票'
          }
        ],
      }
    },
    methods: { // 方法声明
      clickHomeSearchReset() { // 点击重置按钮
        this.searchData = {
          DATA_STATUS: "0",
          USER_TYPE: "3",
        };
        this.initData();
        this.select();
        //控制重置按钮一秒内重复点击
        this.isdisabled = true
        setTimeout(()=>{
          this.isdisabled = false
        },500)
        Bus.$emit('WkfpSearchDataReset', true); //发送消息清空搜索栏
      },
      clickHomeSearch() { //点击过滤
        Bus.$emit('openHomeSearchDialog', true); //发送消息
      },
      handleSelectionChange(val) {//获取多选数据
        this.multipleSelection = val;
      },
      select() { // 搜索
        this.searchData.limit = this.paginationData.pageSize;
        this.searchData.page = this.paginationData.pageNum;
        let S_ST = this.$store.state.XFID
        // console.log(S_ST)
        if (!S_ST) {
          this.TableList = []
          this.$message({
            title: '失败',
            message: '请选择销方',
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.searchData.S_ST = S_ST
        this.TableLoad = true;
        // console.log("select")
        // console.log(this.searchData)
        axios.post('/aisino/selecWeiKai', this.searchData).then(response => {
          let responseData = response.data;
          if (responseData.status == "0") {
            this.paginationData.total = responseData.count;
            this.TableList = responseData.data;
            // console.log(this.TableList)
          } else {
            this.TableList = []
          }
          this.TableLoad = false
        }).catch(response => {
          this.TableList = []
          this.TableLoad = false
        })
      },
      showCreateDkfp() {
        let tempdatas = this.multipleSelection
        if (tempdatas.length < 1) {
          this.$message({
            title: '失败',
            message: "请至少勾选一项",
            type: 'warning',
            duration: 2000
          })
          return
        }
        for (let i = 0; i < tempdatas.length; i++) {
          // console.log(tempdatas[i].DATA_STATUS)
          if (tempdatas[i].DATA_STATUS != '0' && tempdatas[i].DATA_STATUS) {
            this.$message({
              title: '失败',
              message: "勾选了已经处理过的数据，请重新勾选",
              type: 'warning',
              duration: 2000
            })
            return
          }
        }
        this.dkfpChooseTypeShow = true
      },
      createDkfp() {

        let tempdatas = this.multipleSelection
        this.dkfpChooseTypeShow = false
        this.divload = true
        // console.log("点击")
        let tempvalues = []
        for (let i = 0; i < tempdatas.length; i++) {
          tempvalues.push({"I_FEEID": tempdatas[i].I_FEEID, "GFMC": tempdatas[i].GFVALUE})
        }
        let url = '/aisino/shengCheng?FPZL=' + this.fptype
        axios.post(url, tempvalues).then(response => {
          // console.log(response)

          if (response.data.status == '0') {
            this.select()
            this.$message({
              title: '成功',
              message: response.data.msg,
              type: 'success',
              duration: 2000
            })
          } else {
            this.$message({
              title: '失败',
              message: response.data.msg,
              type: 'warning',
              duration: 2000
            })
          }
          this.divload = false
          this.fptype = '51'
        }).catch(res => {
          this.dkfpChooseTypeShow = false
          this.divload = false
          this.fptype = '51'
        })
      },
      handleSizeChange(val) { // 更改显示数量方法
        this.paginationData.pageSize = val;
        this.select();
        parent.postMessage({
          scrollTop: 200
        }, '*');
      },
      handleCurrentChange(val) { // 上下翻页方法
        this.paginationData.pageNum = val;
        this.select();
        window.scrollTo(0, 0);
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
      },
      initData(){  //初始化日期搜索条件
        let today = new Date();
        let todaystr = this.dateFormat("YYYY-mm-dd", today)
        let KPRQ = [todaystr,todaystr]
        if (KPRQ.length > 0) {
          // 全局替换指定字符
          this.searchData.startTime = KPRQ[0].replace(/-/g, "")
          this.searchData.endTime = KPRQ[1].replace(/-/g, "")
        }
      }

    },
    created() {// 初始化页面执行的东西
      // this.select();
      this.initData();
      // console.log(this.searchData)

    },
    mounted() {// 两个子组件传递数据
      Bus.$on('WkFpSearchData', res => { // 接收搜索数据请求
        this.searchData.S_HM = res.S_HM
        this.searchData.S_ShouFeiY = res.S_ShouFeiY
        this.searchData.S_TouDiR = res.S_TouDiR
        this.searchData.startTime = res.startTime
        this.searchData.endTime = res.endTime
        this.searchData.DATA_STATUS = res.DATA_STATUS
        this.searchData.S_CID = res.S_CID
        // console.log(this.searchData)
        this.select();
      });
    },
    beforeDestroy() {
      Bus.$off('WkFpSearchData')
    },
    watch: {// 监听页面元素

    },
    components: {// 注册页面所用到的元素（标签）
    },
    computed: {
      ...mapState(['userInfo'])
    },
    beforeDestroy() {
      Bus.$off('WkFpSearchData')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .fnBtnBox {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
  }

  .paginbox {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .tabBox {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
</style>
