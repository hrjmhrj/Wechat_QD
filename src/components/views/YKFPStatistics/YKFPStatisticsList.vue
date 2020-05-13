<template>
  <div class="tabBox">
    <div class="fnBtnBox">
      <el-row style="text-align: left">
        <Button @click="bqykfp"  type="primary"  v-if="userInfo.features.YKFPStatisticsPage.bqykfpBtn" > 本期已开发票</Button>
        <Button @click="showSearchFormFlag = true" icon="el-icon-search"  v-if="userInfo.features.YKFPStatisticsPage.yktjgnBtn">过滤</Button>
        <Button @click="resetBack" icon="el-icon-refresh-right" type="primary" v-if="userInfo.features.YKFPStatisticsPage.yktjczBtn">重置</Button>
        <Button @click="exportExcel" class="iconfont" :loading="excelLoading" type="primary" v-if="userInfo.features.YKFPStatisticsPage.yktjbkdcBtn ">&#xe70a;&nbsp; 表格导出</Button>
      </el-row>
      <Dialog title="过滤列表" :visible.sync="showSearchFormFlag" :close-on-click-modal="false" top="8vh" class="customDia"
              :center="true" width="550px">
        <div class="forBox">
          <Form label-width="106px" ref="form" size="medium" :inline="true">
            <FormItem label="统计时间:">
              <el-date-picker v-model="searchData.KPRQ" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd">
              </el-date-picker>
            </FormItem>
            <FormItem label="用户号:" prop="YHH">
              <Input v-model="searchData.YHH" placeholder="请输入用户号" style="width: 210px; height: 30px;"/>
            </FormItem>
            <FormItem label="购方名称:" prop="GFMC">
              <Input v-model="searchData.GFMC" placeholder="请输入购方名称" style="width: 210px; height: 30px;"/>
            </FormItem>
            <FormItem label="发票类型:" prop="FPZL">
              <el-select v-model="searchData.FPZL" placeholder="请选择发票类型" style="width: 210px; height: 30px;">
                <el-option v-for="item in [
                {label: '全部', value: ''},
                {label: '增值税专用发票', value: '0'},
                {label: '增值税普通发票', value: '2'},
                {label: '增值税电子发票', value: '51'}
              ]" :label="item.label" :value="item.value" :key="item.label"/>
              </el-select>
            </FormItem>
            <div class="btnBox" style="width: 100%;display: flex;justify-content: center;">
              <Button type="default"  @click="searchDataClear" style="margin-left: 5px;">清空</Button>
              <Button type="primary"  @click="getInvoiceList">开始过滤</Button>
            </div>
          </Form>
        </div>
      </Dialog>
    </div>
    <caption class="table-caption" >发票汇总表</caption>  <!--show-summary 表格下方显示合计栏   -->
    <Table :data="tableList" highlight-current-row border v-loading="tableLoad"  style="min-width: 100%;font-size:13px"
           height="50%" ref="YKFPStatisticSLVist">
      <TableColumn prop="idx" label="序号" width="50" align="center"/>
      <TableColumn prop="XMMC" label="项目名称" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="HJ" label="合计" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV17" label="17%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV16" label="16%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV13" label="13%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV11" label="11%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV10" label="10%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV9" label="9%"  width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV6" label="6%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV5" label="5%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV4" label="4%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV3" label="3%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV1_5" label="1.50%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLV0" label="0.00%" width="120" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="SLVQT" label="其他" width="120" :show-overflow-tooltip="true" align="center"/>
    </Table>
  </div>

</template>

