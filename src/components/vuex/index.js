import Vue from 'vue'
import Vuex from 'vuex'
// 引入JSON配置文件
import configGyxxfp from '../../static/json/config'
import axios from 'axios';


Vue.use(Vuex)

/**
 * 定义权限数据格式
 */
const state = {
  userInfo: {
    userId: '', //用户ID
    userName: '', //用户名
    name: '',//姓名
    token: '',
    features: {  //权限列表（按钮，页面，功能）
      //Home页按钮权限
      Home: {
        searchBtn: false,
        kpBtn: false,
        zffpBtn: false
      },
      qxGnTreeTablePage: { //资源管理
        xzzyBtn: false, // 新增资源按钮
        zyscBtn: false, // 资源删除按钮
        zyxgBtn: false, // 资源修改按钮
      },
      qxUserManagePage: { //用户管理
        yhgnBtn: false, // 用户过滤按钮
        yhczBtn: false, // 用户重置按钮
        tjyhBtn: false, // 添加用户按钮
        sjbjBtn: false, // 数据编辑按钮
        jsxzBtn: false, // 角色选择按钮
        czmmBtn: false, // 重置密码按钮
        sjscBtn: false, // 数据删除按钮
        xfglBtn: false, // 销方管理按钮
      },
      jsglPage: { //角色管理
        tjjsBtn: false, //添加角色按钮
        ymglBtn: false, //页面管理按钮
        sjbjBtn: false, //数据编辑按钮
        sjscBtn: false, //数据删除按钮
      },
      kjcgPage: {//已开发票查询
        cxBtn: false,//查询按钮
        kjgnBtn: false,//过滤按钮
        ykczBtn: false,//已开发票查询重置按钮
        dpxzBtn: false,//电票下载按钮
        zpdyBtn: false,//纸票打印按钮
        zphcBtn: false,//纸票红冲按钮
        zpzfBtn: false,//纸票作废按钮
        bgdcBtn: false,//表格导出按钮
        dpylBtn: false,//电票预览按钮
      },
      sellerPage: {//销方信息维护
        xfcxBtn: false,//查询按钮
        xfgnBtn: false,//过滤按钮
        xfczBtn: false,//销方重置按钮
        xfxjBtn: false,//销方新建按钮
        xfxgBtn: false,//销方修改按钮
        xfscBtn: false,//销方删除按钮
        xfsqBtn: false,//销方授权按钮
        xfxzyhBtn: false,//销方新增授权用户按钮
        xfxzscBtn: false,//销方删除授权用户按钮
        xffjglBtn:false,//销方分机管理按钮
        xffjxzBtn:false,//销方分机新增按钮
        xffjscBtn:false,//销方分机删除按钮
      },
      purchasePage: {//购方信息维护
        gfcxBtn: false,//购方查询按钮
        gfgnBtn: false,//购方过滤按钮
        gfczBtn: false,//购方重置按钮
        gfxjBtn: false,//购方新建按钮
        gfxgBtn: false,//购方修改按钮
        gfscBtn: false,//购方删除按钮
        gfdrBtn: false,//购方导入按钮
        gfdcBtn: false,//购方导出按钮
        mbxzBtn: false,//模板下载按钮
        gfwjscBtn: false,//购方上传按钮
      },
      HongChongPage: {//红冲查询
        hccxBtn: false,//红冲查询按钮
        hcgnBtn: false,//红冲过滤按钮
        hczzBtn: false,//红冲重置按钮
        sdhcBtn: false,//手动红冲按钮
      },
      YKFPStatisticsPage: {//已开发票统计-发票汇总
        yktjgnBtn: false,//已开发票统计过滤按钮
        yktjczBtn: false,//已开发票统计重置按钮
        yktjbkdcBtn: false,//已开发票统计导出按钮
        bqykfpBtn: false,//本期已开发票按钮
        sfkjtjgnBtn: false,//水费发票开具情况统计过滤按钮
        sfkjtjczBtn: false,//水费发票开具情况统计重置按钮
        sfkjtjbkdcBtn: false,//水费发票开具情况统计导出按钮
        fphzBtn: false,//发票汇总按钮
      },
      zpkjPage: {   //代开发票页面
        gxkpBtn: false,  //勾选开票按钮
        guolvBtn: false,  //代开发票页面过滤按钮
        chongzhiBtn: false, //代开发票页面重置按钮
        chehuiBtn: false,  //代开发票页面撤回按钮
        fptkBtn: false,   //代开发票页面发票填开按钮
        SJBCBtn: false,   //代开发票页面 双击行的保存按钮
      },
      WkFpPage: {  //未开发票页面
        chaxunBtn: false,  //未开页面查询按钮
        WkGlBtn: false,  //未开页面过滤按钮
        WKCZBtn: false,  //未开重置按钮
        SCDKFPBtn: false,  //未开页面生成代开发票按钮

      },
    }
  },
  XFID: '',  //全局销方ID
  BMID: '',  //全局部门ID
};

