<template>
  <div class="filter-container">
    <div class="portlet-filter">
      <labeling-slot :label="$t('route.datasetNameData')">
        <el-input
          v-model="localListQuery.name"
          :placeholder="$t('route.datasetNameData')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.description')">
        <el-input
          v-model="localListQuery.description"
          :placeholder="$t('table.description')"
        />
      </labeling-slot>

      <!-- <labeling-slot :label="$t('table.createdBy')">
        <el-select
          v-model="localListQuery.createdBy"
          :placeholder="$t('table.createdBy')"
          filterable
          clearable
        >
          <el-option
            v-for="item in createdByOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <pagination
            v-show="totalItemsCreatedByOptions > 0"
            :total="totalItemsCreatedByOptions"
            :page.sync="listQueryCreatedByOptions.page"
            :limit.sync="listQueryCreatedByOptions.size"
            @pagination="fetchDataGetCreatedBy"
          />
        </el-select>
      </labeling-slot> -->

      <labeling-slot :label="$t('route.project')">
        <el-select
          v-model="localListQuery.projectId"
          :placeholder="$t('route.project')"
          filterable
          clearable
        >
          <el-option
            v-for="item in projectByOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <pagination
            v-show="totalItemsProjectOptions > 0"
            :total="totalItemsProjectOptions"
            :page.sync="listQueryProjectOptions.page"
            :limit.sync="listQueryProjectOptions.size"
            @pagination="fetchDataGetProject"
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
        {{ $t("table.search") }}
      </el-button>
    </div>
    <div class="mod-table">
      <el-checkbox
        v-model="localShowCreatedAt"
        @change="localTableKey = localTableKey + 1"
      >
        {{ $t("table.createdAt") }}
      </el-checkbox>
      <el-checkbox
        v-model="localShowCreatedBy"
        @change="localTableKey = localTableKey + 1"
      >
        {{ $t("table.createdBy") }}
      </el-checkbox>
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t("table.add") }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import LabelingSlot from '@/components/Commons/labeling-slot'
import Pagination from '@/components/Pagination/index.vue'
// import { getUserList } from '@/api/user-management/user-list'
import { getProjectList } from '@/api/project-management/project-list'

export default {
  name: 'FilterSearchDataset',
  components: {
    LabelingSlot,
    Pagination
  },
  props: {
    listQuery: Object,
    showCreatedAt: Boolean,
    showCreatedBy: Boolean,
    tableKey: Number,
    downloadLoading: Boolean
  },
  data() {
    return {
      localListQuery: { ...this.listQuery },
      localShowCreatedAt: this.showCreatedAt,
      localShowCreatedBy: this.showCreatedBy,
      localTableKey: this.tableKey,
      // createdByOptions: [],
      // totalItemsCreatedByOptions: 0,
      // listQueryCreatedByOptions: {
      //   page: 1,
      //   size: 10
      // },
      projectByOptions: [],
      totalItemsProjectOptions: 0,
      listQueryProjectOptions: {
        page: 1,
        size: 10
      }
    }
  },
  watch: {
    localListQuery: {
      handler(newVal) {
        this.$emit('update:listQuery', newVal)
      },
      deep: true
    },
    localShowCreatedAt(newVal) {
      this.$emit('update:showCreatedAt', newVal)
    },
    localShowCreatedBy(newVal) {
      this.$emit('update:showCreatedBy', newVal)
    },
    localTableKey(newVal) {
      this.$emit('update:tableKey', newVal)
    }
  },
  created() {
    // this.fetchDataGetCreatedBy()
    this.fetchDataGetProject()
  },
  methods: {
    // async fetchDataGetCreatedBy() {
    //   const { data } = await getUserList(
    //     this.listQueryCreatedByOptions
    //   )
    //   const newArray = data.items.map((item) => ({
    //     key: item.id,
    //     displayName: item.username
    //   }))
    //   this.createdByOptions = newArray
    //   this.totalItemsCreatedByOptions = data.total
    // },
    async fetchDataGetProject() {
      const { data } = await getProjectList(
        this.listQueryProjectOptions
      )
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      this.projectByOptions = newArray
      this.totalItemsProjectOptions = data.total
    },
    handleFilter() {
      this.$emit('filter')
    },
    handleCreate() {
      this.$emit('create')
    },
    handleDownload() {
      this.$emit('download')
    }
  }
}
</script>
