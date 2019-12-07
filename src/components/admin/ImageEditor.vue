<template>
  <div>
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item>
        <router-link to="image_info">卫星图像</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>编辑信息</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>编辑信息</h1>
      <div :style="{ width: '70%', minWidth: '600px' }">
        <a-form  :form="form" @submit="handleSubmit">
          <a-form-item label="图像" v-bind="formItemLayout">
            <a-card style="width: 325px;" :bodyStyle="{ display: 'flex', flexDirection: 'row', alignItems: 'center'}">
              <img v-if="imageDetails.thumbUrl" @click="(e)=>openPhotoModal(host + imageDetails.url)" class="photo-image" :src="host + imageDetails.thumbUrl"/>
              <div v-else :style="{}">
                <div :style="{width: '120px', height: '120px', border: '1px solid #c8c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}">
                  <a-icon type='picture' :style="{ fontSize: '80px' }" />
                </div>
              </div>
              <input
                v-decorator="['url',
                  {
                    rules: [
                      {
                        required: true,
                        message: 'Please select a picture!',
                      },
                    ]
                  },
                ]"
                type="hidden"/>
              <a-upload
                :style="{ paddingLeft: '16px', width: '125px' }"
                name="image"
                :showUploadList="false"
                :multiple="false"
                :customRequest="uploadImage"
                :beforeUpload="beforeUpload"
              >
                <a-button v-if="loading"><a-icon type="loading" />Loading</a-button>
                <a-button v-else><a-icon type="upload" />Upload</a-button>
              </a-upload>
            </a-card>
          </a-form-item>
          <a-form-item v-if="imageID" label="图像ID" v-bind="formItemLayout">
            <span class="a-form-text">{{imageDetails.id}}</span>
          </a-form-item>
          <a-form-item label="类型" v-bind="formItemLayout">
            <a-select
              v-decorator="[
                'type',
                {
                  initialValue: imageDetails.type,
                  rules: [{ required: true, message: 'Please select a Type!' }]
                },
              ]"
              placeholder="Please select a Type"
            >
              <a-select-option v-for="(item) in types" :value="item.name" :key="item.id">
                {{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="国别" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'country',
                {
                  initialValue: imageDetails.country,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Country!',
                    },
                  ]
                },
              ]"
              placeholder="Country"
            />
          </a-form-item>
          <a-form-item label="具体位置" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'position',
                {
                  initialValue: imageDetails.position,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Position!',
                    },
                  ]
                },
              ]"
              placeholder="Position"
            />
          </a-form-item>
          <a-form-item label="分辨率" v-bind="formItemLayout">
            <a-input-number :min="0" :max="10000" :step="0.1"  style="width: 200px;"
              v-decorator="[ 'ppi',
                {
                  initialValue: imageDetails.ppi,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your PPi!',
                    },
                  ]
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="经度" v-bind="formItemLayout">
            <a-input-number :min="-180" :max="180" :step="0.1"  style="width: 200px;"
              v-decorator="[ 'longitude',
                {
                  initialValue: imageDetails.longitude,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Longitude!',
                    },
                  ]
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="纬度" v-bind="formItemLayout">
            <a-input-number :min="-90" :max="90" :step="0.1" style="width: 200px;"
              v-decorator="[ 'latitude',
                {
                  initialValue: imageDetails.latitude,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Latitude!',
                    },
                  ]
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="采集时间" v-bind="formItemLayout">
            <a-date-picker
              v-decorator="[ 'gatherTime',
                {
                  initialValue: imageDetails.gatherTime,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Gather Time!',
                    },
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="采集时长" v-bind="formItemLayout">
            <a-input-number :min="0" :max="1000" :step="0.1"  style="width: 200px;"
              v-decorator="[ 'gatherDuration',
                {
                  initialValue: imageDetails.gatherDuration,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Gather Duration!',
                    },
                  ]
                },
              ]"
            />
          </a-form-item>
          <a-form-item label="比例尺" v-bind="formItemLayout">
            <a-input-number :min="0" :max="100" :step="0.1"  style="width: 200px;"
              v-decorator="[ 'scale',
                {
                  initialValue: imageDetails.scale,
                  rules: [
                    {
                      required: true,
                      message: 'Please input your Scale!',
                    },
                  ]
                },
              ]"
            />
          </a-form-item>
          <a-form-item v-if="imageID" label="用户ID" v-bind="formItemLayout">
            <span class="a-form-text">{{imageDetails.userID}}</span>
          </a-form-item>
          <a-form-item v-if="imageID" label="创建时间" v-bind="formItemLayout">
            <span class="a-form-text">{{imageDetails.createTime}}</span>
          </a-form-item>
          <a-form-item v-if="imageID" label="更新时间" v-bind="formItemLayout">
            <span class="a-form-text">{{imageDetails.updateTime}}</span>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 8 }">
            <a-button type="primary" html-type="submit">
              Submit
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <a-modal :zIndex="901" v-model="visibleModal" :footer="null">
      <a :href="imageUrl" target="_blank"><img :style="{ width: '100%' }" :src="imageUrl" /></a>
    </a-modal>
  </div>
</template>

<script>
import http from '@/HttpConnector'
import values from '@/values'
import moment from 'moment'
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
      imageID: this.$route.query.id,
      imageDetails: {},
      loading: false,
      types: [],
      host: values.host,
      imageUrl: null,
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
    http.type.getTypeList()
      .then(res => {
        this.types = res
      })
    if (this.imageID) {
      http.image.getImageInfo(this.imageID)
        .then(res => {
          res.gatherTime = moment(res.gatherTime)
          this.form.setFieldsValue({
            url: {
              url: res.url,
              thumbUrl: res.thumbUrl
            }
          })
          this.imageDetails = res
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
        console.log('Received values of form: ', formData)
        let params = {...formData}
        params.gatherTime = params.gatherTime.format('YYYY-MM-DD') + ' 00:00:00'
        params.url = formData.url.url
        params.thumbUrl = formData.url.thumbUrl
        params.userID = this.userInfo.id
        params.typeID = this.types.filter(item => item.name === formData.type)[0].id
        if (this.imageID == null) {
          http.image.addImage(params)
            .then(res => {
              this.$message.success('创建成功！')
              this.$router.push({
                name: 'Admin',
                params: {
                  tab: 'image_info'
                }
              })
            })
        } else {
          http.image.updateImage(this.imageID, params)
            .then(res => {
              this.$message.success('修改成功！')
              this.$router.push({
                name: 'Admin',
                params: {
                  tab: 'image_info'
                }
              })
            })
        }
      })
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('You can only upload JPG/PNG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      this.form.validateFields((err, formData) => {
        if (err) {
          console.log(err)
        }
        console.log(formData)
      })
      return (isJPG || isPNG) && isLt2M
    },
    uploadImage (options) {
      this.loading = true
      let file = options.file
      let formData = new FormData()
      formData.append('file', file, file.name)
      return http.image.uploadImage(formData)
        .then(res => {
          let imageDetails = {...this.imageDetails}
          imageDetails.url = res.url
          imageDetails.thumbUrl = res.url
          this.imageDetails = imageDetails
          this.loading = false
          this.form.setFieldsValue({ url: res })
          this.$message.success('图片上传成功！')
        })
    },
    normFile (e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    openPhotoModal (imageUrl) {
      this.visibleModal = true
      this.imageUrl = imageUrl
    },
  }
}
</script>

<style scoped>
.photo-image {
  width: 120px;
}
.a {
  align-self: flex-end
}
</style>
