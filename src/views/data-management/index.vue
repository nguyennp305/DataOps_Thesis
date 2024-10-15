<template>
  <div class="app-container">
    <div class="portlet-filter">
      <labeling-slot :label="$t('route.datasetNameData')">
        <el-select
          v-model="datasetId"
          :placeholder="$t('route.datasetNameData')"
          filterable
          clearable
        >
          <el-option
            v-for="item in datasetTypyOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <div class="component-add-items-to-list-select">
            <el-button
              size="mini"
              type="primary"
              :disabled="
                totalItemsDatasetsOptions === datasetTypyOptions.length
              "
              @click="handleAddDatasets"
            >
              Add Items
            </el-button>
            <span>Total: {{ totalItemsDatasetsOptions }}</span>
          </div>
        </el-select>
      </labeling-slot>
    </div>
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
      @delete="handleDelete"
      @pagination="getList"
    />
    <data-modal
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
import Datatable from '@/views/data-management/component/datatable'
import FilterSearch from '@/views/data-management/component/filter-search'
import DataModal from '@/components/Modal/dataModal'
import LabelingSlot from '@/components/Commons/labeling-slot'
// import function call api.
import { getDataList, deleteDataById } from '@/api/data-management/data'
import { getDatasetList } from '@/api/dataset-management/dataset'

export default {
  name: 'DataList',
  components: {
    Datatable,
    FilterSearch,
    DataModal,
    LabelingSlot
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
        ids: null,
        createdBy: undefined,
        description: undefined,
        name: undefined,
        projectId: undefined,
        status: undefined
      },
      showCreatedAt: false,
      showCreatedBy: false,
      downloadLoading: false,
      visible: false,
      isEditModal: false,
      propDataItem: null,
      //
      datasetId: null,
      datasetTypyOptions: [],
      totalItemsDatasetsOptions: 0,
      listQueryDatasetOptions: {
        page: 1,
        size: 10
      }
    }
  },
  watch: {
    datasetId(newVal) {
      if (newVal) {
        this.getDatasetById(newVal)
      } else {
        this.listQuery.ids = null
        this.getList()
      }
    }
  },
  created() {
    this.getList()
    this.fetchDataSetList(this.listQueryDatasetOptions)
  },
  methods: {
    async getDatasetById(id) {
      const newQuery = {
        page: 1,
        size: 10,
        ids: id
      }
      const { data } = await getDatasetList(newQuery)
      if (data.items[0].labeledImageIds.length > 0) {
        this.listQuery.ids = data.items[0].labeledImageIds.join(',')
        await this.getList()
      } else {
        this.listQuery.ids = 'notImage'
        await this.getList()
      }
    },
    async fetchDataSetList(queryDataset) {
      const { data } = await getDatasetList(queryDataset)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.datasetTypyOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.datasetTypyOptions.push(newItem)
        }
      })
      this.totalItemsDatasetsOptions = data.total
    },
    async handleAddDatasets() {
      this.listQueryDatasetOptions.page += 1
      await this.fetchDataSetList(this.listQueryDatasetOptions)
    },
    async getList() {
      this.listLoading = true
      const { data } = await getDataList(this.listQuery)
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
        'Confirm to remove this data? (not multiple language)',
        'Warning',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async() => {
          await deleteDataById({
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
