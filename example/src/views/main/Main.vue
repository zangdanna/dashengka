<template>
  <div class="main-container">
    <div id="container"></div>
    <!-- <info-pannel toggle='左边信息'>
      <el-row class="text3">
        <el-col :span="7">
          <el-row><span style="font-size:20px">126666</span></el-row>
          <el-row>总车辆</el-row>
        </el-col>
        <el-col :span="1">
          <div class="vertical-line" style="background-color: #7e7e7e;height: 45px;width: 1px;"></div>
        </el-col>
        <el-col :span="7">
          <el-row><span style="font-size:20px">44</span></el-row>
          <el-row>当日活动车辆</el-row>
        </el-col>
        <el-col :span="1">
          <div class="vertical-line" style="background-color: #7e7e7e;height: 45px;width: 1px;"></div>
        </el-col>
        <el-col :span="7">
          <el-row><span style="font-size:20px">56</span></el-row>
          <el-row>当前活动车辆</el-row>
        </el-col>
      </el-row>
      <el-row style="height:10px"></el-row>
      <el-row style="font-size:16px">24小时车辆活跃数</el-row>
      <el-row></el-row>
    </info-pannel>
    <info-pannel toggle='右边信息' position='right' @toggle-click='handleToggleClick'></info-pannel> -->
    <!-- <div class="main-left"></div> -->
    <el-row>
      <el-col>
        <div class="grid-content bg-purple">
    <div class="main-count">
      <!-- <div class="number">
        51,377,064
        <span class="unit">公里</span>
      </div>
      <div class="small">全国车辆当日行驶里程数</div>
      <div class="number" style="margin-top:20px">
        95,432
        <span class="unit">人</span>
      </div>
      <div class="small">在线驾驶人员</div> -->
    </div>
    <!-- <div class="carFilter" ref="carSearch" :style="windowWidth < 1200 ? 'margin-right:0' : 'margin-right:340px'"> -->
    <div class="carFilter" ref="carSearch">
      <el-select popper-class="carSelect" size="small" v-model="choosedCity" placeholder="请选择">
        <el-option
          v-for="item in gc.cityCode"
          :key="item.code"
          :label="item.label"
                :value="item.code"
                class="pulldown">
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
      <el-autocomplete
        class="input-with-select"
        v-model="carno"
        size="small"
        :fetch-suggestions="querySearch"
              placeholder="车牌号"
        :trigger-on-focus="false"
        ref="carNoInput"
      >
              <el-select popper-class="carSelect" v-model="selectedFleet" slot="prepend" placeholder="请选择" class="pulldown">
                <el-option label="全部车" value="all" class="pulldown"></el-option>
                <el-option v-for="(fleetId, index) in fleets.filter(obj=>obj!=='all')" :key="index" :label="'车队'+fleetId" :value="fleetId" class="pulldown"></el-option>
        </el-select>
      </el-autocomplete>
            <el-button size="mini" @click="searchClick(carno, 'carNoInput')">搜索</el-button>
    </div>
    <!-- <div class="main-right"></div> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script src="./main.js"></script>

<style scoped>
  .main-container {
    width: 100%;
    height: 100%;
    min-height: 600px;
    padding: 20px 0px;
    position: relative;
  }
  .main-count {
    position: relative;
    margin-left: 20px;
    color: white;
    float: left;
  }
  .main-count .number {
    font-size: 32px;
    margin-top: 10px;
  }
  .main-count .unit {
    font-size: 12px;
  }
  .main-count .small {
    font-size: 14px;
  }
  #container {
    position: absolute;
    margin-top: -20px;
    width: 100%;
    height: 100%;
  }
  .main-container >>> .info {
    background: #1c3752c7;
    color: white;
    font-size: 15px;
    padding: 5px;
  }
  .main-container >>> .el-select .el-input {
    width: 90px;
  }
  .carFilter {
  float: left;
    transition: all 0.5s;
  margin-top: 5px;
  margin-left: 5px;
  }
  .main-container >>> .input-with-select {
    width: 320px;
}

.main-container >>> .el-input__inner {
  background-color: #ffffff;
  color: #7a7a7a;
  border-color: #e0e0e0;
  border-radius:5px;
}
.bg-purple {
  background-color: #f2f2f2;
}
.grid-content {
  border-radius: 5px;
  min-height: 40px;
  margin-top: 3px;
  margin-left: 20px;
  width: 490px;
  }
.pulldown {
  background-color: #ffffff;
  color: #7a7a7a !important;
}
.main-container >>> .el-input .el-input--suffix .el-input__inner {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius:5px;
  margin-left: -1px;
}
.el-button {
  background-color:  #0083fd;
  border-color: #0083fd !important;
  width: 55px;
  height: 32px;
  color: #ffffff;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #ebebeb !important;
}
.el-range-input, .el-input-group__prepend {
  background-color: #ffffff !important;
}
</style>

<style>
.carSelect .el-popper[x-placement^=bottom] .popper__arrow::after {
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #ffffff;
}
.carSelect .el-select-dropdown__list {
  list-style: none;
  padding: 6px 0;
  margin: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #ffffff !important;
}
.el-autocomplete-suggestion {
    background-color: #ffffff;
}
.el-autocomplete-suggestion li {
    color: #7a7a7a;
}
.el-autocomplete-suggestion li.highlighted, .el-autocomplete-suggestion li:hover {
    background-color: #b5b4b478;
}
.el-input-group__prepend {
    border-color: solid #e2e2e2;
}
.el-popper[x-placement^=bottom] .popper__arrow::after {
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color: #ffffff;
}
</style>
