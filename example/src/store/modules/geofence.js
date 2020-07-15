import {fetchCarInfo, fetchVehicleMonitor} from '@/api'
import _ from 'lodash'
import {dateFormat} from '@/utils'

export default {
  state: {
    map: null,
    rightPannel: false,
    monitorFormData: {
      monitorName: '',
      geofence: {},
      fleet: '',
      dateRange: [],
      eventType: 1
    },
    eventMonitorList: [],
    monInit: true
  },
  mutations: {
    SET_MAP: (state, map) => {
      state.map = map
    },
    SET_RIGHTPANNEL: (state, val) => {
      state.rightPannel = val
    },
    RESET_MONITORFROMDATA: (state) => {
      state.monitorFormData = {
        monitorName: '',
        geofence: {},
        fleet: '',
        dateRange: [],
        eventType: 1
      }
    },
    UODATE_GEO: (state, val) => {
      state.monitorFormData.geofence = val
    },
    SET_MONITORFROMDATA: (state, val) => {
      state.monitorFormData = val
    },
    SET_INIT: (state, val) => {
      state.monInit = val
    },
    UPDATE_EVENT: (state, val) => {
      let tempList = state.eventMonitorList
      if (val.eventFlg) {
        tempList.push({carNo: val.carNo, start: val.start !== '-' ? dateFormat('YYYY-mm-dd HH:MM', new Date(val.start)) : val.start})
      } else {
        tempList = _.remove(tempList, function (n) {
          return n.carNo !== val.carNo
        })
      }
      state.eventMonitorList = _.unionBy(tempList, 'carNo')
    },
    CLEAR_EVENT: (state) => {
      state.eventMonitorList = []
    }
  },
  actions: {
    getCarDetailInfo ({commit}, vin) {
      return new Promise((resolve, reject) => {
        fetchCarInfo(vin).then(response => {
          resolve(response)
        })
      })
    },
    getVehicleMonitor (context, payload) {
      return new Promise((resolve, reject) => {
        fetchVehicleMonitor(payload).then(res => {
          resolve(res.list)
        })
      })
    }
  }
}
