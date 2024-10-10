<template>
  <div class="app-container">
    <div class="filter-container">
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
    </div>
    <div v-if="datasetId">
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
        @pagination="getListImage"
      />
      <labeling-image-modal
        :visible="visible"
        :data="propDataItem"
        :dataset="datasetInfo"
        @update:visible="handleUpdateVisible"
        @update:reload-table="reloadTable"
      />
    </div>
  </div>
</template>

<script>
// import component
import Datatable from '@/views/labeling-management/component/labeling-image/datatable'
import FilterSearch from '@/views/labeling-management/component/labeling-image/filter-search'
import LabelingImageModal from '@/components/Modal/labelingImageModal'
import LabelingSlot from '@/components/Commons/labeling-slot'
// import function call api.
// import { getLabelDataList } from '@/api/labeling-management/label-data'
import { mockLabelingImageData } from '@/views/labeling-management/component/labeling-image/mockLabelingImageData'
import { getDatasetList } from '@/api/dataset-management/dataset'

export default {
  name: 'LabelingImage',
  components: {
    Datatable,
    FilterSearch,
    LabelingImageModal,
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
        name: undefined,
        description: undefined,
        createdBy: undefined,
        projectId: undefined
      },
      showCreatedAt: false,
      showCreatedBy: false,
      visible: false,
      isEditModal: false,
      propDataItem: null,
      //
      datasetId: null,
      datasetInfo: null,
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
      }
    }
  },
  created() {
    this.getListImage()
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
      this.datasetInfo = data.items[0]
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
    async getListImage() {
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
      this.getListImage()
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
