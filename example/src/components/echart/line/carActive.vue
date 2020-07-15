<template>
  <div :id="id" :style="{height:height}"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    id: {
      type: String,
      default: 'lineChart'
    },
    height: {
      type: String,
      default: '230px'
    }
  },
  data () {
    return {
      chart: null,
      option: {
        // 24小时车辆活跃数
        color: ['#40DCC0'],
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: 'rgb(176,176,227)',
              width: 0.5
            }
          },
          nameTextStyle: {
            fontFamily: 'DINAlternate-Bold'
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: 'rgb(176,176,227)',
              // color:'#ffffff',
              width: 0.1
            }
          },
          axisLabel: {
            margin: 8
          }
        },
        grid: {
          top: '17%',
          bottom: '19%',
          left: '0%',
          right: '5%',
          containLabel: true
        },
        yAxis: [{
          type: 'value',
          name: '万辆',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(176,176,227)',
              width: 0.5
            }
          },
          nameTextStyle: {
            fontFamily: 'DIN Alternate'
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ['rgb(176,176,227)'],
              width: 0.5
            }
          }
        }, {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(176,176,227)',
              width: 0.5
            }
          },
          nameTextStyle: {
            fontFamily: 'DIN Alternate'
          },
          splitLine: {
            lineStyle: {
              // 使用深浅的间隔色
              color: ['rgb(176,176,227)'],
              width: 0.5
            }
          }
        }],
        series: [{
          name: '24小时车辆活跃数',
          data: [],
          type: 'line',
          smooth: true,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgb(49,127,131)' },
                { offset: 0.5, color: 'rgb(46,115,129)' },
                { offset: 1, color: 'rgb(39,62,86)' }
              ])
            }
          },
          itemStyle: {
            normal: {
              opacity: 0, // 为0不会绘制图形拐点消失
              lineStyle: {
                color: '#40DCC0',
                width: 2
              } // 线条的样式
            }
          }
        }]
      }
    }
  },
  mounted () {
    this.chart = echarts.init(document.getElementById(this.id))
    const option = Object.assign({}, this.option)
    option.xAxis.data = this.data.map(e => e.name)
    option.series[0].data = this.data.map(e => e.value)
    this.chart.setOption(option)
  }
}
</script>
