<template>
  <a-layout>
    <a-layout-header style="background-color: white; box-shadow: 0 2px 8px #f0f1f2; margin-bottom: 16px;">
      <img class="logo" src="../assets/ecnu_logo.gif"/>
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
    <a-layout>
      <a-layout-content :style="{ background: 'white', marginLeft: '16px'}">
        <div class="gallery">
          <a-card v-for="(item) in data" :key="item.id" size="small"  hoverable style="margin: 10px; ">
            <div style="width: 240px;overflow: hidden; display:flex; justify-content: center;" slot="cover" >
              <img @click="(e)=>openPhotoModal(host + item.url)" :src="host + item.thumbUrl" style="height: 240px;" />
            </div>
            <a-card-meta
              :title="item.country">
              <template slot="description">{{item.position}}</template>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a-icon type="picture" @click="(e)=>openPhotoModal(host + item.url)" />
              <a-icon type="ellipsis" @click="(e)=>openPhotoDrawer(item)" />
            </template>
          </a-card>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; margin-top: 100px; margin-bottom: 50px;">
          <a-pagination
            showSizeChanger
            @change="pageChange"
            @showSizeChange="onShowSizeChange"
            :pageSize.sync="pagination.pageSize"
            :defaultCurrent="pagination.currPage"
            :total="pagination.total"
          />
        </div>
      </a-layout-content>
      <a-divider type="vertical" />
      <a-layout-sider width="400" theme="light">
        <div :style="{ width: '100%', padding: '20px' }">
          <a-form layout="vertical" :form="form" @submit="handleSubmit" hideRequiredMark>
            <a-form-item label="Category" v-bind="formItemLayout">
              <a-select v-decorator="['type']" allowClear>
                <a-select-option v-for="(item) in types" :value="item.name" :key="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Country" v-bind="formItemLayout">
              <a-input v-decorator="['country']">
              </a-input>
            </a-form-item>
            <a-form-item label="Specific Location" v-bind="formItemLayout">
              <a-input v-decorator="['position']" ></a-input>
            </a-form-item>
            <a-form-item label="Resolution Ratio " v-bind="formItemLayout">
              <a-input-number :style="{width: '80px'}" :min="0" :max="10000" :step="0.1" v-decorator="[ 'fromPPi' ]" />
                -
              <a-input-number :style="{width: '80px'}" :min="0" :max="10000" :step="0.1" v-decorator="[ 'toPPi' ]"/>
            </a-form-item>
            <a-form-item label="Longitude" v-bind="formItemLayout">
              <a-input-number :style="{width: '80px'}" :min="-180" :max="180" :step="0.1" v-decorator="[ 'fromX' ]" />
                -
              <a-input-number :style="{width: '80px'}" :min="-180" :max="180" :step="0.1" v-decorator="[ 'toX' ]"/>
            </a-form-item>
            <a-form-item label="Latitude" v-bind="formItemLayout">
              <a-input-number :style="{width: '80px'}" :min="-90" :max="90" :step="0.1" v-decorator="[ 'fromY' ]" />
                -
              <a-input-number :style="{width: '80px'}" :min="-90" :max="90" :step="0.1" v-decorator="[ 'toY' ]" />
            </a-form-item>
            <a-form-item label="Acquisition Date" v-bind="formItemLayout">
              <a-date-picker v-decorator="[ 'gatherTime']" />
            </a-form-item>
            <a-form-item label="Acquisition Time" v-bind="formItemLayout">
              <a-input-number :style="{width: '80px'}" :min="0" :max="1000" :step="0.1" v-decorator="[ 'fromDuration' ]" />
                -
              <a-input-number :style="{width: '80px'}" :min="0" :max="1000" :step="0.1" v-decorator="[ 'toDuration' ]" />
            </a-form-item>
            <a-form-item label="Scale" v-bind="formItemLayout">
              <a-input-number :style="{width: '80px'}" :min="0" :max="100" :step="0.1" v-decorator="[ 'fromScale' ]" />
                -
              <a-input-number :style="{width: '80px'}" :min="0" :max="100" :step="0.1" v-decorator="[ 'toScale' ]" />
            </a-form-item>
            <a-form-item v-bind="tailFormItemLayout">
              <a-button type="primary" html-type="submit">Filter</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-layout-sider>
    </a-layout>
    <a-layout-footer class="footer">
      {{ footerText }}
    </a-layout-footer>
    <a-modal :zIndex="901" v-model="visibleModal" :footer="null">
      <a :href="modalImageUrl" target="_blank"><img :style="{ width: '100%' }" :src="modalImageUrl" /></a>
    </a-modal>
    <a-drawer
      title="Photo Details"
      :width="480"
      :zIndex="900"
      @close="onClosePhotoDrawer"
      :visible="visibleDrawer"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form layout="vertical"  >
        <a-form-item label="Image" v-bind="formItemLayout">
          <a @click="(e)=>openPhotoModal(host + imageDetails.url)"><img class="phooto-image" :src="host + imageDetails.thumbUrl"/></a>
        </a-form-item>
        <a-form-item label="Category" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.type}}</span>
        </a-form-item>
        <a-form-item label="Country" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.country}}</span>
        </a-form-item>
        <a-form-item label="Specific Location" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.position}}</span>
        </a-form-item>
        <a-form-item label="Resolution Ratio" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.ppi}}</span>
        </a-form-item>
        <a-form-item label="Longitude" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.longitude}}</span>
        </a-form-item>
        <a-form-item label="Latitude" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.latitude}}</span>
        </a-form-item>
        <a-form-item label="Acquisition Date" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.gatherTime}}</span>
        </a-form-item>
        <a-form-item label="Acquisition Time" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.gatherDuration}}</span>
        </a-form-item>
        <a-form-item label="Scale" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.scale}}</span>
        </a-form-item>
        <a-form-item :label="strings.userID" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.userID}}</span>
        </a-form-item>
        <a-form-item label="Image Link" v-bind="formItemLayout">
          <a class="a-form-text" :href="host + imageDetails.url" target="_blank">{{host + imageDetails.url}}</a>
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button @click="(e)=>openPhotoModal(host + imageDetails.url)">View Picture</a-button>
        <a-button @click="onClosePhotoDrawer" type="primary">OK</a-button>
      </div>
    </a-drawer>
  </a-layout>