/**
 * 设置用户信息
 */
const mutations = {
  /**
   * @param info 用户信息
   * @param permission  用户权限
   * @param flag  是否有效
   */
  setInfo(state, {info}) {
    // 初始化权限
    let userInfo = Object.assign({}, state.userInfo)
    for (let i in userInfo.features) {
      for (let j in userInfo.features[i]) {
        userInfo.features[i][j] = false
      }
    }
    // 设置权限true或false
    cheakBtnUrl(info.data.obj, userInfo);

    //Home
    userInfo.features.Home.searchBtn = true;
    userInfo.features.Home.kpBtn = true;
    userInfo.features.Home.zffpBtn = true;


    state.userInfo = userInfo
  },
  /**
   * 设置token存储
   * @param state
   * @param token
   */
  set_token(state, token) {
    state.userInfo.token = token;
    sessionStorage.setItem(configGyxxfp.tokenName, token);
  },
  /**
   * 删除token
   * @param state
   */
  del_token(state) {
    state.userInfo.token = '';
    sessionStorage.removeItem(configGyxxfp.tokenName);
  },
  /**
   * 设置用户信息
   * @param state
   */
  set_userinfo(state, info) {
    state.userInfo.userName = info.username;
    state.userInfo.name = info.name;
    state.userInfo.userId = info.userId;
    sessionStorage.setItem('username', info.username);
    sessionStorage.setItem('name', info.name);
    sessionStorage.setItem('userId', info.userId);
  },
  /**
   * 删除用户信息
   * @param state
   */
  del_userinfo(state) {
    state.userInfo.userName = ''
    state.userInfo.userId = '';
    state.userInfo.name = '';
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('userId');
  },
  /**
   * 设置全局销方id
   * @param state
   * @param xfid
   */
  set_xfid(state, xfid) {
    state.XFID = xfid
    sessionStorage.setItem("XFID", xfid);
  },

  /**
   * 设置全局部门id
   * @param state
   * @param xfid
   */
  set_bmid(state, bmid) {
    state.BMID = bmid
    sessionStorage.setItem("BMID", bmid);
  },

};

/**
 * 获取
 */
const getters = {
  getInfo: state => {
    return state.userInfo
  }
};


/**
 * 获取用户权限
 * @param context
 * @param id 组织id
 */
const actions = {
  getInfo(context, id = 0) {
    if (context.state.userInfo.userId != '') {
      axios.post('/aisino/selectAllBtnById', {"id": context.state.userInfo.userId}).then(res => {
        context.commit('setInfo', {info: res})
      })
    }
  }
};

/**
 * switch判断按钮
 * @param btnInfo
 * @param userInfo
 */
