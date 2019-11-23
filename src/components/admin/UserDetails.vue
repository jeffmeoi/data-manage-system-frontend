<template>
  <div>
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item>
        <router-link to="user">用户管理</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>用户信息</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>用户信息</h1>
      <a-form>
        <a-form-item label="用户ID" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.id}}</span>
        </a-form-item>
        <a-form-item label="用户名" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.username}}</span>
        </a-form-item>
        <a-form-item label="姓名" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.name}}</span>
        </a-form-item>
        <a-form-item label="邮箱" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.email}}</span>
        </a-form-item>
        <a-form-item label="身份" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.statusName}}</span>
        </a-form-item>
        <a-form-item v-if="userID" label="创建者ID" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.creatorID ? userDetails.creatorID : '无'}}</span>
        </a-form-item>
        <a-form-item label="创建时间" v-bind="formItemLayout">
          <span class="a-form-text">{{userDetails.createTime}}</span>
        </a-form-item>
        <a-form-item label="更新时间" v-bind="formItemLayout">
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
