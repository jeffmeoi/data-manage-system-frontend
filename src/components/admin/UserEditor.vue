<template>
  <div>
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item>
        <router-link to="user">用户管理</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>编辑信息</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>编辑信息</h1>
      <div :style="{ width: '70%', minWidth: '600px' }">
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item v-if="userID" label="用户ID" v-bind="formItemLayout">
            <span class="a-form-text">{{userDetails.id}}</span>
          </a-form-item>
          <a-form-item label="用户名" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'username',
                {
                  initialValue: userDetails.username,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Username!',
                    },
                  ]
                },
              ]"
              placeholder="Username"
            />
          </a-form-item>
          <a-form-item v-if="userID == null" label="密码" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'password',
                {
                  initialValue: userDetails.password,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                  ]
                },
              ]"
              type="password"
              placeholder="Password"
            />
          </a-form-item>
          <a-form-item label="姓名" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'name',
                {
                  initialValue: userDetails.name,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Name!',
                    },
                  ]
                },
              ]"
              placeholder="Name"
            />
          </a-form-item>
          <a-form-item label="邮箱" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'email',
                {
                  initialValue: userDetails.email,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your E-mail!',
                    },
                  ]
                },
              ]"
              placeholder="E-mail"
            />
          </a-form-item>
          <a-form-item label="身份" v-bind="formItemLayout">
            <a-select
              v-decorator="[
                'status',
                {
                  initialValue: userDetails.statusName,
                  rules: [{ required: true, message: 'Please select a Status!' }]
                },
              ]"
              placeholder="Please select a Status"
            >
              <a-select-option v-for="(item) in statusList" :value="item.name" :key="item.status">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="userID" label="创建者ID" v-bind="formItemLayout">
            <span class="a-form-text">{{userDetails.creatorID ? userDetails.creatorID : '无'}}</span>
          </a-form-item>
          <a-form-item v-if="userID" label="创建时间" v-bind="formItemLayout">
            <span class="a-form-text">{{userDetails.createTime}}</span>
          </a-form-item>
          <a-form-item v-if="userID" label="更新时间" v-bind="formItemLayout">
            <span class="a-form-text">{{userDetails.updateTime}}</span>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 8 }">
            <a-button type="primary" html-type="submit">
              Submit
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <a-modal :zIndex="901" v-model="visibleModal"  :footer="null">
      <a :href="userDetails.fileUri" target="_blank"><img :style="{ width: '100%' }" :src="userDetails.fileUri" /></a>
    </a-modal>
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
    return {
      formItemLayout,
      visibleModal: false,
      userID: this.$route.query.id,
      userDetails: {
      },
      loading: false,
      statusList: []
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    console.log(this.userInfo)
    http.role.getRoleList()
      .then(res => {
        this.statusList = res
      })
    if (this.userID != null) {
      http.user.getUser(this.userID)
        .then(res => {
          this.userDetails = res
        })
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, formData) => {
        if (err) {
          return
        }
        formData.status = this.statusList.filter(role => role.name === formData.status)[0].status
        formData.creatorID = this.userInfo.id
        if (this.userID) {
          http.user.updateUser(this.userID, formData)
            .then(res => {
              console.log(res)
              this.$message.success('修改成功！')
              this.$router.push({
                name: 'Admin',
                params: {
                  tab: 'user'
                }
              })
            })
        } else {
          http.user.addUser(formData)
            .then(res => {
              console.log(res)
              this.$message.success('创建成功！')
              this.$router.push({
                name: 'Admin',
                params: {
                  tab: 'user'
                }
              })
            })
        }
        console.log('Received values of form: ', formData)
      })
    },
    openPhotoModal (imageUri) {
      this.visibleModal = true
    },
  }
}
</script>

<style scoped>
.phooto-image {
  width: 120px;
}
.a {
  align-self: flex-end
}
</style>
