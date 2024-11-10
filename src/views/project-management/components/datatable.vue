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
        :label="'ID'"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.projectName')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.enterprise')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <el-tag class="status-el-tag">{{ row.enterprise.name }}</el-tag>
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

      <el-table-column
        :label="$t('table.startTime')"
        :align="'center'"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span style="color: red">{{ row.startAt }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.endTime')"
        :align="'center'"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <span style="color: red">{{ row.endAt }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.members')"
        :align="'center'"
        min-width="150px"
      >
        <template slot-scope="{row}">
          <div v-if="row.members.length === 0">
            <span style="color: red">{{ $t("table.noData") }}</span>
          </div>
          <div v-else>
            <el-tag class="member-el-tag">{{ row.members.length }}</el-tag>
          </div>
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
        min-width="300px"
        clas-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            {{ $t("table.delete") }}
          </el-button>
          <el-button type="warning" size="mini" @click="handleAssign(row)">
            Assign Task
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
    handleAssign(row) {
      this.$emit('assign', row)
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

<style lang="scss" scoped>
.status-el-tag {
  min-width: 100px;
}
.member-el-tag {
  min-width: 50px;
}
</style>
