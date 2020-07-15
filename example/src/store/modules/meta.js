import { fetchCanDetail, updateCanDetail, fetchCanData, fetchCanDataById, updateCanData, downloadCanLabelData, fetchCanLabels2 } from '@/api'
import _ from 'lodash'

const meta = {
  state: {
    tableData: {},
    originData: {},
    tableData2: [],
    originData2: [],
    lableData2: []
  },
  getters: {
    tableData: state => {
      return []
    },
    tableData2: state => {
      return _.sortBy(state.tableData2, 'detailId')
    },
    lableData2: state => {
      const labeData = []
      state.lableData2.map(item => {
        labeData.push({
          recordAt: item.recordAtFmt,
          vin: item.vin,
          lat: item.lat,
          lng: item.lng,
          ...item.labels
        })
      })
      return labeData
    }
  },
  mutations: {
    SET_TABLE_DATA2: (state, payload) => {
      state.tableData2 = payload
      state.originData2 = _.cloneDeep(payload)
    },
    RECOVER_DATA2: (state) => {
      state.tableData2 = _.cloneDeep(state.originData2)
    },
    SET_TABLE_DATA: (state, payload) => {
      state.tableData = payload
      state.originData = _.cloneDeep(payload)
    },
    RECOVER_DATA: (state) => {
      state.tableData = _.cloneDeep(state.originData)
    },
    SET_LABELDATA2: (state, value) => {
      state.lableData2 = value
    }
  },
  actions: {
    getCanDetailData ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        fetchCanDetail(payload).then(response => {
          resolve()
          commit('SET_TABLE_DATA2', response.list)
        })
      })
    },
    updateCanDetail ({ dispatch, state }, data) {
      const edit = _.differenceWith(state.tableData2, state.originData2, _.isEqual)
      let payload = []
      edit.map(item => {
        const {detailId, supplement, showFlg, showAlias} = item
        payload.push({detailId, supplement, showFlg, showAlias})
      })
      updateCanDetail(payload).then(response => {
        if (response !== 0) {
          dispatch('getCanDetailData', data)
        }
      })
    },
    getCanDataByVin ({ commit }, data) {
      return new Promise((resolve, reject) => {
        fetchCanData(data).then(response => {
          resolve(response)
        })
      })
    },
    getCanDataByCanId ({ commit }, dataNaviId) {
      fetchCanDataById(dataNaviId).then(response => {
        commit('SET_TABLE_DATA', response)
      })
    },
    updateCanData ({dispatch}, payload) {
      updateCanData(payload).then(res => {
        dispatch('getCanDataByCanId', payload.dataNaviId)
      })
    },
    downloadCanLabelData ({ commit }, data) {
      const {carNo, ...payload} = data
      downloadCanLabelData(payload).then(res => {
        const content = res
        const blob = new Blob([content])
        const fileName = `${carNo}.csv`
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = window.URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          window.URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    getCanLabelsData ({commit}, payload) {
      return new Promise((resolve, reject) => {
        fetchCanLabels2({...payload}).then(res => {
          resolve(res.totalCount)
          commit('SET_LABELDATA2', res.list)
        })
      })
    }
  }
}

export default meta
