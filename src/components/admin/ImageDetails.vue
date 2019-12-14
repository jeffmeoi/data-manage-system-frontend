<template>
  <div>
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item>
        <router-link to="image_info">Images</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>Image Info</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>Image Info</h1>
      <a-form>
        <a-form-item label="Image" v-bind="formItemLayout">
          <a class="a-form-text">
            <img @click="(e)=>openPhotoModal(host + imageDetails.url)" class="phooto-image" :src="host + imageDetails.thumbUrl"/>
          </a>
        </a-form-item>
        <a-form-item label="Image ID" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.id}}</span>
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
        <a-form-item label="User ID" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.userID}}</span>
        </a-form-item>
        <a-form-item label="Create Time" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.createTime}}</span>
        </a-form-item>
        <a-form-item label="Update Time" v-bind="formItemLayout">
          <span class="a-form-text">{{imageDetails.updateTime}}</span>
        </a-form-item>
      </a-form>
    </div>
    <a-modal :zIndex="901" v-model="visibleModal" :footer="null">
      <a :href="imageUrl" target="_blank"><img :style="{ width: '100%' }" :src="imageUrl" /></a>
    </a-modal>
  </div>
</template>

<script>
import http from '@/HttpConnector'
import values from '@/values'
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
      host: values.host,
      visibleModal: false,
      imageUrl: null,
      imageID: this.$route.query.id,
      imageDetails: {},
    }
  },
  mounted () {
    http.image.getImageInfo(this.imageID)
      .then(res => {
        this.imageDetails = res
      })
  },
  methods: {
    openPhotoModal (imageUrl) {
      this.visibleModal = true
      this.imageUrl = imageUrl
    },
  },
}
</script>

<style scoped>
.phooto-image {
  width: auto;
  height: 150px;
  margin: auto;
}
</style>
