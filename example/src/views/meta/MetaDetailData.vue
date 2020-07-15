<template>
  <div class="nav-detail" style="padding:20px;color:white">
    <div style="width:82%;margin-left:47px">
      <el-row>
        <el-col :span="18"><h1 style="font-size:2em">导入数据项目一览</h1></el-col>
      </el-row>
      <el-row style="height:1px;background-color:#585858;"></el-row>
      <el-row style="height:10px"></el-row>
    </div>
    <el-row style="width:82%;margin-left:47px">
      <el-col :span="24">
        <el-table
          :data="navData"
          border
          :header-cell-style="{background:'#002d77'}"
          size="mini"
          style="width:100%;">
          <column-plus v-bind="item" v-for="(item, key) in navDataConfigs" :key="key"></column-plus>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="height:20px"></el-row>
    <div class="row">
      <el-button type="info" size="mini" @click="prePage" icon="el-icon-arrow-left">返回</el-button>
      <div style="flex:1"></div>
      <el-input style="width: 300px" placeholder="请输入内容" size="mini" v-model="navDetailSearch" @keyup.enter.native="searchNavDetail">
        <el-button slot="append" icon="el-icon-search" @click="searchNavDetail"></el-button>
      </el-input>&nbsp;
      <el-button type="success" @click="addNavDetail" size="mini">新增</el-button>
      <el-button type="danger" @click="batchDelNavDetail" size="mini" :disabled="batchDeleteDisable">批量删除</el-button>
      <el-button size="mini" @click="toggleShow('1')" type="primary">显示</el-button>
      <el-button size="mini" @click="toggleShow('0')" type="primary">非显示</el-button>
    </div>
    <el-row style="height:20px"></el-row>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="navDetailList"
      border
      :header-cell-style="{background:'#002d77'}"
      :stripe="true"
      size="mini"
      style="width:82%;margin-left:47px"
      @selection-change="handleShowChange"
      :max-height="tableHeight">
      <el-table-column
        fixed
        align="center"
        type="selection">
      </el-table-column>
      <el-table-column
        fixed
        align="center"
        type="index"
        label="No."
        width="50">
      </el-table-column>
      <el-table-column fixed prop="showFlg" label="显示" width="70">
        <template slot-scope="{row}">
          <span>{{row.showFlg === '1' ? '是' : '否'}}</span>
        </template>
      </el-table-column>
      <column-plus v-bind="item" v-for="(item, key) in navDetailCon" :key="key"></column-plus>
    </el-table>
    <el-row style="height:20px"></el-row>
    <el-row style="width: 82%;margin-left:47px">
      <div style="float: right;">
        <el-pagination
          background
          :page-size="10"
          :current-page="1"
          @current-change="handleCurrentChange"
          layout="prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog @closed="handleDialogClosed" custom-class="self-dialog" :title="operate==='Create'?'新增':'编辑'" :visible.sync="dialogDetailVisible" :close-on-click-modal="false">
      <el-form ref="navDetailForm" :rules="rules" :model="navDetailForm" size="mini" label-position="left" label-width="150px" style="width: 80%;margin: auto;">
        <el-form-item v-for="(item, key) in navDetailCon.filter(nav=>!nav.cellType)" :key="key" :label="item.label" :prop="item.prop">
          <el-input v-if="item.prop==='supplement'" type="textarea" :rows="2" placeholder="请输入内容" v-model="navDetailForm[item.prop]"></el-input>
          <el-select v-else-if="item.prop==='interval'" v-model="navDetailForm[item.prop]" clearable placeholder="请选择采集间隔">
            <el-option label="100" value="100"></el-option>
            <el-option label="200" value="200"></el-option>
            <el-option label="500" value="500"></el-option>
            <el-option label="1000" value="1000"></el-option>
            <el-option label="2000" value="2000"></el-option>
          </el-select>
          <el-select v-else-if="item.prop==='pk'" v-model="navDetailForm[item.prop]" clearable placeholder="请选择pk">
            <el-option label="Yes" value="Yes"></el-option>
            <el-option label="No" value="No"></el-option>
          </el-select>
          <el-select v-else-if="item.prop==='type'" v-model="navDetailForm[item.prop]" clearable placeholder="请选择型式">
            <el-option label="数字" value="数字"></el-option>
            <el-option label="字符" value="字符"></el-option>
            <el-option label="时间" value="时间"></el-option>
            <el-option label="日期" value="日期"></el-option>
          </el-select>
          <range-input v-else-if="item.prop==='range'" v-model="navDetailForm[item.prop]"></range-input>
          <el-input v-else-if="item.prop==='showKey'" v-model="navDetailForm[item.prop]" placeholder="車外活用Data Label" autocomplete="off"></el-input>
          <el-input v-else v-model="navDetailForm[item.prop]" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示">
          <el-radio-group v-model="navDetailForm.showFlg">
            <el-radio label="0">不显示</el-radio>
            <el-radio label="1">显示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogDetailVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="operateNavDetail">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import columnPlus from './components/columnPlus'
