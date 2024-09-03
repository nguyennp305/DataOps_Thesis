<template>
  <div class="filter-container">
    <div class="portlet-filter">
      <labeling-slot :label="$t('route.projectName')">
        <el-input
          v-model="localListQuery.name"
          :placeholder="$t('route.projectName')"
        />
      </labeling-slot>

      <labeling-slot :label="'MemberId(notMultiLang)'">
        <el-input
          v-model="localListQuery.memberId"
          :placeholder="'MemberId(notMultiLang)'"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.isDelete')">
        <el-select
          v-model="localListQuery.isDelete"
          :placeholder="$t('table.isDelete')"
          clearable
        >
          <el-option
            v-for="item in isDeleteOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
      </labeling-slot>
    </div>

    <div class="portlet-filter">
      <labeling-slot :label="$t('table.createTimeFrom')">
        <el-input
          v-model="localListQuery.createTimeFrom"
          :placeholder="$t('table.createTimeFrom')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.createTimeTo')">
        <el-input
          v-model="localListQuery.createTimeTo"
          :placeholder="$t('table.createTimeTo')"
        />
      </labeling-slot>
    </div>

    <div class="portlet-filter">
      <labeling-slot :label="$t('table.startTimeFrom')">
        <el-input
          v-model="localListQuery.startTimeFrom"
          :placeholder="$t('table.startTimeFrom')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.startTimeTo')">
        <el-input
          v-model="localListQuery.startTimeTo"
          :placeholder="$t('table.startTimeTo')"
        />
      </labeling-slot>
    </div>

    <div class="portlet-filter">
      <labeling-slot :label="$t('table.endTimeFrom')">
        <el-input
          v-model="localListQuery.endTimeFrom"
          :placeholder="$t('table.endTimeFrom')"
        />
      </labeling-slot>

      <labeling-slot :label="$t('table.endTimeTo')">
        <el-input
          v-model="localListQuery.endTimeTo"
          :placeholder="$t('table.endTimeTo')"
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
import { getAllRoles } from '@/api/user-management/user-list'

export default {
  name: 'FilterSearchEnterprise',
  components: {
    LabelingSlot
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
      rolesTypeOptions: [],
      isDeleteOptions: [
        { key: true, displayName: 'Deleted' },
        { key: false, displayName: 'Not deleted' }
      ]
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
    this.fetchDataGetAllRoles()
  },
  methods: {
    async fetchDataGetAllRoles() {
      const { data } = await getAllRoles()
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      this.rolesTypeOptions = newArray
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
