<template>
  <div>
    <div style="display:flex">
      <el-select style="width:150px;min-width:120px" v-model="type" placeholder="请选择">
        <el-option label="按车型判断" value="车型"></el-option>
        <el-option label="按列数判断" value="列数"></el-option>
        <el-option label="自定义判断" value="自定义"></el-option>
      </el-select>
      <div v-if="type==='车型'" style="display:flex;margin-left:5px">
        <div style="word-break:keep-all;">column</div>
        <el-input class="self-input" style="max-width:60px;min-width:60px" :value="navData.colNo" @input="handleInput($event, 'colNo')" placeholder="列号">
        </el-input>&nbsp;
        <el-select :value="navData.format" style="min-width:100px" placeholder="" @input="handleInput($event, 'format')" :clearable="true">
          <el-option label="substring" value="substring"></el-option>
        </el-select>&nbsp;
        <el-input-number v-if="navData.format==='substring'" style="max-width:60px;min-width:60px" :value="navData.subFrom" @input="handleInput($event, 'subFrom')" :controls="false"></el-input-number>
        <el-input-number v-if="navData.format==='substring'" style="max-width:60px;min-width:60px" :value="navData.subTo" @input="handleInput($event, 'subTo')" :controls="false"></el-input-number>
        <span>=</span><span>=&nbsp;</span>
        <el-input style="max-width:110px;min-width:100px" :value="navData.typeNo" @input="handleInput($event, 'typeNo')" placeholder="车型号"></el-input>
      </div>
      <el-input style="margin-left:10px;width:200px" v-else-if="type==='列数'" :value="navData.colNum" @input="handleInput($event, 'colNum')" placeholder="总列数"></el-input>
      <el-input style="margin-left:10px;width:200px" v-else :value="navData.diy" @input="handleInput($event, 'diy')" placeholder="自定义"></el-input>
    </div>
    <div style="line-height: 20px;color: #9c9c9c;">format:
      <span v-if="type==='车型'">cloumn[{{navData.colNo}}]<span v-if="navData.format!==''">.{{navData.format}}({{navData.subFrom}}, {{navData.subTo}})</span>=='{{navData.typeNo}}'</span>
      <span v-else-if="type==='列数'">column.length=={{navData.colNum}}</span>
      <span v-else>{{navData.diy}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      type: '车型'
    }
  },
  computed: {
    navData: {
      get () {
        const data = {
          type: '车型',
          colNo: '',
          typeNo: '',
          format: '',
          subFrom: 0,
          subTo: 0,
          colNum: '',
          diy: ''
        }
        if (this.value !== '') {
          if (this.value.includes('column.length==')) {
            data.type = '列数'
            data.colNum = this.value.replace('column.length==', '')
          } else if (/column\[.*\].*==/.test(this.value)) {
            data.type = '车型'
            const isFormat = this.value.match(/\..+\(/)
            if (isFormat) {
              data.format = isFormat[0].replace('.', '').replace('(', '')
              const param = this.value.match(/\(.+\)/)[0].replace('(', '').replace(')', '')
              data.subFrom = param.split(',')[0]
              data.subTo = param.split(',')[1]
            }
            data.colNo = this.value.match(/\[.*\]/)[0].replace('[', '').replace(']', '')
            data.typeNo = this.value.match(/==.*/)[0].replace('==', '').replace(new RegExp("'", 'gm'), '')
          } else {
            data.type = '自定义'
            data.diy = this.value
          }
        }
        return data
      }
    }
  },
  watch: {
    navData: {
      handler (val, oldVal) {
        if (val !== oldVal) {
          this.type = val.type
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleInput (val, key) {
      let compValue = ''
      const navData = {
        ...this.navData,
        [key]: val
      }
      if (this.type === '车型') {
        if (navData.format !== '') {
          compValue = `column[${navData.colNo}].${navData.format}(${navData.subFrom},${navData.subTo})=='${navData.typeNo}'`
        } else {
          compValue = `column[${navData.colNo}]=='${navData.typeNo}'`
        }
      } else if (this.type === '列数') {
        compValue = `column.length==${navData.colNum}`
      } else {
        compValue = navData.diy
      }
      this.$emit('input', compValue)
    }
  }
}
</script>
