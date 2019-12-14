<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Images</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>Images</h1>
      <router-link to="image_editor"><a-button class="editable-add-btn" type="primary">Add</a-button></router-link>
      <a-button  @click="showBatchModal" class="editable-add-btn">Batch Add</a-button>
      <a-table :loading="loading" :columns="columns" :dataSource="data" :rowKey="record=>record.id" @change="handleTableChange" :pagination="pagination">
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
        >
          <a-input
            v-ant-ref="c => searchInput = c"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleSearch(selectedKeys, confirm)"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            >Search</a-button
          >
          <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px"
            >Reset</a-button
          >
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <a slot="image" slot-scope="text, record" href="javascript:">
          <img @click="(e)=>openPhotoModal(host + record.url)" class="photo-image" :src="host + record.thumbUrl"/>
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
    title: 'Image ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Image',
    dataIndex: 'thumbUrl',
    scopedSlots: { customRender: 'image' },
    key: 'image',
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
  },
  {
    title: 'Specific Location',
    dataIndex: 'position',
    key: 'position',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
  },
  {
    title: 'Category',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Creator ID',
    dataIndex: 'userID',
    key: 'userID',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
  },
  {
    title: 'Create Time',
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
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
      let imageFilterParams = {}
      for (let item in filters) {
        imageFilterParams[item] = filters[item][0]
      }
      this.fetch({
        listParams: {
          pageSize: pagination.pageSize,
          currPage: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
        },
        imageFilterParams
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
        formData.append('files', file)
      })
      this.batchModal = batchModal
      console.log(fileList)
      http.image.addImages(formData)
        .then(res => {
          let batchModal = {...this.batchModal}
          batchModal.uploading = false
          batchModal.visible = false
          batchModal.loading = false
          batchModal.text = 'import images from excel file:'
          this.batchModal = batchModal
          this.$message.success('upload successfully.')
          this.fetch()
        })
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
          this.$message.success('Delete Successfully')
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
    handleSearch (selectedKeys, confirm) {
      confirm()
      this.searchText = selectedKeys[0]
    },
    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
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
