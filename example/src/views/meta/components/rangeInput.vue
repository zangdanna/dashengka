<template>
  <div class="range-input">
    <el-input v-model="from" placeholder="" style="width: 100px"></el-input>
    &nbsp;~&nbsp;
    <el-input v-model="to" placeholder="" style="width: 100px"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      type: String,
      default: ''
    }
  },
  data () {
    return {
      from: '',
      to: ''
    }
  },
  watch: {
    from (val, oVal) {
      if (val !== '' || this.to !== '') {
        this.$emit('input', `${val} ~ ${this.to}`)
      } else {
        this.$emit('input', '')
      }
    },
    to (val, oVal) {
      if (val !== '' || this.from !== '') {
        this.$emit('input', `${this.from} ~ ${val}`)
      } else {
        this.$emit('input', '')
      }
    },
    value (val, oVal) {
      this.updateVal()
    }
  },
  created () {
    this.updateVal()
  },
  methods: {
    updateVal () {
      if (this.value.includes('~')) {
        const values = this.value.split('~')
        this.from = values[0].trim()
        this.to = values[1].trim()
      } else {
        this.from = ''
        this.to = ''
      }
    }
  }
}
</script>

<style scoped>
.range-input {
  display: flex;
}
</style>
