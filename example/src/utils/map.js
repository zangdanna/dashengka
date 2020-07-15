export function eventMark (text, position, check, offest = -55) {
  let checkClass = check || ''
  // 点标记显示内容，HTML要素字符串
  console.info('[map.js: function eventMark] ------------->   参数1:-->' + text + ', 参数2:-->' + position + ', 参数3:-->' + checkClass + ', ' + checkClass.length)

  console.info('')
  let tooltiptextClass = ''
  let iconClass = ''

  if (text === '超速') {
    tooltiptextClass = 'tooltiptext__overspeed'
    iconClass = 'el-icon-warning__overspeed'
  } else if (text === '急转弯') {
    tooltiptextClass = 'tooltiptext__sharpturn'
    iconClass = 'el-icon-warning__sharpturn'
  } else if (text === '急加速') {
    tooltiptextClass = 'tooltiptext__rapidaccelerate'
    iconClass = 'el-icon-warning__rapidaccelerate'
  } else if (text === '急减速') {
    tooltiptextClass = 'tooltiptext__rapiddeceleration'
    iconClass = 'el-icon-warning__rapiddeceleration'
  } else {
    tooltiptextClass = 'tooltiptext__fatiguedriving'
    iconClass = 'el-icon-warning__fatiguedriving'
  }
  let markerContent = `<div class='event_mark'>
  <div class="tooltiptext ${tooltiptextClass}">
    <i class="el-icon-warning ${iconClass}"></i>&nbsp;
    <div class="tiptext">${text}</div>
  </div></div>`

  const marker = new AMap.Marker({
    position: position,
    // 将 html 传给 content
    content: markerContent,
    cursor: 'default',
    zIndex: 110,
    // 以 icon 的 [center bottom] 为原点
    offset: new AMap.Pixel(0, offest)
  })

  const circleMarker = new AMap.CircleMarker({
    center: position,
    radius: 2,
    strokeColor: '#0091ea',
    strokeWeight: 2,
    strokeOpacity: 0.9,
    fillColor: 'white',
    fillOpacity: 0.9,
    zIndex: 999,
    bubble: true,
    cursor: 'default'
  })

  return [marker, circleMarker]
}

export function startEndMarker (startLngLat, endLngLat) {
  // 创建一个 Icon
  const startIcon = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: require('@/assets/imgs/dir-marker.png'),
    // 图标所用图片大小
    imageSize: new AMap.Size(135, 40),
    // 图标取图偏移量
    imageOffset: new AMap.Pixel(-9, -3)
  })

  // 将 icon 传入 marker
  const startMarker = new AMap.Marker({
    position: startLngLat,
    icon: startIcon,
    offset: new AMap.Pixel(-13, -30)
  })

  // 创建一个 icon
  const endIcon = new AMap.Icon({
    size: new AMap.Size(25, 34),
    image: require('@/assets/imgs/dir-marker.png'),
    imageSize: new AMap.Size(135, 40),
    imageOffset: new AMap.Pixel(-95, -3)
  })

  // 将 icon 传入 marker
  const endMarker = new AMap.Marker({
    position: endLngLat,
    icon: endIcon,
    offset: new AMap.Pixel(-13, -30)
  })

  return [startMarker, endMarker]
}

export function startMarker (startLngLat) {
  // 创建一个 Icon
  const startIcon = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: require('@/assets/imgs/dir-marker.png'),
    // 图标所用图片大小
    imageSize: new AMap.Size(135, 40),
    // 图标取图偏移量
    imageOffset: new AMap.Pixel(-9, -3)
  })

  // 将 icon 传入 marker
  const startMarker = new AMap.Marker({
    position: startLngLat,
    icon: startIcon,
    offset: new AMap.Pixel(-13, -30)
  })

  return startMarker
}

export function endMarker (endLngLat) {
  // 创建一个 icon
  const endIcon = new AMap.Icon({
    size: new AMap.Size(25, 34),
    image: require('@/assets/imgs/dir-marker.png'),
    imageSize: new AMap.Size(135, 40),
    imageOffset: new AMap.Pixel(-95, -3)
  })

  // 将 icon 传入 marker
  const endMarker = new AMap.Marker({
    position: endLngLat,
    icon: endIcon,
    offset: new AMap.Pixel(-13, -30)
  })

  return endMarker
}

