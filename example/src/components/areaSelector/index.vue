<template>
  <el-cascader clearable :key="key" ref="areaCascader" @change="onProvincesChange" size="small" v-model="value" class="cascader" :props="props"></el-cascader>
</template>

<script>
import _ from 'lodash'
export default {
  props: {
    map: {
      required: true
    },
    defaultValue: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      polygons: [],
      key: 1,
      value: [],
      district: null,
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, value, data } = node
          let area = level === 0 ? '中国' : value
          this.coverArea(area, data ? data.areaLevel : '').then(({subList}) => {
            const nodes = subList.map(item => ({
              value: item.adcode,
              label: item.name,
              areaLevel: item.level,
              leaf: level >= 2
            }))
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          })
        }
      }
    }
  },
  watch: {
    defaultValue: {
      handler (val, oldVal) {
        this.value = val
        this.key += 1
        setTimeout(() => {
          this.coverArea(_.last(val), 'district', true)
        }, 2000)
      },
      deep: true
    }
  },
  created () {
    AMap.plugin('AMap.DistrictSearch', _ => {
      this.district = new AMap.DistrictSearch({
        // 关键字对应的行政区级别，country表示国家
        subdistrict: 1, // 返回下一级行政区
        showbiz: false // 最后一级返回街道信息
      })
    })
  },
  methods: {
    coverArea (area, level = '', border = false) {
      if (!area) { return }
      this.polygons.map(item => { item.setMap(null) })
      let extensions = border ? 'all' : 'base'
      return new Promise((resolve, reject) => {
        this.district.setLevel(level)
        this.district.setExtensions(extensions)
        this.district.search(area, (status, result) => {
          // 查询成功时，result即为对应的行政区信息
          if (status === 'complete') {
            const bounds = result.districtList[0].boundaries
            const subList = result.districtList[0].districtList
            if (bounds && border) {
              bounds.map(item => {
                const polygon = new AMap.Polygon({
                  map: this.map,
                  strokeWeight: 1,
                  strokeColor: '#0091ea',
                  fillColor: '#80d8ff',
                  fillOpacity: 0.2,
                  path: item
                })
                this.polygons.push(polygon)
              })
              this.map.setFitView()// 地图自适应
            }
            resolve({subList, bounds, cityCode: result.districtList[0].citycode})
          }
        })
      })
    },
    onProvincesChange (item) {
      this.$emit('input', item)
      this.map.clearMap()
      this.coverArea(_.last(item), 'district', true).then(({bounds, cityCode}) => {
        this.$emit('onAreaSelect', {bounds, cityCode})
      })
    }
  }
}
</script>
<style scoped>
/* .cascader{ */
  /* position: absolute; */
  /* top: 85px; */
  /* left: 20px; */
/* } */
</style>
