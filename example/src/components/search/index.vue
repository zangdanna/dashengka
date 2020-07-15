<template>
	<el-form ref="nttForm" :inline="true" size="small" :model="formData">
		<el-form-item v-if="input" label="">
			<el-autocomplete size="small" v-model="formData.carNo" :fetch-suggestions="vinSearch" placeholder="请输入车牌号"
				:trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
		</el-form-item>
		<el-form-item v-if="select">
			<el-select size="small" style="width:300px" clearable v-model="formData.carModel" placeholder="请选择车型">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item v-if="search">
      <el-tooltip popper-class="btn-tip" :enterable="false" :open-delay="1000" content="查询" placement="bottom-start">
        <el-button size="small" @click="nsearch" icon="el-icon-search" circle></el-button>
      </el-tooltip>
		</el-form-item>
		<el-form-item v-if="reset">
      <el-tooltip popper-class="btn-tip" :enterable="false" :open-delay="1000" content="reset" placement="bottom-start">
        <el-button size="small" type="info" @click="nreset" icon="el-icon-refresh-left" circle></el-button>
      </el-tooltip>
		</el-form-item>
		<el-form-item v-if="view">
      <el-tooltip popper-class="btn-tip" :enterable="false" :open-delay="1000" content="查看" placement="bottom-start">
        <el-button size="small" type="success" @click="nview" icon="el-icon-view" circle></el-button>
      </el-tooltip>
		</el-form-item>
		<el-form-item v-if="download">
      <el-tooltip popper-class="btn-tip" :enterable="false" :open-delay="1000" placement="bottom-start">
        <div slot="content" style="font-size:8px">数据导出</div>
        <el-button size="small" type="primary" @click="ndownload" icon="el-icon-download" circle></el-button>
      </el-tooltip>
		</el-form-item><br>
    <el-form-item v-if="time" label="">
			<el-date-picker v-model="formData.dateRange" size="small" type="datetimerange" range-separator="至" start-placeholder="开始日期"
				end-placeholder="结束日期">
			</el-date-picker>
		</el-form-item><br>
    <el-form-item v-if="lat" label="纬度">
			<el-input size="small" style="width:100px" v-model="formData.latFrom" placeholder="from"></el-input><span>&nbsp;-&nbsp;</span>
      <el-input size="small" style="width:100px" v-model="formData.latTo" placeholder="to"></el-input>
		</el-form-item>
    <el-form-item v-if="lng" label="经度">
			<el-input size="small" style="width:100px" v-model="formData.lngFrom" placeholder="from"></el-input><span>&nbsp;-&nbsp;</span>
      <el-input size="small" style="width:100px" v-model="formData.lngTo" placeholder="to"></el-input>
		</el-form-item>
	</el-form>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    lat: {
      type: Boolean,
      default: false
    },
    lng: {
      type: Boolean,
      default: false
    },
    input: {
      type: Boolean,
      default: true
    },
    select: {
      type: Boolean,
      default: false
    },
    time: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: false
    },
    view: {
      type: Boolean,
      default: false
    },
    download: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: [],
      suggestCar: {},
      formData: {
        latFrom: '',
        latTo: '',
        lngFrom: '',
        lngTo: '',
        carNo: '',
        carModel: '',
        dateRange: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date()],
        vin: ''
      }
    }
  },
  created () {
    if (this.select) {
      this.$store.dispatch('getCanDataByVin').then(res => {
        let options = []
        res.map(item => {
          options.push({
            value: JSON.stringify(item),
            label: [item.brand, item.model, item.carProductYear].join('/')})
        })
        this.options = options
      })
    }
    this.$store.dispatch('getVehicleStatus').then(res => {
      res.list.map(car => {
        this.suggestCar[car.carNo] = car
      })
    })
  },
  methods: {
    vinSearch (queryString, cb) {
      let suggestCar = _.keys(this.suggestCar)
      let results = queryString ? suggestCar.filter(this.createFilter(queryString)) : []
      // 调用 callback 返回建议列表的数据
      cb(_.map(results, (item) => {
        return {
          value: item,
          car: this.suggestCar[item]
        }
      }))
    },
    createFilter (queryString) {
      return (suggestCar) => {
        return (suggestCar.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect (item) {
      // this.formData.vin = item.car.vin
    },
    nsearch () {
      if (this.suggestCar[this.formData.carNo]) {
        this.formData.vin = this.suggestCar[this.formData.carNo].vin
      } else {
        this.formData.vin = ''
      }
      this.$emit('nsearch', this.formData)
    },
    nreset () {
      this.$refs.nttForm.resetFields()
    },
    nview () {
      this.$emit('nview', this.formData)
    },
    ndownload () {
      this.$emit('ndownload', this.formData)
    }
  }
}
</script>

<style>
 .btn-tip {
   font-size: 8px;
   padding: 5px !important
 }
</style>
