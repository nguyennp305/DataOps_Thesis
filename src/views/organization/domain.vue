<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox
        v-model="showReviewer"
        class="filter-item"
        @change="tableKey=tableKey+1"
      >{{ $t('table.reviewer') }}</el-checkbox>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
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
    @pagination="getList"
  />
  </div>
</template>

<script>
import { getListDomain } from '@/api/organization/domain'
import Pagination from '@/components/Pagination/index.vue'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableKey: 0,
      listLoading: true,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        sort: '+id'
      },
      showReviewer: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await getListDomain(this.listQuery)
      console.log('getListDomain', data)
      this.list = data.items
      this.total = data.total
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    },
    getSortClass(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      console.log('handleUpdate', row)
    },
    handleDelete(row, index) {
      console.log('handleUpdate', row, index)
      this.$confirm('Confirm to remove this domain?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
        .catch(err => { console.error(err) })
    }
  }
}
</script>
