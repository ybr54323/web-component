import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tableForm',
    name: 'TableForm',
    component: () =>
      import(/* webpackChunkName: "TableForm" */ '../views/TableForm.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