export function getAddrByLnglat (lnglat) {
  const geocoder = new AMap.Geocoder({
    // city: "010", 城市设为北京，默认：“全国”
    radius: 1000
  })
  return new Promise((resolve, reject) => {
    geocoder.getAddress(lnglat, function (status, result) {
      if (status === 'complete' && result.regeocode) {
        const addressObj = result.regeocode.addressComponent
        const formattedAddress = result.regeocode.formattedAddress
        let [province, ...other] = formattedAddress.split(addressObj.city)
        let fmtAddr = other.join('')
        let addr = [addressObj.district, addressObj.township, addressObj.street]
        resolve({addr, addressObj, fmtAddr, province})
      } else {
        reject(Error('根据经纬度查询地址失败'))
      }
    })
  })
}

export function createMapLine (path, strokeColor, marker = false) {
  console.info('function createMapLine------->' + ' 参数2:-->' + strokeColor)
  const line = new AMap.Polyline({
    path: path,
    strokeWeight: 4,
    strokeOpacity: 0.8,
    strokeColor: strokeColor,
    showDir: false
  })
  if (marker) {
    let capMarker = startEndMarker(path[0], path[path.length - 1])
    return [line, ...capMarker]
  } else {
    return line
  }
}

export function createPathSimplifier (map) {
  return new Promise((resolve, reject) => {
    AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
      if (!PathSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！')
        return
      }

      let emptyLineStyle = {
        lineWidth: 0,
        fillStyle: null,
        strokeStyle: null,
        borderStyle: null
      }

      const pathSimplifierIns = new PathSimplifier({
        zIndex: 111,
        autoSetFitView: false,
        map: map, // 所属的地图实例

        getPath: function (pathData, pathIndex) {
          return pathData.path
        },
        getHoverTitle: function (pathData, pathIndex, pointIndex) {
          return null
        },
        renderOptions: {
          // 将点、线相关的style全部置emptyLineStyle
          pathLineStyle: emptyLineStyle,
          pathLineSelectedStyle: emptyLineStyle,
          pathLineHoverStyle: emptyLineStyle,
          keyPointStyle: emptyLineStyle,
          startPointStyle: emptyLineStyle,
          endPointStyle: emptyLineStyle,
          keyPointHoverStyle: emptyLineStyle,
          keyPointOnSelectedPathLineStyle: emptyLineStyle
        }
      })

      const payload = PathSimplifier.Render.Canvas.getImageContent(
        require('@/assets/imgs/car.png'),
        function () { pathSimplifierIns.renderLater() },
        function () { alert('图片加载失败！') }
      )
      resolve([pathSimplifierIns, payload])
    })
  })
}

export function handlePathData (data, events) {
  let eventPriority = [5, 2, 4, 3, 1]
  events.map(event => {
    data.map(point => {
      if (event.startAt <= point.recordAt && point.recordAt <= event.endAt) {
        if (eventPriority.indexOf(point.eventType) < eventPriority.indexOf(event.eventType)) {
          if (!event.startAddr) {
            event.startAddr = [point.lng, point.lat]
          }
          point.eventId = event.eventId
          point.eventType = event.eventType
        }
      }
    })
  })
  return { data, events }
}

export function drawCityLine (map, polygons, city, cover = false) {
  polygons.map(item => {
    item.setMap(null)
  })
  return new Promise((resolve, reject) => {
    if (city === '中国') {
      map.setZoom(4.5)
      map.setCenter([116.397428, 39.90923])
      resolve([])
    } else {
      AMap.plugin('AMap.DistrictSearch', function () {
        var districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: 'city',
          extensions: 'all'
        })
        districtSearch.search(city, function (status, result) {
          // 查询成功时，result即为对应的行政区信息
          if (status === 'complete') {
            const bounds = result.districtList[0].boundaries
            if (bounds) {
              bounds.map(item => {
                const polygon = new AMap.Polygon({
                  map: map,
                  strokeWeight: 1,
                  strokeColor: '#0091ea',
                  fillColor: cover ? '#80d8ff' : null,
                  fillOpacity: 0.2,
                  path: item
                })
                polygons.push(polygon)
              })
              map.setFitView()// 地图自适应
            }
          }
          resolve(polygons)
        })
      })
    }
  })
}

