import request from '@/utils/request'

export * from './geofence'

export * from './metaApi'

export function fetchCarPoint (data) {
  return request({
    url: '/api/iov/vehicle-status',
    method: 'get',
    params: { data }
  })
}

export function fetchTrackLine (data) {
  let { vin, tripCnt, ...other } = data
  tripCnt = tripCnt === 0 ? tripCnt : tripCnt || ''
  return request({
    url: `/api/iov/vehicle/${vin}/trip/${tripCnt}`,
    method: 'get',
    params: { ...other }
  })
}

export function fetchCarInfo (vin) {
  return request({
    url: `/api/iov/vehicle/${vin}`,
    method: 'get'
  })
}

export function fetchCarReportMonthly (data) {
  return request({
    url: `/api/iov/vehicle-report/monthly`,
    method: 'get',
    params: { ...data }
  })
}

export function fetchCanData (data) {
  return request({
    url: `/api/iov/navi-data/vehicle`,
    method: 'get',
    params: { ...data }
  })
}

export function fetchCanDataById (dataNaviId) {
  return request({
    url: `/api/iov/navi-data/${dataNaviId}`,
    method: 'get'
  })
}

export function updateCanData (data) {
  let { dataNaviId, summary } = data
  return request({
    url: `/api/iov/navi-data/${dataNaviId}`,
    method: 'post',
    data: {summary}
  })
}

export function fetchCanDetail (data) {
  const { dataNaviId, ...other } = data
  return request({
    url: `/api/iov/navi-detail/${dataNaviId}`,
    method: 'get',
    params: {...other, limit: -1}
  })
}

export function updateCanDetail (data) {
  return request({
    url: `/api/iov/navi-detail/update`,
    method: 'post',
    data
  })
}

export function fetchCanLabels (data) {
  const { vin, ...other } = data
  return request({
    url: `/api/iov/vehicle/${vin}/can`,
    method: 'get',
    params: other
  })
}

export function fetchCanLabels2 (data) {
  const { vin, ...other } = data
  const timeOffset = new Date().getTimezoneOffset() / 60
  const timeZone = timeOffset > 0 ? 'GMT-' + Math.abs(timeOffset) : 'GMT+' + Math.abs(timeOffset)
  return request({
    url: `/api/iov/vehicle/${vin}/can2`,
    method: 'get',
    params: {...other, timeZone}
  })
}

export function downloadCanLabelData (data) {
  const { vin, ...other } = data
  const timeOffset = new Date().getTimezoneOffset() / 60
  const timeZone = timeOffset > 0 ? 'GMT-' + Math.abs(timeOffset) : 'GMT+' + Math.abs(timeOffset)
  return request({
    url: `/api/iov/vehicle/${vin}/can2.csv`,
    method: 'get',
    params: {...other, timeZone},
    responseType: 'blob'
  })
}

export function fetchVehicleByFleetId (fleetId) {
  return request({
    url: `/api/iov/vehicle`,
    method: 'get',
    params: {fleetId}
  })
}
