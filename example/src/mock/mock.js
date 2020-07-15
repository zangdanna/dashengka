// mock
import { param2Obj } from '@/utils'
import * as meta from './meta'
import * as track from './track'
let Mock = require('mockjs')

Mock.mock(/\/api\/iov\/vehicle-status/, 'get', function (config) {
  let citlats = [
    { carNo: '苏B12G34', vin: '1', fleetId: '1', updateAt: '2012-01-01 12:13:14', odo: '200', speed: '65', lat: 31.483557, lng: 120.375068, latestTripCnt: '123', latestTimeCnt: '2012-01-01 12:13:14', latestOdoCnt: '600', latestStartAt: '2012-01-01 12:13:14' },
    { carNo: '苏B2R436', vin: '2', fleetId: '2', updateAt: '2012-01-01 12:13:14', odo: '200', speed: '65', lat: 31.591792, lng: 120.453287, latestTripCnt: '342', latestTimeCnt: '2012-01-01 12:13:14', latestOdoCnt: '600', latestStartAt: '2012-01-01 12:13:14' },
    { carNo: '苏B8A789', vin: '3', fleetId: '3', updateAt: '2012-01-01 12:13:14', odo: '200', speed: '65', lat: 31.565139, lng: 120.356427, latestTripCnt: '755', latestTimeCnt: '2012-01-01 12:13:14', latestOdoCnt: '600', latestStartAt: '2012-01-01 12:13:14' },
    { carNo: '苏L12K3', vin: '4', fleetId: '4', updateAt: '2012-01-01 12:13:14', odo: '200', speed: '65', lat: 31.580178, lng: 120.283257, latestTripCnt: 'ht6', latestTimeCnt: '2012-01-01 12:13:14', latestOdoCnt: '600', latestStartAt: '2012-01-01 12:13:14' },
    { carNo: '苏Q1P13', vin: '5', fleetId: '5', updateAt: '2012-01-01 12:13:14', odo: '200', speed: '65', lat: 48.695807, lng: 126.26419, latestTripCnt: '85g', latestTimeCnt: '2012-01-01 12:13:14', latestOdoCnt: '600', latestStartAt: '2012-01-01 12:13:14' }
    // ...
  ]
  return {
    list: citlats
  }
})
Mock.mock(/\/api\/iov\/vehicle\/2\/trip\//, 'get', function (config) {
  return {
    totalCount: 71,
    offset: 0,
    limit: -1,
    list: [
      {
        vin: '2',
        tripCnt: 1,
        timeCnt: 180000,
        odoCnt: 9,
        startAt: 1579480560000,
        updateAt: 1581502979000,
        speedAvg: 180.0,
        startLat: 31.558652,
        startLng: 120.354358,
        endLat: 31.504454,
        endLng: 120.330825,
        eventSum: [
          { eventType: 1, eventCount: 1 },
          { eventType: 2, eventCount: 1 },
          { eventType: 3, eventCount: 1 },
          { eventType: 4, eventCount: 1 },
          { eventType: 5, eventCount: 1 }
        ]
      },
      {
        vin: '2',
        tripCnt: 2,
        timeCnt: 375000,
        odoCnt: 2,
        startAt: 1579547820000,
        updateAt: 1579548194000,
        speedAvg: 19.2,
        startLat: 31.558652,
        startLng: 120.354358,
        endLat: 31.504454,
        endLng: 120.330825,
        eventSum: []
      }
    ]
  }
})
Mock.mock(/\/api\/iov\/vehicle\/.\/trip\/./, 'get', function (config) {
  const { to } = param2Obj(config.url)
  let pathParam = []
  if (to === '') {
    pathParam = [
      { recordAt: 1581052889678, odo: '234', speed: '60', lng: 120.375041, lat: 31.483557 },
      { recordAt: 1581052890678, odo: '234', speed: '61', lng: 120.371822, lat: 31.483424 },
      { recordAt: 1581052891678, odo: '234', speed: '62', lng: 120.371544, lat: 31.481324 },
      { recordAt: 1581052892678, odo: '234', speed: '63', lng: 120.371206, lat: 31.479462 },
      { recordAt: 1581052893678, odo: '234', speed: '64', lng: 120.371189, lat: 31.478085 },
      { recordAt: 1581052894678, odo: '234', speed: '65', lng: 120.377026, lat: 31.478863 },
      { recordAt: 1581052895678, odo: '234', speed: '66', lng: 120.379091, lat: 31.478826 },
      { recordAt: 1581052896678, odo: '234', speed: '67', lng: 120.378963, lat: 31.480903 },
      { recordAt: 1581052897678, odo: '234', speed: '68', lng: 120.378507, lat: 31.482898 },
      { recordAt: 1581052898678, odo: '234', speed: '69', lng: 120.37812, lat: 31.48411 },
      { recordAt: 1581052899678, odo: '234', speed: '70', lng: 120.375154, lat: 31.483561 }
    ]
  } else {
    pathParam = [
      { recordAt: 1581052871678, odo: '234', speed: 0, lng: 120.374596, lat: 31.480098 },
      { recordAt: 1581052872678, odo: '234', speed: '20', lng: 120.37524, lat: 31.480158 },
      { recordAt: 1581052873678, odo: '234', speed: '30', lng: 120.375218, lat: 31.48062 },
      { recordAt: 1581052874678, odo: '234', speed: '40', lng: 120.375165, lat: 31.480661 },
      { recordAt: 1581052875678, odo: '234', speed: '50', lng: 120.375127, lat: 31.480775 },
      { recordAt: 1581052876678, odo: '234', speed: '60', lng: 120.375256, lat: 31.480972 },
      { recordAt: 1581052877678, odo: '234', speed: '200', lng: 120.375143, lat: 31.48287 },
      { recordAt: 1581052878678, odo: '234', speed: '70', lng: 120.375041, lat: 31.483557 },
      { recordAt: 1581052879678, odo: '234', speed: '63', lng: 120.371822, lat: 31.483424 },
      { recordAt: 1581052880678, odo: '234', speed: '64', lng: 120.371544, lat: 31.481324 },
      { recordAt: 1581052881678, odo: '234', speed: '65', lng: 120.371206, lat: 31.479462 },
      { recordAt: 1581052882678, odo: '234', speed: '60', lng: 120.371189, lat: 31.478085 },
      { recordAt: 1581052883678, odo: '234', speed: '70', lng: 120.377026, lat: 31.478863 },
      { recordAt: 1581052884678, odo: '234', speed: '56', lng: 120.379091, lat: 31.478826 },
      { recordAt: 1581052885678, odo: '234', speed: '45', lng: 120.378963, lat: 31.480903 },
      { recordAt: 1581052886678, odo: '234', speed: '65', lng: 120.378507, lat: 31.482898 },
      { recordAt: 1581052887678, odo: '234', speed: '67', lng: 120.37812, lat: 31.48411 },
      { recordAt: 1581052888678, odo: '234', speed: '60', lng: 120.375154, lat: 31.483561 }
    ]
  }
  return {
    totalCount: 60,
    offset: 0,
    limit: -1,
    timeCnt: 180000,
    odoCnt: 389,
    startAt: 1582093740000,
    updateAt: 1582093919000,
    list: pathParam,
    events: [
      {
        eventId: '001',
        eventType: 1,
        startAt: 1581052877678,
        endAt: 1581052879678
      }
    ]
  }
})
Mock.mock(/\/api\/iov\/vehicle\/.\/can/, 'get', track.labelData)
Mock.mock(/\/api\/iov\/vehicle\/./, 'get', function (config) {
  return {
    vin: '2',
    fleetId: '车队2',
    licenseId: '123',
    carNo: '苏B2R436',
    brand: 'audi',
    model: 'A3',
    carProductYear: '2018',
    driverName: '张伟2',
    phoneNum: '185212233213',
    carNameMark: 'asdf'
  }
})

Mock.mock(/\/api\/iov\/vehicle-report\/monthly/, 'get', function (config) {
  return {
    list: [
      {
        vin: 2,
        fleetId: '车队2',
        yearMonth: '2019-12',
        odoCnt: 13588.2,
        timeCnt: 401.6,
        eventSum: [
          {
            eventType: 2,
            eventCount: 1
          },
          {
            eventType: 3,
            eventCount: 1
          },
          {
            eventType: 5,
            eventCount: 1
          }
        ]
      },
      {
        vin: 2,
        fleetId: '车队2',
        yearMonth: '2020-01',
        odoCnt: 13188.2,
        timeCnt: 321.6,
        eventSum: [
          {
            eventType: 2,
            eventCount: 1
          },
          {
            eventType: 3,
            eventCount: 1
          },
          {
            eventType: 5,
            eventCount: 1
          }
        ]
      }
    ]
  }
})

Mock.mock(/\/api\/iov\/navi-detail/, 'get', meta.canDeatal)
Mock.mock(/\/api\/iov\/navi-detail\/update/, 'post', meta.canDeatal)
Mock.mock(/\/api\/iov\/navi-data\/./, 'get', meta.canData)
Mock.mock(/\/api\/iov\/navi-data\/./, 'post', meta.canData)
