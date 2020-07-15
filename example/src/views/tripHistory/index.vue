<template>
  <div class="main-container">
    <div id="history_map"></div>
    <div class="search">
      <el-row style="margin-top:-7px">
        <el-col :span="7">
          <el-autocomplete
            size="small"
            v-model="carNo"
            :fetch-suggestions="vinSearch"
            placeholder="请输入车牌号"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
        </el-col>
        <el-col :span="14" style="margin-left:-5px">
          <el-date-picker
            v-model="dateRange"
            size="small"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <!-- <el-tooltip popper-class="btn-tip" :enterable="false" :open-delay="1000" content="查询" placement="bottom-start">
            <el-button :loading="tripLoading" size="small" @click="getAllTripsByVin" icon="el-icon-search" circle></el-button>
          </el-tooltip> -->
          <el-button :loading="tripLoading" style="margin-left:59px;" size="small" @click="getAllTripsByVin">搜索</el-button>
        </el-col>
        <el-col :span="1">
          <!-- <el-tooltip popper-class="btn-tip" :enterable="false" :open-delay="1000" content="重置" placement="bottom-start">
            <el-button style="margin-left:-20px;" @click="refresh" size="small" icon="el-icon-refresh-left" circle></el-button>
          </el-tooltip> -->
          <el-button style="margin-left:70px;" @click="refresh" size="small">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div ref="nttPanel" v-show="tripList.length > 0" class="trip_his ntt-panel">
      <el-row class="text1"><el-button class="test">{{carInfo.carNo||''}}</el-button><i class="el-icon-close"  style="margin-left:85px;font-size:23px;"></i></el-row>
      <el-row style="height:10px"></el-row>
      <el-row>
      <el-col :span="8" class="text2"><div style="font-size: 4px;">司机名称</div></el-col>
      <el-col :span="8"><div style="font-size: 4px;margin-left: 10px;">{{carInfo.driverName||''}}</div></el-col>
      </el-row>
      <el-row>
      <el-col :span="8" class="text2"><div style="font-size: 4px;">联系电话</div></el-col>
      <el-col :span="8"><div style="font-size: 4px;margin-left: 10px;">{{carInfo.phoneNum||''}}</div></el-col>
      </el-row>
      <el-divider style="background-color:#000000"></el-divider>
      <!--<el-row class="text1">行程信息</el-row>-->
      <!-- <el-scrollbar style="width: 100%;height: 100%;" > -->
      <div ref="tripPanel" id="trip-panel" style="overflow:auto;height:auto">
        <el-row v-for="(item, index) in tripList" :key="index" style="padding-bottom:5px;cursor:pointer">
          <el-popover
            placement="right-start"
            width="300"
            trigger="manual"
            :popper-options="{boundariesElement: 'viewport', removeOnDestroy: true}"
            :value="popoverIndex===index && item.eventSum.length>0">
            <el-row class="text1"><span style="float: right;cursor: pointer;" @click="popoverIndex = ''"><i class="el-icon-close"></i></span></el-row>
            <el-tabs v-if="popoverIndex===index && item.eventSum.length>0" :stretch="true" value="event0" @tab-click="handleTabClick">
              <el-tab-pane
                v-for="(event, index) in item.eventSum"
                :key="index"
                :label="gc.eventMap[event.eventType]"
                :name="'event'+index">
                <el-row >
                  <el-col class="text1" :span="12">{{gc.eventMap[event.eventType]}}</el-col>
                  <el-col :span="12"><div style="float:right;color:red"><span class="text1">{{event.eventCount}}</span><span>&nbsp;次</span></div></el-col>
                </el-row>
                <div v-scrollBar style="overflow:auto;max-height:400px;position:relative">
                  <el-card
                    v-for="(eitem, eidx) in events[event.eventType]"
                    :key="eidx" shadow="always"
                    style="cursor:pointer"
                    @click.native="checkEvent(eitem.eventType, eitem.startAddr)">
                    <el-row v-if="event.eventType===0">{{gc.eventMap[eitem.eventType]}}</el-row>
                    <el-row class="text2">
                      <el-col :span="12">{{eitem.startAddrMap}}</el-col>
                      <el-col :span="12"><div class="text1" style="float:right;color:red">{{eitem.speedAvg}}km/h&nbsp;<el-tag size="mini">平均</el-tag></div></el-col>
                    </el-row>
                    <el-row class="text3">{{eitem.startAt}} - {{eitem.endAt}}</el-row>
                    <!-- <el-row class="text3">平均车速：{{eitem.speedAvg}}km/h</el-row> -->
                  </el-card>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-card slot="reference" @click.native="getTripDetail(index, item.tripCnt)" shadow="always">
              <el-row class="text2">{{item.startAddr||'-'}} - {{item.endAddr||'-'}}</el-row>
              <el-row class="text3">
                <el-col :span="18">{{item.startAt}} - {{item.endAt}}</el-col>
                <el-col :span="6"><div style="float:right">{{item.timeCnt}}&nbsp;<i class="el-icon-time"></i></div></el-col>
              </el-row>
              <el-row class="text3">平均车速：{{item.speedAvg}}km/h</el-row>
              <el-row class="text3">行驶里程：{{item.odoCnt}}km</el-row>
              <el-row class="text3">
                <div v-for="(event, index) in item.eventSum" :key="index">
                  <el-col :span="6">
                    <el-row style="color:red"><span class="text1">{{event.eventCount}}</span><span>&nbsp;次</span></el-row>
                    <el-row>{{gc.eventMap[event.eventType]}}</el-row>
                  </el-col>
                  <el-col v-if="index !== item.eventSum.length-1" :span="1">
                    <div class="vertical-line"></div>
                  </el-col>
                </div>
              </el-row>
            </el-card>
          </el-popover>
        </el-row>
      </div>
      <!-- </el-scrollbar> -->
    </div>
  </div>
