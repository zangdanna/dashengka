<template>
  <info-pannel class="new-task" style="top: 90px;overflow:auto">
    <el-row>
      <el-col :span="24" class="text1">新增围栏</el-col>
    </el-row>
    <el-row style="height:15px"></el-row>
    <el-form :model="formData" size="small" label-position="top" ref="geoForm" :rules="rules">
      <el-form-item label="围栏名称" prop="name">
        <el-input v-model="formData.name" placeholder="输入围栏名称"></el-input>
      </el-form-item>
      <el-form-item label="过期日期" prop="validTime">
        <el-date-picker style="width: 100%" v-model="formData.validTime" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="周监控日期" prop="week">
        <el-select style="width: 100%" v-model="formData.week" multiple placeholder="请选择">
          <el-option label="Mon" value="monValid"></el-option>
          <el-option label="Tues" value="tuesValid"></el-option>
          <el-option label="Wed" value="wedValid"></el-option>
          <el-option label="Thur" value="thurValid"></el-option>
          <el-option label="Fri" value="friValid"></el-option>
          <el-option label="Sat" value="satValid"></el-option>
          <el-option label="Sun" value="sunValid"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="围栏描述">
        <el-input v-model="formData.desc" placeholder="围栏描述信息"></el-input>
      </el-form-item>
      <el-form-item label="围栏类型">
        <el-radio-group v-model="formData.geofenceType">
          <el-radio label="district">行政区划</el-radio>
          <el-radio label="line">路线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="formData.geofenceType==='district'" label="选择区域" prop="areaValue">
        <area-selector style="width: 100%" :map="map" v-model="formData.areaValue" :defaultValue="formData.defaultAreaValue" @onAreaSelect="handleAreaSelect"></area-selector>
      </el-form-item>
      <el-form-item v-show="formData.geofenceType==='line'" label="偏离距离(米)" prop="offset">
        <el-input v-model="formData.offset" placeholder="输入偏离距离"></el-input>
      </el-form-item>
      <el-form-item v-show="formData.geofenceType==='line'" label="起始位置" prop="startPosition" :rules="rules.startPosition">
        <el-row>
          <el-col :span="20"><el-input id="startPlace" v-model="formData.startPoint" placeholder="输入起始位置"></el-input></el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="3">
            <el-tooltip v-if="mapSelect!=='start'" popper-class="btn-tip" :enterable="false" :open-delay="1000" content="地图选点" placement="top-start">
              <el-button type="primary" icon="el-icon-place" circle @click="mapSelect='start'"></el-button>
            </el-tooltip>
            <el-tooltip v-if="mapSelect==='start'" popper-class="btn-tip" :enterable="false" :open-delay="1000" content="确定" placement="top-start">
              <el-button type="success" icon="el-icon-check" circle @click="mapSelect=''"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-show="formData.geofenceType==='line'" label="终点位置" prop="endPosition" :rules="rules.endPosition">
        <el-row>
          <el-col :span="20"><el-input id="endPlace" ref="endPlace" v-model="formData.endPoint" placeholder="输入终点位置"></el-input></el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="3">
            <el-tooltip v-if="mapSelect!=='end'" popper-class="btn-tip" :enterable="false" :open-delay="1000" content="地图选点" placement="top-start">
              <el-button type="primary" icon="el-icon-place" circle @click="mapSelect='end'"></el-button>
            </el-tooltip>
            <el-tooltip v-if="mapSelect==='end'" popper-class="btn-tip" :enterable="false" :open-delay="1000" content="确定" placement="top-start">
              <el-button type="success" icon="el-icon-check" circle @click="mapSelect=''"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-show="formData.geofenceType==='line'" label="路径规划方案" :required="true">
        <el-radio-group style="width:100%" v-model="formData.roadType">
          <el-row>
            <el-col :span="12"><el-radio label="LEAST_TIME">最快捷</el-radio></el-col>
            <el-col :span="12"><el-radio label="LEAST_FEE">最经济</el-radio></el-col>
          </el-row>
          <el-row style="height:10px"></el-row>
          <el-row>
            <el-col :span="12"><el-radio label="LEAST_DISTANCE">最短距离</el-radio></el-col>
            <el-col :span="12"><el-radio label="REAL_TRAFFIC">实时路况</el-radio></el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="formData.geofenceType==='line'">
        <el-row>
          <el-col :span="15">&nbsp;</el-col>
          <el-col :span="9"><el-button type="primary" @click="routePlan">确认路线</el-button></el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="11"><el-button style="width: 100%" type="info" round @click="cancel">取消</el-button></el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="11"><el-button style="width: 100%" type="success" round @click="submit" :loading="submitLoading">确认</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </info-pannel>
</template>

<script>
import areaSelector from '@/components/areaSelector'
import infoPannel from '@/components/infoPannel'
import { getAddrByLnglat, startMarker, endMarker, autocomplete, drivingRoad, createMapLine } from '@/utils'
import { Message } from 'element-ui'
import { fetchGeofence, updateGeofence, addGeofence } from '@/api'
import init from './mixins/init'

