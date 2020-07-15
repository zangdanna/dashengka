<template>
  <div style="padding:20px;color:white">
    <div style="width:82%;margin-left:47px;">
			<el-row>
				<ntt-search
					:time="true"
          :lat="true"
          :lng="true"
          :view="true"
          :download="true"
          @nsearch="searchCanData"
          @nview="getVisibleLabelsData"
          @ndownload="csvDownload">
				</ntt-search>
			</el-row>
      <el-row><h1 style="font-size: 2em;">行驶数据抽取</h1></el-row>
      <el-row style="height:1px;background-color:#585858;"></el-row>
      <el-dialog title="Can数据" width='80%' :visible.sync="dialogTableVisible">
        <el-table
        v-loading="dialogLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        border
        :header-cell-style="{background:'#002d77'}"
        :stripe="true"
        :height="dialogTableHeight"
        size="mini"
        :data="lableData2">
          <el-table-column
            fixed
            align="center"
            label="No."
            type="index"
            :index="20 * (currentPage - 1) + 1"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            v-for="(item, index) in selectedLabels"
            :key="index"
            :property="item.showKey"
            :min-width="140"
            :label="item.showAlias">
           </el-table-column>
        </el-table>
        <el-row style="height:20px"></el-row>
        <el-row>
          <div style="float: right;">
            <el-pagination
              background
              v-if="dialogTableVisible"
              :page-size=20
              :current-page="1"
              @current-change="handleCurrentChange"
              layout="prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </div>
        </el-row>
      </el-dialog>
    </div>
    <el-row style="height:20px"></el-row>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData2"
      border
      :header-cell-style="{background:'#002d77'}"
      :stripe="true"
      size="mini"
      style="width:82%; margin-left:47px;"
      :height="tableHeight"
      @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        fixed
        align="center"
        type="index"
        label="No."
        width="50">
      </el-table-column>
      <el-table-column
        fixed
        prop="dataName"
        label="数据名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="canLabel"
        label="CAN300 Label"
        width="180">
      </el-table-column>
      <el-table-column
        prop="showAlias"
        label="别名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="showKey"
        label="Data Label Key"
        width="120">
      </el-table-column>
      <el-table-column
        prop="summary"
        label="概要"
        width="320">
      </el-table-column>
      <el-table-column
        prop="interval"
        label="采集间隔/msec"
        width="160">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="单位"
        width="120">
      </el-table-column>
      <el-table-column
        prop="granularity"
        label="数据粒度"
        width="120">
      </el-table-column>
      <el-table-column
        prop="range"
        label="范围/值"
        width="120">
      </el-table-column>
      <el-table-column
        prop="supplement"
        label="补充"
        width="200">
      </el-table-column>
      <el-table-column
        prop="pk"
        label="PK"
        width="120">
      </el-table-column>
      <el-table-column
        prop="type"
        label="型式"
        width="120">
      </el-table-column>
      <el-table-column
        prop="length"
        label="长度"
        width="120">
      </el-table-column>
      <el-table-column
        prop="decimal"
        label="小数部分"
        width="120">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import nttSearch from '@/components/search'
import _ from 'lodash'

export default {
  components: {nttSearch},
  data () {
    return {
      tableTitle: ['概要说明', '更新周期'],
      showEdit: false,
      loading: false,
      dialogLoading: false,
      searchData: {},
      tableHeight: window.innerHeight - 335,
      dialogTableHeight: window.innerHeight * 0.6,
      dialogTableVisible: false,
      selectedLabels: [],
      totalCount: 1,
      currentPage: 1
    }
  },
  created () {
    this.$store.commit('SET_TABLE_DATA2', [])
  },
  computed: {
    tableData2: {
      get: function () {
        return this.$store.getters.tableData2
      }
    },
    lableData2 () {
      return this.$store.getters.lableData2
    }
  },
  methods: {
    searchCanData (data) {
      this.searchData = data
      if (data.vin === '') {
        Message({
          message: '请输入正确的车牌号！',
          type: 'warning',
          duration: 1 * 1000
        })
        return
      }
      this.loading = true
      this.$store.dispatch('getCanDataByVin', {vin: data.vin}).then(res => {
        if (res.length > 0) {
          // get can detail data
          this.$store.dispatch('getCanDetailData', {dataNaviId: res[0].dataNaviId}).finally(() => {
            this.loading = false
          })
        }
      })
    },
    getVisibleLabelsData (data) {
      this.searchData = data
      if (this.selectedLabels.length === 0 || !data.dateRange) {
        Message({
          message: !data.dateRange ? '请选择时间！' : '请选择Can Label！',
          type: 'warning',
          duration: 1 * 1000
        })
        return
      }
      this.dialogTableVisible = true
      this.dialogLoading = true
      this.currentPage = 1
      this.$store.dispatch('getCanLabelsData', {
        vin: this.searchData.vin,
        offset: 0,
        from: data.dateRange[0].getTime(),
        to: data.dateRange[1].getTime(),
        labels: this.selectedLabels.map(label => label.showKey).join()
      }).then(res => {
        this.totalCount = res
      }).finally(_ => {
        this.dialogLoading = false
      })
    },
    csvDownload (data) {
      this.searchData = data
      if (this.selectedLabels.length === 0 || !data.dateRange) {
        Message({
          message: !data.dateRange ? '请选择时间！' : '请选择Can Label！',
          type: 'warning',
          duration: 1 * 1000
        })
        return
      }
      this.$store.dispatch('downloadCanLabelData', {
        carNo: this.searchData.carNo,
        vin: this.searchData.vin,
        from: data.dateRange[0].getTime(),
        to: data.dateRange[1].getTime(),
        labels: this.selectedLabels.map(label => label.showKey).join()
      })
    },
    handleSelectionChange (val) {
      this.selectedLabels = _.sortBy(val, 'detailId')
    },
    handleCurrentChange (val) {
      this.dialogLoading = true
      this.currentPage = val
      this.$store.dispatch('getCanLabelsData', {
        vin: this.searchData.vin,
        offset: 20 * (val - 1),
        from: this.searchData.dateRange[0].getTime(),
        to: this.searchData.dateRange[1].getTime(),
        labels: this.selectedLabels.map(label => label.showKey).join()
      }).then(res => {
        this.totalCount = res
      }).finally(_ => {
        this.dialogLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
