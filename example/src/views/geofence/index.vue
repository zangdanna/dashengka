<template>
  <div style="width:100%;height:100%">
    <div id="geofence_map" style="width:100%;height:100%"></div>
    <info-pannel v-show="this.$store.state.geofence.rightPannel" position="right" style="top: 80px">
      <el-row style="font-size:16px">
        <el-col :span="18">违规事件报警信息</el-col>
        <el-col :span="6"><div style="float:right">{{eventMonitorList.length}}辆</div></el-col>
      </el-row>
      <el-row style="height:10px"></el-row>
      <el-table :data="eventMonitorList" size="mini" :header-cell-style="{background:'#1e3349'}" :cell-style="()=>'background:#1e3349'">
        <el-table-column label="车牌号" prop="carNo"></el-table-column>
        <el-table-column label="开始时间" width="120" prop="start"></el-table-column>
        <el-table-column label="">
          <template slot-scope=""><div style="color:red;font-size:16px;"><i class="el-icon-warning"></i></div></template>
        </el-table-column>
      </el-table>
    </info-pannel>
    <router-view v-if="mapLoaded"></router-view>
  </div>
</template>

<script>
import infoPannel from '@/components/infoPannel'

export default {
  data () {
    return {
      mapLoaded: false,
      map: null
    }
  },
  components: {infoPannel},
  computed: {
    eventMonitorList () {
      return this.$store.state.geofence.eventMonitorList
    }
  },
  created () {
    this.$store.commit('SET_RIGHTPANNEL', false)
  },
  mounted () {
    const map = new AMap.Map('geofence_map', {
      mapStyle: this.gc.map.mapStyle,
      zoom: 11,
      center: [120.307767, 31.670237],
      viewMode: '3D'
    })
    this.map = map
    AMap.plugin(['AMap.Scale'], function () {
      map.addControl(new AMap.Scale())
    })
    map.on('complete', _ => {
      this.mapLoaded = true
      this.$store.commit('SET_MAP', map)
    })
  },
  beforeDestroy () {
    if (this.map) {
      this.map.destroy()
    }
  }
}
</script>

<style scoped>

</style>
