<!--
  * @author: 胡甫圣
  * @description: 已开发票统计
-->

<template>
  <div class="fnBox">
    <div class="listBox" ref="listBox">
      <TableVm v-if="currentId=='1'" currentId="currentId"></TableVm>
      <TableVm1 v-if="currentId=='2'" currentId="currentId"></TableVm1>
    </div>
  </div>
</template>

<script>
    import Bus from "../../utils/bus";
    import TableVm from './YKFPStatisticsList'
    import TableVm1 from './bqykfpList'
    /*import {mapState} from 'vuex'*/


    export default {
        data() {
            return {
                treeList: [],
                tableId: '', // 每次点击Tree的node 右侧需要获取列表的ID
                parentId: '',
                rowData: {},
                idType: 'deptId',
                currentId: '1',
                rowName: '',
                rowdeptType: '',
                resetSearch: false,
                taxNo: '',
                parentIsId: '',
                code: '',
                features: {}
            }
        },
        methods: {},

        created() {
        },
        mounted() {
            Bus.$on('bqykfp', res => {
                //debugger
                this.currentId = res
            }),
                Bus.$on('fphz', res => {
                    //debugger
                    this.currentId = res
                })
        },
        beforeDestroy() {
            Bus.$off('bqykfp');
            Bus.$off('fphz');
        },
        computed: {
            /*    ...mapState(['userInfo'])*/
        },
        components: {
            TableVm1,
            TableVm,
            Bus
        }
    }
</script>

<style scoped>
  .fnBox {
    flex: 1;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
  }

  .listBox {
    min-width: 90%;
    max-width: 100%;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
  }
</style>
