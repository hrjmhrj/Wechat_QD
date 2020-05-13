<template>
  <div class="tabBox">
    <div class="fnBtnBox">
      <el-row style="text-align: right">
        <Button type="primary"  @click="searchList" icon="el-icon-search" v-if="userInfo.features.sellerPage.xfcxBtn">查询</Button>
        <Button @click="showSearchFormFlag = true" icon="el-icon-search" v-if="userInfo.features.sellerPage.xfgnBtn">过滤</Button>
        <Button @click="resetBack" icon="el-icon-refresh-right" type="primary" v-if="userInfo.features.sellerPage.xfczBtn">重置</Button>
        <Button type="primary" @click="settaxserver" icon="el-icon-plus" v-if="userInfo.features.sellerPage.xfxjBtn">新建</Button>
      </el-row>
      <Dialog title="信息管理" :visible.sync="xfxxglFormFlag" :close-on-click-modal=false top="8vh" class="customDia" :before-close="xfxxglCovarianceItemClose"
              :center=true width="79%">
        <div class="authBox">
          <el-row style="text-align: right">
            <Button type="primary"  @click="addxfxx" icon="el-icon-plus" style="margin-bottom: 10px;" >新增
            </Button>
          </el-row>
          <Table :data="xfxxglTableList" border v-loading="xfxxglTableLoad" class="customTable" style="min-width: 100%"
                 height="84%" ref="SellerInfoList">
            <TableColumn prop="idx" label="序号" width="50" align="center"/>
            <TableColumn prop="xiaofangid" label="销方id" width="250" :show-overflow-tooltip=true align="center"/>
            <TableColumn prop="XFJS" label="销方账户类型" width="200" :show-overflow-tooltip=true align="center"/>
            <TableColumn prop="XFDZDH" label="销方地址电话" width="280" :show-overflow-tooltip=true align="center"/>
            <TableColumn prop="XFYHZH" label="销方银行账号" width="280" :show-overflow-tooltip=true align="center"/>
            <TableColumn label="操作" width="100" align="center">
              <template slot-scope="scope">
                <Button @click.native.prevent="xfxxdeleteRow(scope.row)" type="danger" size="mini" >删除</Button>
              </template>
            </TableColumn>
          </Table>
          <div class="paginbox" v-show="xfxxglpaginationData.total >= 0">
            <Pagination v-if="xfxxglPaginationType" @size-change="xfxxglhandleSizeChange"
                        @current-change="xfxxglhandleCurrentChange"
                        :hide-on-single-page="!(xfxxglpaginationData.total >=0)" :page-sizes="[10,30,50]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper" :total="xfxxglpaginationData.total"/>
          </div>
        </div>
      </Dialog>
      <Dialog title="新增信息管理" :visible.sync="xfxxglCovarianceItemFlag" :close-on-click-modal=false top="8vh" class="customDia"
              :center=true width="550px" append-to-body>
        <div class="forBox">
          <Form label-width="120px" ref="xfxxglform" :model="xfxxglData" :rules="xfxxglRules"  size="medium" :inline=true>
            <FormItem label="销方名称:" prop="XFMC"  >
              <Input v-model="xfxxglData.XFMC" placeholder="请输入销方名称" style="width: 300px;" :disabled="true"/>
            </FormItem>
            <FormItem label="销方id:" prop="XFID"  v-if="false">
              <Input v-model="xfxxglData.XFID" placeholder="请输入销方税号" style="width: 300px;"/>
            </FormItem>
            <FormItem label="销方账户类型:" prop="XFJS" :required=true >
              <Input v-model="xfxxglData.XFJS" placeholder="请输入销方账户类型" style="width: 300px;"/>
            </FormItem>
            <FormItem label="销方地址电话:" prop="XFDZDH" :required=true >
              <Input v-model="xfxxglData.XFDZDH" placeholder="请输入销方地址电话" style="width: 300px;"/>
            </FormItem>
            <FormItem label="销方银行账号:" prop="XFYHZH" :required=true >
              <Input v-model="xfxxglData.XFYHZH" placeholder="请输入销方银行账号" style="width: 300px;"/>
            </FormItem>
          </Form>
          <div class="bottom">
            <Button @click="xzxfxxquxiao" >取消</Button>
            <Button type="primary" @click="submitxfxxgl('xfxxglform')" :loading="xfxxglsubmitBtnLoadFlag" >提交</Button>
          </div>
        </div>
      </Dialog>
      <Dialog title="分机管理" :visible.sync="fjglFormFlag" :close-on-click-modal=false top="8vh" class="customDia" :before-close="fjglCovarianceItemClose"
              :center=true width="1000px">
        <div class="authBox">
          <el-row style="text-align: right">
            <Button type="primary"  @click="addfjh" icon="el-icon-plus" style="margin-bottom: 10px;" v-if="userInfo.features.sellerPage.xffjxzBtn">新增
            </Button>
          </el-row>
          <Table :data="fjglTableList" border v-loading="fjglTableLoad" class="customTable" style="min-width: 100%"
                 height="84%" ref="SellerInfoList">
            <TableColumn prop="idx" label="序号" width="50" align="center"/>
            <TableColumn prop="xiaofangid" label="销方id" width="250" :show-overflow-tooltip=true align="center"/>
            <TableColumn prop="bumenid" label="部门ID" width="280" :show-overflow-tooltip=true align="center"/>
            <TableColumn prop="zhongwen" label="中文名称" width="280" :show-overflow-tooltip=true align="center"/>
            <TableColumn label="操作" width="100" align="center">
              <template slot-scope="scope">
                <Button @click.native.prevent="fjhdeleteRow(scope.row)" type="danger" size="mini" v-if="userInfo.features.sellerPage.xffjscBtn">删除</Button>
              </template>
            </TableColumn>
          </Table>
          <div class="paginbox" v-show="fjglpaginationData.total >= 0">
            <Pagination v-if="fjglPaginationType" @size-change="fjglhandleSizeChange"
                        @current-change="fjglhandleCurrentChange"
                        :hide-on-single-page="!(fjglpaginationData.total >=0)" :page-sizes="[10,30,50]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper" :total="fjglpaginationData.total"/>
          </div>
        </div>
      </Dialog>
      <Dialog title="新增分机" :visible.sync="fjglCovarianceItemFlag" :close-on-click-modal=false top="8vh" class="customDia"
              :center=true width="550px" append-to-body>
        <div class="forBox">
          <Form label-width="120px" ref="fjglform" :model="fjglData" :rules="fjglRules"  size="medium" :inline=true>
            <FormItem label="销方名称:" prop="XFMC"  >
              <Input v-model="fjglData.XFMC" placeholder="请输入销方名称" style="width: 300px;" :disabled="true"/>
            </FormItem>
            <FormItem label="销方id:" prop="XFID"  v-if="false">
              <Input v-model="fjglData.XFID" placeholder="请输入销方税号" style="width: 300px;"/>
            </FormItem>
            <FormItem label="部门id:" prop="bumenid" :required=true >
              <Input v-model="fjglData.bumenid" placeholder="请输入部门id" style="width: 300px;"/>
            </FormItem>
            <FormItem label="中文名称:" prop="zhongwen" :required=true >
              <Input v-model="fjglData.zhongwen" placeholder="请输入中文名称" style="width: 300px;"/>
            </FormItem>
          </Form>
          <div class="bottom">
            <Button @click="xzfjquxiao" >取消</Button>
            <Button type="primary" @click="submitFjgl('fjglform')" :loading="fjglsubmitBtnLoadFlag" >提交</Button>
          </div>
        </div>
      </Dialog>
      <Dialog :title="(editFlag ? '修改' : '新建') + '销方信息'" :visible.sync="addCovarianceItemFlag"
              :before-close="addCovarianceItemClose" :close-on-click-modal=false top="8vh" class="customDia"
              :center=true width="1100px" append-to-body>
        <div class="forBox">
          <Form label-width="120px" ref="form" :model="addData" :rules="addRules" size="medium" :inline=true>
            <FormItem label="销方名称:" prop="XFMC" :required=true>
              <Input v-model="addData.XFMC" placeholder="请输入销方名称" style="width: 202px;"/>
            </FormItem>
            <FormItem label="销方税号:" prop="XFSH" :required=true>
              <Input v-model="addData.XFSH" placeholder="请输入销方税号" style="width: 202px;"/>
            </FormItem>
            <FormItem label="销方银行账户:" prop="XFYHZH" :required=false>
              <Input v-model="addData.XFYHZH" placeholder="请输入销方银行账户" style="width: 202px;"/>
            </FormItem>
            <FormItem label="销方地址电话:" prop="XFDZDH" :required=false>
              <Input v-model="addData.XFDZDH"  placeholder="请输入销方地址电话" style="width: 202px;"/>
            </FormItem>
            <FormItem label="开票人:" prop="KPR" :required=true>
              <Input v-model="addData.KPR" placeholder="请输入开票人" style="width: 202px;"/>
            </FormItem>
            <FormItem label="收款人:" prop="SKR" :required=false>
              <Input v-model="addData.SKR" placeholder="请输入收款人" style="width: 202px;"/>
            </FormItem>
            <FormItem label="复核人:" prop="FHR" :required=false>
              <Input v-model="addData.FHR" placeholder="请输入复核人" style="width: 202px;"/>
            </FormItem>
            <FormItem label="推送邮箱帐号:" prop="TS_EMAIL" :required=false>
              <Input v-model="addData.TS_EMAIL" placeholder="请输入推送邮箱帐号" style="width: 202px;"/>
            </FormItem>
            <FormItem label="推送邮箱url地址:" prop="TS_EMAIL_URL" :required=false>
              <Input v-model="addData.TS_EMAIL_URL" placeholder="请输入推送邮箱url地址" style="width: 202px;"/>
            </FormItem>
            <FormItem label="邮箱密码:" prop="TS_EMAIL_PASSWORD" :required=false>
              <Input v-model="addData.TS_EMAIL_PASSWORD" placeholder="请输入邮箱密码" style="width: 202px;"/>
            </FormItem>
            <FormItem label="pop3:" prop="TS_EMAIL_POP3" :required=false>
              <Input v-model="addData.TS_EMAIL_POP3" placeholder="请输入pop3" style="width: 202px;"/>
            </FormItem>
            <FormItem label="smtp:" prop="TS_EMAIL_SMTP" :required=false>
              <Input v-model="addData.TS_EMAIL_SMTP" placeholder="请输入smtp" style="width: 202px;"/>
            </FormItem>
            <FormItem label="专票:" prop="ZP" :required=true>
              <Input v-model="addData.ZP" placeholder="请输入专票" style="width: 202px;"/>
            </FormItem>
            <FormItem label="普票:" prop="PP" :required=true>
              <Input v-model="addData.PP" placeholder="请输入普票" style="width: 202px;"/>
            </FormItem>
            <FormItem label="卷票:" prop="JP" :required=true>
              <Input v-model="addData.JP" placeholder="请输入卷票" style="width: 202px;"/>
            </FormItem>
            <FormItem label="电子发票:" prop="DZFP" :required=true>
              <Input v-model="addData.DZFP" placeholder="请输入电子发票" style="width: 202px;"/>
            </FormItem>
            <FormItem label="终端:" prop="terminalCode">
              <el-select v-model="addData.terminalCode" placeholder="请选择终端" style="width: 202px; height: 30px;">
                <el-option v-for="item in [
                {label: 'B/S请求来源', value: '0'},
                {label: 'C/S请求来源', value: '1'}
              ]" :label="item.label" :value="item.value" :key="item.label"/>
              </el-select>
            </FormItem>
            <FormItem label="应用标志:" prop="appId">
              <el-select v-model="addData.appId" placeholder="请选择终端" style="width: 202px; height: 30px;">
                <el-option v-for="item in [
                {label: '服务器自开票版', value: 'A16D8DBD18EDDD80'},
                {label: '税控组件开票版', value: 'AA0DDF541B152FBA'}
              ]" :label="item.label" :value="item.value" :key="item.label"/>
              </el-select>
            </FormItem>
            <FormItem label="纳税人授权码:" prop="authorizationCode" :required=false>
              <Input v-model="addData.authorizationCode" placeholder="请输入纳税人授权码" style="width: 202px;"/>
            </FormItem>
            <FormItem label="第三方平台授权码:" prop="requestCode" :required=false>
              <Input v-model="addData.requestCode" placeholder="请输入第三方平台授权码" style="width: 202px;"/>
            </FormItem>
            <FormItem label="注册码:" prop="sigCode" :required=false>
              <Input v-model="addData.sigCode" placeholder="请输入注册码" style="width: 202px;"/>
            </FormItem>
            <FormItem label="开票软件密码:" prop="password" :required=false>
              <Input v-model="addData.password" placeholder="请输入开票软件密码" style="width: 202px;"/>
            </FormItem>
            <FormItem label="分税盘证书密码:" prop="token" :required=false>
              <Input v-model="addData.token" placeholder="请输入分税盘证书密码" style="width: 202px;"/>
            </FormItem>
            <FormItem label="机器编码:" prop="jqbh" :required=false>
              <Input v-model="addData.jqbh" placeholder="请输入机器编码" style="width: 202px;"/>
            </FormItem>
            <FormItem label="分机号:" prop="fjh" :required=true>
              <Input v-model="addData.fjh" placeholder="请输入分机号" style="width: 202px;"/>
            </FormItem>
            <FormItem label="默认电票分机号:" prop="dpfjh" :required=true>
              <Input v-model="addData.dpfjh" placeholder="请输入默认电票分机号" style="width: 202px;"/>
            </FormItem> <!--2019.11.29 增加电票分机号 对应数据库表t_xfxx字段BY2-->
            <FormItem label="A9服务器调用地址:" prop="serverUrl" :required=false>
              <Input v-model="addData.serverUrl" placeholder="请输入A9服务器调用地址" style="width: 202px;"/>
            </FormItem>
            <FormItem label="拆分依据:" prop="CFYJ" :required=true>
              <el-select v-model="addData.CFYJ" placeholder="请选择拆分依据" style="width: 202px; height: 30px;">
                <el-option v-for="item in [
                {label: '拆分数量', value: '0'},
                {label: '拆分单价', value: '1'}
              ]" :label="item.label" :value="item.value" :key="item.label"/>
              </el-select>
            </FormItem>
            <FormItem label="开票类型:" prop="BY3" :required=true>
              <el-select v-model="addData.BY3" placeholder="请选择开票类型" style="width: 202px; height: 30px;">
                <el-option v-for="item in [
                {label: '组件开票', value: '0'},
                {label: '诺诺开票', value: '1'}
              ]" :label="item.label" :value="item.value" :key="item.label"/>
              </el-select>
            </FormItem>
            <FormItem label="诺诺identity:" prop="identity" :required=false>
              <Input v-model="addData.identity" placeholder="请输入诺诺identity" style="width: 202px;"/>
            </FormItem>
            <FormItem label="是否回滚:" prop="SFHG">
              <el-select v-model="addData.SFHG" placeholder="请选择是否回滚" style="width: 202px; height: 30px;">
                <el-option v-for="item in [
                {label: '不回滚', value: '0'},
                {label: '回滚', value: '1'}
              ]" :label="item.label" :value="item.value" :key="item.label"/>
              </el-select>
            </FormItem>
            <FormItem label="销方id:" prop="XFID" :required=false v-if="editFlag">
              <Input v-model="addData.XFID" placeholder="请输入销方id" style="width: 202px;"/>
            </FormItem>
          </Form>
          <div class="bottom">
            <Button @click="addCovarianceItemClose" >取消</Button>
            <Button type="primary" @click="submitFn('form')" :loading="submitBtnLoadFlag" >提交</Button>
          </div>
        </div>
      </Dialog>
      <Dialog title="过滤列表" :visible.sync="showSearchFormFlag" :close-on-click-modal=false top="8vh" class="customDia"
              :center=true width="710px">
        <div class="forBox">
          <Form label-width="106px" ref="form" size="medium" :inline=true :model="formData">
            <FormItem label="销方名称:" prop="XFMC">
              <Input v-model="formData.XFMC" placeholder="请输入销方名称" style="width: 210px; height: 30px;"/>
            </FormItem>
            <FormItem label="销方税号:" prop="XFSH">
              <Input v-model="formData.XFSH" placeholder="请输入销方税号" style="width: 210px; height: 30px;"/>
            </FormItem>
       <!--     <FormItem label="银行账号:" prop="XFYHZH">
              <Input v-model="formData.XFYHZH" placeholder="请输入银行账号" style="width: 210px; height: 30px;"/>
            </FormItem>-->
            <div class="btnBox" style="width: 100%;display: flex;justify-content: center;">
              <Button type="default"  @click="searchDataClear" style="margin-left: 5px;">清空</Button>
              <Button type="primary"  @click="searchList">开始过滤</Button>
            </div>
          </Form>
        </div>
      </Dialog>
      <Dialog title="授权" :visible.sync="authFormFlag" :close-on-click-modal=false top="8vh" class="customDia" :before-close="authCovarianceItemClose"
              :center=true width="1120px">
        <div class="authBox">
          <el-row style="text-align: right">
            <Button type="primary"  @click="authUser" icon="el-icon-plus" style="margin-bottom: 10px;" v-if="userInfo.features.sellerPage.xfxzyhBtn">新增
            </Button>
          </el-row>
          <Table :data="authTableList" border v-loading="authTableLoad" class="customTable" style="min-width: 100%"
                 height="84%" ref="SellerInfoList">
            <TableColumn prop="idx" label="序号" width="50" align="center"/>
            <TableColumn prop="UUID" label="UUID" width="250" :show-overflow-tooltip=true align="center"/>
            <TableColumn prop="USERID" label="用户ID" width="260" :show-overflow-tooltip=true align="center"/>
            <TableColumn prop="NAME" label="用户名称" width="100" :show-overflow-tooltip=true align="center"/>
            <!--<TableColumn prop="XFMC" label="销方名称" width="200" :show-overflow-tooltip=true align="center"/>--><!--数据库用户和销方的中间表中没有存这个字段取消显示-->
            <TableColumn prop="XFXXID" label="销方ID" width="290" :show-overflow-tooltip=true align="center"/>
            <TableColumn label="操作" width="100" align="center">
              <template slot-scope="scope">
                <Button @click.native.prevent="authdeleteRow(scope.row)" type="danger" size="mini" v-if="userInfo.features.sellerPage.xfxzscBtn">删除</Button>
              </template>
            </TableColumn>
          </Table>
          <div class="paginbox" v-show="authpaginationData.total >= 0">
            <Pagination v-if="authPaginationType" @size-change="authhandleSizeChange"
                        @current-change="authhandleCurrentChange"
                        :hide-on-single-page="!(authpaginationData.total >=0)" :page-sizes="[10,30,50]"
                        :page-size="10"
                        layout="total, sizes, prev, pager, next, jumper" :total="authpaginationData.total"/>
          </div>
        </div>
      </Dialog>
      <Dialog title="用户授权" :visible.sync="authUserFormFlag" :close-on-click-modal=false top="8vh" class="customDia"
              :center=true width="500px">
        <div class="forBox">
          <Form label-width="106px" ref="authUserform" size="medium" :inline=true :model="authUserformData">
            <FormItem label="用户名称:" prop="USERID">
              <Select v-model="authUserformData.USERID" style="width: 210px; height: 30px;">
                <Option v-for="item in USERIDS" :key="item.USERID" :label="item.NAME" :value="item.USERID"/>
              </Select>
            </FormItem>
            <div class="btnBox" style="width: 100%;display: flex;justify-content: center;">
              <Button type="primary"  @click="saveAuthUser">保存</Button>
            </div>
          </Form>
        </div>
      </Dialog>
    </div>
    <Table :data="tableList" highlight-current-row border v-loading="tableLoad"  style="min-width: 100%"
           height="100%" ref="SellerInfoList">
      <TableColumn prop="idx" label="序号" width="50" align="center"/>
      <TableColumn prop="XFID" label="销方ID" width="280" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="PZID" label="配置ID" width="250" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="XFMC" label="销方名称" width="300" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="XFSH" label="销方税号" width="200" :show-overflow-tooltip=true align="center"/>
      <!--<TableColumn prop="XFYHZH" label="销方银行账号" width="300" :show-overflow-tooltip=true align="center"/>-->
      <TableColumn prop="KPR" label="开票人" width="80" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="SKR" label="收款人" width="80" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="FHR" label="复核人" width="80" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="CFYJ" label="拆分依据" width="80" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="ZPXE" label="专票（限额）" width="100" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="PPXE" label="普票（限额）" width="100" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="JPXE" label="卷票（限额）" width="100" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="DPXE" label="电子发票（限额）" width="120" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="SFHG" label="是否回滚" width="80" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="TS_EMAIL" label="推送邮箱账号" width="180" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="identity" label="诺诺identity" width="320" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="TS_EMAIL_URL" label="推送邮箱URL" width="180" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="TS_EMAIL_PASSWORD" label="邮箱密码" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="TS_EMAIL_SMTP" label="smtp" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="TS_EMAIL_POP3" label="pop3" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="KPFS" label="开票类型" width="80" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="terminalCode" label="终端" width="60" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="appId" label="应用标识" width="200" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="authorizationCode" label="纳税人授权码" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="requestCode" label="第三方平台编码" width="180" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="sigCode" label="注册码" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="password" label="开票软件密码" width="180" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="token" label="金税盘证书口令" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="dpfjh" label="默认电票分机号" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="jqbh" label="机器编码" width="250" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="serverUrl" label="A9服务器调用地址" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="CREATETIME" label="创建时间" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn prop="UPDATETIME" label="修改时间" width="150" :show-overflow-tooltip=true align="center"/>
      <TableColumn label="操作" width="405" align="center" fixed="right" v-if="userInfo.features.sellerPage.xfxgBtn || userInfo.features.sellerPage.xfscBtn || userInfo.features.sellerPage.xfsqBtn">
        <template slot-scope="scope">
          <Button @click.native.prevent="editRow(scope.row)" type="primary" size="mini" v-if="userInfo.features.sellerPage.xfxgBtn">修改</Button>
          <Button @click.native.prevent="deleteRow(scope.row)" type="danger" size="mini" v-if="userInfo.features.sellerPage.xfscBtn">删除</Button>
          <Button @click.native.prevent="authRow(scope.row)" type="primary" size="mini" v-if="userInfo.features.sellerPage.xfsqBtn">授权</Button>
          <Button @click.native.prevent="fjglRow(scope.row)" type="primary" size="mini" v-if="userInfo.features.sellerPage.xffjglBtn">分机管理</Button>
          <Button @click.native.prevent="sellerBankManagerRow(scope.row)" type="primary" size="mini" >信息管理</Button>
        </template>
      </TableColumn>
    </Table>
    <div class="paginbox" v-show="paginationData.total >= 0">
      <Pagination v-if="PaginationType" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                  :hide-on-single-page="!(paginationData.total >=0)" :page-sizes="[10,30,50]"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper" :total="paginationData.total"/>
    </div>

  </div>

