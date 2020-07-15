import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login/Login.vue'
import home from '../views/home/Home.vue'
import main from '../views/main/Main.vue'
import trackline from '@/views/trackline/TrackLine.vue'
import meta from '@/views/meta/MetaManage.vue'
import tripHistory from '@/views/tripHistory'
import metaData from '@/views/meta/MetaData.vue'
import metaDetail from '@/views/meta/MetaDetailData.vue'
import geofence from '@/views/geofence'
import geofenceList from '@/views/geofence/geofenceList.vue'
import newGeofence from '@/views/geofence/newGeofence.vue'
import monitorList from '@/views/geofence/monitorList.vue'
import newMonitor from '@/views/geofence/newMonitor.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: '/main',
      children: [
        {
          path: '/main',
          component: main,
          name: 'main'
        },
        {
          path: '/trackline',
          component: trackline,
          name: 'trackLine'
        },
        {
          path: '/geofence',
          component: geofence,
          name: 'geofence',
          redirect: '/geofence/monitorList',
          children: [
            {
              path: '/geofence/monitorList',
              component: monitorList,
              name: 'monitorList'
            },
            {
              path: '/geofence/newMonitor',
              component: newMonitor,
              name: 'newMonitor'
            },
            {
              path: '/geofence/geofenceList',
              component: geofenceList,
              name: 'geofenceList'
            },
            {
              path: '/geofence/newGeofence',
              component: newGeofence,
              name: 'newGeofence'
            }
          ]
        }
      ]
    },
    {
      path: '/meta',
      component: home,
      name: 'meta',
      redirect: '/meta/label',
      children: [
        {
          path: '/meta/label',
          component: meta,
          name: 'metaLabel'
        },
        {
          path: '/meta/maintain',
          component: () => {},
          name: 'metaMaintain'
        },
        {
          path: '/meta/label-detail',
          component: metaDetail,
          name: 'metaDetail'
        }
      ]
    },
    {
      path: '/history',
      component: home,
      name: 'history',
      redirect: '/history/trip-history',
      children: [
        {
          path: '/history/trip-history',
          component: tripHistory,
          name: 'tripHistory'
        },
        {
          path: '/history/data',
          component: metaData,
          name: 'metaData'
        }
      ]
    }
  ]
})
