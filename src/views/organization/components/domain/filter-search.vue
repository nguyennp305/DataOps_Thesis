<template>
  <div class="filter-container">
    <div class="portlet-filter">
      <labeling-slot :label="$t('table.title')">
        <el-input
          v-model="localListQuery.title"
          :placeholder="$t('table.title')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.author')">
        <el-input
          v-model="localListQuery.author"
          :placeholder="$t('table.author')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.reviewer')">
        <el-input
          v-model="localListQuery.reviewer"
          :placeholder="$t('table.reviewer')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.type')">
        <el-select
          v-model="localListQuery.type"
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
          v-model="localListQuery.status"
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
        v-model="localShowReviewer"
        @change="tableKey=tableKey+1"
      >
        {{ $t('table.reviewer') }}
      </el-checkbox>
      <el-checkbox
        v-model="localShowStatus"
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
</template>

<script>
import LabelingSlot from '@/components/Commons/labelingSlot.vue'

export default {
  name: 'FilterSearchDomain',
  components: {
    LabelingSlot
  },
  props: {
    listQuery: Object,
    showReviewer: Boolean,
    showStatus: Boolean,
    downloadLoading: Boolean,
    calendarTypeOptions: Array,
    statusOptions: Array
  },
  data() {
    return {
      localListQuery: { ...this.listQuery },
      localShowReviewer: this.showReviewer,
      localShowStatus: this.showStatus
    }
  },
  watch: {
    localListQuery: {
      handler(newVal) {
        this.$emit('update:listQuery', newVal)
      },
      deep: true
    },
    localShowReviewer(newVal) {
      this.$emit('update:showReviewer', newVal)
    },
    localShowStatus(newVal) {
      this.$emit('update:showStatus', newVal)
    }
  }
}
</script>
