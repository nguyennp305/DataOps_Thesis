<template>
  <div class="app-container">
    <filter-search
      :listQuery="listQuery"
      :showReviewer.sync="showReviewer"
      :showStatus.sync="showStatus"
      :downloadLoading="downloadLoading"
      @filter="handleFilter"
      @create="handleCreate"
      @download="handleDownload"
      @update:listQuery="updateListQuery"
      @update:showReviewer="updateShowReviewer"
      @update:showStatus="updateShowStatus"
      @update:tableKey="updateTableKey"
    />

    <datatable
      :loading="listLoading"
      :data="list"
      :total="total"
      :tableKey="tableKey"
      :listQuery="listQuery"
      :showReviewer="showReviewer"
      :showStatus="showStatus"
      @sort-change="sortChange"
      @update="handleUpdate"
      @delete="handleDelete"
      @pagination="getList"
    />

    <domain-modal
      :visible="visible"
      :isEdit="isEditModal"
      :data="propDataItem"
      @update:visible="handleUpdateVisible"
    />
  </div>
</template>

<script>
// import component
import Datatable from '@/views/organization/components/domain/datatable'
import FilterSearch from '@/views/organization/components/domain/filter-search'
import DomainModal from '@/components/Modal/domainModal'
// import function call api.
import { getListDomain, deleteDomain } from '@/api/organization/domain'

export default {
  components: {
    Datatable,
    FilterSearch,
    DomainModal
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        type: undefined,
        author: undefined,
        reviewer: undefined,
        status: undefined,
        sort: '+id'
      },
      showReviewer: false,
      showStatus: false,
      downloadLoading: false,
      visible: false,
      isEditModal: false,
      propDataItem: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getListDomain(this.listQuery)
      this.list = data.items
      console.log('getListDomain', this.list)
      this.total = data.total
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.propDataItem = row
      this.isEditModal = true
      this.visible = true
    },
    handleUpdateVisible(newVal) {
      this.propDataItem = null
      this.visible = newVal
    },
    handleDelete(row) {
      this.$confirm('Confirm to remove this domain?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteDomain(row.id)
          this.list = this.list.filter((item) => item.id !== row.id)
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
        })
        .catch(err => { console.error(err) })
    },
    handleCreate() {
      this.propDataItem = null
      this.isEditModal = false
      this.visible = true
    },
    handleDownload() {
      this.downloadLoading = true
      console.log('handleDownload')
      this.downloadLoading = false
    },
    updateListQuery(newListQuery) {
      this.listQuery = newListQuery
    },
    updateShowReviewer(newVal) {
      this.showReviewer = newVal
    },
    updateShowStatus(newVal) {
      this.showStatus = newVal
    },
    updateTableKey(newVal) {
      this.tableKey = newVal
    }
  }
}
</script>