export function autocomplete (el) {
  // 输入提示
  let autoOptions = {
    input: el
  }
  let auto = new AMap.Autocomplete(autoOptions)
  return new Promise((resolve, reject) => {
    resolve(auto)
  })
}

export function drivingRoad (map, start, end, roadType) {
  const driving = new AMap.Driving({
    policy: AMap.DrivingPolicy[roadType],
    map: map,
    extensions: 'all',
    autoFitView: true
  })
  return new Promise((resolve, reject) => {
    driving.search(start, end, function (status, result) {
      if (status === 'complete') {
        resolve(result)
      } else {
        reject(result)
      }
    })
  })
}

export function getLnglatByLocation (address) {
  const geocoder = new AMap.Geocoder({
    radius: 1000
  })
  return new Promise((resolve, reject) => {
    geocoder.getLocation(address, function (status, result) {
      if (status === 'complete' && result.geocodes.length) {
        const lnglat = result.geocodes[0].location
        resolve(lnglat)
      } else {
        reject(Error('根据地址查询位置失败'))
      }
    })
  })
}

export function carMarker (lngLat, eventFlg = false, vin, type) {
  let imge = require('@/assets/imgs/car-right.png')
  if (eventFlg) {
    imge = require('@/assets/imgs/errorCar.png')
  }
  const carIcon = new AMap.Icon({
    size: new AMap.Size(30, 30),
    image: imge,
    imageSize: new AMap.Size(30, 30),
    imageOffset: new AMap.Pixel(0, 0)
  })

  // 将 icon 传入 marker
  const carMarker = new AMap.Marker({
    position: lngLat,
    icon: carIcon,
    offset: new AMap.Pixel(-20, -20),
    autoRotation: true,
    angle: -90
  })

  AMap.event.addListener(carMarker, 'click', e => {
    this.$store.dispatch('getCarInfo', vin).then(async res => {
      let dateStr = e.target.dataSet[e.target.dataSet.length - 1].recordAt
      const updateTime = dateFormat('YYYY-mm-dd HH:MM:SS', new Date(dateStr))
      const addr = await getAddrByLnglat(lngLat)
      const address = addr.addr.join('')
      const html = `
      <div>
        <div style="text-align:left;">&nbsp;&nbsp;&nbsp;司机名称:	${res.driverName}</div>
        <div style="text-align:left;">&nbsp;&nbsp;&nbsp;联系电话:	${res.phoneNum}</div>
        <div style="text-align:left;">&nbsp;&nbsp;&nbsp;所在位置:	${address}</div>
        <div style="text-align:left;">&nbsp;&nbsp;&nbsp;更新时间:	${updateTime}</div>
      </div>
      `
      this.$alert(html, res.carNo, {
        dangerouslyUseHTMLString: true
      })
    })
  })

  // car status marker
  let eventMsg = type === 2 ? '驶出报警' : '驶入报警'
  const eventMarker = eventMark(eventMsg, lngLat, '', -60)
  if (!eventFlg) {
    eventMarker[0].hide()
  }

  return [carMarker, eventMarker[0]]
}

export function updateCarMarker (marker, status) {
  let img = status ? require('@/assets/imgs/errorCar.png') : require('@/assets/imgs/car-right.png')
  const carIcon = new AMap.Icon({
    size: new AMap.Size(35, 35),
    image: img,
    imageSize: new AMap.Size(35, 35),
    imageOffset: new AMap.Pixel(0, 0)
  })
  marker[0].setIcon(carIcon)
  if (status) {
    marker[1].show()
  } else {
    marker[1].hide()
  }
}

export function dateFormat (fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString()
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}
