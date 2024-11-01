<template>
  <div class="app-container">
    <filter-search :listQuery="listQuery" @update:listQuery="updateListQuery" />
    <panel-group
      v-if="listQuery.projectId"
      :panel-group-data="panelGroupData"
    />
    <div class="chart-container" v-if="listQuery.projectId">
      <mixed-chart-analytics-dataset
        height="100%"
        width="100%"
        :idsProject="listQuery.projectId"
      />
    </div>
  </div>
</template>

<script>
// import component
import FilterSearch from '@/views/dataset-management/component-analytics/filter-search'
import PanelGroup from '@/views/dataset-management/component-analytics/panelGroup'
import { getDatasetList } from '@/api/dataset-management/dataset'
import { getAnalysticDatasetPanelGroup } from '@/api/analystics-management/analystics'
import MixedChartAnalyticsDataset from '@/components/Charts/MixedChartAnalyticsDataset.vue'
export default {
  name: 'Analytics',
  components: {
    FilterSearch,
    MixedChartAnalyticsDataset,
    PanelGroup
  },
  data() {
    return {
      listLoading: true,
      list: [],
      listQuery: {
        page: 1,
        size: 1000000,
        projectId: undefined
      },
      panelGroupData: {}
    }
  },
  watch: {
    'listQuery.projectId': {
      handler(newVal) {
        if (newVal) {
          this.getAnalysticDatasetPanelGroup(newVal)
        }
      },
      deep: true
    }
  },
  methods: {
    async getAnalysticDatasetPanelGroup(id) {
      const { data } = await getAnalysticDatasetPanelGroup({
        projectId: id
      })
      this.panelGroupData = {
        datasets: data.datasets,
        labels: data.labels,
        images: data.images,
        labeledImages: data.labeledImages
      }
    },
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
