<template>
  <a-layout id="components-layout-top" class="layout" style="height: 100%; min-width: 1300px;">
    <a-layout-header style="background-color: white;box-shadow: 0 2px 8px #f0f1f2;">
      <img class="logo" src="../assets/ecnu_logo.gif"/>
    </a-layout-header>
    <a-layout-content>
      <a-layout>
        <a-layout-content class="content-footer-layout">
          <div class="card">
            <a-steps :current="current">
              <a-step v-for="item in steps" :key="item.title" :title="item.title" />
            </a-steps>
            <div class="steps-content">
              <template v-if="steps[current].title === 'Username'">
                <a-form :form="form" @submit="handleUsernameSubmit" :style="{width: '400px', margin: 'auto'}">
                  <a-form-item label="Username">
                    <a-input
                      size="large"
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
                      placeholder="Username" />
                  </a-form-item>
                  <a-form-item >
                    <a-button type="primary" html-type="submit" class="login-form-button">
                      Confirm
                    </a-button>
                  </a-form-item>
                </a-form>
              </template>
              <template v-else-if="steps[current].title === 'E-mail'">
                <a-form :form="form" @submit="handleEmailSubmit" :style="{width: '400px', margin: 'auto'}">
                  <a-form-item label="E-mail">
                    <a-input
                      size="large"
                      v-decorator="[
                        'email',
                        {
                          rules: [
                            {
                              required: true,
                              message: 'Please Input Your E-mail!',
                            },
                          ],
                        },
                      ]"
                      placeholder="E-mail" />
                  </a-form-item>
                  <a-form-item >
                    <a-button type="primary" html-type="submit" class="login-form-button">
                      Confirm
                    </a-button>
                  </a-form-item>
                </a-form>
              </template>
              <template v-else-if="steps[current].title === 'Waiting'">
                <div :style="{ margin:'auto', textAlign: 'center', paddingTop: '50px'}">
                  <p>Please Open E-mail and Check Out.</p>
                </div>
              </template>
              <template v-else-if="steps[current].title === 'New Password'">
                <a-form :form="form" @submit="handlePasswordSubmit" :style="{width: '400px', margin: 'auto'}">
                  <a-form-item label="New Password">
                    <a-input
                      size="large"
                      v-decorator="[
                        'password',
                        { rules: [{ required: true, message: 'Please Input Iour Password!' }] },
                      ]"
                      type="password"
                      placeholder="New Password"
                    >
                    </a-input>
                  </a-form-item>
                  <a-form-item >
                    <a-button type="primary" html-type="submit" class="login-form-button">
                      Confirm
                    </a-button>
                  </a-form-item>
                </a-form>
              </template>
              <template v-else-if="steps[current].title === 'Done'">
                <div :style="{ margin:'auto', textAlign: 'center', paddingTop: '50px'}">
                  <p><a-icon type="check" />Modify Password Successfully, Please<a @click="navigateToLogin">Log In Again</a></p>
                </div>
              </template>
            </div>
            <!--
            <div class="steps-action">
              <a-button v-if="current < steps.length - 1" type="primary" @click="next">
                Next
              </a-button>
              <a-button
                v-if="current == steps.length - 1"
                type="primary"
                @click="$message.success('Processing complete!')"
              >
                Done
              </a-button>
              <a-button v-if="current>0" style="margin-left: 8px" @click="prev">
                Previous
              </a-button>
            </div>
            -->
          </div>
        </a-layout-content>
        <a-layout-footer class="footer">
          {{ footerText }}
        </a-layout-footer>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<script>
export default {
  name: 'ForgetPassword',
  data () {
    return Object.assign({
      footerText: 'Image Information Manage System ©2019 Created by Jeff Xie',
      headline: 'Image Information Manage System',
      current: 0,
      steps: [
        {
          title: 'Username',
          content: 'Input-Username-Content',
        },
        {
          title: 'E-mail',
          content: 'Fetch-Email-Content',
        },
        {
          title: 'Waiting',
          content: 'Waiting-Email-Content',
        },
        {
          title: 'New Password',
          content: 'New-Password-Content',
        },
        {
          title: 'Done',
          content: 'Done-Content',
        },
      ],
    })
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
  },
  methods: {
    next () {
      this.current++
    },
    prev () {
      this.current--
    },
    handleUsernameSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, formData) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', formData)
        this.current++
      })
    },
    handleEmailSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, formData) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', formData)
        this.current++
      })
    },
    handlePasswordSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, formData) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', formData)
        this.current++
        this.$message.success('Reset complete!')
      })
    },
    navigateToLogin (e) {
      this.$router.push({
        name: 'Login'
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
  color: rgba(255, 255, 255, 0);
  font-size: 4em;
  /**禁用选中 */
  -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
  -webkit-user-select:none; /*webkit浏览器*/
  -khtml-user-select:none; /*早期浏览器*/
  -moz-user-select:none;/*火狐*/
  -ms-user-select:none; /*IE10*/
  user-select:none;
}
.content-footer-layout {
  min-height: 380px;
  padding-bottom: 20px;
}
.card {
  margin: auto;
  width: 80%;
  min-width: 600px;
  margin-top: 100px;
}
.footer {
  text-align: center;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 500px;
  padding-top: 80px;
}
.steps-action {
  margin-top: 24px;
}
</style>
