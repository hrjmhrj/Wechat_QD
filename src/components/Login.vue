<template>
  <div class="form-div"  :style="backgroundDiv">
    <div class="titleclass">成 都 自 来 水 公 司 开 票 平 台</div>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left"  label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系 统 登 录</h3>
      <el-form-item prop="account">
        <el-input type="text"  prefix-icon="el-icon-user"  v-model="ruleForm2.account" auto-complete="off"  placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" prefix-icon="el-icon-lock" class="qxs-ic_password qxs-icon" v-model="ruleForm2.checkPass" auto-complete ="new-password"  placeholder="密码"></el-input>
      </el-form-item>
      <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;font-weight: 900;" @click.native.prevent="handleSubmit2" :loading="logining">登 录</el-button>
      </el-form-item>
    </el-form>
    <div class="logclass">@Aisino</div>
  </div>

</template>

<script>
  import axios from 'axios';
  import JSEncrypt from 'jsencrypt/bin/jsencrypt'
  export default {
    data() {
      return {
          backgroundDiv: {
              backgroundImage:'url(' + require('../static/img/login-bj.jpg') + ')',
              backgroundRepeat:'no-repeat',
              backgroundSize:'100% 100%',
              width:'100%' ,
              height:'100%' ,
              position: 'fixed',
          },
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit2(ev) {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            let encryptor = new JSEncrypt();
            let publickey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZVjzDACliZaODgoEt2teMjU5KsM1VFThbwfzHpUiVBR9Te9Y8P5UGA+BehfKV3I5gwqtOfB3dq+xEjlJLwSlTREIdV7cu2uaBKc2TLHJJ+GUF0A46nr4P9brO5k/S5GWHNsbLNsczKB6uxW2jZB8c8eW3Xhwr9C9eNiARjrKqXQIDAQAB"
            encryptor.setPublicKey(publickey);
            let rsaPassWord = encryptor.encrypt(this.ruleForm2.checkPass) // 对需要加密的数据进行加密
            let data = {"username": this.ruleForm2.account, "password": rsaPassWord};
            axios.post('/aisino/checkLogin',data).then(response => {
              if(!response.data.success){
                this.$message({
                  message: response.data.msg,
                  type: 'error'
                });
              } else {
                //模拟获取token
                let token = response.data.obj.nekot;
                //保存token
                this.$store.commit('set_token', token);
                //保存用户信息
                this.$store.commit('set_userinfo',response.data.obj);
                //请求按钮资源
                this.$store.dispatch('getInfo');
                //跳转到首页
                this.$router.push({ path: '/Index' });
              }
            })
          } else {
            return false;
          }
        });
      }
    },
    created () {
      this.$store.commit('del_token');
      this.$store.commit('del_userinfo');
    }
  }

</script>

<style  scoped>

  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin:0 auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: transparent;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    top: 36vh;
    position: relative;
    margin: 0 auto;
  }
  .title {
    font-size: 2vw !important;
    font-weight: 800;
    color: #fff;
    margin: 0px auto 40px auto;
    text-align: center;
  }
 .form-div {
    width: 99vw;
    height: 100%;
    position: absolute;
  }
  .titleclass{
    text-align: center;
    height: 30px;
    width: 100vw;
    color: #fff;
    position: absolute;
    top: 19vh;
    font-size: 2.5vw !important;
    font-weight: 800;
  }
.logclass{
  text-align: center;
  height: 30px;
  width: 100vw;
  color: #000;
  position: absolute;
  top: 97vh;
  font-size: 0.8vw !important;
  font-weight: 800;
}
</style>
