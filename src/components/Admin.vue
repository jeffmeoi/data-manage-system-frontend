<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider collapsible v-model="collapsed">
      <div class="logo" >{{collapsed? 'B' : 'Backstage'}}</div>
      <a-menu theme="dark" :selectedKeys="selectedKeys" mode="inline"  @click="clickMenuItem">
        <a-menu-item key="home"><a-icon type="pie-chart" /><span>Survey</span></a-menu-item>
        <a-menu-item key="type"><a-icon type="tag"/><span>Categories</span></a-menu-item>
        <a-menu-item key="image_info"><a-icon type="instagram"/><span>Images</span></a-menu-item>
        <a-menu-item key="user"><a-icon type="user" /><span>Users</span></a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background:white;">
        <div class="right-element">
          <a-dropdown>
            <a class="ant-dropdown-link" :style="{ fontSize: '11pt', marginLeft: '10px' }" href="#">
              <a-avatar icon="user"/>&nbsp;&nbsp;{{userInfo.username}}&nbsp;&nbsp;<a-icon type="down" />
            </a>
            <a-menu slot="overlay" @click="clickUserMenuItemListener">
              <a-menu-item v-for="(menuItem, index) in userMenuItems" :key="index" >
                <a href="javascript:;" :style="{ fontSize: '11pt' }" >{{ menuItem.text }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <component :is="routes[tabName]" :userInfo="userInfo" />
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        {{footerText}}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import http from '@/HttpConnector'
import Home from '@/components/admin/Home'
import Type from '@/components/admin/Type'
import ImageInfo from '@/components/admin/ImageInfo'
import ImageEditor from '@/components/admin/ImageEditor'
import ImageDetails from '@/components/admin/ImageDetails'
import User from '@/components/admin/User'
import UserEditor from '@/components/admin/UserEditor'
import UserDetails from '@/components/admin/UserDetails'
const tabs = {
  'home': 'home',
  'type': 'type',
  'image_info': 'image_info',
  'image_details': 'image_info',
  'image_editor': 'image_info',
  'user': 'user',
  'user_details': 'user',
  'user_editor': 'user',
}
const routes = {
  'home': 'Home',
  'type': 'Type',
  'image_info': 'ImageInfo',
  'image_details': 'ImageDetails',
  'image_editor': 'ImageEditor',
  'user': 'User',
  'user_details': 'UserDetails',
  'user_editor': 'UserEditor',
}
export default {
  data () {
    let tabName = this.$route.params.tab
    if (tabName == null) {
      this.$router.push({
        name: 'Admin',
        params: {
          tab: 'home'
        }
      })
    }
    tabName = this.$route.params.tab
    let selectedKeys = [ tabs[tabName] ]
    let $router = this.$router
    const userMenuItems = [
      {
        text: 'Homepage',
        action: function () {
          $router.push({ name: 'Homepage' })
        }
      },
      {
        text: 'Log out',
        action: function () {
          http.user.logout()
            .then((data) => {
              $router.push({ name: 'Login' })
            })
        }
      },
    ]
    return {
      footerText: 'Image Information Manage System ©2019 Created by Jeff Xie',
      collapsed: false,
      routes,
      tabName,
      selectedKeys,
      userMenuItems,
      userInfo: {}
    }
  },
  mounted () {
    http.user.getLoginID()
      .then(id => {
        return http.user.getUser(id)
      })
      .then(res => {
        this.userInfo = res
      })
  },
  methods: {
    clickMenuItem ({ item, key, keyPath }) {
      this.$router.push({
        name: 'Admin',
        params: {
          tab: key
        }
      })
    },
    clickUserMenuItemListener: function ({ item, key, keyPath }) {
      this.userMenuItems[key].action()
    },
  },
  watch: {
    $route (to, from) {
      this.tabName = to.params.tab
      this.selectedKeys = [ tabs[to.params.tab] ]
    }
  },
  components: {
    Home,
    Type,
    ImageInfo,
    ImageDetails,
    ImageEditor,
    User,
    UserDetails,
    UserEditor
  }
}
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  display: flex;
  color: white;
  justify-content: center;
  font-size: 18pt;
  overflow: hidden;
}
.right-element {
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64px;
}
</style>
