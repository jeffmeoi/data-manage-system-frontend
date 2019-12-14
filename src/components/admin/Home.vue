<template>
  <div>
    <a-breadcrumb style="margin: 16px 0;">
      <a-breadcrumb-item>Survey</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
      <h1>Survey</h1>
      <h2>Category Statistics</h2>
      <a-table :columns="imageColumns" :dataSource="imageData" :rowKey="(record, index)=>index">
      </a-table>
      <h2>User Statistics</h2>
      <a-table :columns="userColumns" :dataSource="userData" :rowKey="(record, index)=>index">
      </a-table>
    </div>
  </div>
</template>

<script>
import http from '@/HttpConnector'
const imageColumns = [
  {
    title: 'Type',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
  },
]
const userColumns = [
  {
    title: 'Create Time',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
  },
]

export default {
  data () {
    return {
      imageColumns,
      userColumns,
      imageData: [],
      userData: []
    }
  },
  mounted () {
    http.user.getCount()
      .then(res => {
        this.userData = res
      })
    http.type.getCount()
      .then(res => {
        this.imageData = res
      })
  }
}
</script>

<style scoped>

</style>
