<template>
  <div :class="windowWidth < 1200 && toggle !== '' ? pannelHideClass : pannelClass">
    <div v-if="toggle !== ''" :class="drawerClass" @click="drawerToggle">
      <i :class="windowWidth < 1200 ? reiClass : iClass"></i><br>
      <div v-html="msg.join('<br>')"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    toggle: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      msg: [],
      windowWidth: document.documentElement.clientWidth,
      pannelClass: 'main-left ntt-panel',
      pannelHideClass: 'main-left ntt-panel main-left-hide',
      drawerClass: 'drawer drawer-left',
      iClass: 'el-icon-d-arrow-left',
      reiClass: 'el-icon-d-arrow-right'
    }
  },
  created () {
    for (let i of this.toggle) {
      this.msg.push(i)
    }
    if (this.position === 'right') {
      this.pannelClass = 'main-right ntt-panel'
      this.pannelHideClass = 'main-right ntt-panel main-right-hide'
      this.drawerClass = 'drawer drawer-right'
      this.reiClass = 'el-icon-d-arrow-left'
      this.iClass = 'el-icon-d-arrow-right'
    }
  },
  methods: {
    drawerToggle ($event) {
      const panel = $event.currentTarget.parentNode
      const drawer = $event.currentTarget.childNodes[0]
      if (panel.classList.contains('main-left')) {
        if (panel.classList.contains('main-left-hide')) {
          panel.classList.remove('main-left-hide')
          drawer.classList.value = 'el-icon-d-arrow-left'
          this.$emit('toggle-click', {position: 'left', hide: false})
        } else {
          panel.classList.add('main-left-hide')
          drawer.classList.value = 'el-icon-d-arrow-right'
          this.$emit('toggle-click', {position: 'left', hide: true})
        }
      } else {
        if (panel.classList.contains('main-right-hide')) {
          panel.classList.remove('main-right-hide')
          drawer.classList.value = 'el-icon-d-arrow-right'
          this.$emit('toggle-click', {position: 'right', hide: false})
        } else {
          panel.classList.add('main-right-hide')
          drawer.classList.value = 'el-icon-d-arrow-left'
          this.$emit('toggle-click', {position: 'right', hide: true})
        }
      }
    }
  }
}
</script>

<style scoped>
.main-left {
  top: 20px;
  left: 20px;
}
.main-right {
  top: 20px;
  right: 20px;
}
</style>
