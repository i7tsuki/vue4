<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <router-view></router-view>
    <div id="footer">Copyright ©2019 〇〇 inc. All rights reserved.</div>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  routes: [
    {
      path: '/',
      redirect: {
        name: 'login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
  ],
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
