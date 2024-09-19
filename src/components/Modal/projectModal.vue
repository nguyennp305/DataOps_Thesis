<template>
  <modal
    :title="isEdit ? $t('route.edit') : $t('route.add')"
    :visible.sync="visible"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="top"
    >
      <el-form-item :label="$t('route.projectName')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.projectName')"
        />
      </el-form-item>

      <el-form-item :label="$t('table.description')" prop="description">
        <el-input
          v-model="dataForm.description"
          :placeholder="$t('table.description')"
        />
      </el-form-item>

      <el-form-item
        v-if="!isEdit"
        :label="$t('table.startTime') + ' - ' + $t('table.endTime')"
        prop="rangeDate"
      >
        <date-range-picker
          v-model="rangeDate"
          class="date-range-picker"
          type="datetimerange"
          format="dd/MM/yyyy HH:mm:ss"
        >
        </date-range-picker>
      </el-form-item>

      <el-form-item
        v-if="isEdit"
        :label="$t('table.startTime') + ' - ' + $t('table.endTime')"
        prop="rangeDate"
      >
        <div>{{ changeShowDateStartAt }} - {{ changeShowDateEndAt }}</div>
      </el-form-item>

      <el-form-item :label="$t('route.enterprise')" prop="enterpriseId">
        <el-select
          v-model="dataForm.enterpriseId"
          :placeholder="$t('route.enterprise')"
          filterable
          clearable
        >
          <el-option
            v-for="item in enterpriseTypeOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <pagination
            v-show="totalItemsEnterpriseTypeOptions > 0"
            :total="totalItemsEnterpriseTypeOptions"
            :page.sync="listQueryntEnterpriseTypeOptions.page"
            :limit.sync="listQueryntEnterpriseTypeOptions.size"
            @pagination="fetchDataGetEnterprises"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('table.members')" prop="members">
        <el-select
          v-model="dataForm.memberIds"
          :placeholder="$t('table.members')"
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="item in usersTypeOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <pagination
            v-show="totalItemsUsersTypeOptions > 0"
            :total="totalItemsUsersTypeOptions"
            :page.sync="listQueryntUsersTypeOptions.page"
            :limit.sync="listQueryntUsersTypeOptions.size"
            @pagination="fetchDataGetUsers"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import { getUserList } from '@/api/user-management/user-list'
import { createProject, updateProjectById } from '@/api/project-management/project-list'
import { getListEnterprise } from '@/api/organization/enterprise'
import Pagination from '@/components/Pagination/index.vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import moment from 'moment'

const defaultDataForm = {
  name: '',
  description: '',
  enterpriseId: null,
  memberIds: [],
  startDate: null,
  endDate: null,
  id: null
}

export default {
  components: {
    Modal,
    Pagination,
    DateRangePicker
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dataForm: cloneDeep(defaultDataForm),
      rules: {
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        description: [
          {
            required: true,
            message: 'Description is required',
            trigger: 'blur'
          }
        ],
        enterpriseId: [
          {
            required: true,
            message: 'Enterprise is required',
            trigger: 'blur'
          }
        ]
        // memberIds: [
        //   { required: true, message: "members is required", trigger: "blur" },
        // ],
        // startDate: [
        //   { required: true, message: 'StartDate is required', trigger: 'blur' }
        // ],
        // endDate: [
        //   { required: true, message: 'EndDate is required', trigger: 'blur' }
        // ]
      },
      rangeDate: [null, null],
      enterpriseTypeOptions: [],
      totalItemsEnterpriseTypeOptions: 0,
      listQueryntEnterpriseTypeOptions: {
        page: 1,
        size: 10
      },
      usersTypeOptions: [],
      totalItemsUsersTypeOptions: 0,
      listQueryntUsersTypeOptions: {
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    changeShowDateStartAt() {
      if (this.isEdit && this.dataForm.startAt) {
        const UTCFromDate = moment.utc(this.dataForm.startAt)
        const localFromDate = moment(UTCFromDate).local()
        const fromDate = localFromDate.format('DD/MM/yyyy HH:mm:ss').toString()
        return fromDate
      }
      return ''
    },
    changeShowDateEndAt() {
      if (this.isEdit && this.dataForm.endAt) {
        const UTCToDate = moment.utc(this.dataForm.endAt)
        const localToDate = moment(UTCToDate).local()
        const toDate = localToDate.format('DD/MM/yyyy HH:mm:ss').toString()
        return toDate
      }
      return ''
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
        } else {
          this.dataForm = cloneDeep(defaultDataForm)
          this.rangeDate = [null, null]
        }
        this.clearValidate()
      },
      deep: true
    }
  },
  created() {
    this.fetchDataGetEnterprises()
    this.fetchDataGetUsers()
  },
  methods: {
    async fetchDataGetEnterprises() {
      const { data } = await getListEnterprise(
        this.listQueryntEnterpriseTypeOptions
      )
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      this.enterpriseTypeOptions = newArray
      this.totalItemsEnterpriseTypeOptions = data.total
    },
    async fetchDataGetUsers() {
      const { data } = await getUserList(this.listQueryntUsersTypeOptions)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.username
      }))
      this.usersTypeOptions = newArray
      this.totalItemsUsersTypeOptions = data.total
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate()
      })
    },
    handleModalClose() {
      this.dataForm = cloneDeep(defaultDataForm)
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.$emit('update:visible', false)
    },
    handleModalConfirm() {
      if (this.isEdit) {
        this.updateProjectModal()
      } else {
        this.createProjectModal()
      }
    },
    updateProjectModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          const dataUpdateProject = {
            description: this.dataForm.description,
            endAt: this.convertToISOString(this.dataForm.endDate),
            enterpriseId: this.dataForm.enterpriseId,
            id: this.dataForm.id,
            memberIds: this.dataForm.memberIds,
            name: this.dataForm.name,
            startAt: this.convertToISOString(this.dataForm.startDate)
          }
          await updateProjectById(dataUpdateProject)
            .then((res) => {
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.$emit('update:reload-table')
              this.$emit('update:visible', false)
            })
            .catch((err) => {
              console.log('err', err)
            })
        } else {
          console.log('Form update Project is invalid')
        }
      })
    },
    createProjectModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          this.dataForm.startDate = this.rangeDate[0]
            ? this.rangeDate[0]
            : null
          this.dataForm.endDate = this.rangeDate[1] ? this.rangeDate[1] : null
          await createProject(this.dataForm)
            .then((res) => {
              this.$notify({
                title: 'Success',
                message: 'Create Successfully',
                type: 'success',
                duration: 2000
              })
              this.$emit('update:reload-table')
              this.$emit('update:visible', false)
            })
            .catch((err) => {
              console.log('err', err)
            })
        } else {
          console.log('Form create Project is invalid')
        }
      })
    },
    convertToISOString(dateString) {
      const date = moment.parseZone(dateString)
      return date.toISOString()
    }
  }
}
</script>

<style lang="scss" scoped>
/* Add your styles here */
.date-range-picker {
  width: 100%;
}
</style>
<!-- ngày 18/-9/2024
Đã xong khởi tạo data create project. hiện tại chưa thực hiện ghép API -->
