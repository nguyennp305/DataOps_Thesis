<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px" class="transaction-table-css">
    <el-table-column :label="'My task'" min-width="195">
      <template slot-scope="{row}">
        {{ row.name }}
      </template>
    </el-table-column>
    <el-table-column label="ProjectId" min-width="200" :align="'center'">
      <template slot-scope="{row}">
        {{ row.projectId }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="130" :align="'center'">
      <template slot-scope="{row}">
        <el-tag :type="row.status | transactionStatusFilter" class="el-tags-css">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  name: 'MyTaskTable',
  props: {
    tasksChartData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    tasksChartData: {
      handler(newVal) {
        this.list = newVal.map((item) => ({
          name: item.name,
          projectId: item.projectId,
          status: item.status
        }))
      },
      deep: true
    }
  },
  methods: {},
  filters: {
    transactionStatusFilter: (status) => {
      const statusMap = {
        todo: 'info',
        inprogress: 'warning',
        review: 'warning',
        complete: 'success',
        onhold: 'info',
        rework: 'danger'
      }
      return statusMap[status]
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tags-css {
  min-width: 100px;
}
.transaction-table-css {
  max-height: 600px;
  overflow-y: auto;
}
</style>
