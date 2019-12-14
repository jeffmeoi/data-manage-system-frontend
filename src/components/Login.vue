<template>
  <a-layout id="components-layout-top" class="layout" style="height: 100%; min-width: 1000px;">
    <a-layout-header style="background-color: white;">
      <img class="logo" src="../assets/ecnu_logo.gif"/>
    </a-layout-header>
    <a-layout-content :style="{display: 'flex', flexDirection: 'row'}">
      <a-layout>
        <a-layout-sider class="content-sider" :width="600"  theme="light">
          <h1 class="headline-text">{{headline}}</h1>
        </a-layout-sider>
        <a-layout-content class="content-footer-layout" :style="{ backgroundColor: 'white', minHeight: '380px', width: '600px'}">
          <a-layout>
            <a-layout-content :style="{ background: 'white' , paddingBottom: '150px'}">
              <div class="login-card">
                <h1 :style="{marginBottom: '40px', fontSize: '44px'}">Welcome To Login</h1>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item :label="strings.username">
                    <a-input
                      size="large"
                      v-decorator="[
                        'username',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your Username!',
                            },
                          ],
                        },
                      ]"
                      :placeholder="strings.username"
                    >
                      <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                  </a-form-item>
                  <a-form-item label="Password">
                    <a-input
                      size="large"
                      v-decorator="[
                        'password',
                        { rules: [{ required: true, message: 'Please input your Password!' }] },
                      ]"
                      type="password"
                      placeholder="Password"
                    >
                      <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                    </a-input>
                  </a-form-item>
                  <a-form-item>
                    <a-checkbox
                      v-decorator="[
                        'remember',
                        {
                          valuePropName: 'checked',
                          initialValue: true,
                        },
                      ]"
                    >
                      Remember me
                    </a-checkbox>
                    <!--
                    <a class="login-form-forgot" @click="navigateToForgetPassword">
                      Forgot password
                    </a>
                    -->
                  </a-form-item>
                  <a-form-item >
                    <a-button type="primary" html-type="submit" class="login-form-button">
                      Log in
                    </a-button>
                  </a-form-item>
                  <a-form-item >
                    Or
                    <a @click="navigateToRegister">
                      register now!
                    </a>
                  </a-form-item>
                </a-form>
              </div>
            </a-layout-content>
            <a-layout-footer style="text-align: center; background: rgb(255, 255, 255);">
              {{ footerText }}
            </a-layout-footer>
          </a-layout>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
import http from '@/HttpConnector'
import strings from '@/strings'
export default {
  name: 'Login',
  data () {
    return Object.assign({
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      footerText: 'Image Information Manage System ©2019 Created by Jeff Xie',
      headline: 'Image Information Manage System',
    }, {
      strings: strings.zh
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
        http.user.login(formData.username, formData.password)
          .then(res => {
            console.log(res)
            this.$router.push({
              name: 'Homepage'
            })
          })
      })
    },
    navigateToRegister (e) {
      e.preventDefault()
      this.$router.push({
        name: 'Register'
      })
    },
    navigateToForgetPassword (e) {
      e.preventDefault()
      this.$router.push({
        name: 'ForgetPassword'
      })
    }
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
.login-card {
  margin: auto;
  width: 400px;
  margin-top: 100px;
}
.login-form-button {
  width: 100%;
}
.login-form-forgot {
  float: right;
}
.login-form {
  max-width: 300px;
}
</style>
