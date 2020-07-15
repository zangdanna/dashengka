
import { fetchCanLabels, fetchCanDetail, fetchCarInfo, fetchCarReportMonthly, fetchTrackLine, fetchCarPoint } from '@/api'
import { dateFormat } from '@/utils'
import _ from 'lodash'

const track = {
  // namespaced: true,
  state: {
    lableData: [],
    labelAliasMap: [],
    carInfo: {},
    carReport: [],
    lastOdoComp: {},
    lastTimeComp: {}
  },
  getters: {
    lableData: state => {
      let dataList = []
      state.labelAliasMap.map(item => {
        let showAlias = item.showAlias || item.showKey
        let value = '-'
        state.lableData.map(label => {
          if (item.showKey === label.label) {
            value = label.value
          }
        })
        dataList.push({
          showAlias: showAlias,
          value: value
        })
      })
      return dataList
    }
  },
  mutations: {
    SET_LABELALIASMAP: (state, value) => {
      state.labelAliasMap = value
    },
    SET_LABELDATA: (state, value) => {
      state.lableData = value
    },
    SET_CAR_INFO: (state, value) => {
      state.carInfo = value
    },
    SET_CAR_REPORT: (state, report) => {
      state.carReport = report
    },
    SET_ODO_COMP: (state, odo) => {
      state.lastOdoComp = odo
    },
    SET_TIME_COMP: (state, time) => {
      state.lastTimeComp = time
    }
  },
  actions: {
    getCanLabels ({commit}, payload) {
      fetchCanDetail(payload.canPayload).then(res => {
        let keys = []
        res.list.map(item => {
          keys.push(item.showKey)
        })
        commit('SET_LABELALIASMAP', res.list)
        let labels = keys.join()
        fetchCanLabels({...payload.labelPayload, labels: labels}).then(res => {
          commit('SET_LABELDATA', res.list)
        })
      })
    },
    getCarInfo ({commit}, vin) {
      return new Promise((resolve, reject) => {
        fetchCarInfo(vin).then(response => {
          commit('SET_CAR_INFO', response)
          resolve(response)
        })
      })
    },
    getCarReportMonthly ({ commit }, param) {
      let date = new Date()
      date.setMonth(date.getMonth() - 1)
      let from = dateFormat('YYYYmm', date)
      return new Promise((resolve, reject) => {
        fetchCarReportMonthly({ ..._.omit(param, 'tripCnt'), from: from }).then(response => {
          const carReport = _.reverse(response.list)
          if (carReport.length > 1) {
            let odoComp = (((carReport[0].odoCnt - carReport[1].odoCnt) / carReport[1].odoCnt) * 100).toFixed(2)
            let timeComp = (((carReport[0].timeCnt - carReport[1].timeCnt) / carReport[1].timeCnt) * 100).toFixed(2)
            const lastOdoComp = { value: odoComp > 0 ? odoComp : -odoComp, class: odoComp > 0 ? 'el-icon-top' : 'el-icon-bottom' }
            const lastTimeComp = { value: timeComp > 0 ? timeComp : -timeComp, class: timeComp > 0 ? 'el-icon-top' : 'el-icon-bottom' }
            commit('SET_ODO_COMP', lastOdoComp)
            commit('SET_TIME_COMP', lastTimeComp)
          }
          commit('SET_CAR_REPORT', carReport)
          resolve(carReport)
        })
      })
    },
    getTrackLineData ({ commit }, param) {
      return new Promise((resolve, reject) => {
        fetchTrackLine(param).then(res => {
          resolve(res)
        })
      })
    },
    getVehicleStatus () {
      return new Promise((resolve, reject) => {
        fetchCarPoint().then(res => {
          resolve(res)
        })
      })
    }
  }
}

export default track
