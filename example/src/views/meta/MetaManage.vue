<template>
  <div style="padding:20px;color:white; height=900px">
    <div style="width:95%;margin:auto;">
      <el-row>
        <el-col :span="18"><h1 style="font-size: 2em;">导入数据格式一览</h1></el-col>
      </el-row>
      <el-row style="height:1px;background-color:#585858;"></el-row>
      <el-row style="height:10px"></el-row>
    </div>
    <el-row style="width:95%;margin:auto">
      <div class="row">
        <el-input style="width: 300px" placeholder="请输入内容" size="mini" v-model="navSearch" @keyup.enter.native="searchNav">
          <el-button slot="append" icon="el-icon-search" @click="searchNav"></el-button>
        </el-input>&nbsp;
        <el-button type="success" @click="addNavData" size="mini">新增</el-button>
        <el-button type="danger" @click="batchDelNavData" size="mini">批量删除</el-button>
      </div>
      <el-row style="height:20px"></el-row>
      <el-table
        :data="tableData"
        border
        size="mini"
        :header-cell-style="{background:'#002d77'}"
        style="width:100%;"
        @selection-change="handleSelected"
        :max-height="tableHeight">
        <el-table-column
          fixed
          align="center"
          type="selection">
        </el-table-column>
        <el-table-column
          fixed
          align="center"
          label="No."
          type="index"
          :index="20 * (currentPage - 1) + 1"
          width="55">
        </el-table-column>
        <column-plus v-bind="item" v-for="(item, key) in columnConfigs" :key="key"></column-plus>
      </el-table>
      <el-row style="height:20px"></el-row>
      <el-row>
        <div style="float: right;">
          <el-pagination
            background
            :page-size="15"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </el-row>
    </el-row>
    <el-dialog @closed="handleDialogClosed" custom-class="self-dialog" :title="operate==='Create'?'新增':'编辑'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="navForm" :model="Navform" :rules="rules" size="small" label-position="left" label-width="120px" style="width: 80%;margin: auto;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="Navform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="Navform.brand" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车型" prop="model">
          <el-input v-model="Navform.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产年份" prop="carProductYear">
          <el-date-picker
            v-model="Navform.carProductYear"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="概要说明" prop="summary">
          <el-input v-model="Navform.summary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="更新周期" prop="renewalCycle">
          <el-input-number :value="parseInt(Navform.renewalCycle)" @input="Navform.renewalCycle=$event+'分钟'" :controls="false"></el-input-number>&nbsp;<span>分钟</span>
        </el-form-item>
        <el-form-item label="接口编号" prop="ifNo">
          <el-input-number v-model="Navform.ifNo" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item label="车型判断条件" prop="ifTypeFormula">
          <type-formula v-model="Navform.ifTypeFormula"></type-formula>
          <!-- <el-input type="textarea" :rows="2" placeholder="请输入车型判断条件" v-model="Navform.ifTypeFormula"></el-input> -->
        </el-form-item>
        <el-form-item label="(车型判断顺序)" prop="ifTypeOrder">
          <el-input-number v-model="Navform.ifTypeOrder" :controls="false"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="operateNavData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import nttSearch from '@/components/search'
import columnPlus from './components/columnPlus'
import typeFormula from './components/typeFormula'
import {listNavData, updateNavData, addNavData, deleteNavData} from '@/api'