</template>

<script>
    import Bus from "../../utils/bus";
    import {mapState} from 'vuex'
    import {
        Form,
        FormItem,
        Table,
        TableColumn,
        Button,
        Pagination,
        Dialog,
        Input,
        Select,
        Option
    } from 'element-ui'
    import axios from 'axios'

    export default {
        props: ['tableId', 'rowName', 'taxNo'],
        name: "SellerInfoList",
        data() {
            return {
                tableList: [],
                USERIDS: [],
                tableLoad: false,
                authTableList: [],
                fjglTableList: [],/*分机管理表格数据*/
                xfxxglTableList:[],/*销方信息管理表格数据*/
                authTableLoad: false,
                fjglTableLoad:false,/*分机号管理遮罩层*/
                xfxxglTableLoad:false,/*销方信息管理遮罩层*/
                editFlag: false,
                showSearchFormFlag: false,
                authFormFlag: false,
                authUserFormFlag: false,
                addCovarianceItemFlag: false,
                fjglFormFlag:false,/*分机管理页面*/
                xfxxglFormFlag:false,/*销方信息管理页面*/
                fjglCovarianceItemFlag:false,/*新增分机页面*/
                xfxxglCovarianceItemFlag:false,/*新增信息管理弹框*/
                submitBtnLoadFlag: false,
                fjglsubmitBtnLoadFlag: false,
                xfxxglsubmitBtnLoadFlag:false,/*新增销方信息提交转圈效果*/
                PaginationType: true,
                authPaginationType: true,
                fjglPaginationType: true,/*分机管理页*/
                xfxxglPaginationType:true,/*销方信息管理页*/
                paginationData: {
                    total: 0,
                    pageSize: 10,
                    pageNum: 1
                },
                authpaginationData: {
                    total: 0,
                    pageSize: 10,
                    pageNum: 1
                },
                fjglpaginationData: {/*分机管理*/
                    total: 0,
                    pageSize: 10,
                    pageNum: 1
                },
                xfxxglpaginationData: {/*销方信息管理*/
                    total: 0,
                    pageSize: 10,
                    pageNum: 1
                },
                tableHeight: 0,
                multipleSelection: [],
                formData: {
                    XFMC: '',
                    XFSH: '',
                    XFYHZH: ''
                },
                authUserformData: {},
                addData: {},
                addRules: {
                    XFMC: [
                        {required: true, message: '请输入销方名称', trigger: 'change'},
                        {required: true, message: '请输入销方名称', trigger: 'blur'},
                    ],
                    XFSH: [
                        {required: true, pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/, message: '15/17/18/20位数字或大写字母', trigger: 'change'},
                        {required: true, pattern: /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/, message: '15/17/18/20位数字或大写字母', trigger: 'blur'},
                    ],
                    KPR: [
                        {required: true, message: '请输入开票人', trigger: 'change'},
                        {required: true, message: '请输入开票人', trigger: 'blur'},
                    ],
                    ZP: [
                        {required: true, message: '请输入专票', trigger: 'change'},
                        {required: true, message: '请输入专票', trigger: 'blur'},
                    ],
                    PP: [
                        {required: true, message: '请输入普票', trigger: 'change'},
                        {required: true, message: '请输入普票', trigger: 'blur'},
                    ],
                    JP: [
                        {required: true, message: '请输入卷票', trigger: 'change'},
                        {required: true, message: '请输入卷票', trigger: 'blur'},
                    ],
                    DZFP: [
                        {required: true, message: '请输入电子发票', trigger: 'change'},
                        {required: true, message: '请输入电子发票', trigger: 'blur'},
                    ],
                    fjh: [
                        {required: true, message: '请输入分机号', trigger: 'change'},
                        {required: true, message: '请输入分机号', trigger: 'blur'},
                    ],
                    dpfjh: [
                        {required: true, message: '请输入默认电票分机号', trigger: 'change'},
                        {required: true, message: '请输入默认电票分机号', trigger: 'blur'},
                    ],
                    BY3: [
                        {required: true, message: '请输入开票类型', trigger: 'change'},
                        {required: true, message: '请输入开票类型', trigger: 'blur'},
                    ],
                    CFYJ: [
                        {required: true, message: '请输入拆分依据', trigger: 'change'},
                        {required: true, message: '请输入拆分依据', trigger: 'blur'},
                    ]
                },
                xfxxglData:{},/*销方信息管理数据*/
                fjglData:{},/*分机管理数据*/
                fjglRules: {
                    bumenid: [
                        {required: true, message: '请输入部门id', trigger: 'change'},
                        {required: true, message: '请输入部门id', trigger: 'blur'},
                    ],
                    zhongwen: [
                        {required: true, message: '请输入中文名称', trigger: 'change'},
                        {required: true, message: '请输入中文名称', trigger: 'blur'},
                    ],
                },
                xfxxglRules:{
                    XFJS: [
                        {required: true, message: '请输入销方账户类型', trigger: 'change'},
                        {required: true, message: '请输入销方账户类型', trigger: 'blur'},
                    ],
                    XFDZDH: [
                        {required: true, message: '请输入销方地址电话', trigger: 'change'},
                        {required: true, message: '请输入销方地址电话', trigger: 'blur'},
                    ],
                    XFYHZH: [
                        {required: true, message: '请输入销方银行账号', trigger: 'change'},
                        {required: true, message: '请输入销方银行账号', trigger: 'blur'},
                    ],
                },
            }

        },
        methods: {
            searchDataClear() {
                this.formData = {
                    XFMC: '',
                    XFSH: '',
                    XFYHZH: ''
                }
            },
            resetBack(){//重置
                this.searchDataClear()
                this.searchList()
            },
            handleSizeChange(val) {//处理页面显示条数
                this.paginationData.pageSize = val
                this.searchList()
                parent.postMessage({
                    scrollTop: 200
                }, '*')
            },
            handleCurrentChange(val) {//处理页面显示页数
                this.paginationData.pageNum = val
                this.searchList()
                window.scrollTo(0, 0)
            },
            authhandleSizeChange(val) {//处理授权页面显示条数
                this.authpaginationData.pageSize = val
                this.authRow()
                parent.postMessage({
                    scrollTop: 200
                }, '*')
            },
            authhandleCurrentChange(val) {//处理授权页面显示页数
                this.authpaginationData.pageNum = val
                this.authRow()
                window.scrollTo(0, 0)
            },
            fjglhandleSizeChange(val) {//处理分机管理页面显示条数
                this.fjglpaginationData.pageSize = val
                this.fjglRow()
                parent.postMessage({
                    scrollTop: 200
                }, '*')
            },
            fjglhandleCurrentChange(val) {//处理分机管理页面显示页数
                this.fjglpaginationData.pageNum = val
                this.fjglRow()
                window.scrollTo(0, 0)
            },
            xfxxglhandleSizeChange(val) {//处理销方信息管理页面显示条数
                this.xfxxglpaginationData.pageSize = val
                this.sellerBankManagerRow()
                parent.postMessage({
                    scrollTop: 200
                }, '*')
            },
            xfxxglhandleCurrentChange(val) {//处理销方信息管理页面显示页数
                this.xfxxglpaginationData.pageNum = val
                this.sellerBankManagerRow()
                window.scrollTo(0, 0)
            },
            settaxserver() {
                this.formData = {}
                this.addCovarianceItemFlag = true
            },
            // 新建与修改的提交
            submitFn(formName) {
                this.$refs[formName].validate((valid) => {
                    //debugger
                    if (valid) {
                        let map1 = {
                            XFID:this.addData.XFID ? this.addData.XFID:'',
                            XFMC: this.addData.XFMC ? this.addData.XFMC : '',
                            XFSH: this.addData.XFSH ? this.addData.XFSH : '',
                            XFYHZH: this.addData.XFYHZH ? this.addData.XFYHZH : '',
                            XFDZDH: this.addData.XFDZDH ? this.addData.XFDZDH : '',
                            terminalCode: this.addData.terminalCode ? this.addData.terminalCode : '',
                            appId: this.addData.appId ? this.addData.appId : '',
                            authorizationCode: this.addData.authorizationCode ? this.addData.authorizationCode : '',
                            requestCode: this.addData.requestCode ? this.addData.requestCode : '',
                            sigCode: this.addData.sigCode ? this.addData.sigCode : '',
                            password: this.addData.password ? this.addData.password : '',
                            token: this.addData.token ? this.addData.token : '',
                            fjh: this.addData.fjh ? this.addData.fjh : '',
                            BY2:this.addData.dpfjh ? this.addData.dpfjh : '',
                            jqbh: this.addData.jqbh ? this.addData.jqbh : '',
                            identity: this.addData.identity ? this.addData.identity : '',
                            BY3: this.addData.BY3 ? this.addData.BY3 : '',
                            serverUrl: this.addData.serverUrl ? this.addData.serverUrl : '',
                        }
                        let BY3 = {
                            "0": this.addData.ZP ? this.addData.ZP : '',
                            "2": this.addData.PP ? this.addData.PP : '',
                            "41": this.addData.JP ? this.addData.JP : '',
                            "51": this.addData.DZFP ? this.addData.DZFP : '',
                        }
                        let temp = JSON.stringify(BY3)
                        let map2 = {
                            BY3: temp,
                            BY2: this.addData.SFHG ? this.addData.SFHG : '',
                            BY1: this.addData.KPR ? this.addData.KPR : '',
                            SKR: this.addData.SKR ? this.addData.SKR : '',
                            FHR: this.addData.FHR ? this.addData.FHR : '',
                            TS_EMAIL: this.addData.TS_EMAIL ? this.addData.TS_EMAIL : '',
                            TS_EMAIL_URL: this.addData.TS_EMAIL_URL ? this.addData.TS_EMAIL_URL : '',
                            TS_EMAIL_PASSWORD: this.addData.TS_EMAIL_PASSWORD ? this.addData.TS_EMAIL_PASSWORD : '',
                            TS_EMAIL_POP3: this.addData.TS_EMAIL_POP3 ? this.addData.TS_EMAIL_POP3 : '',
                            TS_EMAIL_SMTP: this.addData.TS_EMAIL_SMTP ? this.addData.TS_EMAIL_SMTP : '',
                            CFYJ: this.addData.CFYJ ? this.addData.CFYJ : ''
                        }
                        //debugger
                        if (this.addData.editFlag) {
                            map1["UUID"] = this.addData.UUID
                            map2["UUID"] = this.addData.PZID
                        }
                        let list = []
                        list.push(map2)
                        list.push(map1)
                        this.submitBtnLoadFlag = true
                        axios.post(`/aisino/orderhead/${this.editFlag ? 'updateXfxx' : 'addXfxx'}`, JSON.stringify(list), {headers: {'Content-Type': 'application/json '}}).then(res => {
                            //debugger
                            if (res.data.success) {
                                this.$refs[formName].resetFields()
                                this.$message({
                                    message: `${this.editFlag ? '修改' : '添加'}成功`,
                                    type: 'success'
                                })
                                this.addCovarianceItemClose()
                                this.searchList()
                            } else {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: res.data.msg,
                                    customClass: 'zZindex'
                                })
                            }
                            this.submitBtnLoadFlag = false

                        })
                    } else {
                        return false
                    }
                })
            },
            addCovarianceItemClose() {
                this.addCovarianceItemFlag = false
                this.editFlag = false
                this.$refs['form'].resetFields()//将查询条件初始化
                for (let i in this.addData) {
                    this.addData[i] = ''
                }
                this.addData = {};
                this.submitBtnLoadFlag = false
            },
            authCovarianceItemClose(){
               this.authFormFlag=false
                this.authTableList=[]
            },
            fjglCovarianceItemClose(){//分机管理弹框关闭
                this.fjglFormFlag=false
                this.fjglData=[]
            },
            xfxxglCovarianceItemClose(){//销方信息弹框关闭
                this.xfxxglFormFlag=false
                this.xfxxglData=[]
            },
            xzxfxxquxiao(){/*新增销项信息取消按钮*/
                this.xfxxglCovarianceItemFlag=false
                this.xfxxglData=[]
                this.xfxxglsubmitBtnLoadFlag=false
            },
            xzfjquxiao(){
                this.fjglCovarianceItemFlag=false
                this.fjglData=[]
                this.fjglsubmitBtnLoadFlag=false
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            searchList() {
                //debugger
                let form = {
                    XFMC: this.formData.XFMC ? this.formData.XFMC : '',
                    XFSH: this.formData.XFSH ? this.formData.XFSH : '',
                    XFYHZH: this.formData.XFYHZH ? this.formData.XFYHZH : '',
                    limit: this.paginationData.pageSize,
                    page: this.paginationData.pageNum
                }
                this.tableLoad = true
                this.showSearchFormFlag = false
                axios.post(`/aisino/orderhead/getXfxxList`, form).then(response => {
                    //debugger
                    this.paginationData.total = response.data.count
                    const res = response.data
                    if (res.status == '0') {
                        if (res.data.length == '0') {
                            this.tableList = []
                        } else {
                            this.dealWithList(res.data)
                        }
                    } else {
                        this.tableList = []
                    }
                    /*this.searchDataClear()*/
                    this.tableLoad = false
                })
            },
            dealWithList(list) {
                //debugger
                list.forEach((item, idx) => {
                    item.idx = idx + 1
                })
                this.tableList = list
            },
            editRow(row) {//修改
                this.editFlag = true
                Bus.$emit('addDataStart', row)
                this.addCovarianceItemFlag = true
            },
            deleteRow(row) {//删除
                this.$confirm(`是否删除${row.XFMC}信息？`, `删除销方信息`, {
                    confirmButtonText: '确定',
                    center: true
                }).then(() => {
                    let map = {"PEIZHIID": row.PZID, "XFXXID": row.XFID}
                    axios.post(`/aisino/orderhead/deleteXfxx?`, JSON.stringify(map), {headers: {'Content-Type': 'application/json '}}).then(res => {
                        //debugger
                        if (res.data.success) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success',
                                customClass: 'zZindex'
                            })
                            this.searchList()
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                })
            },
            sellerBankManagerRow(row){//销方信息管理弹框获取数据
                Bus.$emit('xfxxglRowStart', row)
                this.xfxxglFormFlag=true
                let data = {
                    XFID: this.xfxxglData.XFID,
                    limit: this.xfxxglpaginationData.pageSize,
                    page: this.xfxxglpaginationData.pageNum
                }
                //console.log(JSON.stringify(data))
                this.xfxxglTableLoad=true
                axios.post(`/aisino/orderhead/selectXFJSByXFID`, data, {headers: {'Content-Type': 'application/json '}}).then(res => {
                    //debugger
                    if (res.data.status == '0') {
                        if (res.data.data.length == '0') {
                            this.xfxxglTableList = []
                        } else {
                            this.xfxxglpaginationData.total = res.data.count
                            let list = res.data.data
                            list.forEach((item, idx) => {
                                item.idx = idx + 1
                            })
                            this.xfxxglTableList = list
                        }
                    } else {
                        this.xfxxglTableList = []
                    }
                    this.xfxxglTableLoad = false
                })
            },
            xfxxdeleteRow(row){//删除销方地址电话银行账号信息
                this.$confirm(`是否删除信息${row.XFJS}？`, `删除信息`, {
                    confirmButtonText: '确定',
                    center: true
                }).then(() => {
                    //debugger
                    axios.post(`/aisino/orderhead/deleteXFJS?XFJS=${row.XFJS}`).then(res => {
                        //debugger
                        if (res.data.success) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success',
                                customClass: 'zZindex'
                            })
                            this.sellerBankManagerRow()
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                })
            },
            submitxfxxgl(formName){//新增销方地址电话银行账号
                this.$refs[formName].validate((valid) => {
                    //debugger
                    if (valid) {
                        let xfxxglFormData={
                            xiaofangid:this.xfxxglData.XFID,
                            XFJS:this.xfxxglData.XFJS,
                            XFDZDH:this.xfxxglData.XFDZDH,
                            XFYHZH:this.xfxxglData.XFYHZH,
                        }
                        //console.log(JSON.stringify(xfxxglFormData))
                        this.xfxxglsubmitBtnLoadFlag = true
                        axios.post(`/aisino/orderhead/addXFJS`, JSON.stringify(xfxxglFormData), {headers: {'Content-Type': 'application/json '}}).then(res => {
                            //debugger
                            if (res.data.success) {
                                this.$refs[formName].resetFields()
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                })
                                this.xfxxglCovarianceItemFlag=false
                                this.sellerBankManagerRow()
                            } else {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: res.data.msg,
                                    customClass: 'zZindex'
                                })
                            }
                            this.xfxxglsubmitBtnLoadFlag = false
                        })
                    }
                })
            },
            fjglRow(row){//分机管理
                //debugger
                Bus.$emit('fjglRowStart', row)
                this.fjglFormFlag=true
                let data = {
                    XFID: this.fjglData.XFID,
                    limit: this.fjglpaginationData.pageSize,
                    page: this.fjglpaginationData.pageNum
                }
                //console.log(data)
                this.fjglTableLoad = true
                axios.post(`/aisino/orderhead/selectfjByXFID`, data, {headers: {'Content-Type': 'application/json '}}).then(res => {
                    //debugger
                    if (res.data.status == '0') {
                        if (res.data.data.length == '0') {
                            this.fjglTableList = []
                        } else {
                            this.fjglpaginationData.total = res.data.count
                            let list = res.data.data
                            list.forEach((item, idx) => {
                                item.idx = idx + 1
                            })
                            this.fjglTableList = list
                        }
                    } else {
                        this.fjglTableList = []
                    }
                })
                this.fjglTableLoad = false
            },
            addfjh(){
                this.fjglCovarianceItemFlag=true
                this.fjglData.XFMC=this.fjglData.XFMC
                this.fjglData.XFID=this.fjglData.XFID
            },
            addxfxx(){//新增销方信息
                this.xfxxglCovarianceItemFlag=true
                this.xfxxglData.XFMC=this.xfxxglData.XFMC
                this.xfxxglData.XFID=this.xfxxglData.XFID
            },
            submitFjgl(formName){//提交新增分机
                this.$refs[formName].validate((valid) => {
                    //debugger
                    if (valid) {
                        let fjglFormData={
                            xiaofangid:this.fjglData.XFID,
                            bumenid:this.fjglData.bumenid,
                            zhongwen:this.fjglData.zhongwen,
                        }
                        //console.log(JSON.stringify(fjglFormData))
                        this.fjglsubmitBtnLoadFlag = true
                        axios.post(`/aisino/orderhead/addfj`, JSON.stringify(fjglFormData), {headers: {'Content-Type': 'application/json '}}).then(res => {
                            //debugger
                            if (res.data.success) {
                                this.$refs[formName].resetFields()
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success'
                                })
                                this.fjglCovarianceItemFlag=false
                                this.fjglRow()
                            } else {
                                this.$message({
                                    type: 'error',
                                    showClose: true,
                                    message: res.data.msg,
                                    customClass: 'zZindex'
                                })
                            }
                            this.fjglsubmitBtnLoadFlag = false
                        })
                    }
                })
            },
            fjhdeleteRow(row) {//删除分机
                this.$confirm(`是否删除分机${row.zhongwen}？`, `删除分机`, {
                    confirmButtonText: '确定',
                    center: true
                }).then(() => {
                    //debugger
                    axios.post(`/aisino/orderhead/deletefj?bumenid=${row.bumenid}`, {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).then(res => {
                        //debugger
                        if (res.data.success) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success',
                                customClass: 'zZindex'
                            })
                            this.fjglRow()
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                })
            },
            authRow(row) {//获取授权列表
                //debugger
                Bus.$emit('authRowStart', row)
                this.authFormFlag = true
                let data = {
                    XFXXID: this.authData.XFID,
                    limit: this.authpaginationData.pageSize,
                    page: this.authpaginationData.pageNum
                }
                this.authTableLoad = true
                axios.post(`/aisino/selectZJBList`, data, {headers: {'Content-Type': 'application/json '}}).then(res => {
                    //debugger
                    if (res.data.status == '0') {
                        if (res.data.data.length == '0') {
                            this.authTableList = []
                        } else {
                            this.authpaginationData.total = res.data.count
                            let list = res.data.data
                            list.forEach((item, idx) => {
                                item.idx = idx + 1
                            })
                            this.authTableList = list
                        }
                    } else {
                        this.authTableList = []
                    }
                    this.authTableLoad = false
                })

            },
            authdeleteRow(row) {//删除认证
                this.$confirm(`是否删除${row.NAME}用户的授权？`, `删除用户的授权`, {
                    confirmButtonText: '确定',
                    center: true
                }).then(() => {
                    //debugger
                    axios.post(`/aisino/orderhead/deleteRelation?UUID=${row.UUID}`, {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).then(res => {
                        //debugger
                        if (res.data.success) {
                            this.$message({
                                message: res.data.msg,
                                type: 'success',
                                customClass: 'zZindex'
                            })
                            this.authRow()
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                })
            },
            authUser() {
                this.authUserFormFlag = true
                let data = {
                    XFXXID: this.authData.XFID
                }
                axios.post(`/aisino/selectUersByUUID`, data, {headers: {'Content-Type': 'application/json '}}).then(res => {
                        //debugger
                        if (res.data.success) {
                            this.USERIDS = res.data.obj
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    }
                )
            },
            saveAuthUser() {
                this.$refs['authUserform'].validate((valid) => {
                    if (valid) {
                    //debugger
                        let map =Object.assign({}, this.authUserformData)
                        map["XFXXID"]=this.authData.XFID
                        axios.post(`/aisino/orderhead/addRelation`, JSON.stringify(map), {headers: {'Content-Type': 'application/json '}}).then(res => {
                        //debugger
                            if (res.data.success) {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'success',
                                    customClass: 'zZindex'
                                })
                                this.authUserformData={}
                                this.authUserFormFlag=false
                                this.authRow()
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                    }
                })
            }
        },
        components: {
            Form,
            FormItem,
            Table,
            TableColumn,
            Button,
            Pagination,
            Dialog,
            Input,
            Select,
            Option
        },
        created() {
            this.searchList()
        },
        computed: {
             ...mapState(['userInfo'])
        },
        mounted() {
            Bus.$on('addDataStart', row => {
                //debugger
                this.addData = {
                    XFMC: row.XFMC,
                    XFSH: row.XFSH,
                    XFYHZH: row.XFYHZH,
                    XFDZDH: row.XFDZDH,
                    KPR: row.KPR,
                    SKR: row.SKR,
                    FHR: row.FHR,
                    CFYJ: row.CFYJ == "拆分数量" ? "0" : (row.CFYJ == "拆分单价" ? "1" : ""),
                    TS_EMAIL: row.TS_EMAIL,
                    TS_EMAIL_URL: row.TS_EMAIL_URL,
                    TS_EMAIL_PASSWORD: row.TS_EMAIL_PASSWORD,
                    TS_EMAIL_SMTP: row.TS_EMAIL_SMTP,
                    TS_EMAIL_POP3: row.TS_EMAIL_POP3,
                    terminalCode: row.terminalCode == "B/S" ? "0" : (row.terminalCode == "C/S" ? "1" : ""),
                    appId: row.appId,
                    authorizationCode: row.authorizationCode,
                    requestCode: row.requestCode,
                    sigCode: row.sigCode,
                    password: row.password,
                    token: row.token,
                    fjh: row.fjh,
                    dpfjh:row.dpfjh,
                    jqbh: row.jqbh,
                    serverUrl: row.serverUrl,
                    ZP: row.ZPXE,
                    PP: row.PPXE,
                    JP: row.JPXE,
                    DZFP: row.DPXE,
                    BY3: row.KPFS == "组件开票" ? "0" : (row.KPFS == "诺诺开票" ? "1" : ""),
                    identity: row.identity,
                    SFHG: row.SFHG == "不回滚" ? "0" : (row.SFHG == "回滚" ? "1" : ""),
                    UUID: row.XFID,
                    PZID: row.PZID,
                    XFID: row.XFID,
                    editFlag: true
                }
            }),
                Bus.$on('authRowStart', row => {
                //debugger
                    this.authData = {
                        XFID: row.XFID
                    }
                }),
                Bus.$on('fjglRowStart', row => {
                    //debugger
                    this.fjglData = {
                        XFID: row.XFID,
                        XFMC:row.XFMC,
                    }
                }),
            Bus.$on('xfxxglRowStart', row => {
                //debugger
                this.xfxxglData = {
                    XFID: row.XFID,
                    XFMC:row.XFMC,
                }
            })
        },
        beforeDestroy() {
            Bus.$off('addDataStart');
            Bus.$off('authRowStart');
            Bus.$off('fjglRowStart');
            Bus.$off('xfxxglRowStart');
        },
        watch: {}
    }

</script>
<style scoped>

  .fnBtnBox {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 10px;
  }

  .forBox .bottom {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 0px;
  }

  .tabBox {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .paginbox {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 10px;
  }

  .zZindex {
    z-index: 3000 !important;
  }

  .tabBox .fnBtnBox .authBox {
    height: 37vw;
    overflow: auto;
  }
</style>
