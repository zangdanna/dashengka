<template>
  <div style="min-width: 900px">
    <el-container>
      <el-aside width="245px">
        <div class="home-container">
          <header>
            <nav>
              <el-row>
                <el-col>
                  <div class="nav-menu">
                    <el-menu
                      :default-active="defaultActive"
                      class="el-menu"
                      mode="vertical"
                      :router="true"
                      background-color="#0083fd"
                      text-color="#fff"
                      active-text-color="#92D050">
                        <div><span class="logon-icon">MaaS<br>Platform</span></div>
                        <div style="width:245px; border:1px solid #3ea1fd;"></div>
                        <div><span class="admin-icon" ><img src="../../assets/imgs/nav_user.png"/>&nbsp;&nbsp;Admin</span></div>
                        <div style="width:245px; border:1px solid #3ea1fd;"></div>
                        <el-menu-item index="/main"><span><img src="../../assets/imgs/nav_camera.png"/>&nbsp;&nbsp;实时监控</span></el-menu-item>
                        <el-submenu index="/meta" ref="dataref">
                          <template slot="title"><span><img src="../../assets/imgs/nav_DataNavi.png"/>&nbsp;&nbsp;数据平台管理&nbsp;&nbsp;</span></template>
                          <el-menu-item index="/meta/label" class="secondMenu"><span style="font-size: 14px;">导入数据格式管理</span></el-menu-item>
                          <el-menu-item index_todo="/meta/maintain" class="secondMenu"><span style="font-size: 14px;">数据维护</span></el-menu-item>
                        </el-submenu>
                        <el-submenu index="/history">
                          <template slot="title"><span style="font-size: 20px;"><img src="../../assets/imgs/nav_historyPath.png">&nbsp;&nbsp;行驶记录查询</span></template>
                          <el-menu-item index="/history/trip-history" class="secondMenu"><span style="font-size: 14px;">行驶轨迹再现</span></el-menu-item>
                          <el-menu-item index="/history/data" class="secondMenu"><span style="font-size: 14px;">行驶数据抽取</span></el-menu-item>
                        </el-submenu>
                        <el-menu-item index=""><img src="../../assets/imgs/nav_manageAnalysis.png">&nbsp;&nbsp;运营分析</el-menu-item>
                        <el-submenu index="/geofence">
                          <template slot="title"><span style="font-size: 20px;"><img src="../../assets/imgs/nav_fence.png">&nbsp;&nbsp;地理围栏</span></template>
                          <el-menu-item index="/geofence/monitorList" class="secondMenu"><span style="font-size: 14px;">监控一览</span></el-menu-item>
                          <el-menu-item index="/geofence/geofenceList" class="secondMenu"><span style="font-size: 14px;">围栏一览</span></el-menu-item>
                        </el-submenu>
                    </el-menu>
                    <!-- 发送测试数据 -->
                    <el-popover
                    placement="bottom"
                    width="570"
                    style="position:relative;top:-23px"
                    trigger="click">
                      <div class="send-trip-data">
                        <el-form :inline="true" :model="formData">
                          <el-form-item>
                            <el-select v-model="formData.case" :popper-append-to-body="false" size="mini" placeholder="选择数据">
                              <el-option v-for="item in caseOption" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item>
                            <el-button v-if="done" type="primary" size="mini" @click="sendTripData">发送数据</el-button>
                            <el-button v-else type="primary" size="mini" @click="cancleTripData">取消</el-button>
                          </el-form-item>
                          <el-form-item v-if="done && currentIndex === 0">
                            <span>未发送</span>
                          </el-form-item>
                          <el-form-item v-if="!done">
                            <span>正在发送数据</span>
                          </el-form-item>
                          <el-form-item v-if="!done">
                            <el-progress
                              :text-inside="true"
                              style="width:150px;margin-top:10px;"
                              :stroke-width="15"
                              :percentage="currentIndex/totalIndex*100"
                              :format="_ => currentIndex + '分钟/' + totalIndex + '分钟'"
                            ></el-progress>
                          </el-form-item>
                          <el-form-item v-if="done && totalIndex > 0">
                            <span style="color:#44d444">发送完成</span>
                          </el-form-item>
                        </el-form>
                      </div>
                      <el-button slot="reference" type="info" size="medium" style="margin-left:35px; margin-top:28px" round>实时数据</el-button>
                    </el-popover>
                  </div>
                  <!-- 发送测试数据 -->
                </el-col>
              </el-row>
            </nav>
          </header>
        </div>
      </el-aside>
      <!-- container -->
      <div class="container">
        <!-- main -->
        <!-- router -->
        <!-- <transition name="fade-in" mode="out-in"> -->
        <router-view></router-view>
        <!-- </transition> -->
      </div>
    </el-container>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'Home',
  data () {
    return {
      // trip测试数据
      caseOption: [],
      currentIndex: 0,
      totalIndex: 0,
      done: true,
      taskId: 0,
      fetchInterval: null,
      formData: {
        case: ''
      },
      defaultActive: this.$route.path
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.defaultActive = to.path
      if (to.path === '/trackline') {
        vm.defaultActive = '/main'
      }
      if (to.path === '/geofence/newMonitor') {
        vm.defaultActive = '/geofence/monitorList'
      }
      if (to.path === '/geofence/newGeofence') {
        vm.defaultActive = '/geofence/geofenceList'
      }
    })
  },
  created () {
    // trip测试数据
    request({
      url: '/api/iov/sim/v2/case',
      method: 'get'
    }).then(res => {
      this.caseOption = res.list
    })
  },
  methods: {
    // 发送trip测试数据
    sendTripData () {
      if (this.formData.case === '') {
        return
      }
      this.taskId = parseInt(Math.random() * 1000)
      request({
        url: `/api/iov/sim/v2/task/${this.taskId}`,
        method: 'post',
        data: {
          caseId: this.formData.case
        }
      }).then(res => {
        this.done = res.done
        this.totalIndex = parseInt(res.totalCount * (res.interval / 1000) / 60)
        this.currentIndex = parseInt(res.sendedCount * (res.interval / 1000) / 60)
        this.fetchInterval = setInterval(() => {
          request({
            url: `/api/iov/sim/v2/task/${this.taskId}`,
            method: 'get'
          }).then(res => {
            this.done = res.done
            this.totalIndex = parseInt(res.totalCount * (res.interval / 1000) / 60)
            this.currentIndex = parseInt(res.sendedCount * (res.interval / 1000) / 60)
            if (res.done) {
              clearInterval(this.fetchInterval)
            }
          })
        }, 60 * 1000)
      })
    },
    cancleTripData () {
      request({
        url: `/api/iov/sim/v2/task/${this.taskId}`,
        method: 'delete'
      }).then(res => {
        this.done = true
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.fetchInterval)
  }
}
</script>

<style>
.home-container {
  height: 100%;
  background-color: #0083fd;
  margin-left: -1px;
  width: 245px;
}
header {
  color: #e0e0e0;
  font-weight: 400;
}
header nav {
  height: 100%;
  line-height: 64px;
}
header .nav-menu,
header .logon-icon,
header .admin-icon {
  display: inline-block;
}
header .admin-icon {
  float:inherit;
  line-height: 64px;
  margin-right: 20px;
  font-size: 20px;
  color: #ffffff;
}
header .admin-icon img {
  padding-left: 10px;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
header .nav-menu {
  position: absolute;
  border: none;
}
header .logon-icon {
  height:160px;
  color: white;
  font-weight: bold;
  font-size: 38px;
  text-align: center;
  display: block;
  padding: 30px 30px 30px 20px;
  line-height:40px;
}
.container {
  background-color: #142433;
  width: 100%;
  margin-left: 3px;
  height: 969px;
}
.el-menu.el-menu--horizontal {
  border-bottom: none !important
}
.el-menu-item {
  font-size: 20px !important
}
.el-submenu__title {
  font-size: 20px !important
}
.send-trip-data >>> .el-form-item {
  margin-bottom: 0;
}
.send-trip-data >>> .el-progress-bar__innerText {
  color: white;
}
li.el-submenu .el-submenu__title{
 border-radius: 4px;
}
li.el-submenu.is-active.is-opened .el-submenu__title {
 background: #92D050 !important;
}
.el-submenu__title:hover {
  background: rgba(255,255,255,0.15) !important;
  color: #A0E853 !important;
}
</style>
<style scoped>
/* 光标移动到带有子菜单的一阶菜单颜色设置 */
/* .el-submenu__title:hover{
  background-color: #0083fd !important;
} */
/* 按钮点击时目录的颜色设置 */
.el-menu-item.is-active{
      background-color: #92D050 !important;
      color: #ffffff !important;
      margin: 40px,40px,40px,40px;
}
/* 光标移动到一阶目录和二阶目录的背景颜色设置 */
/* .el-menu-item:active{
  background-color: #0083fd !important;
}
*/
.el-menu-item:hover{
  background-color: #0083fd !important;
  color: #A0E853 !important;
}
.ul,
li,
body {
  margin-left: 10px;
  margin-right: 10px;
  padding: 0px;
}
.el-menu-item {
  border-radius: 4px;
}
.secondMenu.is-active{
  background-color: #0083fd !important;
  color: #A0E853 !important;
}
</style>