export default {
  components: {nttSearch, columnPlus, typeFormula},
  data () {
    return {
      tableTitle: ['概要说明', '更新周期'],
      showEdit: false,
      vin: '',
      dataNaviId: '',
      tableHeight: window.innerHeight - 250,
      selectedShow: [],
      loading: false,
      currentPage: 1,
      totalCount: 1,
      navSearch: '',
      operate: 'Create',
      dialogFormVisible: false,
      tableData: [],
      selectedNavDataList: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '请输入品牌', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '请输入车型', trigger: 'blur' }
        ],
        carProductYear: [
          { required: true, message: '请输入生产年份', trigger: 'change' }
        ],
        renewalCycle: [
          { required: true, message: '请输入更新周期', trigger: 'blur' }
        ],
        ifNo: [
          { required: true, message: '请输入接口编号', trigger: 'blur' }
        ],
        ifTypeFormula: [
          { required: true, message: '请输入车型判断条件', trigger: 'blur' }
        ]
      },
      Navform: {
        name: '',
        brand: '',
        model: '',
        carProductYear: '',
        summary: '',
        renewalCycle: '1分钟',
        ifNo: 1,
        ifTypeFormula: '',
        ifTypeOrder: ''
      },
      columnConfigs: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'brand',
          label: '品牌'
        },
        {
          prop: 'model',
          label: '车型'
        },
        {
          prop: 'carProductYear',
          label: '生产年份'
        },
        {
          prop: 'summary',
          label: '概要说明',
          width: 250
        },
        {
          prop: 'renewalCycle',
          label: '更新周期'
        },
        {
          prop: 'ifNo',
          label: '接口编号'
        },
        {
          prop: 'ifTypeFormula',
          label: '车型判断条件'
        },
        {
          prop: 'ifTypeOrder',
          label: '车型判断顺序'
        },
        {
          cellType: 'slots',
          prop: 'dataNaviId',
          fixed: 'right',
          label: '操作',
          width: '210',
          renderCell: ({row}) => {
            return (
              <div>
                <el-button style="margin-right:10px" type="primary" on-click={() => this.editNavData(row)} size="mini">编辑</el-button>
                <el-popconfirm title="确定要删除吗？" on-onConfirm={() => this.delNavData(row)}>
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popconfirm>
                <el-button style="margin-left:10px" type="info" on-click={() => this.showNavDetail(row)} size="mini">详细</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable (search = {}) {
      const payload = {offset: 15 * (this.currentPage - 1), limit: 15, ...search}
      listNavData(payload).then(res => {
        this.tableData = res.list
        this.totalCount = res.totalCount
      })
    },
    searchNav () {
      if (this.navSearch === '') {
        this.initTable()
        return
      }
      this.currentPage = 1
      this.initTable({searchValue: this.navSearch})
    },
    operateNavData () {
      this.$refs.navForm.validate((valid) => {
        if (valid) {
          if (this.operate === 'Create') {
            // create nav data
            addNavData(this.Navform).then(res => {
              this.dialogFormVisible = false
              this.initTable()
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
            // update nav data
            updateNavData(this.Navform).then(res => {
              this.dialogFormVisible = false
              this.initTable()
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
    addNavData () {
      this.operate = 'Create'
      this.dialogFormVisible = true
      this.Navform = this.$options.data().Navform
    },
    editNavData (row) {
      this.operate = 'Edit'
      this.dialogFormVisible = true
      this.Navform = JSON.parse(JSON.stringify(row))
    },
    delNavData (row) {
      const {dataNaviId} = row
      deleteNavData([{dataNaviId}]).then(res => {
        let totalPage = Math.ceil((this.totalCount - 1) / 15)
        let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
        this.currentPage = this.currentPage < 1 ? 1 : currentPage
        this.initTable()
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
    batchDelNavData () {
      if (this.selectedNavDataList.length === 0) return
      const delNavDataList = this.selectedNavDataList.map(item => ({dataNaviId: item.dataNaviId}))
      this.$confirm('将删除所有选中的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNavData(delNavDataList).then(res => {
          let totalPage = Math.ceil((this.totalCount - delNavDataList.length) / 15)
          let currentPage = this.currentPage > totalPage ? totalPage : this.currentPage
          this.currentPage = this.currentPage < 1 ? 1 : currentPage
          this.initTable()
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
    handleSelected (val) {
      this.selectedNavDataList = val
    },
    showNavDetail (row) {
      this.$router.push({name: 'metaDetail', query: {dataNaviId: row.dataNaviId}})
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initTable()
    },
    handleDialogClosed () {
      this.$refs.navForm.resetFields()
    }
  }
}
</script>

<style scoped>
.row {
  display: flex;
  justify-content: flex-end;
}
</style>
