<template>
  <div class="monitor">
    <info-pannel>
      <el-row>
        <el-col :span="19">
          <el-input style="width:100%" v-model="monitorSearch" size="small" placeholder="搜索监控名称"></el-input>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="4">
          <el-button type="primary" size="small" round @click="newMonitor">新增</el-button>
        </el-col>
      </el-row>
      <el-row style="height:15px"></el-row>
      <ul style="overflow: auto;max-height: calc(83vh - 60px);">
        <li v-for="(monitor, index) in monitorList" :key="monitor.id" v-show="searchMonitor(monitor.name)">
          <el-card style="cursor: pointer" @click.native="getMonitor(monitor, index, monitor.type)">
            <el-row>
              <el-col :span="20">
                <el-radio v-model="selectedMonitor" :label="index">{{monitor.name}}</el-radio>
              </el-col>
              <el-col :span="2" v-show="selectedMonitor === index">
                <div style="color:#409eff;cursor: pointer"><i class="el-icon-edit" @click.stop="editMonitor(monitor.id)"></i></div>
              </el-col>
              <el-col :span="2" v-show="selectedMonitor === index">
                <el-popconfirm title="确定要删除吗？" @onConfirm="deleteMonitor(monitor.id)">
                  <div slot="reference" style="color:#f56c6c;cursor: pointer"><i class="el-icon-delete"></i></div>
                </el-popconfirm>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">监控车辆数:{{monitor.monCarSum}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">应用围栏:{{monitor.fenceName}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">报警类型:{{monitor.type | formatType}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">应用时间:{{monitor.applyStart | dateFormat('YYYY-mm-dd')}} - {{monitor.applyEnd | dateFormat('YYYY-mm-dd')}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">创建时间:{{monitor.createAt | dateFormat('YYYY-mm-dd HH:MM:SS')}}</el-col>
            </el-row>
          </el-card>
          <el-row style="height:10px"></el-row>
        </li>
      </ul>
    </info-pannel>
  </div>
</template>

<script>
import infoPannel from '@/components/infoPannel'
import {carMarker, drawCityLine, updateCarMarker, createMapLine} from '@/utils'
import {fetchMonitor, deleteMonitor, fetchGeofence} from '@/api'
import init from './mixins/init'
import _ from 'lodash'

export default {
  mixins: [init],
  data () {
    return {
      monitorSearch: '',
      selectedMonitor: '1',
      interval: null,
      vehicleMarkers: {},
      monitorList: [],
      currentGeoType: '',
      path: [],
      lineOffset: ''
    }
  },
  components: {infoPannel},
  created () {
    fetchMonitor().then(res => {
      this.monitorList = res.reverse()
    })
  },
  filters: {
    formatType: function (val) {
      const type = {
        1: '驶入报警',
        2: '驶出报警'
      }
      return type[val]
    }
  },
  methods: {
    editMonitor (monId) {
      this.$store.commit('SET_INIT', true)
      this.$router.push({name: 'newMonitor', query: {monId: monId}})
    },
    deleteMonitor (monId) {
      deleteMonitor(monId).then(res => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.$store.commit('CLEAR_EVENT')
        this.selectedMonitor = '1'
        this.map.clearMap()
        fetchMonitor().then(res => {
          this.monitorList = res.reverse()
        })
      })
    },
    getMonitor (monitor, index, type) {
      if (this.selectedMonitor === index) { return }
      this.selectedMonitor = index
      this.map.clearMap()
      fetchGeofence({geoId: monitor.fenceId}).then(res => {
        this.currentGeoType = res.type
        this.lineOffset = res.lineOffset
        this.$store.commit('CLEAR_EVENT')
        this.$store.commit('SET_RIGHTPANNEL', true)
        if (res.type === 'line') {
          let path = res.polyline.split(';').map(item => item.split(','))
          const line = createMapLine(path, this.gc.map.strokeColor, true)
          this.map.add(line)
          this.map.setFitView()
          this.path = path
        }
        if (res.type === 'district') {
          drawCityLine(this.map, [], monitor.districtAdcode, true)
          this.path = []
        }
        clearInterval(this.interval)
        let to = new Date().getTime()
        this.setVehiclePosition({monId: monitor.id, from: to - 2 * 60000, to: to - 60000}, true, type)
        this.interval = setInterval(_ => {
          let to = new Date().getTime()
          this.setVehiclePosition({monId: monitor.id, from: to - 2 * 60000, to: to - 60000}, false, type)
        }, 60 * 1000)
      })
    },
    newMonitor () {
      this.$store.commit('SET_INIT', true)
      this.$router.push({name: 'newMonitor'})
    },
    searchMonitor (monitorName) {
      return monitorName.indexOf(this.monitorSearch) !== -1
    },
    setVehiclePosition (param, init, type) {
      this.$store.dispatch('getVehicleMonitor', param).then(list => {
        for (let vehicle of list) {
          if (vehicle.tripList.length === 0) {
            continue
          }
          let trip = _.takeRight(vehicle.tripList, 60)
          let events = [vehicle.events.pop()].filter(item => item)
          trip = this.handlePath(trip, events, vehicle.carNo).trip
          let firstPoint = trip[0]
          // this.updateTime = _.last(trip).recordAt
          // 地图上添加car marker
          if (init) {
            const marker = carMarker.bind(this)([firstPoint.lng, firstPoint.lat], firstPoint.eventFlg, vehicle.vin, type)
            this.$store.commit('UPDATE_EVENT', {carNo: vehicle.carNo, start: events.length > 0 ? events[0].startAt : '-', eventFlg: firstPoint.eventFlg})
            marker[0].on('moving', e => {
              let currentData = e.target.dataSet[e.passedPath.length - 1]
              setTimeout(() => { this.vehicleMarkers[e.target.carNo][1].moveTo(e.target.getPosition(), 1000) }, 1)
              if (!currentData) return
              const currentEvent = currentData.eventFlg
              if (e.target.eventFlg !== currentEvent) {
                console.log(currentEvent)
                e.target.eventFlg = currentEvent
                updateCarMarker(this.vehicleMarkers[e.target.carNo], currentEvent)
                let start = currentData.recordAt
                this.$store.commit('UPDATE_EVENT', {carNo: e.target.carNo, start: start, eventFlg: currentEvent})
              }
            })
            marker[0].dataSet = trip
            marker[0].eventFlg = firstPoint.eventFlg
            marker[0].carNo = vehicle.carNo
            this.vehicleMarkers[vehicle.carNo] = marker
            this.map.add(marker)
            this.map.setFitView()
          }
          let path = []
          let speed = 0
          trip.map((point, index) => {
            path.push([point.lng, point.lat])
            speed += point.speed
          })
          this.vehicleMarkers[vehicle.carNo][0].dataSet = trip
          // const carCurrentPosition = this.vehicleMarkers[vehicle.carNo][0].getPosition()
          this.vehicleMarkers[vehicle.carNo][0].moveAlong(path, parseInt(speed / 60))
        }
      })
    },
    handlePath (trip, events, carNo) {
      if (this.currentGeoType === 'line') {
        trip.map(point => {
          point.eventFlg = false
          let distance = Math.round(AMap.GeometryUtil.distanceToLine([point.lng, point.lat], this.path))
          if (distance > this.lineOffset) {
            point.eventFlg = true
          }
        })
      }
      if (this.currentGeoType === 'district') {
        events.map(event => {
          event.carNo = carNo
          trip.map(point => {
            point.eventFlg = false
            if (event.startAt <= point.recordAt && point.recordAt <= event.endAt) {
              point.eventFlg = true
            }
          })
        })
      }
      return {trip, events}
    }
  },
  beforeDestroy () {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}
</script>

<style scoped>
.monitor {
  position: absolute;
  height: 100%;
  top: 60px;
}
.monitor >>> .el-card__body {
  padding: 10px;
}
</style>
