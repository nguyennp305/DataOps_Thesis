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
        :label="$t('route.datasetNameData')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        :label="$t('route.project')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.projectId }}</span>
        </template>
      </el-table-column> -->

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
        :label="$t('route.labelGroupName')"
        min-width="150px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <div v-if="row.labelGroupIds && row.labelGroupIds.length > 0">
            <el-tag>
              {{ row.labelGroupIds.length }} groups
            </el-tag>
          </div>
          <div v-else>
            <span style="color: red">No groups</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.image')"
        min-width="150px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <div v-if="row.labeledImageIds && row.labeledImageIds.length > 0">
            <el-tag>
              {{ row.labeledImageIds.length }} images
            </el-tag>
          </div>
          <div v-else>
            <span style="color: red">No images</span>
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
        min-width="300px"
        clas-name="fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("table.edit") }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            {{ $t("table.delete") }}
          </el-button>
          <el-button v-waves type="warning" size="mini" icon="el-icon-download" @click="handleGenerateData(row)">
            Generate data
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
    handleGenerateData(row) {
      this.$emit('generate-data', row)
    },
    emitPagination() {
      this.$emit('pagination')
    }
  }
}
</script>

<style lang="scss" scoped></style>
