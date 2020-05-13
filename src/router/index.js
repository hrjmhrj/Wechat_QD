import Vue from 'vue'
import Router from 'vue-router'
import SellerInfo from "../components/views/SellerInfo/SellerInfo";
import YKFPStatistics from "../components/views/YKFPStatistics/YKFPStatistics";

import Index from '@/components/Index'
import Login from '@/components/Login'
import Home from '@/components/model/Home'

import QxMenuManager from '@/components/views/system/menumanager/QxGnTree'
import QxUserManager from '@/components/views/system/usermanager/QxUserManager'
import QxRoleManager from '@/components/views/system/rolemanager/QxRoleManager'

import WkFpPage from '@/components/views/wkfp/WkFp'


Vue.use(Router)

export default new Router({
  base: '/zitest',
  routes: [
    {
      path: '/index',
      name: 'Index',
      meta: {
        title: '首页',
        requireAuth: true, //判断该路由的访问是否需要登录
      },
      component: Index,
      children :[
        {
          path: '/home',
          name: 'Home',
          meta: {
            title: '标签页',
            requireAuth: true, //判断该路由的访问是否需要登录
          },
          component: Home
        }, {
          path: '/aisino/qxGnTreeTablePage',
          name: 'QxGnTreeTablePage',
          meta: {
            title: '资源管理页面',
            requireAuth: true, //判断该路由的访问是否需要登录
          },
          component: QxMenuManager
        },
        {
          path: '/aisino/qxUserManagePage',
          name: 'QxUserManager',
          meta: {
            title: '用户管理',
            requireAuth: true, //判断该路由的访问是否需要登录
          },
          component: QxUserManager
        },
        {
          path: '/aisino/jsglPage',
          name: 'QxRoleManager',
          meta: {
            title: '角色管理',
            requireAuth: true, //判断该路由的访问是否需要登录
          },
          component: QxRoleManager
        },{
          path: '/aisino/sellerPage',
          name: 'SellerInfo',
          meta: {
            title: '销方信息',
            requireAuth: false, //判断该路由的访问是否需要登录
          },
          component: SellerInfo
        },{
          path: '/aisino/WkFpPage',
          name: 'WkFpPage',
          meta: {
            title: '未开发票',
            requireAuth: false, //判断该路由的访问是否需要登录
          },
          component: WkFpPage
        },{
          path: '/aisino/YKFPStatisticsPage',
          name: 'YKFPStatisticsPage',
          meta: {
            title: '已开发票统计',
            requireAuth: false, //判断该路由的访问是否需要登录
          },
          component: YKFPStatistics
        },
      ]
    }, {
      path: '/',
      name: 'Login',
      meta: {
        title: '登录页',
        requireAuth: false, //判断该路由的访问是否需要登录
      },
      component: Login
    }
  ]
})



