<template>
  <div>
    <el-table
      v-loading="loading"
      :key="tableKey"
      :data="data"
      :border="true"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        :align="'center'"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.date')"
        width="180px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.title')"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.author')"
        width="180px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showReviewer"
        :label="$t('table.reviewer')"
        width="180px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span style="color: red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showStatus"
        :label="$t('table.status')"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | articleStatusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.actions')"
        :align="'center'"
        width="230px"
        clas-name="fixed-width"
      >
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{  $t('table.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row, $index)">
            {{  $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
  </el-table>

  <pagination
    v-show="total > 0"
    :total=total
    :page.sync="listQuery.page"
    :limit.sync="listQuery.limit"
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
    showReviewer: Boolean,
    showStatus: Boolean
  },
  data() {
    return {}
  },
  methods: {
    getSortClass(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    sortChange(data) {
      this.$emit('sort-change', data)
    },
    handleUpdate(row) {
      this.$emit('update', row)
    },
    handleDelete(row, index) {
      this.$emit('delete', { row, index })
    },
    emitPagination() {
      this.$emit('pagination')
    }
  }
}
</script>

<style lang="scss" scoped></style>
