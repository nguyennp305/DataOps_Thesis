<template>
  <div class="app-container">
    <filter-search
      :listQuery="listQuery"
      :showCreatedAt.sync="showCreatedAt"
      :showCreatedBy.sync="showCreatedBy"
      :downloadLoading="downloadLoading"
      @filter="handleFilter"
      @create="handleCreate"
      @download="handleDownload"
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
      @generate-data="handleClickButtonGenerateData"
      @delete="handleDelete"
      @pagination="getList"
    />
    <dataset-modal
      :visible="visible"
      :isEdit="isEditModal"
      :data="propDataItem"
      :listAllDatasetInProject="listAllDatasetInProject"
      @update:visible="handleUpdateVisible"
      @update:reload-table="reloadTable"
    />
    <generate-data-label-model
      :visible="visibleGenerateData"
      :dataset="propDataItemGenerateData"
      @update:visible="handleUpdateVisibleGenerateData"
      @update:reload-table="reloadTable"
    />
  </div>
</template>

<script>
// import component
import Datatable from '@/views/dataset-management/component/datatable'
import FilterSearch from '@/views/dataset-management/component/filter-search'
import DatasetModal from '@/components/Modal/datasetModal'
import GenerateDataLabelModel from '@/components/Modal/generateDataLabelModel.vue'
// import function call api.
import {
  getDatasetList,
  deleteDatasetById
} from '@/api/dataset-management/dataset'
export default {
  name: 'DatasetList',
  components: {
    Datatable,
    FilterSearch,
    DatasetModal,
    GenerateDataLabelModel
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
        name: undefined,
        description: undefined,
        createdBy: undefined,
        projectId: undefined,
        labelType: undefined
      },
      showCreatedAt: false,
      showCreatedBy: false,
      downloadLoading: false,
      visible: false,
      isEditModal: false,
      propDataItem: null,
      visibleGenerateData: false,
      propDataItemGenerateData: null,
      listAllDatasetInProject: []
    }
  },
  created() {
    this.getList()
    this.getListAllDatasetInProject()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getDatasetList(this.listQuery)
      this.list = data.items
      this.total = data.total
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    async getListAllDatasetInProject() {
      const query = {
        page: 1,
        size: 100000000 // mock số lượng.
      }
      const { data } = await getDatasetList(query)
      // Dùng reduce để gộp tất cả các labeledImageIds
      const allLabeledImageIds = data.items.reduce((acc, item) => {
        if (item.labeledImageIds && Array.isArray(item.labeledImageIds)) {
          return acc.concat(item.labeledImageIds)
        }
        return acc
      }, [])
      this.listAllDatasetInProject = allLabeledImageIds
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
    handleClickButtonGenerateData(row) {
      this.propDataItemGenerateData = row
      this.visibleGenerateData = true
    },
    handleUpdateVisibleGenerateData(newVal) {
      this.propDataItemGenerateData = null
      this.visibleGenerateData = newVal
    },
    handleDelete(row) {
      this.$confirm(
        'Confirm to remove this dataset? (not multiple language)',
        'Warning',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async() => {
          await deleteDatasetById({
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
    handleDownload() {
      this.downloadLoading = true
      console.log('handleDownload')
      this.downloadLoading = false
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
<style lang="scss" scoped></style>
