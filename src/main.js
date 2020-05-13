import Vue from 'vue'
import App from './App'
// 引入路由
import Router from 'vue-router'
import router from './router'

// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入自定义样式
import './assets/css/customStyle.css'
import './assets/iconfont/iconfont.css'

// 引入axios ajax请求
import axios from 'axios'

// 引入JSON配置文件
import configGyxxfp from './static/json/config'

// 引入权限管理文件
import store from './components/vuex'

// 引入公用样式
import './static/css/customStyle.css'

// 配置axios
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
if (sessionStorage.getItem(configGyxxfp.tokenName)) {//页面刷新时，重新赋值token 以及基础用户信息
  store.commit('set_token', sessionStorage.getItem(configGyxxfp.tokenName))
  store.commit('set_userinfo', {
    "userName": sessionStorage.getItem('username'),
    "userId": sessionStorage.getItem('userId'),
    "name": sessionStorage.getItem('name')
  })
}

axios.defaults.baseURL = process.env.API_ROOT;//配置默认ajax请求路径  在/config/index.js中配置

// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.common[configGyxxfp.tokenName] = store.state.userInfo.token;//让每个请求携带自定义token
  return config;
});

var responseFlag = true;//是否已经有弹框的标识
// axios响应拦截器
axios.interceptors.response.use(response => {
  //token过期 以及 没有token 以及 别处登录
  if ((response.data.status === configGyxxfp.landingElseWhere || response.data.status === configGyxxfp.tokenExpired || response.data.status === configGyxxfp.noSuccessToken) && responseFlag) {
    responseFlag = false;
    ElementUI.MessageBox.alert(response.data.msg, response.data.title, {
      confirmButtonText: response.data.btnStr,
      type: response.data.boxType,
      showClose: false
    }).then(() => {
      responseFlag = true;
      router.replace({
        path: '/',
      });
    })
  }
  //没有权限
  if (response.data.status === configGyxxfp.notHaveQxRequest && responseFlag) {
    responseFlag = false;
    ElementUI.MessageBox.alert(response.data.msg, response.data.title, {
      confirmButtonText: response.data.btnStr,
      type: response.data.boxType,
      showClose: false
    }).then(() => {
      responseFlag = true;
    })
  }
  return response;
}, error => {
  responseFlag = false;
  ElementUI.MessageBox.alert("网络异常请重试", "提示", {
    confirmButtonText: "确定",
    type: 'error',
    showClose: false
  }).then(() => {
    responseFlag = true;
  })
  return error;
});

// 前端路由跳转拦截器
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requireAuth)) { //需要登录才能访问
    if (store.state.userInfo.token) {
      //自定义：可以到后台请求查看当前token是否失效
      next();
    } else {
      next({
        path: '/',
      });
    }
  } else {
    next();
  }
})

// VUE
Vue.use(ElementUI)
Vue.use(configGyxxfp)
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
