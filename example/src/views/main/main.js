import { fetchCarPoint } from '@/api'
import _ from 'lodash'
import { drawCityLine } from '@/utils'
import infoPannel from '@/components/infoPannel'
import carActiveChart from '@/components/echart/line/carActive.vue'

export default {
  data () {
    return {
      windowWidth: document.documentElement.clientWidth,
      interval: '',
      carno: '',
      map: null,
      layer: null,
      polygons: [],
      fleetData: {},
      fleets: [],
      selectedFleet: 'all',
      choosedCity: '中国',
      searchedCar: ''
    }
  },
  components: { infoPannel, carActiveChart },
  mounted () {
    let that = this;
    var infoWin;

    const map = new AMap.Map('container', {
      mapStyle: this.gc.map.mapStyle,
      zoom: 11,
      center: [120.305783, 31.588256],
      viewMode: '3D'
    });

    map.on('complete', function () {
      // 地图图块加载完成后触发
      that.map = map

      that.layer = new Loca.RoundPointLayer({
        eventSupport: true,
        map: map
      });

      map.on('zoomend', function () {
        let zoom = map.getZoom();
        let radius = 3;
        if (zoom > 7) {
          radius = 4;
        }
        if (zoom > 12) {
          radius = 6;
        }
        that.layer.setOptions({
          style: {
            // 默认半径单位为像素
            radius: radius,
            color: function (data) {
              if (data.value.item.carNo === that.searchedCar) {
                return '#05ff18'
              }
              return '#4FC2FF'
            },
            borderWidth: 0,
            opacity: 0.9,
          },
          selectStyle: {
            radius: radius + 2,
            color: '#ffe30a'
          }
        });
        that.layer.render();
      });

      that.layer.on('mousemove', function (ev) {
        // 事件类型
        var type = ev.type;
        // 当前元素的原始数据
        var rawData = ev.rawData;
        // 原始鼠标事件
        var originalEvent = ev.originalEvent;

        infoWin = that.openInfoWin(infoWin, map, originalEvent, {
          '名称': rawData.item.carNo
        });
      });

      that.layer.on('mouseleave', function (ev) {
        that.closeInfoWin(infoWin);
      });

      that.layer.on('click', function (ev) {
        var data = ev.rawData.item;
        that.$router.push({ name: 'trackLine', query: { vin: data.vin, fleetId: data.fleetId, tripCnt: data.latestTripCnt } });
      });

      that.layer.setOptions({
        style: {
          // 默认半径单位为像素
          radius: 3,
          color: function (data) {
            if (data.value.item.carNo === that.searchedCar) {
              return '#05ff18'
            }
            return '#4FC2FF'
          },
          borderWidth: 0,
          opacity: 0.9,
        },
        selectStyle: {
          radius: 5,
          color: '#ffe30a'
        }
      });

      // get car point data
      that.$store.dispatch('getCarPoint', that.selectedFleet).then(({fleetData, pointData}) => {
        that.fleetData = fleetData
        that.fleets = _.keys(fleetData)
        that.layer.setData(pointData, {
          lnglat: 'lnglat'
        });
        // 渲染
        that.layer.render();
      })
    });

    that.interval = setInterval(() => {
      // get car point data
      that.$store.dispatch('getCarPoint', that.selectedFleet).then(({fleetData, pointData}) => {
        that.fleetData = fleetData
        that.fleets = _.keys(fleetData)
        that.layer.setData(pointData, {
          lnglat: 'lnglat'
        });
        // 渲染
        that.layer.render();
      })
    }, that.gc.carPointRefreshTime)
  },

  methods: {
    openInfoWin (infoWin, map, event, content) {
      var tableDom;
      if (!infoWin) {
        infoWin = new AMap.InfoWindow({
          retainWhenClose: true
        });
      }
      var x = event.offsetX;
      var y = event.offsetY;
      var lngLat = map.containerToLngLat(new AMap.Pixel(x, y - 10));
      if (!tableDom) {
        let infoDom = document.createElement('div');
        infoDom.className = 'info';
        tableDom = document.createElement('table');
        infoDom.appendChild(tableDom);
        infoWin.setContent(infoDom);
      }
      var trStr = '';
      for (var name in content) {
        var val = content[name];
        trStr += '<tr>' + '<td class="content">' + val + '</td>' + '</tr>'
      }
      tableDom.innerHTML = trStr;
      infoWin.open(map, lngLat);
      return infoWin;
    },
    closeInfoWin (infoWin) {
      if (infoWin) {
        infoWin.close();
      }
    },
    handleSelect (obj) {
      let car = obj.car;
      this.searchedCar = car.carNo;
      this.map.setCenter([car.lng, car.lat]);
      this.map.setZoom(18)
      // 改变搜索到的车的颜色
      this.layer.setOptions({
        style: {
          // 默认半径单位为像素
          radius: 6,
          color: function (data) {
            if (data.value.item.carNo === car.carNo) {
              return '#05ff18'
            }
            return '#4FC2FF'
          },
          borderWidth: 0,
          opacity: 0.9,
        },
        selectStyle: {
          radius: 8,
          color: '#ffe30a'
        }
      });
      this.layer.render();
    },
    handleSelect2(carno) {
      // 取得车辆信息
      var carPointData = this.fleetData[this.selectedFleet] || [];
      var results = carno ? carPointData.filter(this.createFilter(carno)) : carPointData;
      // 取到的场合,定位车辆
      if (results.length != 0) {
        let carinfo = {car:{carNo: results[0].carNo, lng: results[0].lng, lat: results[0].lat}}
        this.handleSelect(carinfo);
      }
    },
    searchClick(carno, inputRef){
      // 如果只是选择了城市,描绘围栏
      if (this.selectedFleet == "all" && carno == ""){
        this.chooseCity ();
        // 如果选择了城市和车队,没有输入车号,画点
      } else if (this.selectedFleet != "all" && carno == "") {
        this.changeFleet (inputRef);
        this.chooseCity ();
        // 如果输入了车队和车号,检索
      } else {
          this.changeFleet (inputRef);
          this.handleSelect2(carno);
      };
    },
    querySearch (queryString, cb) {
      cb([])
      var carPointData = this.fleetData[this.selectedFleet] || [];
      var results = queryString ? carPointData.filter(this.createFilter(queryString)) : carPointData;
      // 调用 callback 返回建议列表的数据
      cb(_.map(results, (item) => { return { value: item.carNo, car: item } }));
    },
    createFilter (queryString) {
      return (carPointData) => {
        return (carPointData.carNo.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    changeFleet (inputRef) {
      // this.$refs[inputRef].handleClear();
      let pointData = [];
      this.fleetData[this.selectedFleet].map((item) => {
        pointData.push({
          'lnglat': [item.lng, item.lat],
          'item': item
        })
      })
      this.layer.setData(pointData, {
        lnglat: 'lnglat'
      });
      // 渲染
      this.layer.render();
    },
    chooseCity () {
      drawCityLine(this.map, this.polygons, this.choosedCity).then(polygons => {
        this.polygons = polygons
      })
    },
    handleToggleClick (param) {
      if (param.hide && param.position === 'right') {
        this.$refs.carSearch.style.marginRight = '0'
      } else {
        this.$refs.carSearch.style.marginRight = '340px'
      }
    }
  },
  beforeDestroy () {
    if (this.interval !== '') {
      clearInterval(this.interval);
    }
    if (this.map) {
      this.map.destroy()
    }
  },

}
