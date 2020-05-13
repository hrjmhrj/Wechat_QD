<template>
  <div class="app-container" v-loading="dialogLoading">
    <div class="fnBtnBox">
      <el-row style="text-align: right">
<!--        <el-input v-model="listQuery.USERNAME" v-if="userInfo.features.qxUserManagePage.yhgnBtn" placeholder="请输入用户名"-->
        <!--                  style="width: 200px;" class="filter-item"/>-->
        <!--        <el-input v-model="listQuery.COMPANY_NAME" v-if="userInfo.features.qxUserManagePage.yhgnBtn"-->
        <!--                  placeholder="请输入公司名称" style="width: 200px;" class="filter-item"/>-->
        <el-button type="primary" plain @click="handleFilterShow" v-if="userInfo.features.qxUserManagePage.yhgnBtn">过滤
        </el-button>
        <el-button type="primary" plain @click="clickHomeSearchReset" v-if="userInfo.features.qxUserManagePage.yhczBtn">
          重置
        </el-button>
        <el-button type="primary" @click="addUser()" v-if="userInfo.features.qxUserManagePage.tjyhBtn">添加用户</el-button>
      </el-row>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row
              style="width: 100%;">
      <el-table-column label="用户名" prop="USERNAME" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.USERNAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司编号" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.COMPANY_ID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.COMPANY_NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ROLE_NAME }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="500" class-name="small-padding fixed-width"
                       v-if="userInfo.features.qxUserManagePage.sjbjBtn || userInfo.features.qxUserManagePage.jsxzBtn  || userInfo.features.qxUserManagePage.czmmBtn || userInfo.features.qxUserManagePage.sjscBtn">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)"
                     v-if="userInfo.features.qxUserManagePage.sjbjBtn">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleRole(row)"
                     v-if="userInfo.features.qxUserManagePage.jsxzBtn">
            角色
          </el-button>
          <el-button type="primary" size="mini" @click="resetPassword(row)"
                     v-if="userInfo.features.qxUserManagePage.czmmBtn">
            重置密码
          </el-button>
          <el-button size="mini" type="primary" @click="XFGL(row)" v-if="userInfo.features.qxUserManagePage.xfglBtn">
            销方管理
          </el-button>
          <el-button size="mini" type="danger" @click="deleteUser(row)"
                     v-if="userInfo.features.qxUserManagePage.sjscBtn">
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

    <el-dialog :title="textMap[dialogStatus]" class="customDia" top="8vh" :visible.sync="dialogFormVisible"
               width="600px" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus == 'create'" label="用户名" prop="USERNAME">
          <el-input v-model="temp.USERNAME" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="姓名" prop="NAME">
          <el-input v-model="temp.NAME" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="公司编号" prop="COMPANY_ID">
          <el-input v-model="temp.COMPANY_ID" placeholder="请输入公司编号"/>
        </el-form-item>
        <el-form-item label="公司名称" prop="COMPANY_NAME">
          <el-input v-model="temp.COMPANY_NAME" placeholder="请输入公司名称"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="密码" prop="PASSWORD">
          <el-input type="password" v-model="temp.PASSWORD" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item v-if="dialogStatus === 'create'" label="确认密码" prop="REPASSWORD">
          <el-input type="password" v-model="temp.REPASSWORD" placeholder="请确认密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">
          确定
        </el-button>
        <el-button @click="resetTemp()">
          重置
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" class="customDia" top="8vh" title="用户角色" width="600px"
               :close-on-click-modal="false">
      <el-form ref="roleForm" :model="temp" rules="" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="NAME">
          <el-input v-model="temp.NAME" disabled="disabled" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="角色" prop="ROLE_NAME">
          <el-select v-model="temp.ROLE_ID" style="width: 200px">
            <el-option v-for="item in ROLE_IDS" :key="item.ID" :label="item.NAME" :value="item.ID"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRole()">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="XFGLdialogPvVisible" class="customDia" top="8vh" title="销方管理" width="500px"
               :close-on-click-modal="false">
      <template>
        <div>
          <el-table :data="XFGLIN" border v-loading="tableLoad" class="customTable"
                    @selection-change="handleSelectionChange"
                    ref="InvoiceItemList">
            <el-table-column type="selection" width="80px" align="center"> <!--多选-->
            </el-table-column>
            <el-table-column prop="XFMC" label="已有销方" :show-overflow-tooltip="true" align="center" width="370px"/>
          </el-table>
          <el-button type="primary" @click="deleteXF()">删除销方</el-button>
        </div>
        <div>
          <el-table :data="XFGLALL" border v-loading="tableLoad" class="customTable"
                    @selection-change="handleSelectionChange"
                    ref="InvoiceItemList">
            <el-table-column type="selection" width="80px" align="center"> <!--多选-->
            </el-table-column>
            <el-table-column prop="XFMC" label="未有销方" :show-overflow-tooltip="true" align="center" width="370px"/>
          </el-table>
          <el-button type="primary" @click="addXF()">添加销方</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="搜索过滤" :visible.sync="userFilterDialogShow" :close-on-click-modal="false" top="8vh"
               class="customDia" :center="true" width="500px" append-to-body>
      <el-form label-width="98px" ref="form" size="medium" :inline="true"  style="text-align: left">
        <el-row>
          <el-form-item label="用户名:">
            <el-input v-model="listQuery.USERNAME" v-if="userInfo.features.qxUserManagePage.yhgnBtn"
                      placeholder="请输入用户名"
                      style="width: 200px;" class="filter-item"/>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="公司名称:">
            <el-input v-model="listQuery.COMPANY_NAME" v-if="userInfo.features.qxUserManagePage.yhgnBtn"
                      placeholder="请输入公司名称" style="width: 200px;" class="filter-item"/>
          </el-form-item>
        </el-row>
        <el-row style="text-align: center">
          <el-button type="primary" size="small" @click="handleFilter">确认提交</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import axios from 'axios'
  import {mapState} from 'vuex'
  import Bus from "../../../utils/bus";

  export default {
    name: "QxUserManager",
    components: {},
    data() {
      let checkUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error("用户名必填"))
        } else {
          const param = {"USERNAME": value}
          axios.post("/aisino/checkUser", param).then(res => {
            if (!res.data.success) {
              callback(new Error(res.data.msg))
            } else {
              callback()
            }
          })

        }
      }
      let checkName = (rule, value, callback) => {
        if (!value) {
          callback(new Error("姓名必填"))
        } else {
          callback()
        }
      }
      let checkCompany_id = (rule, value, callback) => {
        if (!value) {
          callback(new Error("公司编号必填"))
        } else {
          callback()
        }
      }
      let checkCompany_name = (rule, value, callback) => {
        if (!value) {
          callback(new Error("公司名称必填"))
        } else {
          callback()
        }
      }
      let validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入密码"))
        } else {
          callback()
        }
      }
      // <!--二次验证密码-->
      let validatePass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.temp.PASSWORD) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        XFGLdialogPvVisible: false,
        XFGLIN: [],
        XFGLALL: [],
        tableLoad: false,
        multipleSelection: [], // 当前获取的多选的数据
        USERID: "",


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
        temp: {
          ID: undefined,
          USERNAME: '',
          NAME: '',
          COMPANY_ID: '',
          COMPANY_NAME: '',
          ROLE_NAME: '',
          ROLE_ID: '',
          PASSWORD: '',
          REPASSWORD: '',
        },
        ROLE_IDS: [],
        dialogFormVisible: false, //双向绑定值。 初始情况下通过该值控制 dialog显示。
        dialogStatus: '',
        dialogPvVisible: false,
        dialogLoading: false,
        rules: {
          USERNAME: [{validator: checkUsername, trigger: 'blur'}],
          NAME: [{validator: checkName, trigger: 'blur'}],
          COMPANY_ID: [{validator: checkCompany_id, trigger: 'blur'}],
          COMPANY_NAME: [{validator: checkCompany_name, trigger: 'blur'}],
          PASSWORD: [{validator: validatePass, trigger: 'blur'}],
          REPASSWORD: [{validator: validatePass2, trigger: 'blur'}],
        },
        rules: {
          ROLE_NAME: [{validator: checkUsername, trigger: 'blur'}],
        },
        textMap: {
          update: '编辑用户信息',
          create: '添加用户信息'
        },

        userFilterDialogShow: false,//用户过滤页面开关
      }
    },
    created() {
      this.getList()
    },
    methods: {
      deleteXF() {
        console.log("this.multipleSelection.length==" + this.multipleSelection)
        let sdf = []
        for (var i = 0; i < this.multipleSelection.length; i++) {
          let map = {}
          map["XFXXID"] = this.multipleSelection[i].XFXXID
          map["USERID"] = this.USERID
          sdf.push(map)
        }
        console.log("sdf===" + sdf)
        axios.post('/aisino/deleteXF', sdf).then(response => {
          console.log("response===" + response)
          if (response.status == '200') {
            this.$message({
              type: 'success',
              showClose: true,
              message: '销方删除成功'
            })
            this.XFGLdialogPvVisible = false
            Bus.$emit('deleteXF', true); //发送消息
          }
        })
      },
      addXF() {
        let sdf = []
        for (var i = 0; i < this.multipleSelection.length; i++) {
          let map = {}
          map["XFXXID"] = this.multipleSelection[i].UUID
          map["USERID"] = this.USERID
          sdf.push(map)
        }
        axios.post('/aisino/addXF', sdf).then(response => {
          if (response.status == '200') {
            this.$message({
              type: 'success',
              showClose: true,
              message: '销方添加成功'
            })
            this.XFGLdialogPvVisible = false
            Bus.$emit('addXF', true); //发送消息
          }
        })
      },
      XFGL(row) {
        this.XFGLdialogPvVisible = true;
        this.USERID = row.ID;
        axios.post('/aisino/xfglDate', this.USERID).then(response => {
          this.XFGLIN = response.data;
        });
        axios.post('/aisino/xfglDa', this.USERID).then(response => {
          this.XFGLALL = response.data;
        })
      },
      handleSelectionChange(val) {//获取多选数据
        this.multipleSelection = val;
      },


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
        this.listLoading = true
        axios.post("/aisino/getUserList", this.listQuery).then(res => {
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
          USERNAME: '',
          NAME: '',
          COMPANY_ID: '',
          COMPANY_NAME: '',
          ROLE_NAME: '',
          PASSWORD: ''
        }
      },
      addUser() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => { //跳过表单验证
          if (valid) {
            const tempData = this.temp
            // console.log("进入添加用户接口")
            axios.post("/aisino/saveUser", tempData).then(res => {
              if (res.data.success) {
                this.clickHomeSearchReset();
                this.dialogFormVisible = false
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
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.divLoading = true
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)   //复制数据
            // console.log(tempData)
            axios.post("/aisino/editUser", tempData).then(res => {
              if (res.data.success) {
                this.clickHomeSearchReset();
                this.dialogFormVisible = false
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
                this.divLoading = false
              }, 100)
            })
          } else {
            this.divLoading = false
          }
        })
      },
      handleRole(row) {
        this.temp = Object.assign({}, row) // copy obj
        axios.post("/aisino/getRoles").then(res => {
          if (res.data.success) {
            this.ROLE_IDS = res.data.obj
          } else {
            this.$message({
              title: '失败',
              message: res.data.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
        this.dialogPvVisible = true
      },
      saveRole() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            // console.log(tempData);
            this.roleLoading = true
            axios.post("/aisino/saveUserRole", tempData).then(res => {
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
                this.roleLoading = false
              }, 100)
            })
          }
        })
      },
      resetPassword(row) {
        const param = {ID: row.ID, PASSWORD: '123456'}
        this.$confirm('确定重置密码为：123456？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          axios.post("/aisino/editUser", param).then(res => {
            if (res.data.success) {
              this.clickHomeSearchReset();
              this.dialogFormVisible = false
              this.$message({
                title: '成功',
                message: '重置密码成功，密码为：1234566！',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$message({
                title: '失败',
                message: '重置密码失败',
                type: 'warning',
                duration: 2000
              })
            }
            this.listLoading = false
          })
        })
      },
      deleteUser(row) {
        let userId = this.$store.state.userInfo.userId
        console.log(userId)
        if (userId == row.ID) {
          this.$message({
            title: '失败',
            message: '不能删除当前用户',
            type: 'warning',
            duration: 2000
          })
          return
        }
        const param = {ID: row.ID}
        this.$confirm('确定删除该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          axios.post("/aisino/deleteUser", param).then(res => {
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
            this.listLoading = false
          })
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
        this.userFilterDialogShow = false
      },
      clickHomeSearchReset() { // 点击重置按钮
        this.listQuery = {}
        this.listQuery.page = 1
        this.listQuery.limit = 10
        this.getList()
      },
      handleFilterShow() { //打开过滤弹框
        this.userFilterDialogShow = true
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
</style>

