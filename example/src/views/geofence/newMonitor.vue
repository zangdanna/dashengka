<template>
  <div class="form-div">
    <el-form :model="monitorFormData" ref="monForm" size="small" label-position="left" label-width="80px">
      <el-form-item label="监控名称" prop="monitorName" :rules="rules.monitorName">
        <el-row>
          <el-col :span="8">
            <el-input v-model="monitorFormData.monitorName" placeholder="请输入监控名称"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="围栏设置" prop="geofence" :rules="rules.geofence">
        <el-row>
          <el-col :span="8">
            <el-input v-model="monitorFormData.geofence.name" placeholder="请选择围栏"></el-input>
          </el-col>
          <el-col :span="1">&nbsp;</el-col>
          <el-col :span="4">
            <el-button type="primary" round size="small" @click="selectGeofence">选择围栏</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="任务车辆" prop="fleet" :rules="rules.fleet">
        <el-card>
          <el-row>
            <el-col :span="12">
              <el-select v-model="monitorFormData.fleet" placeholder="请选择车队" @change="changeFleet">
                <el-option v-for="(fleet, index) in fleets.filter(obj=>obj!=='all')" :key="index" :label="'车队'+fleet" :value="fleet"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <div style="float:right"><span style="font-size:15px">已选<span style="font-size:25px">{{carList.length}}</span>辆</span></div>
            </el-col>
          </el-row>
          <el-table
          :data="carList"
          :header-cell-style="{background:'#002d77'}"
          :stripe="true"
          size="mini"
          max-height="400"
          style="width: 95%;margin:auto">
            <el-table-column label="车牌号" prop="carNo"></el-table-column>
            <el-table-column label="车辆类型" prop="model" width="160"></el-table-column>
            <el-table-column label="生产年" prop="carProductYear"></el-table-column>
            <el-table-column label="司机名称" prop="driverName"></el-table-column>
            <el-table-column label="电话" prop="phoneNum"></el-table-column>
            <el-table-column label="品牌" prop="brand"></el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
      <el-form-item label="应用时间" prop="dateRange" :rules="rules.dateRange">
        <el-date-picker
          v-model="monitorFormData.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报警类型" :required="true">
        <el-radio-group v-model="monitorFormData.eventType">
          <el-radio :label="1">驶入报警</el-radio>
          <el-radio :label="2">驶出报警</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-row>
          <div style="float:right">
            <el-button style="width: 100px" size="small" type="info" @click="cancle" round>取消</el-button>&nbsp;
            <el-button style="width: 100px" size="small" type="success" @click="submit" round>确认</el-button>
          </div>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import _ from 'lodash'
import init from './mixins/init'
import {addMonitor, updateMonitor, fetchMonitor, fetchVehicleByFleetId} from '@/api'

export default {
  mixins: [init],
  data () {
    let checkGeofence = (rule, value, callback) => {
      if (!value.id) {
        callback(new Error('请选择围栏'))
      } else {
        callback()
      }
    }
    return {
      fleets: [],
      fleetData: [],
      carList: [],
      submitLoading: false,
      rules: {
        monitorName: [
          { required: true, message: '请输入监控名称', trigger: 'blur' }
        ],
        geofence: [
          { validator: checkGeofence, required: true, trigger: 'change' }
        ],
        fleet: [
          {required: true, message: '请选择车队', trigger: 'change'}
        ],
        dateRange: [
          { type: 'array', required: true, message: '请选择应用时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    monitorFormData () {
      return this.$store.state.geofence.monitorFormData
    }
  },
  created () {
    if (this.monInit) {
      this.$store.commit('RESET_MONITORFROMDATA')
    }
    // update
    let monId = this.$route.query.monId
    if (monId && this.monInit) {
      fetchMonitor({monId}).then(res => {
        this.$store.commit('SET_MONITORFROMDATA', {
          monitorName: res.name,
          geofence: {id: res.fenceId, name: res.fenceName},
          fleet: res.targetList[0].targetId,
          dateRange: [new Date(res.applyStart), new Date(res.applyEnd)],
          eventType: res.type
        })
      })
    }
    this.$store.dispatch('getCarPoint', 'all').then(({fleetData}) => {
      this.fleetData = fleetData
      this.fleets = _.keys(fleetData)
      if (this.monitorFormData.fleet !== '') {
        this.changeFleet()
      }
    })
  },
  methods: {
    changeFleet () {
      fetchVehicleByFleetId(this.monitorFormData.fleet).then(res => {
        this.carList = res
      })
    },
    selectGeofence () {
      this.$router.push({ name: 'geofenceList', params: {selectGeofence: true} })
    },
    cancle () {
      this.$router.push({name: 'monitorList'})
    },
    submit () {
      this.$refs['monForm'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = {
            name: this.monitorFormData.monitorName,
            type: this.monitorFormData.eventType,
            applyStart: this.monitorFormData.dateRange[0].getTime(),
            applyEnd: this.monitorFormData.dateRange[1].getTime(),
            fenceId: this.monitorFormData.geofence.id,
            targetList: [
              {
                type: 1,
                targetId: this.monitorFormData.fleet
              }
            ]
          }
          if (this.$route.query.monId) {
            // update monitor
            updateMonitor({monId: this.$route.query.monId, ...data}).then(res => {
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
              this.$router.push({name: 'monitorList'})
            }).finally(() => {
              this.submitLoading = false
            })
          } else {
            // add monitor
            addMonitor(data).then(res => {
              this.$message({
                message: '新增成功！',
                type: 'success'
              })
              this.$router.push({name: 'monitorList'})
            }).finally(() => {
              this.submitLoading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.form-div {
  position: absolute;
  top: 60px;
  width: 87%;
  height: 100%;
  padding: 100px 20% 50px 20%;
  background: #4e4e4e94;
  overflow: auto;
}
.el-table::before {
  width: 100%;
}
</style>
