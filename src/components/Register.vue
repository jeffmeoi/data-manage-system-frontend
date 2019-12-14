<template>
  <a-layout id="components-layout-top" class="layout" style="height: 100%; min-width: 1000px;">
    <a-layout-header style="background-color: white;">
      <img class="logo" src="../assets/ecnu_logo.gif"/>
    </a-layout-header>
    <a-layout-content class="sider-content-layout">
    <a-layout>
      <a-layout-sider class="content-sider" :width="600" theme="light">
        <h1 class="headline-text">{{headline}}</h1>
      </a-layout-sider>
      <a-layout class="content-footer-layout">
        <a-layout-content class="content">
          <div class="register-card">
            <h1 :style="{marginBottom: '40px', fontSize: '44px'}">Welcome to Register</h1>
            <a-form :form="form" @submit="handleSubmit">
              <a-form-item label="Username">
                <a-input
                  v-decorator="[
                    'username',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please Input Your Username!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
              <a-form-item label="Password">
                <a-input
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please Input Your Password!',
                        },
                      ],
                    },
                  ]"
                  type="password"
                />
              </a-form-item>
              <a-form-item label="Confirm Password">
                <a-input
                  v-decorator="[
                    'confirm',
                    {
                      rules: [
                        {
                          required: true,
                          message: 'Please Confirm Your Password!',
                        },
                        {
                          validator: compareToFirstPassword,
                        },
                      ],
                    },
                  ]"
                  type="password"
                />
              </a-form-item>
              <a-form-item label="E-mail">
                <a-input
                  v-decorator="[
                    'email',
                    {
                      rules: [
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        },
                        {
                          required: true,
                          message: 'Please Input Your E-mail!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
              <a-form-item>
                <span slot="label">
                  Nickname&nbsp;
                  <a-tooltip title="What do you want others to call you?">
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </span>
                <a-input
                  v-decorator="[
                    'name',
                    {
                      rules: [{ required: true, message: 'Please Input Your Nickname!', whitespace: true }],
                    },
                  ]"
                />
              </a-form-item>
              <a-form-item>
                <a-checkbox v-decorator="['agreement', {
                  valuePropName: 'checked',
                  rules: [
                    {
                      required: true,
                      message: 'Please check!',
                    },
                  ],
                }]">
                  I have read the agreement
                </a-checkbox>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit">
                  Register
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-layout-content>
        <a-layout-footer class="footer">
          {{ footerText }}
        </a-layout-footer>
      </a-layout>
    </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import http from '@/HttpConnector'
export default {
  name: 'Register',
  data () {
    return Object.assign({
      footerText: 'Image Information Manage System ©2019 Created by Jeff Xie',
      headline: 'Image Information Manage System',
    })
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, formData) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', formData)
        http.user.register(formData)
          .then(res => {
            this.$message.success('Register Successfully!')
            this.$router.push({
              name: 'Login'
            })
          })
      })
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback(new Error('Two passwords that you enter is inconsistent!'))
      } else {
        callback()
      }
    },
  }
}
</script>

<style scoped>
#components-layout-top .logo {
  height: 31px;
  background: rgba(255,255,255,0);
  margin: 16px 24px 16px 0;
  float: left;
}
.headline-text {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  padding: 50% 0;
  height: 100%;
  font-size: 4em;
  margin: 0;
  /**禁用选中 */
  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
.content-sider {
  background: url('../assets/register_bg.jpg') center 0 no-repeat;
  background-size: cover;
}
.content-footer-layout {
  background-color: white;
  min-height: 380px;
  padding-bottom: 150px;
}
.register-card {
  margin: auto;
  width: 400px;
  margin-top: 100px;
}
.footer {
  text-align: center;
  background-color: white;
}
</style>
