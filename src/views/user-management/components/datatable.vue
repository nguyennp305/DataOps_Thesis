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
    >
      <el-table-column
        :label="$t('login.username')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('login.email')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.status')"
        width="100px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <el-tag>{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.rolePermission')"
        width="100px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.delete')"
        width="100px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.deleted }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showCreatedAt"
        :label="$t('table.createdAt')"
        :align="'center'"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span style="color: red;">{{ row.createdAt }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="showCreatedBy"
        :label="$t('table.createdBy')"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span style="color: red;">{{ row.createdBy }}</span>
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
            {{  $t('table.edit') }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            {{  $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
  </el-table>

  <pagination
    v-show="total > 0"
    :total=total
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
