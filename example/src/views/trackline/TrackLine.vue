<template>
  <div style="width:100%;height:100%">
     <div :class="windowWidth < 1200 ? 'main-right ntt-panel main-right-hide' : 'main-right ntt-panel'">
      <div class="drawer drawer-right"  @click="drawerToggle"><i :class="windowWidth < 1200 ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>{{carDetailShowState}}</div>
      <el-row>
        <!-- <el-col :span="18"><div>{{carInfo.carNo||''}}</div></el-col> -->
        <el-tooltip class="btn-tip" effect="dark" placement="right-start">
          <div slot="content" :style="eventType&&(eventType!=='noraml')?'float:right;color:red':'float:left;color:green'">{{carState}}</div>
          <el-button><div>{{carInfo.carNo||''}}</div></el-button>
        </el-tooltip>
        <!--
        <el-col :span="12"><div :style="eventType&&(eventType!=='noraml')?'float:right;color:red':'float:left;color:white'">{{carState}}</div></el-col>
        -->
      </el-row>
      <el-row style="height:10px"></el-row>
      <el-row><el-col :span="24"><div>司机名称：{{carInfo.driverName||''}}</div></el-col></el-row>
      <el-row><el-col :span="24"><div>联系电话：{{carInfo.phoneNum||''}}</div></el-col></el-row>
      <el-row><el-col :span="24"><div>当前速度：{{currentSpeed}}km/h</div></el-col></el-row>
      <el-row><el-col :span="24"><div>驾驶时长：{{driveTime}}</div></el-col></el-row>
      <el-row><el-col :span="24"><div>所在位置：{{address}}</div></el-col></el-row>
      <el-row><el-col :span="24"><div>更新时间：{{updateTime}}</div></el-col></el-row>
      <!-- <el-divider style="background-color:black" content-position="center">车辆信息</el-divider> -->
      <el-divider style="background-color:#ffffff">车辆信息</el-divider>
      <el-table class="carinfo-tbl"
        :data="lableData"
        border
        size="mini"
        max-height="240"
        :cell-style="()=>'background-color:#666666;border-color:#a2a2a2'"
        :show-header="true"
        style="width: 100%; color: #a2a2a2;">
        <el-table-column
          prop="showAlias"
          label="项目"
          :resizable="true"
          width="120">
        </el-table-column>
        <el-table-column
          prop="value"
          label="值"
          :resizable="false">
        </el-table-column>
      </el-table>
      <!--
      <el-row>
        <el-col :span="24">
          <div
            class="router_title"
            style="text-align:center;cursor:pointer;"
            >月次车辆行驶信息
          </div>
        </el-col>
      </el-row>
      -->
      <div>
        <!--
        <el-row style="height:15px"></el-row>
        <el-row style="font-size:16px">
          <el-col :span="9"><div>车辆基本信息</div></el-col>
          <el-col :span="15"></el-col>
        </el-row>
        -->
        <el-row style="height:10px"></el-row>
        <el-divider>月次车辆行驶信息</el-divider>
        <el-row>
          <el-col :span="8"><div>行驶里程(km)</div></el-col>
          <el-col :span="4"><div>{{carReport.length > 0 ? carReport[0].odoCnt : 0}}</div></el-col>
          <el-col :span="12"><div class="title_sec">同比上月<div :class="lastOdoComp.class||''">{{lastOdoComp.value||0}}%</div></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="8"><div>行驶时长(h)</div></el-col>
          <el-col :span="4"><div>{{carReport.length > 0 ? (carReport[0].timeCnt/3600000).toFixed(3) : 0}}</div></el-col>
          <el-col :span="12"><div class="title_sec">同比上月<div :class="lastTimeComp.class||''">{{lastTimeComp.value||0}}%</div></div></el-col>
        </el-row>
        <el-row style="height:10px"></el-row>
        <el-row style="font-size:16px">
          <el-col :span="8"><div>违规信息</div></el-col>
          <el-col :span="16"></el-col>
        </el-row>
        <el-row style="height:10px"></el-row>
        <el-row><el-col :span="24"><pie-chart id="pie-chart" :data="chartData"></pie-chart></el-col></el-row>
        <el-row style="height:10px"></el-row>
        <!-- <el-row><el-col :span="24"><div class="router_title" style="float:right">查看轨迹&nbsp;<i class="el-icon-d-arrow-right"/></div></el-col></el-row> -->
      </div>
    </div>
    <div id="carline">
    </div>
  </div>
</template>

<script src="./trackline.js"></script>

<style>
.carinfo-tbl.el-table thead tr,.carinfo-tbl.el-table thead tr th{
  background-color: #666666;
}
.carinfo-tbl.el-table thead tr th.is-leaf {
  border-bottom: 2px solid #a2a2a2;
}
.carinfo-tbl.el-table thead tr th:first-child {
  border-right: 2px solid #a2a2a2 !important;
}
.carinfo-tbl tbody tr td:first-child {
  border-right: 2px solid !important;
}
.carinfo-tbl th.gutter:last-of-type {
    border-bottom: 2px solid #a2a2a2 !important;
    border-bottom-width: 1px;
}
</style>

<style scoped>
#carline {
  width: 100%;
  height: 100%;
}
.main-left {
  left: 20px;
}
.main-right {
  right: 20px;
}
.el-icon-bottom{
  color: red
}
.el-icon-top{
  color: lime
}
.el-divider {
    background-color: #000000;
    position: relative;
}
.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
}
.el-divider__text {
    position: absolute;
    background-color: #666666;
    padding: 0 10px;
    color: #FCFDFE;
}
.el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #0083fd;
    border: 1px solid #ffffff;
    color: #FBFCFE;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 10px 10px;
    font-size: 25px;
    border-radius: 5px;
}
.el-table--border, .el-table--group {
    border: 1px solid #a2a2a2;
}
.drawer-right {
  padding-left: 1px;
  padding-top: 26px;
}
.ntt-panel {
  height: 934px;
  max-height: 100%;
  top: 21px;
}
.main-right {
  right: 0px;
}
</style>
