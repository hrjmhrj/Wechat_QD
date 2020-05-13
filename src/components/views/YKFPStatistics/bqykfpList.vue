<template>
  <div class="tabBox">
    <div class="fnBtnBox">
      <el-row style="text-align: left">
        <Button @click="fphz"  type="primary"  v-if="userInfo.features.YKFPStatisticsPage.fphzBtn">发票汇总</Button>
        <Button @click="showSearchFormFlag = true" icon="el-icon-search"  v-if="userInfo.features.YKFPStatisticsPage.sfkjtjgnBtn">过滤</Button>
        <Button @click="resetBack" icon="el-icon-refresh-right" type="primary" v-if="userInfo.features.YKFPStatisticsPage.sfkjtjczBtn">重置</Button>
        <Button @click="exportExcel" class="iconfont" :loading="excelLoading" type="primary" v-if="userInfo.features.YKFPStatisticsPage.sfkjtjbkdcBtn">&#xe70a;&nbsp; 表格导出</Button>
      </el-row>
      <Dialog title="过滤列表" :visible.sync="showSearchFormFlag" :close-on-click-modal="false" top="8vh" class="customDia"
              :center="true" width="550px">
        <div class="forBox">
          <Form label-width="106px" ref="form" size="medium" :inline="true">
            <FormItem label="开账时间起:">
              <el-date-picker v-model="searchData.DL_KaiZhang" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  value-format="yyyy-MM-dd">
              </el-date-picker>
            </FormItem>
            <FormItem label="用户号:" prop="YHH">
              <Input v-model="searchData.YHH" placeholder="请输入用户号" style="width: 210px; height: 30px;"/>
            </FormItem>
            <FormItem label="购方名称:" prop="GFMC">
              <Input v-model="searchData.GFMC" placeholder="请输入购方名称" style="width: 210px; height: 30px;"/>
            </FormItem>
            <!--<FormItem label="发票类型:" prop="FPZL">
              <el-select v-model="searchData.FPZL" placeholder="请选择发票类型" style="width: 210px; height: 30px;">
                <el-option v-for="item in [
                {label: '全部', value: ''},
                {label: '增值税专用发票', value: '0'},
                {label: '增值税普通发票', value: '2'},
                {label: '增值税电子发票', value: '51'}
              ]" :label="item.label" :value="item.value" :key="item.label"/>
              </el-select>
            </FormItem>-->
            <div class="btnBox" style="width: 100%;display: flex;justify-content: center;">
              <Button type="default"  @click="searchDataClear" style="margin-left: 5px;">清空</Button>
              <Button type="primary"  @click="getInvoiceList">开始过滤</Button>
            </div>
          </Form>
        </div>
      </Dialog>
    </div>
    <caption class="table-caption" >水费发票开具情况统计表</caption>  <!--show-summary 表格下方显示合计栏   -->
    <Table :data="tableList" highlight-current-row border v-loading="tableLoad"  style="min-width: 100%;font-size:13px"
           height="50%" ref="YKFPStatisticSLVist" @selection-change="handleselectionChange"  id="exportTab">
      <TableColumn prop="SLV" label="税率" width="250" :show-overflow-tooltip="true" align="center"/>
      <TableColumn prop="ykjfp" label="已开具发票" width="800" :show-overflow-tooltip="true" align="center">
        <TableColumn prop="kjdysffpje" label="开具当月水费发票金额" width="350" :show-overflow-tooltip="true" align="center"/>
        <TableColumn prop="bkyqyfsffpje" label="补开以前月份水费发票金额" width="350" :show-overflow-tooltip="true" align="center"/>
      </TableColumn>
      <TableColumn prop="wkjfp" label="未开具发票" width="350" :show-overflow-tooltip="true" align="center"/>
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
        props: ['currentId', 'rowName', 'taxNo'],
        name: "bqykfpList",
        data() {
            return {
                options: [],
                tableList: [
                ],
                tableLoad: false,
                excelLoading:false,
                multipleselection: [],
                showSearchFormFlag: false,
                tableHeight: 0,
                searchData: {
                    YHH: '',
                    FPZL: '',
                    DL_KaiZhang: '',
                    GFMC: '',
                },
            }
        },

        methods: {
            fphz(){//发票汇总
                //debugger
                let Id='1'
                Bus.$emit('fphz', Id)
            },
            searchDataClear() {//过滤条件清空
                this.searchData = {
                    YHH: '',
                    GFMC: '',
                    FPZL: '',
                    DL_KaiZhang: '',
                }
            },
            resetBack(){//重置
                this.searchDataClear()
                let time=this.getCurrentMonth()
                this.searchData.DL_KaiZhang = [time.firstDay, time.lastDay]
                this.getInvoiceList()
            },
            //获取当前月第一天和最后一天赋值给过滤条件中的日期
            getCurrentMonth(){
                var time={}
                var now = new Date(); //当前日期
                var nowMonth = now.getMonth(); //当前月
                var nowYear = now.getFullYear(); //当前年
                //本月的开始时间
                var monthStartDate = new Date(nowYear, nowMonth, 1);
                //本月的结束时间
                var monthEndDate = new Date(nowYear, nowMonth+1, 0);
                var timeStar=monthStartDate.getFullYear() + "-" +  (monthStartDate.getMonth() + 1 < 10 ? '0' + (monthStartDate.getMonth() + 1) : monthStartDate.getMonth() + 1) + "-" + (monthStartDate.getDate() <10 ? '0' + monthStartDate.getDate() : monthStartDate.getDate());
                var timeEnd=monthEndDate.getFullYear() + "-" + (monthEndDate.getMonth() + 1 < 10 ? '0' + (monthEndDate.getMonth() + 1) : monthEndDate.getMonth() + 1) + "-" + (monthEndDate.getDate() <10 ? '0' + monthEndDate.getDate() : monthEndDate.getDate());
                time.firstDay=timeStar
                time.lastDay=timeEnd
                return time
            },
            //访问后台获取统计数据
            getInvoiceList() {
                let list1 = []
                let sdf={}
                let DL_KaiZhangTemp=this.searchData.DL_KaiZhang
                sdf["DL_KaiZhang"]=DL_KaiZhangTemp.toString();
                sdf["YHH"]=this.searchData.YHH;
                sdf["FPZL"]=this.searchData.FPZL;
                sdf["GFMC"]=this.searchData.GFMC;
                sdf["XFXXID"]=this.$store.state.XFID;
                list1.push(sdf)
                let list2=[]
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
                axios.post(`/aisino/statistics/statisticsSFKJ`, formData,{headers:{'Content-Type': 'application/json'}}).then(res => {
                    //console.log(res)
                    if (res.data.success){
                        this.tableList=res.data.obj
                    }else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                    this.tableLoad = false
                })
            },
            bqykfp(){

            },
            handleselectionChange(val) {
                this.multipleselection = val
            },
            exportExcel(){
                this.excelLoading=true
                /* generate workbook object from table */
                var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
                var wb = XLSX.utils.table_to_book(document.querySelector('#exportTab'), xlsxParam)

                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '水费发票开具情况统计表.xlsx')
                } catch (e) {
                    if (typeof console !== 'undefined') {
                        console.log(e, wbout)
                    }
                }
                this.excelLoading=false
                return wbout
            },
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
            let time=this.getCurrentMonth()
            this.searchData.DL_KaiZhang = [time.firstDay, time.lastDay]
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

  .tabBox .fnBtnBox .PDFView {
   /* height: 38.5vw;*/
    /*overflow: auto;*/
    overflow:hidden;
  }

  .tabBox .table-caption {
    align-content: center;
    padding: 10px 10px;
    font: caption;
    font-size: 14px !important;
    font-weight: bold;
  }

</style>
