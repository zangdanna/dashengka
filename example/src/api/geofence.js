import request from '@/utils/request'

export function fetchVehicleMonitor (data) {
  return request({
    url: '/api/iov/vehicle-mon',
    method: 'get',
    params: data
  })
}

export function addGeofence (data) {
  return request({
    url: '/api/iov/geofence',
    method: 'post',
    data
  })
}

export function deleteGeofence (geoId) {
  return request({
    url: `/api/iov/geofence/${geoId}`,
    method: 'delete'
  })
}

export function updateGeofence (data) {
  const {geoId, ...other} = data
  return request({
    url: `/api/iov/geofence/${geoId}`,
    method: 'patch',
    data: other
  })
}

export function fetchGeofence (data = {}) {
  const {geoId = '', ...other} = data
  return request({
    url: `/api/iov/geofence/${geoId}`,
    method: 'get',
    params: {containPoly: true, ...other}
  })
}

export function addMonitor (data) {
  return request({
    url: '/api/iov/mon',
    method: 'post',
    data
  })
}

export function deleteMonitor (monId) {
  return request({
    url: `/api/iov/mon/${monId}`,
    method: 'delete'
  })
}

export function updateMonitor (data) {
  const {monId, ...other} = data
  return request({
    url: `/api/iov/mon/${monId}`,
    method: 'patch',
    data: other
  })
}

export function fetchMonitor (data = {}) {
  const {monId = '', ...other} = data
  return request({
    url: `/api/iov/mon/${monId}`,
    method: 'get',
    params: other
  })
}
