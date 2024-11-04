<template>
  <div>
    <el-table
      v-loading="loading"
      :key="tableKey"
      :data="data"
      :border="true"
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        :label="$t('route.labelGroupName')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.project')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.projectId }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.description')"
        min-width="150px"
        max-width="300px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <!-- :label="$t('route.labelNameData')" -->
      <el-table-column :label="'Label ID'" :align="'center'" min-width="150px">
        <template slot-scope="{row}">
          <div v-if="row.labelIds && row.labelIds.length > 0">
            <el-tag v-for="(labelData, index) in row.labelIds" :key="index">
              {{ labelData }}
            </el-tag>
          </div>
          <div v-else>
            <span style="color: red">{{ $t("table.noData") }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.updatedAt')"
        :align="'center'"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span style="color: red">{{ row.updatedAt }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.updatedBy')"
        :align="'center'"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span style="color: red">{{ row.updatedBy }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showCreatedAt"
        :label="$t('table.createdAt')"
        :align="'center'"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span style="color: red">{{ row.createdAt }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showCreatedBy"
        :label="$t('table.createdBy')"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span style="color: red">{{ row.createdBy }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        :align="'center'"
        min-width="200px"
        clas-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            {{ $t("table.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="emitPagination"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'

export default {
  components: {
    Pagination
  },
  props: {
    loading: Boolean,
    data: Array,
    total: Number,
    tableKey: Number,
    listQuery: Object,
    showCreatedAt: Boolean,
    showCreatedBy: Boolean
  },
  data() {
    return {}
  },
  methods: {
    // getSortClass(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // },
    // sortChange(data) {
    //   this.$emit('sort-change', data)
    // },
    handleUpdate(row) {
      this.$emit('update', row)
    },
    handleDelete(row) {
      this.$emit('delete', row)
    },
    emitPagination() {
      this.$emit('pagination')
    }
  }
}
</script>

<style lang="scss" scoped></style>
