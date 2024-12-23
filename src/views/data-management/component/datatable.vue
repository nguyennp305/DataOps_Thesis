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
        :label="$t('route.image')"
        width="200px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <div class="cropped-image">
            <img
              v-if="row.imageUrl"
              :src="row.imageUrl"
              alt="Cropped Image"
              class="css-and-hover-image"
            />
            <div v-else class="crop-placeholder" />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('route.dataName')"
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

      <el-table-column
        :label="$t('table.status')"
        min-width="100px"
        :align="'center'"
      >
        <template slot-scope="{row}">
          <el-tag>{{ row.status }}</el-tag>
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
        fixed="right"
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
  computed: {
    labeledNames() {
      const response = this.data.map((item) => {
        return {
          id: item.id,
          data: []
        }
      })
      this.data.forEach((item, index) => {
        if (item.labeledImages.length === 0) {
          response[index].data.push('Not use label')
          return
        }
        const uniqueLabels = new Set() // Sử dụng Set để lọc các giá trị không trùng nhau
        item.labeledImages.forEach((labeledImage) => {
          uniqueLabels.add(labeledImage.labelId)
        })
        response[index].data = [...uniqueLabels] // Chuyển Set thành mảng và gán vào response
      })
      return response
    }
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

<style lang="scss" scoped>
.cropped-image img {
  max-width: 100%;
  height: 200px;
  object-fit: contain;
}
.css-and-hover-image {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
}
.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}
</style>
