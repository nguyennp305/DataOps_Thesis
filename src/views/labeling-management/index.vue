<template>
  <div class="app-container">
    <filter-search
      :listQuery="listQuery"
      :showCreatedAt.sync="showCreatedAt"
      :showCreatedBy.sync="showCreatedBy"
      @filter="handleFilter"
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
      @pagination="getList"
      />
    <labeling-image-modal
      :visible="visible"
      :data="propDataItem"
      @update:visible="handleUpdateVisible"
      @update:reload-table="reloadTable"
    />
  </div>
</template>

<script>
// import component
import Datatable from '@/views/labeling-management/component/labeling-image/datatable'
import FilterSearch from '@/views/labeling-management/component/labeling-image/filter-search'
import LabelingImageModal from '@/components/Modal/labelingImageModal'
// import function call api.
// import { getLabelDataList } from '@/api/labeling-management/label-data'
import { mockLabelingImageData } from '@/views/labeling-management/component/labeling-image/mockLabelingImageData'
export default {
  name: 'LabelingImage',
  components: {
    Datatable,
    FilterSearch,
    LabelingImageModal
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
        projectId: undefined
      },
      showCreatedAt: false,
      showCreatedBy: false,
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
      // const { data } = await getLabelDataList(this.listQuery)
      // this.list = data.items
      // this.total = data.total
      this.list = mockLabelingImageData
      this.total = mockLabelingImageData.length

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