export default {
  mixins: [init],
  data () {
    let checkAreaValue = (rule, value, callback) => {
      if (this.formData.geofenceType === 'district') {
        if (value.length === 0) {
          callback(new Error('请选择行政区域'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let checkLineValue = (rule, value, callback) => {
      if (this.formData.geofenceType === 'line') {
        if (value.length === 0) {
          let msg = rule.field === 'startPosition' ? '起始位置' : '终点位置'
          callback(new Error(`请设置${msg}`))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      formData: {
        name: '',
        validTime: new Date(new Date().setDate(new Date().getDate() + 90)),
        week: [],
        desc: '',
        areaValue: [],
        defaultAreaValue: [],
        startPoint: '',
        startPosition: [],
        endPoint: '',
        endPosition: [],
        polyline: '',
        cityCode: '',
        geofenceType: 'district',
        roadType: 'LEAST_TIME',
        offset: 50
      },
      rules: {
        name: [
          { required: true, message: '请输入围栏名称', trigger: 'blur' }
        ],
        offset: [
          { required: true, message: '请输入偏离距离', trigger: 'blur' }
        ],
        week: [
          { required: true, message: '请选择周监控日期', trigger: 'change' }
        ],
        validTime: [
          { type: 'date', required: true, message: '请选择过期日期', trigger: 'change' }
        ],
        areaValue: [
          { validator: checkAreaValue, required: true, trigger: 'change' }
        ],
        startPosition: [
          { validator: checkLineValue, required: true, trigger: 'change' }
        ],
        endPosition: [
          { validator: checkLineValue, required: true, trigger: 'change' }
        ]
      },
      mapSelect: '',
      startMarker: null,
      endMarker: null,
      submitLoading: false
    }
  },
  components: { areaSelector, infoPannel },
  created () {
    const geoId = this.$route.query.geoId
    if (geoId) {
      fetchGeofence({geoId: geoId}).then(async res => {
        this.formData = await this.serializeGeoResData(res)
        if (res.type === 'line') {
          let polyline = res.polyline
          let path = polyline.split(';').map(item => item.split(','))
          const line = createMapLine(path, this.gc.map.strokeColor, true)
          this.map.add(line)
          this.map.setFitView()
        }
      })
    }
    // 点击地图选中地址
    const that = this
    this.map.on('click', e => {
      if (that.mapSelect !== '') {
        const position = [e.lnglat.getLng(), e.lnglat.getLat()]
        let marker = that.mapSelect === 'start' ? that.startMarker : that.endMarker
        if (marker) {
          that.map.remove(marker)
        }
        getAddrByLnglat(position).then(({fmtAddr}) => {
          if (that.mapSelect === 'start') {
            that.formData.startPoint = fmtAddr
            that.formData.startPosition = position
            that.startMarker = startMarker(position)
            that.map.add(that.startMarker)
          } else {
            that.formData.endPoint = fmtAddr
            that.formData.endPosition = position
            that.endMarker = endMarker(position)
            that.map.add(that.endMarker)
          }
        })
      }
    })
  },
  mounted () {
    // 地址自动补全
    autocomplete('startPlace').then(auto => {
      // 注册监听，当选中某条记录时会触发
      AMap.event.addListener(auto, 'select', e => {
        this.formData.startPoint = e.poi.name
        const location = e.poi.location
        this.formData.startPosition = [location.lng, location.lat]
      })
    })
    autocomplete('endPlace').then(auto => {
      // 注册监听，当选中某条记录时会触发
      AMap.event.addListener(auto, 'select', e => {
        this.formData.endPoint = e.poi.name
        const location = e.poi.location
        this.formData.endPosition = [location.lng, location.lat]
      })
    })
  },
  methods: {
    routePlan () {
      if (this.mapSelect !== '') {
        const msg = this.mapSelect === 'start' ? '起始位置' : '终点位置'
        Message({
          message: `请确认${msg}`,
          type: 'warning',
          duration: 1 * 1000
        })
        return
      }
      this.map.clearMap()
      drivingRoad(this.map, this.formData.startPosition, this.formData.endPosition, this.formData.roadType).then(result => {
        this.formData.polyline = result.routes[0].steps.map(step => step.path.map(i => i.toString()).join(';')).join(';')
      })
    },
    cancel () {
      this.$router.push({name: 'geofenceList'})
    },
    submit () {
      this.$refs['geoForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = this.serializeGeoFormData(this.formData)
          if (this.$route.query.geoId) {
            // update geofence
            updateGeofence({geoId: this.$route.query.geoId, ...data}).then(res => {
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
              this.$router.push({name: 'geofenceList'})
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            // add geofence
            if (this.formData.polyline === '') {
              Message({
                message: `请确认路线`,
                type: 'warning',
                duration: 1 * 1000
              })
              this.submitLoading = false
              return
            }
            addGeofence(data).then(res => {
              this.$message({
                message: '新增成功！',
                type: 'success'
              })
              this.$router.push({name: 'geofenceList'})
            }).finally(() => {
              this.submitLoading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAreaSelect (params) {
      this.formData.cityCode = params.cityCode
      this.formData.polyline = params.bounds.map(area => area.map(i => i.toString()).join(';')).join('|')
    }
  }
}
</script>

<style scoped>
.new-task >>> .el-form-item__label {
  line-height: 20px;
}
.new-task {
  position: absolute;
  left: 271px;
}
</style>
