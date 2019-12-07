<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>用户管理</h1>
      <router-link to="user_editor"><a-button class="editable-add-btn" type="primary">Add</a-button></router-link>
      <a-button  @click="showBatchModal" class="editable-add-btn">Batch Add</a-button>
      <a-table
        @change="handleTableChange"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :rowKey="record=>record.id"
      >
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
        <a slot="name" slot-scope="text" href="javascript:">{{text}}</a>
        <span slot="action" slot-scope="record">
          <a href="javascript:" @click="()=>navigateToDetails(record)">See</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="()=>navigateToEditor(record)">Edit</a>
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
  </div>
</template>

<script>
import http from '@/HttpConnector'
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '15%',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: '20%',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
    key: 'email',
    width: '25%',
    scopedSlots: {
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon',
      customRender: 'customRender',
    },
  },
  {
    title: 'Action',
    key: 'action',
    width: '20%',
    scopedSlots: { customRender: 'action' },
  },
]
export default {
  data () {
    return {
      data: [],
      columns,
      pagination: {},
      loading: false,
      batchModal: {
        text: 'import users from excel file:',
        visible: false,
        loading: false,
        disabled: false,
        fileList: [],
        uploading: false,
      }
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
        batchModal.text = 'import users from excel file:'
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
      http.user.deleteUser(id)
        .then(res => {
          this.$message.success('删除成功！')
          this.fetch()
        })
    },
    navigateToDetails (record) {
      console.log(record)
      this.$router.push({
        name: 'Admin',
        params: {
          tab: 'user_details'
        },
        query: {
          id: record.id
        }
      })
    },
    navigateToEditor (record) {
      this.$router.push({
        name: 'Admin',
        params: {
          tab: 'user_editor'
        },
        query: {
          id: record.id
        }
      })
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
    fetch (params) {
      this.loading = true
      http.user.getUserList(params)
        .then((data) => {
          const pagination = { ...this.pagination }
          pagination.total = data.info.totalCount
          this.loading = false
          this.data = data.results
          this.pagination = pagination
        })
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
</style>
