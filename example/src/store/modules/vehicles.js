import { fetchCarPoint } from '@/api'

export default {
  state: {},
  actions: {
    getCarPoint (context, selectedFleet) {
      return new Promise((resolve, reject) => {
        fetchCarPoint().then(res => {
          const pointData = []
          const fleetData = {}
          fleetData['all'] = res.list
          res.list.map(item => {
            if (fleetData[item.fleetId]) {
              fleetData[item.fleetId].push(item)
            } else {
              fleetData[item.fleetId] = [item]
            }
          })
          fleetData[selectedFleet].map((item) => {
            pointData.push({
              'lnglat': [item.lng, item.lat],
              'item': item
            })
          })
          resolve({fleetData, pointData})
        })
      })
    }
  }
}