</template>

<script>
import http from '@/HttpConnector'
import values from '@/values'
import strings from '@/strings'
const formItemLayout = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 12 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      offset: 16,
    },
  },
}
export default {
  name: 'Homepage',
  data () {
    let $router = this.$router
    const userMenuItems = [
      {
        text: 'Log out',
        action: function () {
          http.user.logout()
          $router.push({ name: 'Login' })
        }
      },
    ]
    return Object.assign({
      footerText: 'Image Management Information System ©2019 Created by Jeff Xie',
      host: values.host,
      visibleDrawer: false,
      visibleModal: false,
      data: [],
      formItemLayout,
      tailFormItemLayout,
      userMenuItems,
      imageDetails: {},
      cacheFilter: {},
      modalImageUrl: '',
      userInfo: {},
      pagination: {
        pageSize: 20,
        currPage: 1,
      },
      types: [
        'tab 1',
        'tab 2',
        'tab 3',
      ],
      strings: strings.zh
    })
  },
  mounted () {
    http.user.getLoginID()
      .then(id => {
        return http.user.getUser(id)
      })
      .then(res => {
        this.userInfo = res
        let $router = this.$router
        if (res.status === 1) {
          this.userMenuItems.unshift({
            text: 'Backstage',
            action: function () {
              $router.push({ name: 'Admin' })
            }
          })
        }
      })
    http.type.getTypeList()
      .then(res => {
        this.types = res
      })
    this.fetch()
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, formData) => {
        if (err) {
          return
        }
        if (formData.gatherTime) {
          formData.gatherTime = formData.gatherTime.format('YYYY-MM-DD')
        }
        if (formData.type != null) {
          formData.typeID = this.types.filter(item => item.name === formData.type)[0].id
        }
        console.log('Received values of form: ', formData)
        this.cacheFilter = formData
        this.fetch()
      })
    },
    clickUserMenuItemListener: function ({ item, key, keyPath }) {
      this.userMenuItems[key].action()
    },
    openPhotoDrawer (image) {
      this.imageDetails = {...image}
      this.visibleDrawer = true
    },
    openPhotoModal (imageUri) {
      this.visibleModal = true
      this.modalImageUrl = imageUri
    },
    onClosePhotoDrawer () {
      this.visibleDrawer = false
    },
    fetch (params = { imageFilterParams: this.cacheFilter, listParams: this.pagination }) {
      this.loading = true
      http.image.getImageInfoList(params)
        .then((data) => {
          const pagination = { ...this.pagination }
          pagination.total = data.info.totalCount
          this.loading = false
          this.data = data.results
          this.pagination = pagination
        })
    },
    onShowSizeChange (current, pageSize) {
      console.log(current + '  ' + pageSize)
      let pagination = {...this.pagination}
      pagination.currPage = current
      pagination.pageSize = pageSize
      this.pagination = pagination
      this.fetch()
    },
    pageChange (page, pageSize) {
      let pagination = { ...this.pagination }
      pagination.currPage = page
      this.pagination = pagination
      this.fetch()
    }
  },
}
</script>
<style scoped>
.right-sider {
  min-height: 380px;
}
.content {
  min-height: 380px;
}
.footer {
  text-align: center;
}
.gallery {
  padding: 18px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.photo {
  height: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.phooto-image {
  height: 125px;
}
.photo-details {
  width: 100%;
  height: 100%;
}
.info-line {
  color: white;
  position: flex;
  flex-direction: column;
  width: 100%;
}
.right-element {
  float: right;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64px;
}
</style>
