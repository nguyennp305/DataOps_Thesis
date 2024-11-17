<template>
  <modal
    :title="isEdit ? $t('route.edit') : $t('route.add')"
    :visible.sync="visible"
    :width="'70%'"
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
          <div class="component-add-items-to-list-select">
            <el-button
              size="mini"
              type="primary"
              :disabled="
                totalItemsEnterpriseTypeOptions === enterpriseTypeOptions.length
              "
              @click="handleAddEnterprises"
            >
              Add Items
            </el-button>
            <span>Total: {{ totalItemsEnterpriseTypeOptions }}</span>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('table.members')" prop="members">
        <el-select
          v-model="userListSelected"
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
          <div class="component-add-items-to-list-select">
            <el-button
              size="mini"
              type="primary"
              :disabled="totalItemsUsersTypeOptions === usersTypeOptions.length"
              @click="handleAddUsers"
            >
              Add Items
            </el-button>
            <span>Total: {{ totalItemsUsersTypeOptions }}</span>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="reportList && reportList.length > 0 && isEdit"
        :label="'Project Report'"
        prop="report"
      >
        <div class="components-report-tinymce">
          <div class="report-component">
            <div v-for="item in reportList" :key="item.id" class="report-row">
              <el-tag
                class="report-el-tag"
                @click="handleChooseShowReport(item)"
              >
                {{ item.name }} - {{ item.reportType }}
              </el-tag>
              <el-button
                v-waves
                type="primary"
                size="mini"
                icon="el-icon-download"
                class="export-content-as-pdf"
                @click="exportContentAsPDF(item.data)"
              />
              <el-button
                v-waves
                type="primary"
                size="mini"
                icon="el-icon-delete"
                class="delete-content-as-pdf"
                @click="handleDeleteReportInProject(item)"
              />
            </div>
          </div>
          <div
            v-if="reportData"
            class="editor-content"
            v-html="reportData.data"
          ></div>
        </div>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import { getUserList } from '@/api/user-management/user-list'
