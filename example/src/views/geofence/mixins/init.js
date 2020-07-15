import { getAddrByLnglat } from '@/utils'
import _ from 'lodash'

const weekValid = ['monValid', 'tuesValid', 'wedValid', 'thurValid', 'friValid', 'sunValid', 'satValid']

export default {
  created () {
    this.map.clearMap()
    this.$store.commit('SET_RIGHTPANNEL', false)
  },
  computed: {
    map () {
      return this.$store.state.geofence.map
    },
    rightPannel () {
      return this.$store.state.geofence.rightPannel
    },
    monInit () {
      return this.$store.state.geofence.monInit
    }
  },
  filters: {
    geoType: function (val) {
      const type = {
        district: '行政区域',
        line: '路线'
      }
      return type[val]
    }
  },
  methods: {
    formatAdcode (adcode) {
      let result = []
      const first = adcode.slice(0, 2).padEnd(6, 0)
      const second = adcode.slice(0, 4).padEnd(6, 0)
      if (first === second) {
        result = [first]
      } else if (second === adcode) {
        result = [first, second]
      } else {
        result = [first, second, adcode]
      }
      return result
    },
    async serializeGeoResData (res) {
      let data = {}
      switch (res.type) {
        case 'district': {
          data = {
            defaultAreaValue: this.formatAdcode(res.districtAdcode),
            areaValue: this.formatAdcode(res.districtAdcode),
            cityCode: res.districtCitycode
          }
          break
        }
        case 'line': {
          let start = await getAddrByLnglat(res.lineStart.split(','))
          let end = await getAddrByLnglat(res.lineEnd.split(','))
          data = {
            startPoint: start.fmtAddr,
            startPosition: res.lineStart.split(','),
            endPoint: end.fmtAddr,
            endPosition: res.lineEnd.split(','),
            roadType: res.lineMethod
          }
          break
        }
      }
      return {
        name: res.name,
        validTime: new Date(res.expireAt),
        week: weekValid.filter(day => res[day] !== 0),
        desc: res.detail,
        areaValue: [],
        defaultAreaValue: [],
        startPoint: '',
        startPosition: [],
        endPoint: '',
        endPosition: [],
        polyline: res.polyline,
        cityCode: '',
        geofenceType: res.type,
        roadType: 'LEAST_TIME',
        offset: res.lineOffset,
        ...data
      }
    },
    serializeGeoFormData (formData) {
      let data = {}
      switch (formData.geofenceType) {
        case 'district': {
          data = {
            districtCitycode: formData.cityCode,
            districtAdcode: _.last(formData.areaValue)
          }
          break
        }
        case 'line': {
          data = {
            lineStart: formData.startPosition.join(),
            lineEnd: formData.endPosition.join(),
            lineOffset: formData.offset
          }
          break
        }
      }
      const week = {}
      formData.week.map(day => {
        week[day] = 1
      })
      return {
        ...week,
        name: formData.name,
        type: formData.geofenceType,
        detail: formData.desc,
        expireAt: formData.validTime.getTime(),
        districtCitycode: '',
        districtAdcode: '',
        lineStart: '',
        lineEnd: '',
        lineMethod: formData.roadType,
        polyline: formData.polyline,
        lineOffset: '',
        ...data
      }
    }
  }
}
