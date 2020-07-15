import { dateFormat, formatSeconds, eventMark, getAddrByLnglat, createMapLine, createPathSimplifier, handlePathData } from '@/utils'
import { mapState } from 'vuex'
import _ from 'lodash'
import pieChart from '@/components/echart/pie/pieChart'

export default {
  data () {
    return {
      map: null,
      carImg: null,
      pathSimplifierIns: null,
      driveTime: '',
      navg: null,
      eventType: 'normal',
      chartData: [],
      carState: '在线',
      infoWindow: null,
      navgPath: [],
      navgData: [],
      interval: '',
      param: {},
      currentSpeed: 0,
      address: '',
      updateTime: '',
      tripStartAt: '',
      windowWidth: document.documentElement.clientWidth,
      carDetailShowState: '收起',
      initTripFlg: false
    }
  },
  components: { pieChart },
  computed: {
    lableData () {
      return this.$store.getters.lableData
    },
    ...mapState({
      carInfo: state => state.track.carInfo,
      carReport: state => state.track.carReport,
      lastOdoComp: state => state.track.lastOdoComp,
      lastTimeComp: state => state.track.lastTimeComp
    })
  },
  watch: {
    eventType (val, oldVal) {
      // console.log(`watch: ${oldVal} => ${val}`)
      this.carState = val ? this.gc.eventMap[val] : '在线'
      if (oldVal !== 'normal'){
        this.createNavigator(this.map, this.pathSimplifierIns, this.carImg, [])
        if (val) {
          const point = this.navgData[this.navg.cursor.idx]
          console.info('fucntion watch----->参数1:-->' + this.gc.eventMap[val] + '参数2:-->' + [point.lng, point.lat])
          const mark = eventMark(this.gc.eventMap[val], [point.lng, point.lat])
          this.map.add(mark)
          // 更新event事件图表
          this.$store.dispatch('getCarReportMonthly', { ...this.param, baseTime: point.recordAt}).then(carReport => {
            if (carReport.length > 0) {
              // 更新饼图
              this.createPieChart(carReport[0].eventSum)
            }
          })
        }
      }
    }
  },
  created() {
    this.param = this.$route.query;
    this.$store.commit('SET_LABELDATA', [])
    // 获取车辆信息
    this.$store.dispatch('getCarInfo', this.param.vin)
  },
  mounted () {
    let that = this;
    const map = new AMap.Map('carline', {
      mapStyle: that.gc.map.mapStyle,
      resizeEnable: true,
      zoom: 17,
    });
    this.map = map

    getTrackLineInterval()
    // 速度信息窗体
    this.infoWindow = new AMap.InfoWindow({
      //使用默认信息窗体框样式，显示信息内容
      offset: new AMap.Pixel(0, -20),
      retainWhenClose: true,
      content: "<p style='height:40px;background:#1c3752c7;color:white;font-size:10px;line-height:40px;padding:0px 10px'>" + that.currentSpeed + " km/h</p>"
    });
    this.infoWindow.open(map, map.getCenter());

    // 每过一分钟取一次数据
    this.interval = setInterval(getTrackLineInterval, this.gc.trackRefreshTime)

    function getTrackLineInterval () {
      let timeRange = {}
      if (that.initTripFlg) {
        const from = _.last(that.navgData).recordAt + 1
        timeRange = { from: from, to: from + 60000 }
      }
      let param = _.omit(that.param, 'fleetId')
      that.$store.dispatch('getTrackLineData', { ...param, ...timeRange }).then((res) => {
        let pathList = res.list, events = res.events
        that.tripStartAt = res.startAt
        const tripEndTimeRange = new Date().setMinutes(new Date().getMinutes() - that.gc.tripEndTime)
        // 给每个坐标点加上event字段
        pathList = handlePathData(pathList, events).data

        if (res.updateAt < tripEndTimeRange) {
          // 如果trip结束则画出路线，不再发送trip请求
          if (!that.navg) {
            that.initTrap(map, pathList, res.updateAt)
            clearInterval(that.interval)
          }
        } else {
          // trip没有结束
          if (pathList.length === 0) {
            // 取不到数据，10秒之后再次发送trip请求
            clearInterval(that.interval)
            that.interval = setInterval(getTrackLineInterval, 10 * 1000)
          } else {
            if (that.initTripFlg) {
              // 更新巡航器
              that.createNavigator(map, that.pathSimplifierIns, that.carImg, pathList)
            } else {
              if (pathList.length >= (60 * that.gc.tripDelay)) {
                that.initTripFlg = true
                // trip没结束的情况，取两分钟前的数据(避免events延迟)
                pathList = pathList.slice(0, pathList.length - (60 * (that.gc.tripDelay - 1)))
                that.initTrap(map, pathList, res.startAt)
                res.updateAt = _.last(pathList).recordAt
                // trip开始，每一分钟取一次数据
                clearInterval(that.interval)
                that.interval = setInterval(getTrackLineInterval, 60 * 1000)
              }
            }
            if (!that.initTripFlg && !that.navg) {
              // 显示车位置，等待trip开始
              that.initTrap(map, pathList.slice(0, 1), res.startAt)
            }
          }
        }

        if (that.initTripFlg || res.updateAt < tripEndTimeRange) {
          that.updateTime = dateFormat('YYYY-mm-dd HH:MM:SS', new Date(res.updateAt))

          // 获取车辆can label情报
          that.$store.dispatch('getCanDataByVin', { vin: that.param.vin }).then(response => {
            if (response.length > 0) {
              // 获取车辆当前行驶点的时间
              let pointTime = res.updateAt
              if (that.navgData.length > 0) {
                const point = that.navgData[that.navg.cursor.idx]
                pointTime = point.recordAt
              }
              that.$store.dispatch('getCanLabels', {
                canPayload: { dataNaviId: response[0].dataNaviId, showFlg: '1' },
                labelPayload: { vin: that.param.vin, from: pointTime, to: pointTime }
              })
            }
          })

          // 获取车辆行驶信息
          that.$store.dispatch('getCarReportMonthly', {...that.param, baseTime: res.updateAt})
        }

      })
    }
  },
  methods: {
    mapMoving (map, position) {
      // map.panTo([position.lng, position.lat]);
      map.setCenter([position.lng, position.lat]);
    },
    initTrap (map, pathList, baseTime) {
      // 第一次取得数据画出历史路线
      let trp = pathList.length > this.gc.initTripCount ? pathList.length - this.gc.initTripCount : 1
      // 获取车辆驶过路径
      let tripData = pathList.slice(0, trp);
      // 初始化 eventType
      this.eventType = tripData.length > 1 ? tripData[tripData.length - 2].eventType : undefined
      console.info('initTrap 事件类型：' + this.eventType)
      let tripPath = [], tripPathItem = [],
        itemFlg = tripData[0] ? tripData[0].eventType : ''
      let tempFlg = itemFlg
      for (let item of tripData) {
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
        // let color = path[1] ? this.gc.map.eventStrokeColor : this.gc.map.strokeColor
        let colorForRouteLine = this.gc.map.strokeColor
        if (path[1]) {
          if (path[1] === 1) {
            colorForRouteLine = this.gc.map.eventForOverSpeedStrokeColor
          } else if (path[1] === 2) {
            colorForRouteLine = this.gc.map.eventForSharpTurnStrokeColor
          } else if (path[1] === 3) {
            colorForRouteLine = this.gc.map.eventForRapidAccelerateStrokeColor
          } else if (path[1] === 4) {
            colorForRouteLine = this.gc.map.eventForRapidDecelerationStrokeColor
          } else {
            colorForRouteLine = this.gc.map.eventForFatigueDrivingStrokeColor
          }
        }
        console.info('tripPath:->' + path[1] + ',     color:->' + colorForRouteLine)
        map.add(createMapLine(path[0], colorForRouteLine))
        if (path[1]) {
          // 添加events窗口信息          
          const mark = eventMark(this.gc.eventMap[path[1]], path[0][0])
          map.add(mark)
        }
      })
      pathList = pathList.slice(trp - 1)
      if (this.navg) {
        this.createNavigator(map, this.pathSimplifierIns, this.carImg, pathList)
      } else {
        // 初始化巡航器
        createPathSimplifier(map).then(([pathSimplifierIns, carImg]) => {
          this.carImg = carImg
          this.pathSimplifierIns = pathSimplifierIns
          this.createNavigator(map, pathSimplifierIns, carImg, pathList)
        })
      }
      // 初始化车辆行驶信息
      this.$store.dispatch('getCarReportMonthly', {...this.param, baseTime: baseTime}).then(carReport => {
        if (carReport.length > 0) {
          this.createPieChart(carReport[0].eventSum)
        }
      })
    },
    createNavigator (map, pathSimplifierIns, carImg, pathList) {
      let that = this
      let cursor = {idx: 0, tail: 0}
      let strokeColor = this.gc.map.strokeColor
      let passedColor = this.gc.map.strokeColor

      if (this.eventType) {
        if (this.eventType === 1) {
          strokeColor = this.gc.map.eventForOverSpeedStrokeColor
        } else if (this.eventType === 2) {
          strokeColor = this.gc.map.eventForSharpTurnStrokeColor
        } else if (this.eventType === 3) {
          strokeColor = this.gc.map.eventForRapidAccelerateStrokeColor
        } else if (this.eventType === 4) {
          strokeColor = this.gc.map.eventForRapidDecelerationStrokeColor
        } else {
          strokeColor = this.gc.map.eventForFatigueDrivingStrokeColor
        }
      }
      if (that.navg) {
        //保存巡航器的位置
        cursor = that.navg.getCursor().clone(),
          status = that.navg.getNaviStatus();
        if (cursor.idx < 0) {
          cursor.idx = that.navgPath.length - 1
        }
        passedColor = that.navg.getStyleOptions().pathLinePassedStyle.strokeStyle
      }
      
      let latestPath = []
      pathList.map(function (item) {
        latestPath.push([item.lng, item.lat]);
      })
      // 更新passedPath
      const passedPath = that.navgPath.slice(0, cursor.idx + 1)
      that.navgPath = that.navgPath.slice(cursor.idx).concat(latestPath)
      that.navgData = that.navgData.slice(cursor.idx).concat(pathList)

      // 设置巡航器路径
      pathSimplifierIns.setData([{
        name: '轨迹',
        path: that.navgPath,
      }]);
      // 创建巡航器
      that.navg = pathSimplifierIns.createPathNavigator(0, {
        loop: false,
        speed: that.currentSpeed,
        pathNavigatorStyle: {
          width: 32,
          height: 32,
          //使用图片
          content: carImg,
          strokeStyle: null,
          fillStyle: null,
          //经过路径的样式
          pathLinePassedStyle: {
            lineWidth: this.gc.map.lineWidth,
            strokeStyle: strokeColor,
            dirArrowStyle: {
              stepSpace: null,
              strokeStyle: strokeColor
            }
          }
        }
      });
      let mapMovingTh = _.throttle(this.mapMoving, 500);
      let getAddrByLnglatThro = _.throttle(getAddrByLnglat, 60 * 1000);
      let changeCarSpeedFun = this.changeCarSpeed()
      that.navg.on('move', function (e) {
        let position = that.navg.getPosition();
        mapMovingTh(map, position);
        // console.log(that.navg.cursor.idx)
        changeCarSpeedFun();
        getAddrByLnglatThro([position.lng, position.lat]).then(({addr}) => {
          that.address = addr.join('')
        })
        that.infoWindow.open(map, [position.lng, position.lat]);
      })
      map.add(createMapLine(passedPath, passedColor))
      that.navg.start()
      //恢复巡航器的位置
      that.navg.moveToPoint(0, cursor.tail);
    },
    createPieChart (eventSum) {
      const data = []
      eventSum.map(event => {
        data.push({ value: event.eventCount, name: this.gc.eventMap[event.eventType]})
      })
      this.chartData = data
    },
    changeCarSpeed () {
      let indexCache = -1;
      let that = this
      return function () {
        if (that.navg.cursor.idx !== indexCache) {
          indexCache = that.navg.cursor.idx
          let currentSpeed = that.navgData[indexCache].speed || 0;
          that.infoWindow.close();
          that.infoWindow = new AMap.InfoWindow({
            //使用默认信息窗体框样式，显示信息内容
            offset: new AMap.Pixel(0, -20),
            retainWhenClose: true,
            content: "<p style='height:40px;background:#1c3752c7;color:white;font-size:10px;line-height:40px;padding:0px 10px'>" + currentSpeed + " km/h</p>"
          });
          that.navg.setSpeed(currentSpeed);
          that.currentSpeed = currentSpeed;
          // 车速为0时，过一秒跳到下一个point
          if (currentSpeed === 0) {
            setTimeout(function(){
              if (indexCache < that.navg.getPathEndIdx()) {
                that.navg.moveToPoint(indexCache + 1, 0)
              }
            }, 1000)
          }
          // 更新车辆行驶时间
          that.driveTime = formatSeconds(that.navgData[indexCache].recordAt - that.tripStartAt)
          // 判断车辆异常情况
          that.eventType = that.navgData[indexCache].eventType
        }
      }
    },
    drawerToggle($event) {
      const panel = $event.currentTarget.parentNode
      const drawer = $event.currentTarget.childNodes[0]
      if (panel.classList.contains('main-left')) {
        if (panel.classList.contains('main-left-hide')) {
          panel.classList.remove('main-left-hide')
          drawer.classList.value = 'el-icon-d-arrow-left'
          this.carDetailShowState = '收起'
        } else {
          panel.classList.add('main-left-hide')
          drawer.classList.value = 'el-icon-d-arrow-right'
          this.carDetailShowState = '显示'
        }
      } else {
        if (panel.classList.contains('main-right-hide')) {
          panel.classList.remove('main-right-hide')
          drawer.classList.value = 'el-icon-d-arrow-right'
          this.carDetailShowState = '收起'
        } else {
          panel.classList.add('main-right-hide')
          drawer.classList.value = 'el-icon-d-arrow-left'
          this.carDetailShowState = '显示'
        }
      }
    }
  },
  beforeDestroy () {
    if (this.navg) {
      this.navg.destroy()
    }
    if (this.interval !== '') {
      clearInterval(this.interval)
    }
    if (this.map) {
      this.map.destroy()
    }
  },
}
