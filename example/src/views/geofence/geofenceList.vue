<template>
  <div class="geofence-list">
    <info-pannel style="top: 90px">
      <el-row>
        <el-col :span="19">
          <el-input style="width:100%" v-model="geofence" size="small" placeholder="搜索围栏名称"></el-input>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="4">
          <el-button v-if="!selectGeofence" type="primary" size="small" @click="newGeofence" round>新增</el-button>
          <el-button v-if="selectGeofence" type="success" size="small" round @click="selectForMonitor">确认</el-button>
        </el-col>
      </el-row>
      <el-row style="height:15px"></el-row>
      <ul style="overflow: auto;max-height: calc(83vh - 60px);">
        <li v-for="(item, index) in geofenceList" :key='index' v-show="searchGeofence(item.name)">
          <el-card style="cursor: pointer" @click.native="getGeofence(item, index)">
            <el-row>
              <el-col :span="20">
                <el-radio v-model="selectedGeofence" :label="index">{{item.name}}</el-radio>
              </el-col>
              <el-col :span="2" v-show="selectedGeofence === index && !selectGeofence">
                <div style="color:#409eff;cursor: pointer"><i class="el-icon-edit" @click="editGeofence(item.id)"></i></div>
              </el-col>
              <el-col :span="2" v-show="selectedGeofence === index && !selectGeofence">
                <el-popconfirm title="确定要删除吗？" @onConfirm="deleteGeofence(item.id)">
                  <div slot="reference" style="color:#f56c6c;cursor: pointer"><i class="el-icon-delete"></i></div>
                </el-popconfirm>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">围栏类型:{{item.type | geoType}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">围栏描述:{{item.detail}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="22">创建时间:{{item.createAt | dateFormat('YYYY-mm-dd HH:MM:SS')}}</el-col>
            </el-row>
          </el-card>
          <el-row style="height:10px"></el-row>
        </li>
      </ul>
    </info-pannel>
  </div>
</template>

<script>
import infoPannel from '@/components/infoPannel'
import { drawCityLine, createMapLine } from '@/utils'
import { deleteGeofence, fetchGeofence } from '@/api'
import init from './mixins/init'

export default {
  mixins: [init],
  data () {
    return {
      geofence: '',
      selectedGeofence: '0',
      selectGeofence: false,
      polygons: [],
      geofenceList: []
    }
  },
  components: { infoPannel },
  created () {
    this.selectGeofence = this.$route.params.selectGeofence
    // 获取围栏一览
    fetchGeofence({containPoly: false}).then(res => {
      this.geofenceList = res
    })
  },
  methods: {
    newGeofence () {
      this.$router.push({name: 'newGeofence'})
    },
    editGeofence (id) {
      this.$router.push({name: 'newGeofence', query: {geoId: id}})
    },
    deleteGeofence (id) {
      deleteGeofence(id).then(res => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.selectedGeofence = '1'
        this.map.clearMap()
        // 获取围栏一览
        fetchGeofence().then(res => {
          this.geofenceList = res
        })
      })
    },
    getGeofence (item, id) {
      if (this.selectedGeofence === id) { return }
      this.selectedGeofence = id
      this.map.clearMap()
      if (item.type === 'line') {
        fetchGeofence({geoId: item.id}).then(res => {
          let polyline = res.polyline
          let path = polyline.split(';').map(item => item.split(','))
          const line = createMapLine(path, this.gc.map.strokeColor, true)
          this.map.add(line)
          this.map.setFitView()
        })
      } else {
        drawCityLine(this.map, this.polygons, item.districtAdcode, true).then(polygons => {
          this.polygons = polygons
        })
      }
    },
    searchGeofence (geofenceName = '') {
      return geofenceName.indexOf(this.geofence) !== -1
    },
    selectForMonitor () {
      let {id, name} = this.geofenceList[this.selectedGeofence]
      this.$store.commit('UODATE_GEO', {id, name})
      this.$store.commit('SET_INIT', false)
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
.geofence-list >>> .el-card__body {
  padding: 10px;
}
.geofence-list{
  position: absolute;
  height: 100%;
  top: 0px;
}
</style>
