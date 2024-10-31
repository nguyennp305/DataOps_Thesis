<template>
  <div class="app-container">
    <filter-search
      :listQuery="listQuery"
      @filter="handleFilter"
      @update:listQuery="updateListQuery"
    />
    <div class="chart-container" v-if="listQuery.projectId">
      <mixed-chart-analytics-dataset height="100%" width="100%" :idsProject="listQuery.projectId" />
    </div>
  </div>
</template>

<script>
// import component
import FilterSearch from '@/views/dataset-management/component-analytics/filter-search'
import { getDatasetList } from '@/api/dataset-management/dataset'
import MixedChartAnalyticsDataset from '@/components/Charts/MixedChartAnalyticsDataset.vue'
export default {
  name: 'Analytics',
  components: {
    FilterSearch,
    MixedChartAnalyticsDataset
  },
  data() {
    return {
      listLoading: true,
      list: [],
      listQuery: {
        page: 1,
        size: 1000000,
        projectId: undefined
      }
    }
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getDatasetList(this.listQuery)
      this.list = data.items
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateListQuery(newListQuery) {
      this.listQuery = newListQuery
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
