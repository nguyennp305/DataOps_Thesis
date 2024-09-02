<template>
  <div class="filter-container">
    <div class="portlet-filter">
      <labeling-slot :label="$t('route.enterpriseName')">
        <el-input
          v-model="localListQuery.word"
          :placeholder="$t('route.enterpriseName')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.startTime')">
        <el-input
          v-model="localListQuery.startDate"
          :placeholder="$t('table.startTime')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.endTime')">
        <el-input
          v-model="localListQuery.enbDate"
          :placeholder="$t('table.endTime')"
        />
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
    </div>
  </div>
</template>

<script>
import LabelingSlot from '@/components/Commons/labeling-slot'

export default {
  name: 'FilterSearchEnterprise',
  components: {
    LabelingSlot
  },
  props: {
    listQuery: Object,
    showCreatedAt: Boolean,
    showCreatedBy: Boolean,
    tableKey: Number
  },
  data() {
    return {
      localListQuery: { ...this.listQuery },
      localShowCreatedAt: this.showCreatedAt,
      localShowCreatedBy: this.showCreatedBy,
      localTableKey: this.tableKey
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
  methods: {
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
