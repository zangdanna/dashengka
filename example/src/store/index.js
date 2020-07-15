import Vue from 'vue'
import Vuex from 'vuex'
import meta from './modules/meta'
import track from './modules/track'
import vehicles from './modules/vehicles'
import geofence from './modules/geofence'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    meta,
    track,
    vehicles,
    geofence
  }
})
