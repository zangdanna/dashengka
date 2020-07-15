import request from '@/utils/request'

export function listNavData (data) {
  return request({
    url: `/api/iov/navi-data`,
    method: 'get',
    params: data
  })
}

export function fetchNavData (data) {
  const {dataNaviId} = data
  return request({
    url: `/api/iov/navi-data/${dataNaviId}`,
    method: 'get'
  })
}

export function updateNavData (data) {
  const {dataNaviId} = data
  return request({
    url: `/api/iov/navi-data/${dataNaviId}`,
    method: 'post',
    data
  })
}

export function addNavData (data) {
  return request({
    url: `/api/iov/navi-data`,
    method: 'post',
    data
  })
}

export function deleteNavData (data) {
  return request({
    url: `/api/iov/navi-data`,
    method: 'delete',
    data
  })
}

export function listNavDetail (data) {
  const {dataNaviId} = data
  return request({
    url: `/api/iov/navi-detail/${dataNaviId}`,
    method: 'get',
    params: data
  })
}

export function updateNavDetail (data) {
  return request({
    url: '/api/iov/navi-detail/update',
    method: 'post',
    data
  })
}

export function addNavDetail (data) {
  return request({
    url: '/api/iov/navi-detail',
    method: 'post',
    data
  })
}

export function deleteNavDetail (data) {
  return request({
    url: '/api/iov/navi-detail',
    method: 'delete',
    data
  })
}