function cheakBtnUrl(btnInfo, userInfo) {
  if (btnInfo == null || btnInfo.length < 1) {
    return;
  }
  btnInfo.forEach(item => {
    switch (item) {
      case "/jsglPage/tjjsBtn" :
        userInfo.features.jsglPage.tjjsBtn = true;
        break;
      case "/jsglPage/ymglBtn" :
        userInfo.features.jsglPage.ymglBtn = true;
        break;
      case "/jsglPage/sjbjBtn" :
        userInfo.features.jsglPage.sjbjBtn = true;
        break;
      case "/jsglPage/sjscBtn" :
        userInfo.features.jsglPage.sjscBtn = true;
        break;
      case "/qxGnTreeTablePage/xzzyBtn" :
        userInfo.features.qxGnTreeTablePage.xzzyBtn = true;
        break;
      case "/qxGnTreeTablePage/zyscBtn" :
        userInfo.features.qxGnTreeTablePage.zyscBtn = true;
        break;
      case "/qxGnTreeTablePage/zyxgBtn" :
        userInfo.features.qxGnTreeTablePage.zyxgBtn = true;
        break;
      case "/qxUserManagePage/yhgnBtn" :
        userInfo.features.qxUserManagePage.yhgnBtn = true;
        break;
      case "/qxUserManagePage/yhczBtn" :
        userInfo.features.qxUserManagePage.yhczBtn = true;
        break;
      case "/qxUserManagePage/tjyhBtn" :
        userInfo.features.qxUserManagePage.tjyhBtn = true;
        break;
      case "/qxUserManagePage/sjbjBtn" :
        userInfo.features.qxUserManagePage.sjbjBtn = true;
        break;
      case "/qxUserManagePage/jsxzBtn" :
        userInfo.features.qxUserManagePage.jsxzBtn = true;
        break;
      case "/qxUserManagePage/czmmBtn" :
        userInfo.features.qxUserManagePage.czmmBtn = true;
        break;
      case "/qxUserManagePage/sjscBtn" :
        userInfo.features.qxUserManagePage.sjscBtn = true;
        break;
      case "/qxUserManagePage/xfglBtn" :
        userInfo.features.qxUserManagePage.xfglBtn = true;
        break;
      case "/kjcgPage/cxBtn" :
        userInfo.features.kjcgPage.cxBtn = true;
        break;
      case "/kjcgPage/kjgnBtn" :
        userInfo.features.kjcgPage.kjgnBtn = true;
        break;
      case "/kjcgPage/ykczBtn" :
        userInfo.features.kjcgPage.ykczBtn = true;
        break;
      case "/kjcgPage/dpxzBtn" :
        userInfo.features.kjcgPage.dpxzBtn = true;
        break;
      case "/kjcgPage/zpdyBtn" :
        userInfo.features.kjcgPage.zpdyBtn = true;
        break;
      case "/kjcgPage/zphcBtn" :
        userInfo.features.kjcgPage.zphcBtn = true;
        break;
      case "/kjcgPage/zpzfBtn" :
        userInfo.features.kjcgPage.zpzfBtn = true;
        break;
      case "/kjcgPage/bgdcBtn" :
        userInfo.features.kjcgPage.bgdcBtn = true;
        break;
      case "/kjcgPage/dpylBtn" :
        userInfo.features.kjcgPage.dpylBtn = true;
        break;
      case "/sellerPage/xfcxBtn" :
        userInfo.features.sellerPage.xfcxBtn = true;
        break;
      case "/sellerPage/xfgnBtn" :
        userInfo.features.sellerPage.xfgnBtn = true;
        break;
      case "/sellerPage/xfczBtn" :
        userInfo.features.sellerPage.xfczBtn = true;
        break;
      case "/sellerPage/xfxjBtn" :
        userInfo.features.sellerPage.xfxjBtn = true;
        break;
      case "/sellerPage/xfxgBtn" :
        userInfo.features.sellerPage.xfxgBtn = true;
        break;
      case "/sellerPage/xfscBtn" :
        userInfo.features.sellerPage.xfscBtn = true;
        break;
      case "/sellerPage/xfsqBtn" :
        userInfo.features.sellerPage.xfsqBtn = true;
        break;
      case "/purchasePage/gfcxBtn" :
        userInfo.features.purchasePage.gfcxBtn = true;
        break;
      case "/purchasePage/gfgnBtn" :
        userInfo.features.purchasePage.gfgnBtn = true;
        break;
      case "/purchasePage/gfczBtn" :
        userInfo.features.purchasePage.gfczBtn = true;
        break;
      case "/purchasePage/gfxjBtn" :
        userInfo.features.purchasePage.gfxjBtn = true;
        break;
      case "/purchasePage/gfxgBtn" :
        userInfo.features.purchasePage.gfxgBtn = true;
        break;
      case "/purchasePage/gfscBtn" :
        userInfo.features.purchasePage.gfscBtn = true;
        break;
      case "/purchasePage/gfdrBtn" :
        userInfo.features.purchasePage.gfdrBtn = true;
        break;
      case "/purchasePage/gfdcBtn" :
        userInfo.features.purchasePage.gfdcBtn = true;
        break;
      case "/purchasePage/mbxzBtn" :
        userInfo.features.purchasePage.mbxzBtn = true;
        break;
      case "/purchasePage/gfwjscBtn" :
        userInfo.features.purchasePage.gfwjscBtn = true;
        break;
      case "/HongChongPage/hccxBtn" :
        userInfo.features.HongChongPage.hccxBtn = true;
        break;
      case "/HongChongPage/hcgnBtn" :
        userInfo.features.HongChongPage.hcgnBtn = true;
        break;
      case "/HongChongPage/hczzBtn" :
        userInfo.features.HongChongPage.hczzBtn = true;
        break;
      case "/HongChongPage/sdhcBtn" :
        userInfo.features.HongChongPage.sdhcBtn = true;
        break;
      case "/YKFPStatisticsPage/yktjgnBtn" :
        userInfo.features.YKFPStatisticsPage.yktjgnBtn = true;
        break;
      case "/YKFPStatisticsPage/yktjczBtn" :
        userInfo.features.YKFPStatisticsPage.yktjczBtn = true;
        break;
      case "/YKFPStatisticsPage/yktjbkdcBtn" :
        userInfo.features.YKFPStatisticsPage.yktjbkdcBtn = true;
        break;
      case "/YKFPStatisticsPage/bqykfpBtn" :
        userInfo.features.YKFPStatisticsPage.bqykfpBtn = true;
        break;
      case "/YKFPStatisticsPage/sfkjtjgnBtn" :
        userInfo.features.YKFPStatisticsPage.sfkjtjgnBtn = true;
        break;
      case "/YKFPStatisticsPage/sfkjtjczBtn" :
        userInfo.features.YKFPStatisticsPage.sfkjtjczBtn = true;
        break;
      case "/YKFPStatisticsPage/sfkjtjbkdcBtn" :
        userInfo.features.YKFPStatisticsPage.sfkjtjbkdcBtn = true;
        break;
      case "/YKFPStatisticsPage/fphzBtn" :
        userInfo.features.YKFPStatisticsPage.fphzBtn = true;
        break;
    case "/qxUserManagePage/xfglBtn" :
      userInfo.features.qxUserManagePage.xfglBtn = true;
      break;
      case "/kjcgPage/cxBtn" : userInfo.features.kjcgPage.cxBtn = true; break;
      case "/kjcgPage/kjgnBtn" : userInfo.features.kjcgPage.kjgnBtn = true; break;
      case "/kjcgPage/ykczBtn" : userInfo.features.kjcgPage.ykczBtn = true; break;
      case "/kjcgPage/dpxzBtn" : userInfo.features.kjcgPage.dpxzBtn = true; break;
      case "/kjcgPage/zpdyBtn" : userInfo.features.kjcgPage.zpdyBtn = true; break;
      case "/kjcgPage/zphcBtn" : userInfo.features.kjcgPage.zphcBtn = true; break;
      case "/kjcgPage/zpzfBtn" : userInfo.features.kjcgPage.zpzfBtn = true; break;
      case "/kjcgPage/bgdcBtn" : userInfo.features.kjcgPage.bgdcBtn = true; break;
      case "/kjcgPage/dpylBtn" : userInfo.features.kjcgPage.dpylBtn = true; break;
      case "/sellerPage/xfcxBtn" : userInfo.features.sellerPage.xfcxBtn = true; break;
      case "/sellerPage/xfgnBtn" : userInfo.features.sellerPage.xfgnBtn = true; break;
      case "/sellerPage/xfczBtn" : userInfo.features.sellerPage.xfczBtn = true; break;
      case "/sellerPage/xfxjBtn" : userInfo.features.sellerPage.xfxjBtn = true; break;
      case "/sellerPage/xfxgBtn" : userInfo.features.sellerPage.xfxgBtn = true; break;
      case "/sellerPage/xfscBtn" : userInfo.features.sellerPage.xfscBtn = true; break;
      case "/sellerPage/xfsqBtn" : userInfo.features.sellerPage.xfsqBtn = true; break;
      case "/sellerPage/xfxzyhBtn" : userInfo.features.sellerPage.xfxzyhBtn = true; break;
      case "/sellerPage/xfxzscBtn" : userInfo.features.sellerPage.xfxzscBtn = true; break;
      case "/sellerPage/xffjglBtn" : userInfo.features.sellerPage.xffjglBtn = true; break;
      case "/sellerPage/xffjxzBtn" : userInfo.features.sellerPage.xffjxzBtn = true; break;
      case "/sellerPage/xffjscBtn" : userInfo.features.sellerPage.xffjscBtn = true; break;
      case "/purchasePage/gfcxBtn" : userInfo.features.purchasePage.gfcxBtn = true; break;
      case "/purchasePage/gfgnBtn" : userInfo.features.purchasePage.gfgnBtn = true; break;
      case "/purchasePage/gfczBtn" : userInfo.features.purchasePage.gfczBtn = true; break;
      case "/purchasePage/gfxjBtn" : userInfo.features.purchasePage.gfxjBtn = true; break;
      case "/purchasePage/gfxgBtn" : userInfo.features.purchasePage.gfxgBtn = true; break;
      case "/purchasePage/gfscBtn" : userInfo.features.purchasePage.gfscBtn = true; break;
      case "/purchasePage/gfdrBtn" : userInfo.features.purchasePage.gfdrBtn = true; break;
      case "/purchasePage/gfdcBtn" : userInfo.features.purchasePage.gfdcBtn = true; break;
      case "/purchasePage/mbxzBtn" : userInfo.features.purchasePage.mbxzBtn = true; break;
      case "/purchasePage/gfwjscBtn" : userInfo.features.purchasePage.gfwjscBtn = true; break;
      case "/HongChongPage/hccxBtn" : userInfo.features.HongChongPage.hccxBtn = true; break;
      case "/HongChongPage/hcgnBtn" : userInfo.features.HongChongPage.hcgnBtn = true; break;
      case "/HongChongPage/hczzBtn" : userInfo.features.HongChongPage.hczzBtn = true; break;
      case "/HongChongPage/sdhcBtn" : userInfo.features.HongChongPage.sdhcBtn = true; break;
      case "/YKFPStatisticsPage/yktjgnBtn" : userInfo.features.YKFPStatisticsPage.yktjgnBtn = true; break;
      case "/YKFPStatisticsPage/yktjczBtn" : userInfo.features.YKFPStatisticsPage.yktjczBtn = true; break;
      case "/YKFPStatisticsPage/yktjbkdcBtn" : userInfo.features.YKFPStatisticsPage.yktjbkdcBtn = true; break;
      case "/YKFPStatisticsPage/bqykfpBtn" : userInfo.features.YKFPStatisticsPage.bqykfpBtn = true; break;
      case "/YKFPStatisticsPage/sfkjtjgnBtn" : userInfo.features.YKFPStatisticsPage.sfkjtjgnBtn = true; break;
      case "/YKFPStatisticsPage/sfkjtjczBtn" : userInfo.features.YKFPStatisticsPage.sfkjtjczBtn = true; break;
      case "/YKFPStatisticsPage/sfkjtjbkdcBtn" : userInfo.features.YKFPStatisticsPage.sfkjtjbkdcBtn = true; break;
      case "/YKFPStatisticsPage/fphzBtn" : userInfo.features.YKFPStatisticsPage.fphzBtn = true; break;

      case "/zpkjPage/gxkpBtn" :
        userInfo.features.zpkjPage.gxkpBtn = true;
        break;
      case "/zpkjPage/guolvBtn" :
        userInfo.features.zpkjPage.guolvBtn = true;
        break;
      case "/zpkjPage/chongzhiBtn" :
        userInfo.features.zpkjPage.chongzhiBtn = true;
        break;
      case "/zpkjPage/chehuiBtn" :
        userInfo.features.zpkjPage.chehuiBtn = true;
        break;
      case "/zpkjPage/fptkBtn" :
        userInfo.features.zpkjPage.fptkBtn = true;
        break;
      case "/zpkjPage/SJBCBtn" :
        userInfo.features.zpkjPage.SJBCBtn = true;
        break;
      case "/WkFpPage/chaxunBtn" :
        userInfo.features.WkFpPage.chaxunBtn = true;
        break;
      case "/WkFpPage/WkGlBtn" :
        userInfo.features.WkFpPage.WkGlBtn = true;
        break;
      case "/WkFpPage/WKCZBtn" :
        userInfo.features.WkFpPage.WKCZBtn = true;
        break;
      case "/WkFpPage/SCDKFPBtn" :
        userInfo.features.WkFpPage.SCDKFPBtn = true;
        break;

    }
  })
  return userInfo;
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {}
});
export default store;