</template>

<script>
import { formatSeconds, dateFormat, handlePathData, eventMark, startEndMarker, createMapLine, getAddrByLnglat } from '@/utils'
import { Message } from 'element-ui'
import _ from 'lodash'

export default {
  data () {
    return {
      map: null,
      visible: false,
      vin: '',
      carNo: '',
      dateRange: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date()],
      suggestCar: {},
      tripList: [],
      events: {},
      popoverIndex: '',
      checkMark: null,
      tripLoading: false
    }
  },
  computed: {
    carInfo () {
      return this.$store.state.track.carInfo
    }
  },
  created () {
    this.$store.dispatch('getVehicleStatus').then(res => {
      res.list.map(car => {
        this.suggestCar[car.carNo] = car
      })
    })
  },
  mounted () {
    this.map = new AMap.Map('history_map', {
      mapStyle: this.gc.map.mapStyle,
      zoom: 11,
      center: [120.307767, 31.670237],
      viewMode: '3D'
    })
  },
  updated () {
    let tripPanel = this.$refs.tripPanel
    let nttPanel = this.$refs.nttPanel
    if (tripPanel.offsetHeight > (nttPanel.offsetHeight - 100)) {
      tripPanel.style.height = nttPanel.offsetHeight - 200 + 'px'
    }
  },
  methods: {
    vinSearch (queryString, cb) {
      let suggestCar = _.keys(this.suggestCar)
      let results = queryString ? suggestCar.filter(this.createFilter(queryString)) : []
      // 调用 callback 返回建议列表的数据
      cb(_.map(results, (item) => { return { value: item, car: this.suggestCar[item] } }))
    },
    createFilter (queryString) {
      return (suggestCar) => {
        return (suggestCar.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      this.vin = item.car.vin
    },
    handleTabClick () {
      setTimeout(_ => {
        window.dispatchEvent(new Event('resize'))
      }, 1)
    },
    refresh () {
      this.carNo = ''
      this.dateRange = [new Date(new Date().setDate(new Date().getDate() - 1)), new Date()]
      this.tripList = []
      this.events = {}
      this.popoverIndex = ''
      this.map.clearMap()
      this.$store.commit('SET_CAR_INFO', {})
    },
    getAllTripsByVin () {
      // 获取所有trip
      if (this.suggestCar[this.carNo]) {
        this.vin = this.suggestCar[this.carNo].vin
      } else {
        this.vin = ''
      }
      if (this.vin === '') {
        Message({
          message: '车牌号不正确!',
          type: 'warning',
          duration: 1 * 1000
        })
        return
      }
      let fromTo = {}
      if (this.dateRange) {
        fromTo.from = this.dateRange[0].getTime()
        fromTo.to = this.dateRange[1].getTime()
      }
      this.tripLoading = true
      this.$store.dispatch('getCarInfo', this.vin)
      this.$store.dispatch('getTrackLineData', {vin: this.vin, ...fromTo}).then(async res => {
        let tripList = []
        let threeEvent = [2, 3, 4]
        for (let trip of _.reverse(res.list)) {
          if (trip.startLng && trip.startLng !== 0) {
            const {addr: startAddr} = await getAddrByLnglat([trip.startLng, trip.startLat])
            const {addr: endAddr} = await getAddrByLnglat([trip.endLng, trip.endLat])
            let threeEventNum = 0
            let nEventSum = []
            trip.eventSum.map(event => {
              if (threeEvent.indexOf(event.eventType) !== -1) {
                threeEventNum += event.eventCount
              } else {
                nEventSum.push(event)
              }
            })
            if (threeEventNum !== 0) {
              nEventSum.push({eventType: 0, eventCount: threeEventNum})
            }
            tripList.push({
              ...trip,
              startAddr: startAddr[1] + startAddr[2],
              endAddr: endAddr[1] + endAddr[2],
              eventSum: nEventSum,
              startAt: dateFormat('mm-dd HH:MM', new Date(trip.startAt)),
              endAt: dateFormat('mm-dd HH:MM', new Date(trip.updateAt)),
              timeCnt: formatSeconds(trip.timeCnt)
            })
          }
        }
        this.tripList = tripList
        this.tripLoading = false
      })
    },
    getTripDetail (index, tripCnt) {
      this.$store.dispatch('getTrackLineData', {vin: this.vin, tripCnt: tripCnt}).then(async res => {
        this.map.clearMap()
        let {data: pathList, events} = handlePathData(res.list, res.events)
        // format events
        const popoverEvent = {0: [], 1: [], 5: []}
        for (let event of events) {
          const {addr} = await getAddrByLnglat(event.startAddr)
          let evevtType = event.eventType
          if ([2, 3, 4].indexOf(evevtType) !== -1) {
            evevtType = 0
          }
          popoverEvent[evevtType].push({
            ...event,
            startAddrMap: addr[2],
            startAt: dateFormat('HH:MM', new Date(event.startAt)),
            endAt: dateFormat('HH:MM', new Date(event.endAt))
          })
        }
        this.events = popoverEvent
        // format trip path
        let tripPath = []
        let tripPathItem = []
        let itemFlg = pathList[0] ? pathList[0].eventType : ''
        let tempFlg = itemFlg
        for (let item of pathList) {
          tripPathItem.push([item.lng, item.lat])
          itemFlg = item.eventType
          if (tempFlg !== itemFlg) {
            tripPath.push([tripPathItem, tempFlg])
            tripPathItem = [[item.lng, item.lat]]
            tempFlg = itemFlg
          }
        }
        tripPath.push([tripPathItem, tempFlg])

        tripPath.map(path => {
          let color = this.gc.map.strokeColor
          this.map.add(createMapLine(path[0], color))
          if (path[1]) {
            // 添加events窗口信息
            const mark = eventMark(this.gc.eventMap[path[1]], path[0][0])
            this.map.add(mark)
          }
        })
        const startEndMark = startEndMarker(
          [pathList[0].lng, pathList[0].lat],
          [pathList[pathList.length - 1].lng, pathList[pathList.length - 1].lat]
        )
        this.map.add(startEndMark)
        this.map.setFitView()
        this.popoverIndex = index
      })
    },
    checkEvent (type, addr) {
      const eventType = this.gc.eventMap[type]
      if (this.checkMark) {
        this.map.remove(this.checkMark)
      }
      this.checkMark = eventMark(eventType, addr, 'tip-checked')
      this.map.add(this.checkMark)
    }
  },
  beforeDestroy () {
    this.refresh()
    if (this.map) {
      this.map.destroy()
    }
  }
}
</script>

<style scoped>
#history_map {
  width: 100%;
  height: 100%;
}
.trip_his {
  width: 250px;
  top: 85px;
  height: 750px;
  left: 248px;
}
.search {
  position: absolute;
  font-size: 14px;
  width:756px;
  height: 47px;
  margin-top: 2px;
  line-height: 25px;
  padding: 15px;
  z-index: 2;
  top: 18px;
  left: 252px;
  background-color: #f2f2f2;
  border-radius: 4px;
  margin-left: 14px;
}
.vertical-line {
    background-color: #7e7e7e;
    height: 45px;
    width: 1px;
}
.main-container {
    width: 100%;
    height: 100%;
}
.main-container >>> .el-input__inner  {
  background-color: #ffffff;
  margin-left: -5px;
  padding-left: 10px;
  color: #7a7a7a;
  border-color: #e2e2e2;
}
.main-container >>> .el-range-input, .el-input-group__prepend {
    background-color: #ffffff;
    color: #7a7a7a;
    /*border-radius: 4px;*/
}
.main-container >>> .el-icon-time:before {
  color: #7a7a7a;
}
.main-container >>> .el-date-editor .el-range-separator {
    color: #7a7a7a;
}
.el-button {
  background-color:  #0083fd;
  border-color: #0083fd;
  width: 68px;
  color: #ffffff;
}
.main-container >>> .el-col-14 {
    width: 47%;
}
.main-container >>> .el-col-7 {
    width: 27.5%;
}
.el-button.is-active {
  color: #ffffff;
}
.test{
    background-color: #0083fd;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
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
    font-size: 18px;
    border-radius: 5px;
    width: auto;
    height: 35px;
}
</style>
 