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
        :label="'Image Name'"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="'Image'"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <img :src="row.imageUrl" />
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
        :label="$t('table.status')"
        min-width="150px"
        max-width="300px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status }}
          </el-tag>
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
            <!-- {{ $t("table.label") }} -->
              {{ nameTypeLabel }}
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
    showCreatedBy: Boolean,
    nameTypeLabel: String
  },
  data() {
    return {}
  },
  methods: {
    handleUpdate(row) {
      this.$emit('update', row)
    },
    emitPagination() {
      this.$emit('pagination')
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 150px;
  transition: transform 0.3s ease; // Thêm hiệu ứng chuyển động cho ảnh khi hover

  &:hover {
    transform: scale(1.1); // Phóng to ảnh lên 10% khi hover
  }
}
</style>
