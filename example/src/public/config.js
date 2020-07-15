export default {
  map: {
    mapStyle: 'amap://styles/00c64dfae17e2a44cf6fb1f3ee48d8c4',
    lineWidth: 4,
    strokeColor: '#0091ea',
    eventStrokeColor: '#ff00ff',
    eventForOverSpeedStrokeColor: '#fff500',
    eventForSharpTurnStrokeColor: '#e63832',
    eventForRapidAccelerateStrokeColor: '#de86ff',
    eventForRapidDecelerationStrokeColor: '#4b7f69',
    eventForFatigueDrivingStrokeColor: '#ffa11d',
    dirArrowColor: 'white'
  },
  cityCode: [
    { label: '全国', code: '中国' },
    { label: '无锡', code: '320200' },
    { label: '上海', code: '310000' },
    { label: '南京', code: '320100' },
    { label: '深圳', code: '440300' },
    { label: '广州', code: '440100' }
  ],
  carPointRefreshTime: 30 * 1000,
  trackRefreshTime: 10 * 1000,
  eventMap: { 0: '三急事件', 1: '超速', 2: '急转弯', 3: '急加速', 4: '急减速', 5: '疲劳驾驶' },
  // event 事件优先级，5最小，1最大
  eventPriority: [5, 2, 4, 3, 1],
  // 判断trip是否结束时间(分钟)
  tripEndTime: 3,
  // trip 延迟时间(分钟)
  tripDelay: 3,
  // trip初始化放入巡航器的点数
  initTripCount: 60
}
