<template>
  <div class="app-container">
    <div class="fnBtnBox">
      <el-row style="text-align: right">
        <el-button type="primary" @click="addRole()" v-if="userInfo.features.jsglPage.tjjsBtn">添加角色</el-button>
      </el-row>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="权限管理" prop="USERNAME" align="center" width="120px"
                       v-if="userInfo.features.jsglPage.ymglBtn">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="roleManager(row)" v-if="userInfo.features.jsglPage.ymglBtn">
            页面管理
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.SORT }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width"
                       v-if="userInfo.features.jsglPage.sjbjBtn || userInfo.features.jsglPage.sjscBtn">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)" v-if="userInfo.features.jsglPage.sjbjBtn">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="deleteRole(row)" v-if="userInfo.features.jsglPage.sjscBtn">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="paginbox" v-show="paginationData.total > 10">
      <el-pagination v-if="PaginationType" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :hide-on-single-page="!(paginationData.total > 10)" :page-sizes="[10, 30, 50]" :page-size="100"
                     layout="total, sizes, prev, pager, next, jumper" :total="paginationData.total"/>
    </div>


    <el-dialog :visible.sync="dialogPvVisible" v-loading="listLoading" class="customDia" top="8vh"
               :title="textMap[dialogPvStatus]" width="600px" :close-on-click-modal="false">
      <el-form ref="roleNameForm" :model="temp" :rules="rules" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="角色序号" prop="SORT">
          <el-input type="number" v-model="temp.SORT" placeholder="请输入序号"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="NAME">
          <el-input v-model="temp.NAME" placeholder="请输入角色名称"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvStatus == 'create'?createData():updateData()">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="dialogRoleMenuVisible" v-loading="listLoading" class="customDia" top="8vh" title="权限管理页面"
               width="800px" :close-on-click-modal="false">
      <div class="roleMenuDiv">
        <el-table
          :data="allQxGnData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="name"
            label="资源名称">
          </el-table-column>
          <!--          <el-table-column prop="select" align="center" width="60" type=""></el-table-column>-->
          <el-table-column width="50" align="center">
            <template slot="header">
              <el-checkbox id="checkall" @change="changeAll($event)"></el-checkbox>
            </template>
            <template slot-scope="scope">
              <el-checkbox @change="checkChange(scope)" v-model="scope.row.flag=='true'"></el-checkbox>
              <!--this.roleList.indexOf(scope.row.id)>-1-->
              <!--scope.row.flag=='true'-->
              <!--checkStatus(scope.row.id)-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRoleMenu()">保存</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios'

  export default {
    name: "QxRoleManager",
    components: {},
    data() {
      let checkName = (rule, value, callback) => {
        if (!value) {
          callback(new Error("姓名必填"))
        } else {
          callback()
        }
      }
      let checkSort = (rule, value, callback) => {
        console.log(value)
        if (value != 0 && value == '') {  //0这个数字屁事真多
          callback(new Error("排序必填"))
        } else {
          callback()
        }
      }
      return {
        tableKey: 0,
        list: null,
        total: 0,
        paginationData: { // 分页数据
          total: 0,
          pageSize: 10,
          pageNum: 1
        },
        PaginationType: true, // 分页是否显示
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
        },
        roleAllCheckStatus: false,
        temp: {
          ID: undefined,
          NAME: '',
          SORT: ''
        },
        dialogPvVisible: false,
        dialogPvStatus: '',
        dialogRoleMenuVisible: false,
        allQxGnData: [],
        allRoleData: [],
        roleList: [],
        tmpparentList: [],
        rules: {
          NAME: [{validator: checkName, trigger: 'blur'}],
          SORT: [{validator: checkSort, trigger: 'blur'}],
        },
        textMap: {
          update: '编辑角色信息',
          create: '添加角色信息'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleSizeChange(val) { // 更改显示数量方法
        this.paginationData.pageSize = val;
        this.getList();
        parent.postMessage({
          scrollTop: 200
        }, '*');
      },
      handleCurrentChange(val) { // 上下翻页方法
        this.paginationData.pageNum = val;
        this.getList();
        window.scrollTo(0, 0);
      },
      getList() {
        this.listQuery.limit = this.paginationData.pageSize;
        this.listQuery.page = this.paginationData.pageNum;
        this.listQuery.USERID = ''
        this.listLoading = true
        axios.post("/aisino/getRole", this.listQuery).then(res => {
          let templist = res.data
          // console.log(templist)
          if (templist.status == '0') {
            this.list = templist.data
            this.paginationData.total = templist.count
          } else {
            this.list = []
          }
        })
        setTimeout(() => {
          this.listLoading = false
        }, 100)

      },
      resetTemp() {
        this.temp = {
          ID: undefined,
          NAME: '',
          SORT: ''
        }
      },
      addRole() {
        this.resetTemp()
        this.dialogPvStatus = 'create'
        this.dialogPvVisible = true
        this.$nextTick(() => {
          this.$refs['roleNameForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['roleNameForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            const tempData = this.temp
            axios.post("/aisino/insertNewRole", tempData).then(res => {
              if (res.data.success) {
                this.clickHomeSearchReset();
                this.dialogPvVisible = false
                this.$message({
                  title: '成功',
                  message: res.data.msg,
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$message({
                  title: '失败',
                  message: res.data.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
              this.listLoading = false
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogPvStatus = 'update'
        this.dialogPvVisible = true
        this.$nextTick(() => {
          this.$refs['roleNameForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['roleNameForm'].validate((valid) => {
          if (valid) {
            this.listLoading = true
            const tempData = Object.assign({}, this.temp)   //复制数据
            axios.post("/aisino/updateRole", tempData).then(res => {
              if (res.data.success) {
                this.clickHomeSearchReset();
                this.dialogPvVisible = false
                this.$message({
                  title: '成功',
                  message: res.data.msg,
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.$message({
                  title: '失败',
                  message: res.data.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
              setTimeout(() => {
                this.listLoading = false
              }, 100)
            })
          }
        })
      },
      roleManager(row) {
        this.roleList = []
        this.listLoading = true;
        this.temp = Object.assign({}, row) // copy obj
        const param = {roleID: row.ID, userId: this.$store.state.userInfo.userId}
        axios.post('/aisino/selectRoleMenu', param).then(response => {
          let responseData = response.data;
          if (responseData.status == "0") {
            this.allRoleData = responseData.data
            this.allQxGnData = this.treeNode(responseData.data);
            // 渲染列表的时候,验证是否需要全选中
            this.changeAllStatus(this.allQxGnData, 'true')
            responseData.data.forEach(tempdata => {
              if (tempdata.flag == 'true') {
                this.roleList.push(tempdata.id)
              }
            })
            // console.log(responseData)
            // console.log(this.allQxGnData)
            // console.log(this.roleList)
          } else {
            this.allQxGnData = [];
          }
          this.listLoading = false;
        });
        this.dialogRoleMenuVisible = true
        this.changeExpandAll(false)
      },
      changeExpandAll(status) {  //设置tree展开
        var els
        console.log(status)
        if (!status) {
          els = document.getElementsByClassName("el-table__expand-icon el-table__expand-icon--expanded")
        }
        // else{
        //   els = document.getElementsByClassName("el-table__expand-icon")
        // }
        for (let i = 0; i < els.length; i++) {
          els[i].click()
        }
      },
      saveRoleMenu() {
        // console.log("baocun")
        this.listLoading = true
        const ids = this.roleList.join(",")
        let param = {ID: this.temp.ID, ids: ids}
        axios.post("/aisino/addRoleMenu", param).then(res => {
          if (res.data.success) {
            this.clickHomeSearchReset();
            this.listLoading = false
            this.dialogRoleMenuVisible = false
            this.$message({
              title: '成功',
              message: res.data.msg,
              type: 'success',
              duration: 2000
            })
          } else {
            this.listLoading = false
            this.$message({
              title: '失败',
              message: res.data.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      },
      saveRole() {
        this.listLoading = true
        this.$refs['roleNameForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            // console.log(tempData);
            axios.post("/aisino/saveUserRole", tempData).then(res => {
              if (res.data.success) {
                this.clickHomeSearchReset();
                this.listLoading = false
                this.dialogPvVisible = false
                this.$message({
                  title: '成功',
                  message: res.data.msg,
                  type: 'success',
                  duration: 2000
                })
              } else {
                this.listLoading = false
                this.$message({
                  title: '失败',
                  message: res.data.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          }
        })
      },
      deleteRole(row) {
        const param = {ID: row.ID}
        this.$confirm('确定删除该角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.post("/aisino/deleteRole", param).then(res => {
            if (res.data.success) {
              this.clickHomeSearchReset();
              this.$message({
                title: '成功',
                message: res.data.msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$message({
                title: '失败',
                message: res.data.msg,
                type: 'warning',
                duration: 2000
              })
            }
          })
        })
      },
      clickHomeSearchReset() { // 点击重置按钮
        this.listQuery = {}
        this.listQuery.page = 1
        this.listQuery.limit = 10
        this.getList()
      },
      treeNode(data) { //将数据转化为树形结构数据
        class Tree {
          constructor(nodes, p, c, num) {
            nodes = JSON.parse(JSON.stringify(nodes))
            this.data = Tree.build(nodes, p, c, num)
          }

          static build(nodes, p, c, num) {
            let arr = []

            nodes.forEach((node) => {
              if (node[c] == num) {
                arr.push(node)
              }
              var parent = Tree.findParent(nodes, node[c], p)
              if (parent) {
                if (!parent.children) {
                  parent.children = []
                }
                parent.children.push(node)
              }
            })
            return arr
          }

          static findParent(nodes, parentId, p) {
            for (var i = 0; i < nodes.length; ++i) {
              var node = nodes[i]
              if (node[p] == parentId) {
                return node
              }
            }
            return null
          }
        }

        return new Tree(data, 'id', 'parent_id', '0').data
      },
      checkChange(scope, checked) { //单击选中或取消单一节点
        // console.log(scope)
        // console.log(scope.row)
        // console.log(scope.$index)
        // console.log(this.allRoleData[scope.$index])
        if (!checked) {
          checked = scope.row.flag == 'true' ? 'false' : 'true'
        }
        this.pushRoleList(scope.row, checked)
        // console.log(this.roleList)
        if (scope.row.children) {
          this.checkChangeAll(scope.row, checked)
        }
        if (scope.$index > -1) { // 避免判断子节点时重复调用方法
          // 获取父节点的状态,并选中或取消
          this.getParents(scope, checked);
        }
      },
      checkChangeAll(row, checked) { //检测子节点,选中或取消所有子节点
        // console.log(row)
        // row.flag = checked  // 操作当前父节点
        row.children.forEach(child => {
          // console.log(child)
          if (child.children) {
            this.pushRoleList(child, checked)
            this.checkChangeAll(child, checked)
          } else {
            // console.log(this.allRoleData.indexOf(child))
            this.checkChange({row: child}, checked)
          }
        })
      },
      changeAll(event) {
        // console.log(event)
        this.roleAllCheckStatus = event
        // console.log("全选表头")
        // debugger
        let checked = ''
        if (event) {
          // this.roleAllCheckStatus = false
          checked = 'true'
        } else {
          // this.roleAllCheckStatus = true
          checked = 'false'
        }
        this.allQxGnData.forEach(row => {
          if (row.children) {
            this.pushRoleList(row, checked)
            this.checkChangeAll(row, checked)
          } else {
            // console.log(this.allRoleData.indexOf(child))
            this.checkChange({row: row}, checked)
          }
        })
      },
      getParents(scope, checked) { //是否有父节点,是否选中,
        // console.log("进入checkChangeParent")
        // console.log(scope)
        // console.log(checked)
        this.allRoleData.forEach(data => {
          if (data.id == scope.row.parent_id) {
            // console.log(data)
            this.tmpparentList.unshift(data.id)
            if (data.parent_id != "0") {
              this.getParents({row: data}, checked)
            } else {
              // console.log(this.tmpparentList)
              this.changeParents(this.allQxGnData, checked)
            }
          }
        })
        // 检测是否全部节点已被选中,勾选全选checkbox
        this.changeAllStatus(this.allQxGnData, checked)
      },
      changeParents(allQxGnData, checked) {
        // console.log(allQxGnData)
        const id = this.tmpparentList.splice(0, 1)
        // console.log(id)
        allQxGnData.forEach(data => {
          if (data.id == id) {
            // 先循环到最内层
            if (this.tmpparentList.length > 0) {
              this.changeParents(data.children, checked)
            }
            // console.log(data)
            if (checked == 'true') {
              // data.flag = checked
              this.pushRoleList(data, checked)
            } else {
              let flag = false
              // 判断是否还有子节点被选中
              data.children.forEach(row => {
                if (row.flag == 'true') {
                  flag = true
                }
              })
              if (flag) {
                this.pushRoleList(data, 'true')
              } else {
                this.pushRoleList(data, 'false')
              }
            }
          }
        })
      },
      changeAllStatus(allQxGnData, checked) {
        // debugger
        if (checked == 'false') {
          // console.log(document.getElementById("checkall").getAttribute("class"))
          // const classVal = document.getElementById("checkall").getAttribute("class")
          // 好几把气哦 艹
          // 改变checkbox的选中状态
          document.getElementById("checkall").classList.remove("is-checked")
          document.getElementById("checkall").getElementsByTagName("span")[0].classList.remove("is-checked")
        } else {
          for (var i = 0; i < allQxGnData.length; i++) {
            // debugger
            const data = allQxGnData[i]
            if (data.flag == 'true') {
              if (data.children) {
                this.changeAllStatus(data.children, checked)
              } else {
                document.getElementById("checkall").classList.add("is-checked")
                document.getElementById("checkall").getElementsByTagName("span")[0].classList.add("is-checked")
              }
            } else {
              document.getElementById("checkall").classList.remove("is-checked")
              document.getElementById("checkall").getElementsByTagName("span")[0].classList.remove("is-checked")
              break
              return false
            }
          }
        }
      },
      pushRoleList(row, checked) {
        row.flag = checked
        if (checked == 'true') { // 临时list中增加或删除节点id
          this.roleList.indexOf(row.id) < 0 ? this.roleList.push(row.id) : ''
        } else {
          if (this.roleList.indexOf(row.id) > -1) {
            this.roleList.splice(this.roleList.indexOf(row.id), 1)
          }
        }
        // console.log(this.roleList)
      },
      //设置表头全选
      renderHeader(h, data) {
        return h("span", [
          h("el-checkbox", {
            attrs: {
              id: "chooseall",
              on: {
                change: function () {
                  console.log("changeshijian")
                  console.log(data)
                },
                click: function () {
                  console.log("点击事件")
                }
              }
            }
          })
        ])
      },
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

  .paginbox {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 10px;
  }

  .roleMenuDiv {
    height: 30vw;
    overflow: auto;
  }
</style>

