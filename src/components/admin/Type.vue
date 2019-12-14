<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item>Types</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>Types</h1>
      <a-button  @click="showAddModal" class="editable-add-btn" type="primary">Add</a-button>
      <a-button  @click="showBatchModal" class="editable-add-btn">Batch Add</a-button>
      <a-table :loading="loading" :columns="columns" :dataSource="data" :rowKey="record=>record.id" :pagination="false">
        <template
          v-for="col in ['name', 'description']"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, col)" />
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="action" slot-scope="record">
          <span v-if="record.editable">
            <a @click="() => save(record.id)">Save</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.id)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.id)">Edit</a>
          </span>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="Are you sure delete this task?"
            @confirm="()=>confirmDelete(record.id)"
            okText="Yes"
            cancelText="No"
          >
            <a href="javascript:">Delete</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <a-modal
      title="New Type"
      :visible="addModal.visible"
      @ok="handleAddOK"
      :confirmLoading="addModal.loading"
      @cancel="handleAddCancel"
    >
      <a-form :form="newTypeForm">
        <a-form-item label="Input the name of new type">
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input the name of new type!',
                  },
                ],
              },
            ]"
            :disabled="addModal.disabled"
            placeholder="Type Name"/>
        </a-form-item>
        <a-form-item label="Input the description of new type">
          <a-input
            v-decorator="[
              'description',
              {
                rules: [
                  {
                    required: true,
                    message: 'Please input the description of new type!',
                  },
                ],
              },
            ]"
            :disabled="addModal.disabled"
            placeholder="Type Name"/>
        </a-form-item>
      </a-form>
    </a-modal>
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
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' },
    width: '25%',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    scopedSlots: { customRender: 'description' },
    width: '50%',
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: '25%',
  },
]

export default {
  data () {
    return {
      data: [],
      columns,
      loading: false,
      cacheData: [],
      addModal: {
        text: 'Input the name of new type:',
        visible: false,
        loading: false,
        disabled: false,
      },
      batchModal: {
        text: 'import types from excel file:',
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
  beforeCreate () {
    this.newTypeForm = this.$form.createForm(this)
  },
  mounted () {
    this.fetch()
  },
  methods: {
    showAddModal () {
      let addModal = {...this.addModal}
      addModal.visible = true
      this.addModal = addModal
    },
    handleAddOK (e) {
      let addModal = {...this.addModal}
      addModal.text = 'waiting...'
      addModal.loading = true
      addModal.disabled = true
      this.addModal = addModal
      this.newTypeForm.validateFields((err, formData) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', formData)
        http.type.addType({
          name: formData.name,
          description: formData.description,
          userID: this.userInfo.id
        })
          .then(res => {
            let addModal = {...this.addModal}
            addModal.visible = false
            addModal.loading = false
            addModal.disabled = false
            addModal.text = 'Input the name of new type:'
            this.addModal = addModal
            this.$message.success('update success!')
            this.fetch()
          })
      })
      this.newTypeForm.resetFields()
    },
    handleAddCancel (e) {
      let addModal = {...this.addModal}
      addModal.visible = false
      this.addModal = addModal
    },
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
        formData.append('files', file)
      })
      this.batchModal = batchModal
      console.log(fileList)
      http.type.addTypes(formData)
        .then(res => {
          let batchModal = {...this.batchModal}
          batchModal.uploading = false
          batchModal.visible = false
          batchModal.loading = false
          batchModal.text = 'import types from excel file:'
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
      http.type.deleteType(id)
        .then(res => {
          this.$message.success('Delete Successfully!')
          this.fetch()
        })
    },
    handleChange (value, id, column) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit (id) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save (id) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        delete target.editable
        this.data = newData
        this.cacheData = newData.map(item => ({ ...item }))
        http.type.updateType(id, target)
          .then(res => {
            this.$message.success('Modify Successfully!')
          })
      }
    },
    cancel (id) {
      const newData = [...this.data]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
        delete target.editable
        this.data = newData
      }
    },
    fetch () {
      this.loading = true
      http.type.getTypeList()
        .then(res => {
          this.data = res
          this.loading = false
          this.cacheData = this.data.map(item => ({ ...item }))
        })
    }
  }
}
</script>

<style scoped>
.editable-add-btn {
  margin-bottom: 8px;
}
</style>
