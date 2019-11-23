<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>卫星图像</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>卫星图像</h1>
      <router-link to="image_editor"><a-button class="editable-add-btn" type="primary">Add</a-button></router-link>
      <a-button  @click="showBatchModal" class="editable-add-btn">Batch Add</a-button>
      <a-table :loading="loading" :columns="columns" :dataSource="data" :rowKey="record=>record.id" @change="handleTableChange" :pagination="pagination">
        <a slot="image" slot-scope="text" href="javascript:">
          <img @click="(e)=>openPhotoModal(host + text)" class="photo-image" :src="host + text"/>
        </a>
        <span slot="customTitle"><a-icon type="smile-o" /> Name</span>
        <span slot="action" slot-scope="record">
          <a href="javascript:" @click="()=>navigateToDetails(record.id)">See</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="()=>navigateToEditor(record.id)">Edit</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="Are you sure delete this task?"
            @confirm="()=>confirmDelete(record.id)"
            okText="Yes"
            cancelText="No"
          >
            <a href="javascript:">Delete</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <a-modal
      title="Batch New Type"
      :visible="batchModal.visible"
      @ok="handleBatchOK"
      :confirmLoading="batchModal.loading"
      @cancel="handleBatchCancel"
    >
      <p>{{batchModal.text}}
        <a-icon type="question-circle" @click="openNotification"/>
      </p>
      <a-upload :fileList="batchModal.fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
        <a-button> <a-icon type="upload" /> Select File </a-button>
      </a-upload>
    </a-modal>
    <a-modal :zIndex="901" v-model="visibleModal" :footer="null">
      <a :href="imageUrl" target="_blank"><img :style="{ width: '100%' }" :src="imageUrl" /></a>
    </a-modal>
  </div>
</template>

<script>
import http from '@/HttpConnector'
import values from '@/values'
const columns = [
  {
    title: '图像ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '图像',
    dataIndex: 'thumbUrl',
    scopedSlots: { customRender: 'image' },
    key: 'image',
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'Position',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '创建者ID',
    dataIndex: 'userID',
    key: 'userID',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  data () {
    return {
      data: [],
      columns,
      host: values.host,
      visibleModal: false,
      imageUrl: null,
      loading: false,
      pagination: {},
      batchModal: {
        text: 'import photos from excel file:',
        visible: false,
        loading: false,
        disabled: false,
        fileList: [],
        uploading: false,
      }
    }
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    showBatchModal () {
      let batchModal = {...this.batchModal}
      batchModal.visible = true
      batchModal.fileList = []
      this.batchModal = batchModal
    },
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      let user = {}
      for (let item in filters) {
        user[item] = filters[item][0]
      }
      this.fetch({
        listParams: {
          pageSize: pagination.pageSize,
          currPage: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
        },
        user
      })
    },
    handleBatchOK (e) {
      let batchModal = {...this.batchModal}
      batchModal.text = 'waiting...'
      batchModal.loading = true
      batchModal.uploading = true
      const { fileList } = batchModal
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      this.batchModal = batchModal
      console.log(fileList)
      setTimeout(() => {
        let batchModal = {...this.batchModal}
        batchModal.uploading = false
        batchModal.visible = false
        batchModal.loading = false
        batchModal.text = 'import photos from excel file:'
        this.batchModal = batchModal
        this.$message.success('upload successfully.')
      }, 2000)
    },
    handleBatchCancel (e) {
      let batchModal = {...this.batchModal}
      batchModal.visible = false
      this.batchModal = batchModal
    },
    handleRemove (file) {
      const index = this.batchModal.fileList.indexOf(file)
      const newFileList = this.batchModal.fileList.slice()
      newFileList.splice(index, 1)
      let batchModal = {...this.batchModal}
      batchModal.fileList = newFileList
      this.batchModal = this.batchModal
    },
    beforeUpload (file) {
      let batchModal = {...this.batchModal}
      batchModal.fileList = [...this.batchModal.fileList, file]
      this.batchModal = batchModal
      return false
    },
    openNotification () {
      this.$notification.info({
        message: 'Excel Format Requirement',
        description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        style: {
          width: '600px',
          marginLeft: `${335 - 600}px`,
        },
      })
    },
    confirmDelete (id) {
      http.image.deleteImage(id)
        .then(res => {
          this.$message.success('删除成功')
          this.fetch()
        })
    },
    navigateToDetails (id) {
      this.$router.push({
        name: 'Admin',
        params: {
          tab: 'image_details'
        },
        query: {
          id
        }
      })
    },
    navigateToEditor (id) {
      this.$router.push({
        name: 'Admin',
        params: {
          tab: 'image_editor'
        },
        query: {
          id
        }
      })
    },
    fetch (params = {}) {
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
    openPhotoModal (imageUrl) {
      this.visibleModal = true
      this.imageUrl = imageUrl
    },
  }
}
</script>

<style scoped>
.editable-add-btn {
  margin-bottom: 8px;
}
.photo-image {
  width: 100px;
}
</style>
