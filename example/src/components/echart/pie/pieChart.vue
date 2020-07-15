<template>
  <div :class="className" :id="id" :style="{height:height}"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    data: {
      type: Array,
      default () {
        return [{name: 'default', value: 0}]
      }
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '230px'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    data (val, oldVal) {
      if (oldVal === []) {
        this.chart = null
      }
      this.initChart()
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById(this.id))
      }
      let sum = 0
      this.data.map(item => {
        sum += item.value
      })
      this.chart.setOption({
        title: {
          text: [`{a|${sum}}`, `{b|次}`],
          left: 'center',
          top: '35%',
          textStyle: {
            fontFamily: 'DINAlternate-Bold',
            rich: {
              a: {
                color: '#40DCC0',
                fontSize: 30,
                fontFamily: 'DINAlternate-Bold'
              },
              b: {
                color: '#40DCC0',
                fontSize: 14
              }
            }
          },
          subtext: '总数',
          itemGap: 0,
          subtextStyle: {
            color: '#40DCC0',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          textStyle: {
            color: '#ffffff8c',
            fontSize: 11
          },
          itemWidth: 8,
          itemHeight: 8,
          data: ['超速', '疲劳驾驶', '急转弯', '急加速', '急减速']
        },
        series: [
          {
            name: '违规事件占比',
            type: 'pie',
            center: ['50%', '42%'],
            radius: ['60%', '70%'],
            avoidLabelOverlap: false,
            label: {
              color: '#ffffff8c',
              formatter: params => {
                return `${Math.round(
                  params.percent
                )}%`
              }
            },
            data: this.data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function (params) {
                  // 自定义颜色
                  // var colorList = [
                  //   '#dc4444', '#5793f3', '#8460a8', '#9fde3f', '#fd9c35',
                  //   '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                  //   '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                  // ]
                  // 1: '超速', 2: '急转弯', 3: '急加速', 4: '急减速', 5: '疲劳驾驶'
                  var colorList = [
                    '#fff500', '#fa5758', '#de86ff', '#7effc8', '#ffa11d',
                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>