import {
  createProject,
  updateProjectById
} from '@/api/project-management/project-list'
import { getListEnterprise } from '@/api/organization/enterprise'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import moment from 'moment'
import {
  getReportList,
  deleteReportById
} from '@/api/project-management/report-list'
import html2pdf from 'html2pdf.js'

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
      },
      rangeDate: [null, null],
      enterpriseTypeOptions: [],
      totalItemsEnterpriseTypeOptions: 0,
      listQueryntEnterpriseTypeOptions: {
        page: 1,
        size: 10
      },
      usersTypeOptions: [],
      userListSelected: [],
      totalItemsUsersTypeOptions: 0,
      listQueryntUsersTypeOptions: {
        page: 1,
        size: 10
      },
      listQueryReportByProject: {
        page: 1,
        size: 1000000,
        projectId: undefined
      },
      reportList: [],
      reportData: null
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
      async handler(newVal, oldVal) {
        this.fetchDataGetUsers(this.listQueryntUsersTypeOptions)
        this.fetchDataGetEnterprises(this.listQueryntEnterpriseTypeOptions)
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
          await this.getListReportByProject(newVal.id)
          if (newVal.members && newVal.members.length > 0) {
            this.userListSelected = newVal.members.map((item) => item.id) // Tạo mảng mới
            this.fetchDataGetUsersByListIdWhenEdit(
              newVal.members.map((item) => item.id).join(',')
            )
          } else {
            this.userListSelected = [] // Mảng trống nếu không có member
          }
          if (newVal.enterprise) {
            this.fetchDataGetEnterprisesByListIdWhenEdit(newVal.enterprise.id)
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
    this.fetchDataGetEnterprises(this.listQueryntEnterpriseTypeOptions)
    this.fetchDataGetUsers(this.listQueryntUsersTypeOptions)
  },
  methods: {
    async fetchDataGetEnterprises(queryEnterprises) {
      const { data } = await getListEnterprise(queryEnterprises)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.enterpriseTypeOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.enterpriseTypeOptions.push(newItem)
        }
      })
      this.totalItemsEnterpriseTypeOptions = data.total
    },
    async handleAddEnterprises() {
      this.listQueryntEnterpriseTypeOptions.page += 1
      await this.fetchDataGetEnterprises(this.listQueryntEnterpriseTypeOptions)
    },
    async fetchDataGetUsers(queryUsers) {
      const { data } = await getUserList(queryUsers)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.username
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.usersTypeOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.usersTypeOptions.push(newItem)
        }
      })
      this.totalItemsUsersTypeOptions = data.total
    },
    async handleAddUsers() {
      this.listQueryntUsersTypeOptions.page += 1
      await this.fetchDataGetUsers(this.listQueryntUsersTypeOptions)
    },
    // ids is string -- enterprise for project
    async fetchDataGetEnterprisesByListIdWhenEdit(ids) {
      const newQueryEnterprises = {
        page: 1,
        size: 10,
        ids: ids
      }
      await this.fetchDataGetEnterprises(newQueryEnterprises)
    },
    // ids is string -- user for project
    async fetchDataGetUsersByListIdWhenEdit(ids) {
      const newQueryUsers = {
        page: 1,
        size: 20,
        ids: ids
      }
      await this.fetchDataGetUsers(newQueryUsers)
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate()
      })
    },
    handleModalClose() {
      this.dataForm = cloneDeep(defaultDataForm)
      this.rangeDate = [null, null]
      this.userListSelected = []
      this.enterpriseTypeOptions = []
      this.usersTypeOptions = []
      this.totalItemsEnterpriseTypeOptions = 0
      this.totalItemsUsersTypeOptions = 0
      this.listQueryntEnterpriseTypeOptions.page = 1
      this.listQueryntUsersTypeOptions.page = 1
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
      // this.$emit("update:visible", false);
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
            memberIds: this.userListSelected,
            name: this.dataForm.name,
            startAt: this.convertToISOString(this.dataForm.startDate)
          }
          await updateProjectById(dataUpdateProject)
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
          this.dataForm.memberIds = this.userListSelected
          await createProject(this.dataForm)
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
          console.log('Form create Project is invalid')
        }
      })
    },
    convertToISOString(dateString) {
      const date = moment.parseZone(dateString)
      return date.toISOString()
    },
    async getListReportByProject(id) {
      if (id) {
        this.listQueryReportByProject.projectId = id
        const { data } = await getReportList(this.listQueryReportByProject)
        this.reportList = data.items
        console.log('reportList', this.reportList)
      }
    },
    handleChooseShowReport(item) {
      this.reportData = item
    },
    exportContentAsPDF(content) {
      // Tạo một div tạm thời để chứa nội dung cần chuyển đổi thành PDF
      const element = document.createElement('div')
      element.innerHTML = content
      document.body.appendChild(element)
      // Cấu hình cho html2pdf
      const options = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }
      // Tạo PDF và tải xuống
      html2pdf().set(options).from(element).save().then(() => {
        document.body.removeChild(element) // Xóa div tạm sau khi tạo PDF
      })
    },
    handleDeleteReportInProject(item) {
      this.$confirm(
        'Confirm to remove this report?',
        'Warning',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async() => {
          await deleteReportById({
            id: item.id
          })
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.getListReportByProject(this.dataForm.id)
          this.reportData = null
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/* Add your styles here */
.date-range-picker {
  width: 100% !important;
}
.report-el-tag {
  min-width: 100px;
  cursor: pointer;
}
.report-component {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}
.report-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.components-report-tinymce {
  display: flex;
  justify-content: space-between;
  .editor-content {
    flex: 1;
    margin-left: 10px;
    max-width: 80%;
    min-width: 600px;
    overflow-y: auto;
    max-height: 288px;
    border: 1px solid #ccc;
  }
}
.export-content-as-pdf {
  margin-left: 10px;
}
.delete-content-as-pdf {
  margin-left: 10px;
}
</style>
