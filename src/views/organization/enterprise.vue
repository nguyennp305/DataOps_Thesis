<template>
  <div class="app-container">
    <filter-search
      :listQuery="listQuery"
      :showCreatedAt.sync="showCreatedAt"
      :showCreatedBy.sync="showCreatedBy"
      :downloadLoading="downloadLoading"
      @filter="handleFilter"
      @create="handleCreate"
      @update:listQuery="updateListQuery"
      @update:showCreatedAt="updateShowCreatedAt"
      @update:showCreatedBy="updateShowCreatedBy"
      @update:tableKey="updateTableKey"
    />
    <datatable
      :loading="listLoading"
      :data="list"
      :total="total"
      :tableKey="tableKey"
      :listQuery="listQuery"
      :showCreatedAt="showCreatedAt"
      :showCreatedBy="showCreatedBy"
      @update="handleClickButtonUpdate"
      @delete="handleDelete"
      @pagination="getList"
    />
    <enterprise-modal
      :visible="visible"
      :isEdit="isEditModal"
      :data="propDataItem"
      @update:visible="handleUpdateVisible"
      @update:reload-table="reloadTable"
    />
  </div>
</template>

<script>
// import component
import Datatable from '@/views/organization/components/datatable'
import FilterSearch from '@/views/organization/components/filter-search'
import EnterpriseModal from '@/components/Modal/enterpriseModal.vue'
// import function call api.
import { getListEnterprise, deleteEnterprise } from '@/api/organization/enterprise'
export default {
  name: 'Enterprise',
  components: {
    Datatable,
    FilterSearch,
    EnterpriseModal
  },
  data() {
    return {
      listLoading: true,
      list: [],
      total: 0,
      tableKey: 0,
      listQuery: {
        page: 1,
        size: 10,
        word: undefined,
        startDate: undefined,
        enbDate: undefined
      },
      showCreatedAt: false,
      showCreatedBy: false,
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
      const { data } = await getListEnterprise(this.listQuery)
      this.list = data.items
      this.total = data.total
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleClickButtonUpdate(row) {
      this.propDataItem = row
      this.isEditModal = true
      this.visible = true
    },
    handleUpdateVisible(newVal) {
      this.propDataItem = null
      this.visible = newVal
    },
    handleDelete(row) {
      this.$confirm(
        'Confirm to remove this enterprise? (not multiple language)',
        'Warning',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async() => {
          await deleteEnterprise({
            id: row.id
          })
          this.list = this.list.filter((item) => item.id !== row.id)
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.reloadTable()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleCreate() {
      this.propDataItem = null
      this.isEditModal = false
      this.visible = true
    },
    updateListQuery(newListQuery) {
      this.listQuery = newListQuery
    },
    updateShowCreatedAt(newVal) {
      this.showCreatedAt = newVal
    },
    updateShowCreatedBy(newVal) {
      this.showCreatedBy = newVal
    },
    updateTableKey(newVal) {
      this.tableKey = newVal
    },
    reloadTable() {
      this.handleFilter()
    }
  }
}
</script>

<style lang="scss" scoped>
.field-label {
  vertical-align: middle;
}

.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}

.block {
  padding: 30px 24px;
}

.tag-item {
  margin-right: 15px;
}
</style>
