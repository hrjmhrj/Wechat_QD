<template>
  <el-container style="height: 100vh;">
    <!-- 头部 -->
    <el-header style="text-align: right; font-size: 12px" class="el-header">
      <span class="admin-name" ref="adminName">
        初始化项目
      </span>
      <span class="open-close-menu" @click="clickCloseMenu" ref="openCloseMenu">
        <i :class="[isCollapse?'el-icon-s-unfold':'el-icon-s-fold']" style="font-size: 18px"></i>
      </span>
      <span class="username-btn">
        <!--<el-select v-model="defaultXfmc" placeholder="请选择" style="width:215px;" @change="setXfid">
          <el-option
            v-for="(item,index) in XFMCLIST"
            :key="item.XFXXID"
            :label="item.XFMC"
            :value="item.XFXXID+','+index">
          </el-option>
        </el-select>
        <el-select v-model="defaultBumenId" placeholder="请选择" style="width:215px;" @change="setBmid">
          <el-option
            v-for="(item) in DQBMLIST"
            :key="item.BUMENID"
            :label="item.ZHONGWEN"
            :value="item.BUMENID">
          </el-option>
        </el-select>-->
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px;color: #fff"></i>
          <el-dropdown-menu slot="dropdown">
            <span @click="xgmmShow"><el-dropdown-item>修改密码</el-dropdown-item></span>
            <span @click="aqtc"><el-dropdown-item>安全退出</el-dropdown-item></span>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{userInfo.name}}</span>
      </span>
    </el-header>


    <el-container>
      <!-- 菜单 -->
      <el-menu class="el-menu-vertical-demo" :default-active="this.$router.path" @select="handleSelect"
               :collapse="isCollapse" background-color="#EEF1F6" :collapse-transition="false"
               :unique-opened="true"
               router>
        <el-submenu v-for="(item, index) in defaultMenuData" :index="index + '1'" v-if="item.menu.length>0"
                    :key="index">
          <template slot="title">  <!--一级菜单名字-->
            <i :class="item.icon_url"></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <el-menu-item-group v-for="(area, idx) in item.menu" :key="idx">  <!--二级菜单-->
            <el-menu-item :index="area.url" :key="area.id">{{area.name}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else :index="item.url">
          <i class="el-icon-setting"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
        <!--<el-menu-item index="/Home">
          <i class="el-icon-setting"></i>
          <span slot="title">HOME</span>
        </el-menu-item>-->

      </el-menu>
      <!-- 主题内容 -->
      <el-main id="el-main" class="el-main">
        <router-view/>
      </el-main>
    </el-container>

    <el-dialog title="修改密码" class="customDia" top="8vh" :visible.sync="dialogFormVisible"
               width="600px" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rule" :model="temp" label-position="left" label-width="100px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="原密码" prop="OLDPASSWORD">
          <el-input type="password" v-model="temp.OLDPASSWORD" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item label="密码" prop="PASSWORD">
          <el-input type="password" v-model="temp.PASSWORD" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="REPASSWORD">
          <el-input type="password" v-model="temp.REPASSWORD" placeholder="请确认密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePwd">
          确定
        </el-button>
        <el-button @click="resetTemp()">
          重置
        </el-button>
      </div>
    </el-dialog>

  </el-container>
</template>
<script>
  import {mapState} from 'vuex'
  import axios from 'axios';
  import Bus from "./utils/bus";

  export default {
    name: 'Index',
    data() {
      let validateOldPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入密码"))
        } else {
          let param = {PASSWORD: value, USERNAME: this.$store.state.userInfo.userName}
          axios.post("/aisino/checkUserPwd", param).then(res => {
            if (!res.data.success) {
              // console.log(res)
              callback(new Error(res.data.msg))
            } else {
              callback()
            }
          })
        }
      };
      let validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入密码"))
        } else {
          callback()
        }
      };
      // <!--二次验证密码-->
      let validatePass2 = (rule, value, callback) => {
        console.log("进入二次")
        if (!value) {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.temp.PASSWORD) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        isCollapse: false, // 控制菜单收缩
        adminNameWidth: "200px", // 系统名称宽度
        defaultMenuData: null, // 菜单数据
        defaultXfmc: '',//默认销方
        XFMCLIST: [],  // 销方名称列表
        defaultBumenId: '',  //默认部门id
        BMLISTS: [], //总的部门id列表
        DQBMLIST: [], //当前部门id列表
        dialogFormVisible: false,
        temp: {
          OLDPASSWORD: '',
          PASSWORD: '',
          REPASSWORD: ''
        },
        rule: {
          OLDPASSWORD: [{validator: validateOldPassword, trigger: 'blur'}],
          PASSWORD: [{validator: validatePass, trigger: 'blur'}],
          REPASSWORD: [{validator: validatePass2, trigger: 'blur'}],
        },
      };
    },
    methods: {
      aqtc() { // 安全退出
        axios.post('/aisino/loginOut', null).then(response => {
          this.$router.push({path: '/'});
        })
      },
      xgmmShow() {
        this.dialogFormVisible = true
      },
      updatePwd() { //修改密码
        this.$refs['dataForm'].validate((valid) => {
          console.log(valid)
          if (valid) {
            let tempData = {ID: this.$store.state.userInfo.userId, PASSWORD: this.temp.PASSWORD}
            axios.post("/aisino/editUser", tempData).then(res => {
              if (res.data.success) {
                this.dialogFormVisible = false
                this.$message({
                  title: '成功',
                  message: res.data.msg,
                  type: 'success',
                  duration: 2000
                });
                //删除token
                this.$store.commit('del_token');
                this.$router.push({path: "/"})
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
          }
        })
      },
      clickCloseMenu() { //点击菜单收缩按钮
        this.$refs.openCloseMenu.style.left = this.isCollapse == true ? '200px' : "0";
        this.$refs.adminName.style.display = this.isCollapse == true ? 'block' : "none";
        this.isCollapse == false ? this.isCollapse = true : this.isCollapse = false;
      },
      handleSelect(key, keyPath) { //点击菜单功能
      },
      getMenu() {
        let data = {"user_id": this.$store.state.userInfo.userId};
        // 发送菜单列表请求
        axios.post('/aisino/getMenu', data).then(response => {
          if (response.data != null) {
            this.defaultMenuData = response.data.obj.Menu
          }
        })
      },
      getXfList() {
        let param = {"USERID": this.$store.state.userInfo.userId}
        axios.post("/aisino/orderhead/getXfxxListByUser", param).then(res => {
          if (res.data.success) {
            if (res.data.obj.length < 1) {
              this.$message({
                title: '失败',
                message: '没有找到销方信息，联系管理员',
                type: 'warning',
                duration: 2000
              })
              return
            }
            this.XFMCLIST = res.data.obj
            this.defaultXfmc = this.XFMCLIST[0].XFXXID + ',0'

            //整理部门id数据保存下来
            for (let i = 0; i < this.XFMCLIST.length; i++) {
              let xfxx = this.XFMCLIST[i];
              if (!xfxx.BUMENIDS) { // 部门ids字符串不存在,放入一个空列表对象到BULISTS占位
                this.BMLISTS.push([])
                continue;
              }
              let BUMENIDLIST = xfxx.BUMENIDS.split(",")
              let ZHONGWENLIST = xfxx.ZHONGWENS.split(",")
              let templist = []; //临时存放部门id和名称,放到总列表BULISTS中
              for (let j = 0; j < BUMENIDLIST.length; j++) {
                let tmp = {
                  BUMENID: BUMENIDLIST[j],
                  ZHONGWEN: ZHONGWENLIST[j]
                }
                templist.push(tmp)
              }
              this.BMLISTS.push(templist)
            }
            this.DQBMLIST = this.BMLISTS[0]; //给当前列表赋值
            this.initBmList(this.BMLISTS[0])
            //保存用户信息
            this.$store.commit('set_xfid', this.XFMCLIST[0].XFXXID);
          } else {
            this.$message({
              title: '失败',
              message: res.data.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      },
      setXfid(value) {
        let data = value.split(",");
        this.$store.commit('set_xfid', data[0]);
        this.initBmList(this.BMLISTS[data[1]])
      },
      initBmList(bmlist) { //初始部门列表数据,并给bmid赋初值
        this.DQBMLIST = bmlist
        if (this.DQBMLIST.length < 1) {
          this.$message({
            title: '失败',
            message: '没有找到部门信息，联系管理员',
            type: 'warning',
            duration: 2000
          })
          this.defaultBumenId = '';
          this.$store.commit('set_bmid', this.defaultBumenId);
        } else {
          this.defaultBumenId = this.DQBMLIST[0].BUMENID
          this.setBmid(this.defaultBumenId)
        }
      },
      setBmid(value) {
        // console.log(value)
        if (!value) {
          this.$message({
            title: '失败',
            message: '部门数据为空,联系管理员',
            type: 'warning',
            duration: 2000
          })
        }
        this.$store.commit('set_bmid', value);
        // console.log(this.$store.state.XFID)
        // console.log(this.$store.state.BMID)
      }
    },
    created() {// 初始化页面执行的东西
      this.getMenu();
      //this.getXfList();
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted() {// 两个子组件传递数据
      Bus.$on('addXF', res => { // 接收搜索数据请求
        this.getXfList();
      });
      Bus.$on('deleteXF', res => { // 接收搜索数据请求
        this.getXfList();
      });
    },
      beforeDestroy() {
          Bus.$off('addXF');
          Bus.$off('deleteXF');
      },
  }
</script>

<style scoped>
  /* 头部 */
  .el-header {
    background-color: #20a0ff;
    line-height: 8vh !important;
    height: 8vh !important;
    color: #fff !important;
  }

  a {
    text-decoration: none !important;
  }

  .admin-name {
    display: inline-block;
    max-width: 200px;
    width: 200px;
    position: absolute;
    left: 0;
    text-align: center;
    border-right: 1px solid #DCDFE6 !important;
    font-size: 1vw ;
    font-weight: 800;
    color: #fff;
  }

  .open-close-menu {
    display: inline-block;
    width: 64px;
    position: absolute;
    left: 200px;
    text-align: center;
    font-size: 1.8vw;
    font-weight: 800;
    color: #fff;
  }

  /* 菜单 */
  .el-menu {
    max-height: 92vh !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-width: 200px !important;
    min-height: 400px;
  }

  .el-menu--collapse {
    min-width: 64px !important;
  }

  /* 主题 */
  .el-main {
    max-height: 92vh !important;
    padding: 10px !important;
  }

  /*chrome--------------------------------------------start*/
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgb(255, 255, 255);
    border-radius: 8px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(201, 201, 202);
    border-radius: 8px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(162, 162, 163);
  }

  .el-menu::-webkit-scrollbar,
  .el-table__body-wrapper::-webkit-scrollbar {
    display: none;
  }

  .el-menu:hover::-webkit-scrollbar,
  .el-table__body-wrapper:hover::-webkit-scrollbar {
    display: block;
  }

  /*chrome--------------------------------------------end*/
  /*IE--------------------------------------------start*/
  * {
    /*三角箭头的颜色*/
    scrollbar-arrow-color: #c0c4cc;
    /*滚动条滑块按钮的颜色*/
    scrollbar-face-color: #A2A2A3;
    /*滚动条整体颜色*/
    scrollbar-highlight-color: #A2A2A3;
    /*滚动条阴影*/
    scrollbar-shadow-color: #A2A2A3;
    /*滚动条轨道颜色*/
    scrollbar-track-color: #f4f4f5;
    /*滚动条3d亮色阴影边框的外观颜色——左边和上边的阴影色*/
    scrollbar-3dlight-color: #A2A2A3;
    /*滚动条3d暗色阴影边框的外观颜色——右边和下边的阴影色*/
    scrollbar-darkshadow-color: #A2A2A3;
    /*滚动条基准颜色*/
    scrollbar-base-color: #f4f4f5;
  }

  .el-table__body-wrapper, .el-menu {
    /*IE下隐藏*/
    -ms-overflow-style: none;
  }

  .el-table__body-wrapper:hover, .el-menu:hover {
    /*IE下显示*/
    -ms-overflow-style: auto;
  }

  /*IE--------------------------------------------end*/
</style>
