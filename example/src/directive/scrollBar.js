
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const elScrollBar = (el) => {
  // 取名叫做_ps_
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    // el上挂一份属性
    el._ps_ = new PerfectScrollbar(el, { })
  }
}
const scrollBar = {
  inserted (el, binding, vnode) {
    const { arg } = binding
    if (arg === 'el-table') {
      el = el.querySelector('.el-table__body-wrapper')
      !el && console.warn('未发现className为el-table__body-wrapper的dom')

      // 启用x轴后不让原生滚动条出来作乱
      vnode.context.$nextTick(() => {
        el.classList.add('ps')
        el.addEventListener('ps-scroll-y', () =>
          el.classList.add('ps')
        )
        el.addEventListener('ps-scroll-x', () =>
          el.classList.add('ps')
        )
      })
    }
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(
        `perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join(
          '、'
        )}`
      )
    }
    // el上挂一份属性
    elScrollBar(el)
  },
  componentUpdated (el, binding, vnode, oldVnode) {
    const { arg } = binding
    if (arg === 'el-table') {
      el = el.querySelector('.el-table__body-wrapper')
      !el && console.warn('未发现className为el-table__body-wrapper的dom')
    }
    try {
      vnode.context.$nextTick(() => {
        elScrollBar(el)
      })
    } catch (error) {
      console.error(error)
      elScrollBar(el)
    }
  }
}

export default (Vue) => {
  Vue.directive('scrollBar', scrollBar)
}
