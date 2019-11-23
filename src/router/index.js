import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Register from '@/components/Register'
import ForgetPassword from '@/components/ForgetPassword'
import Homepage from '@/components/Homepage'
import Admin from '@/components/Admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/forget',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/home',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/admin/:tab',
      name: 'Admin',
      component: Admin
    },
  ]
})
