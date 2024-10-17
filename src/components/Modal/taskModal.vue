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
      <el-form-item :label="$t('route.taskName')" prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('route.taskName')" />
      </el-form-item>

      <el-form-item :label="$t('route.project')" prop="projectId">
        <el-select
          v-model="dataForm.projectId"
          :placeholder="$t('route.project')"
          filterable
          clearable
        >
          <el-option
            v-for="item in projectByOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <div class="component-add-items-to-list-select">
            <el-button
              size="mini"
              type="primary"
              :disabled="totalItemsProjectOptions === projectByOptions.length"
              @click="handleAddProjects"
            >
              Add Items
            </el-button>
            <span>Total: {{ totalItemsProjectOptions }}</span>
          </div>
        </el-select>
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

      <el-form-item
        :label="'Assignee'"
        prop="assignee"
      >
        <el-tag>{{ dataForm.assigneeId || 'Not Assignee' }}</el-tag>
      </el-form-item>

      <el-form-item :label="$t('table.status')" prop="status">
        <el-select
          v-model="dataForm.status"
          :placeholder="$t('table.status')"
          clearable
        >
          <el-option
            v-for="item in isStatusOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import { getProjectList } from '@/api/project-management/project-list'
import { createTask, updateTaskById } from '@/api/project-management/task-list'
import { UserModule } from '@/store/modules/user'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import moment from 'moment'

const defaultDataForm = {
  assigneeId: null,
  endDate: null,
  id: null,
  name: '',
  projectId: null,
  startDate: null,
  status: 'todo'
}

export default {
  components: {
    Modal,
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
        projectId: [
          {
            required: true,
            message: 'Project is required',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: 'Status is required',
            trigger: 'blur'
          }
        ]
      },
      isStatusOptions: [
        { key: 'todo', displayName: 'To do' },
        { key: 'inprogress', displayName: 'In progress' },
        { key: 'review', displayName: 'Review' },
        { key: 'complete', displayName: 'Complete' },
        { key: 'onhold', displayName: 'On hold' },
        { key: 'rework', displayName: 'Rework/Redo' }
      ],
      projectByOptions: [],
      totalItemsProjectOptions: 0,
      listQueryProjectOptions: {
        page: 1,
        size: 10
      },
      rangeDate: [null, null]
    }
  },
  computed: {
    changeShowDateStartAt() {
      if (this.isEdit && this.dataForm.startDate) {
        const UTCFromDate = moment.utc(this.dataForm.startDate)
        const localFromDate = moment(UTCFromDate).local()
        const fromDate = localFromDate.format('DD/MM/yyyy HH:mm:ss').toString()
        return fromDate
      }
      return ''
    },
    changeShowDateEndAt() {
      if (this.isEdit && this.dataForm.endDate) {
        const UTCToDate = moment.utc(this.dataForm.endDate)
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
        this.fetchDataGetProject(this.listQueryProjectOptions)
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
          if (newVal.projectId) {
            this.fetchDataGetProjectsByListIdWhenEdit(newVal.projectId)
          }
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
    this.fetchDataGetProject(this.listQueryProjectOptions)
  },
  methods: {
    async fetchDataGetProject(queryProject) {
      const { data } = await getProjectList(queryProject)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.projectByOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.projectByOptions.push(newItem)
        }
      })
      this.totalItemsProjectOptions = data.total
    },
    async handleAddProjects() {
      this.listQueryProjectOptions.page += 1
      await this.fetchDataGetProject(this.listQueryProjectOptions)
    },
    // ids is string -- user for project
    async fetchDataGetProjectsByListIdWhenEdit(ids) {
      const newQueryUsers = {
        page: 1,
        size: 20,
        ids: ids
      }
      await this.fetchDataGetProject(newQueryUsers)
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate()
      })
    },
    handleModalClose() {
      this.dataForm = cloneDeep(defaultDataForm)
      this.projectByOptions = []
      this.totalItemsProjectOptions = 0
      this.listQueryProjectOptions.page = 1
      this.rangeDate = [null, null]
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
      // this.$emit("update:visible", false);
    },
    handleModalConfirm() {
      if (this.isEdit) {
        this.updateTaskModal()
      } else {
        this.createTaskModal()
      }
    },
    updateTaskModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          const dataUpdate = {
            assigneeId: this.dataForm.assigneeId,
            endDate: this.dataForm.endDate ? this.convertToISOString(this.dataForm.endDate) : null,
            id: this.dataForm.id,
            name: this.dataForm.name,
            projectId: this.dataForm.projectId,
            startDate: this.dataForm.startDate ? this.convertToISOString(this.dataForm.startDate) : null,
            status: this.dataForm.status
          }
          await updateTaskById(dataUpdate)
            .then((res) => {
              console.log('res', res)
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
          console.log('Form update Task is invalid')
        }
      })
    },
    createTaskModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          this.dataForm.createdBy = UserModule.id
          const UTCFromDate = moment.utc(this.rangeDate[0])
          const localFromDate = moment(UTCFromDate).local()
          const UTCToDate = moment.utc(this.rangeDate[1])
          const localToDate = moment(UTCToDate).local()
          const fromDate = localFromDate
            .format('DD/MM/yyyy HH:mm:ss')
            .toString()
          const toDate = localToDate.format('DD/MM/yyyy HH:mm:ss').toString()
          this.dataForm.startDate = this.rangeDate[0] ? fromDate : null
          this.dataForm.endDate = this.rangeDate[1] ? toDate : null
          await createTask(this.dataForm)
            .then((res) => {
              console.log('res', res)
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
          console.log('Form create Task is invalid')
        }
      })
    },
    convertToISOString(dateString) {
      const formattedDate = moment(dateString)
        .format('DD/MM/yyyy HH:mm:ss')
        .toString()
      return formattedDate
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
