<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="portlet-filter">
        <labeling-slot :label="$t('table.title')">
          <el-input
            v-model="listQuery.title"
            :placeholder="$t('table.title')"
          />
        </labeling-slot>

        <labeling-slot :label="$t('table.author')">
          <el-input
            v-model="listQuery.author"
            :placeholder="$t('table.author')"
          />
        </labeling-slot>

        <labeling-slot :label="$t('table.reviewer')">
          <el-input
            v-model="listQuery.reviewer"
            :placeholder="$t('table.reviewer')"
          />
        </labeling-slot>

        <labeling-slot :label="$t('table.type')">
          <el-select
            v-model="listQuery.type"
            :placeholder="$t('table.type')"
            clearable
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.displayName+'('+item.key+')'"
              :value="item.key"
            />
        </el-select>
        </labeling-slot>

        <labeling-slot :label="$t('table.status')">
          <el-select
            v-model="listQuery.status"
            :placeholder="$t('table.status')"
            clearable
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
        </el-select>
        </labeling-slot>

      </div>
      <div class="portlet-filter_action">
        <el-button
          v-waves
          type="primary"
          icon="el-icon-search"
          class="portlet-filter_action-button"
          @click="handleFilter"
        >
          {{ $t('table.search') }}
        </el-button>
      </div>
      <div class="mod-table">
        <el-checkbox
          v-model="showReviewer"
          @change="tableKey=tableKey+1"
        >
          {{ $t('table.reviewer') }}
        </el-checkbox>
        <el-checkbox
          v-model="showStatus"
          @change="tableKey=tableKey+1"
        >
          {{ $t('table.status') }}
        </el-checkbox>
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          {{ $t('table.add') }}
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          {{ $t('table.export') }}
        </el-button>
      </div>
    </div>
    <!-- <filter-seach
      :listQuery="listQuery"
      :showReviewer.sync="showReviewer"
      :showStatus.sync="showStatus"
      :downloadLoading="downloadLoading"
      :calendarTypeOptions="calendarTypeOptions"
      :statusOptions="statusOptions"
      @filter="handleFilter"
      @create="handleCreate"
      @download="handleDownload"
      @update:listQuery="updateListQuery"
      @update:showReviewer="updateShowReviewer"
      @update:showStatus="updateShowStatus"
    /> -->

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
  </div>
</template>

<script>
// import component
import Datatable from './components/domain/datatable'
import LabelingSlot from '@/components/Commons/labeling-slot'
// import FilterSearch from './components/domain/filter-search'
// import function call api.
import { getListDomain } from '@/api/organization/domain'

export default {
  components: {
    Datatable,
    // FilterSearch,
    LabelingSlot
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
      calendarTypeOptions: [
        { key: 'CN', displayName: 'China' },
        { key: 'US', displayName: 'USA' },
        { key: 'JP', displayName: 'Japan' },
        { key: 'EU', displayName: 'Eurozone' }
      ],
      statusOptions: [
        { key: 'published', displayName: 'Published' },
        { key: 'draft', displayName: 'Draft' },
        { key: 'deleted', displayName: 'Deleted' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getListDomain(this.listQuery)
      console.log('getListDomain', data)
      this.list = data.items
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
      console.log('handleUpdate', row)
    },
    handleDelete(row, index) {
      console.log('handleUpdate', row, index)
      this.$confirm('Confirm to remove this domain?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
        .catch(err => { console.error(err) })
    },
    handleCreate() {
      console.log('handleCreate')
    },
    handleDownload() {
      this.downloadLoading = true
      console.log('handleDownload')
      this.downloadLoading = false
    },
    // updateListQuery(newListQuery) {
    //   this.listQuery = newListQuery
    // },
    // updateShowReviewer(newVal) {
    //   this.showReviewer = newVal
    // },
    // updateShowStatus(newVal) {
    //   this.showStatus = newVal
    // }
  }
}
</script>
