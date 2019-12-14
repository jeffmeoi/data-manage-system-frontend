<template>
  <div>
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item>
        <router-link to="user">Users</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>Users</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>Users</h1>
      <a-form>
        <a-form-item label="User ID" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.id}}</span>
        </a-form-item>
        <a-form-item label="Username" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.username}}</span>
        </a-form-item>
        <a-form-item label="Name" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.name}}</span>
        </a-form-item>
        <a-form-item label="E-mail" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.email}}</span>
        </a-form-item>
        <a-form-item label="Identity" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.statusName}}</span>
        </a-form-item>
        <a-form-item v-if="userID" label="Creator ID" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.creatorID ? userDetails.creatorID : 'None'}}</span>
        </a-form-item>
        <a-form-item label="Create Time" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.createTime}}</span>
        </a-form-item>
        <a-form-item label="Update Time" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.updateTime}}</span>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import http from '@/HttpConnector'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
export default {
  data () {
    console.log(this.$route)
    return {
      formItemLayout,
      userDetails: {},
      userID: this.$route.query.id
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  mounted () {
    http.user.getUser(this.userID)
      .then(res => {
        this.userDetails = res
      })
  }
}
</script>

<style scoped>
.phooto-image {
  width: auto;
  height: 150px;
  margin: auto;
}
</style>