<script>

    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import Bus from "../../utils/bus";
    import {mapState} from 'vuex'
    import {
        Table,
        TableColumn,
        Button,
        Form,
        Input,
        FormItem,
        Pagination,
        Dialog,
        select,
        Option,
        DatePicker
    } from 'element-ui'
    import axios from 'axios'

    export default {
        props: [ 'rowName', 'taxNo'],
        name: "YKFPStatisticsList",
        data() {
            return {
                options: [],
                excelLoading:false,
                tableList: [
                ],
                tableLoad: false,
                showSearchFormFlag: false,
                tableHeight: 0,
                searchData: {
                    YHH: '',
                    FPZL: '',
                    KPRQ: '',
                    GFMC: '',
                },
            }
        },

        methods: {
            searchDataClear() {//过滤条件清空
                this.searchData = {
                    YHH: '',
                    GFMC: '',
                    FPZL: '',
                    KPRQ: '',
                }
            },
            resetBack(){//重置
                this.searchDataClear()
                this.getInvoiceList()
            },
            //访问后台获取统计数据
            getInvoiceList() {
                //debugger
                let list1 = []
                let sdf={}
                let KPRQTemp=this.searchData.KPRQ
                sdf["KPRQ"]=KPRQTemp.toString();
                sdf["YHH"]=this.searchData.YHH;
                sdf["FPZL"]=this.searchData.FPZL;
                sdf["GFMC"]=this.searchData.GFMC;
                list1.push(sdf)
                let list2=[]
                list2.push("17","16","13","11","10","9","6","5","4","3","1.5","0")
                //处理参数
                let formData = {
                    list1:list1,
                    list2:list2,
                }
                /**
                 * 查询发票
                 */
                this.showSearchFormFlag = false//关闭过滤弹框
                this.tableLoad = true
                axios.post(`/aisino/statistics/statisticsYKFP`, formData,{headers:{'Content-Type': 'application/json'}}).then(res => {
                    //console.log(res)
                    if (res.data.success){
                    this.dealWithList(res.data.obj)
                    }else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                    this.tableLoad = false
                })

            },
            dealWithList(list) {
                list.forEach((item, idx) => {
                    item.idx = idx + 1;
                })
                this.tableList = list
            },
            bqykfp(){
                //debugger
                let Id='2'
                Bus.$emit('bqykfp', Id)
            },
            exportExcel(){
                let list1 = []
                let sdf={}
                let KPRQTemp=this.searchData.KPRQ
                sdf["KPRQ"]=KPRQTemp.toString();
                sdf["YHH"]=this.searchData.YHH;
                sdf["FPZL"]=this.searchData.FPZL;
                sdf["GFMC"]=this.searchData.GFMC;
                list1.push(sdf)
                let list2=[]
                list2.push("17","16","13","11","10","9","6","5","4","3","1.5","0")
                //处理参数
                let formData = {
                    list1:list1,
                    list2:list2,
                }
                //设置下载文件名
                let date = new Date()
                let filename = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                this.excelLoading=true
                axios.post(`/aisino/statistics/exportStatisticsYKFP`, formData,{responseType: 'blob'}).then(res => {
                    const link = document.createElement('a')
                    let blob = new Blob([res.data],{type: 'application/vnd.ms-excel'});
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute('download', '已开发票统计'+filename+'.xlsx')
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    this.excelLoading=false
                }).catch(error => {
                    this.$notify.error({
                        title: '错误',
                        desc: '网络连接错误'
                    })
                    console.log(error)
                })

            }
        },
        components: {
            FileSaver,
            XLSX,
            Table,
            TableColumn,
            Button,
            Form,
            Input,
            FormItem,
            Pagination,
            Dialog,
            select,
            Option,
            DatePicker,
            Bus
        },
        created() {
            this.getInvoiceList()
        },
        mounted() {
        },
        watch: {
        },
        computed: {
            ...mapState(['userInfo'])
        },
    }

</script>

<style scoped>
  .fnBtnBox {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
  }
  .forBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .forBox .bottom {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 5px;
  }

  .tabBox {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100px;
  }
  .zZindex {
    z-index: 3000 !important;
  }
  .tabBox .table-caption {
    align-content: center;
    padding: 10px 10px;
    font: caption;
    font-size: 14px!important;
    font-weight: bold;
  }

</style>