import rangeInput from './components/rangeInput'
import {fetchNavData, listNavDetail, updateNavDetail, addNavDetail, deleteNavDetail} from '@/api'

const undeletableKey = ['vin', 'recordAt', 'lat', 'lng']

export default {
  components: {columnPlus, rangeInput},
  data () {
    return {
      tableTitle: ['概要说明', '更新周期'],
      vin: '',
      tableHeight: window.innerHeight - 380,
      selectedNavDataList: [],
      loading: false,
      dataNaviId: '',
      navDetailSearch: '',
      navData: [],
      operate: 'Create',
      dialogDetailVisible: false,
      batchDeleteDisable: false,
      navDataConfigs: [
        {prop: 'name', label: '名称'},
        {prop: 'brand', label: '品牌'},
        {prop: 'model', label: '车型'},
        {prop: 'carProductYear', label: '生产年份'},
        {prop: 'summary', label: '概要说明', width: 250},
        {prop: 'renewalCycle', label: '更新周期'},
        {prop: 'ifNo', label: '接口编号'},
        {prop: 'ifTypeFormula', label: '车型判断条件'},
        {prop: 'ifTypeOrder', label: '车型判断顺序'}
      ],
      navDetailList: [],
      navDetailCon: [
        {fixed: 'left', prop: 'dataName', label: '数据名称', width: '120'},
        {prop: 'canLabel', label: 'CAN300 Label', width: '180'},
        {prop: 'showAlias', label: '别名', width: '120'},
        {prop: 'showKey', label: 'Data Label Key', width: '120'},
        {prop: 'summary', label: '概要', width: '320'},
        {prop: 'interval', label: '采集间隔/msec', width: '160'},
        {prop: 'unit', label: '单位', width: '120'},
        {prop: 'granularity', label: '数据粒度', width: '120'},
        {prop: 'range', label: '范围/值', width: '120'},
        {prop: 'supplement', label: '补充', width: '200'},
        {prop: 'pk', label: 'PK', width: '120'},
        {prop: 'type', label: '型式', width: '120'},
        {prop: 'length', label: '长度', width: '120'},
        {prop: 'decimal', label: '小数部分', width: '120'},
        {prop: 'sourcePath', label: '源路径', width: '120'},
        {prop: 'sourceAgg', label: '采集汇总方法', width: '120'},
        {
          cellType: 'slots',
          prop: 'dataNaviId',
          fixed: 'right',
          label: '操作',
          width: '150',
          renderCell: ({row}) => {
            return (
              <div>
                <el-button style="margin-right:10px" type="primary" on-click={() => this.editNavDetail(row)} size="mini">编辑</el-button>
                {!undeletableKey.includes(row.showKey) ? <el-popconfirm title="确定要删除吗？" on-onConfirm={() => this.delNavDetail(row)}>
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popconfirm> : ''}
              </div>
            )
          }
        }
      ],
      rules: {
        dataName: [
          { required: true, message: '请输入数据名称', trigger: 'blur' }
        ],
        showAlias: [
          { required: true, message: '请输入别名', trigger: 'blur' }
        ],
        showKey: [
          { required: true, message: '请输入Key', trigger: 'blur' }
        ],
        sourcePath: [
          { required: true, message: '请输入源路径', trigger: 'blur' }
        ]
      },
      currentPage: 1,
      totalCount: 1,
      navDetailForm: {
        canLabel: '',
        dataName: '',
        granularity: '',
        interval: '',
        length: '',
        pk: '',
        range: '',
        showAlias: '',
        showFlg: '0',
        showKey: '',
        summary: '',
        supplement: '',
        type: '',
        unit: '',
        decimal: '',
        sourceAgg: '',
        sourcePath: ''
      }
    }
  },
  created () {
    this.dataNaviId = this.$route.query.dataNaviId
    if (this.dataNaviId !== '') {
      // get nav data
      fetchNavData({dataNaviId: this.dataNaviId}).then(res => {
        this.navData = [res]
      })
      // get nav detail data
      this.initDetailTable()
    }
  },
  methods: {
    initDetailTable (search = {}) {
      const payload = {
        offset: 10 * (this.currentPage - 1),
        limit: 10,
        dataNaviId: this.dataNaviId,
        ...search
      }
      listNavDetail(payload).then(res => {
        this.navDetailList = res.list
        this.totalCount = res.totalCount
      })
    },
    searchNavDetail () {
      if (this.navDetailSearch === '') {
        this.initDetailTable()
        return
      }
      this.currentPage = 1
      this.initDetailTable({searchValue: this.navDetailSearch})
    },
    addNavDetail () {
      // add nav detail
      this.operate = 'Create'
      this.dialogDetailVisible = true
      this.navDetailForm = this.$options.data().navDetailForm
    },
    editNavDetail (row) {
      // update nav detail
      this.operate = 'Edit'
      this.dialogDetailVisible = true
      this.navDetailForm = JSON.parse(JSON.stringify(row))
    },
    delNavDetail (row) {
      // delete nav detail
      deleteNavDetail([{detailId: row.detailId}]).then(res => {
        let totalPage = Math.ceil((this.totalCount - 1) / 10)
        let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
        this.currentPage = this.currentPage < 1 ? 1 : currentPage
        this.initDetailTable()
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
      }).catch(e => {
        this.$message({
          message: '删除失败！',
          type: 'error'
        })
      })
    },
    batchDelNavDetail () {
      // batch delete nav detail
      if (this.selectedNavDataList.length === 0) return
      const delNavDataList = this.selectedNavDataList.map(item => ({detailId: item.detailId}))
      this.$confirm('将删除所有选中的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNavDetail(delNavDataList).then(res => {
          let totalPage = Math.ceil((this.totalCount - delNavDataList.length) / 10)
          let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
          this.currentPage = this.currentPage < 1 ? 1 : currentPage
          this.initDetailTable()
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
        }).catch(e => {
          this.$message({
            message: '删除失败！',
            type: 'error'
          })
        })
      })
    },
    operateNavDetail () {
      this.$refs.navDetailForm.validate((valid) => {
        if (valid) {
          if (this.operate === 'Create') {
            // create nav detail
            addNavDetail([{dataNaviId: this.dataNaviId, ...this.navDetailForm}]).then(res => {
              this.dialogDetailVisible = false
              this.initDetailTable()
              this.$message({
                message: '添加成功！',
                type: 'success'
              })
            }).catch(e => {
              this.$message({
                message: '添加失败！',
                type: 'error'
              })
            })
          } else {
            // update nav detail
            updateNavDetail([this.navDetailForm]).then(res => {
              this.dialogDetailVisible = false
              this.initDetailTable()
              this.$message({
                message: '更新成功！',
                type: 'success'
              })
            }).catch(e => {
              this.$message({
                message: '更新失败！',
                type: 'error'
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initDetailTable()
    },
    handleShowChange (val) {
      const containUndeletable = val.filter(item => undeletableKey.includes(item.showKey))
      this.batchDeleteDisable = containUndeletable.length > 0
      this.selectedNavDataList = val
    },
    toggleShow (val) {
      if (this.selectedNavDataList.length === 0) return
      const newNavDataList = this.selectedNavDataList.map(item => {
        item.showFlg = val
        return item
      })
      updateNavDetail(newNavDataList).then(res => {
        this.initDetailTable()
        this.$message({
          message: '更新成功！',
          type: 'success'
        })
      }).catch(e => {
        this.$message({
          message: '更新失败！',
          type: 'error'
        })
      })
    },
    handleDialogClosed () {
      this.$refs.navDetailForm.resetFields()
    },
    prePage () {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
.row {
  display: flex;
  justify-content: flex-end;
  width: 82%;
  margin-left: 47px;
}
</style>
