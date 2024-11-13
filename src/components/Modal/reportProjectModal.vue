<template>
  <modal
    :title="isEdit ? $t('route.edit') : $t('route.add')"
    :visible.sync="visible"
    :width="'90%'"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="top"
      class="report-project-modal-form"
    >
      <el-form-item :label="$t('route.reportName')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.reportName')"
        />
      </el-form-item>

      <el-form-item :label="$t('table.description')" prop="description">
        <el-input
          v-model="dataForm.description"
          :placeholder="$t('table.description')"
        />
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
      <el-form-item :label="$t('route.reportType')" prop="reportType">
        <el-select
          v-model="dataForm.reportType"
          :placeholder="$t('route.reportType')"
          clearable
        >
          <el-option
            v-for="item in isReportTypeOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="'Data Report'" prop="report">
        <div class="components-report-tinymce">
          <report-project-tinymce
            :value="dataForm.data"
            :id="dataForm.id"
            :height="400"
            class="report-project-tinymce"
            @input="updateDataReportContent"
          />
          <div class="editor-content" v-html="dataForm.data"></div>
        </div>
        <el-button
          v-waves
          type="primary"
          size="mini"
          icon="el-icon-download"
          @click="exportContentAsPDF"
          class="export-content-as-pdf"
        >
          Export PDF
        </el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import { getProjectList } from '@/api/project-management/project-list'
import {
  createReport,
  updateReportById
} from '@/api/project-management/report-list'
import { UserModule } from '@/store/modules/user'
import ReportProjectTinymce from '@/components/Tinymce/reportProjectTinymce'
import html2pdf from 'html2pdf.js'

const defaultDataForm = {
  name: '',
  description: '',
  projectId: null,
  reportType: null,
  data: `<h1 style="text-align: center;">Report !</h1><p style="text-align: center; font-size: 15px;"><img title="Logo" src="./favicon.ico" alt="Logo" width="100" height="100" /><ul>
      <li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li><li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li><li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
    </ul>`,
  id: null
}

export default {
  components: {
    Modal,
    ReportProjectTinymce
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
        projectId: [
          {
            required: true,
            message: 'Project is required',
            trigger: 'blur'
          }
        ],
        reportType: [
          {
            required: true,
            message: 'Report Type is required',
            trigger: 'blur'
          }
        ]
      },
      projectByOptions: [],
      totalItemsProjectOptions: 0,
      listQueryProjectOptions: {
        page: 1,
        size: 10
      },
      isReportTypeOptions: [
        { key: 'projectLevelReport', displayName: 'Project Level Report' },
        { key: 'datasetLevelReport', displayName: 'Dataset Level Report' },
        {
          key: 'labelingTypeDetailReport',
          displayName: 'Labeling Type Detail Report'
        },
        {
          key: 'labelingQualityReport',
          displayName: 'Labeling Quality Report'
        },
        { key: 'performanceReport', displayName: 'Performance Report' },
        { key: 'weeklyReport', displayName: 'Weekly Report' },
        { key: 'monthlyReport', displayName: 'Monthly Report' }
      ]
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
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
      // this.$emit("update:visible", false);
    },
    handleModalConfirm() {
      if (this.isEdit) {
        this.updateReportProjectModal()
      } else {
        this.createReportProjectModal()
      }
    },
    updateReportProjectModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          await updateReportById(this.dataForm)
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
          console.log('Form update ReportProject is invalid')
        }
      })
    },
    createReportProjectModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          this.dataForm.createdBy = UserModule.id
          await createReport(this.dataForm)
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
          console.log('Form create ReportProject is invalid')
        }
      })
    },
    updateDataReportContent(content) {
      this.dataForm.data = content
    },
    exportContentAsPDF() {
      const content = this.dataForm.data // Lấy nội dung HTML từ TinyMCE
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
    }
  }
}
</script>

<style lang="scss" scoped>
.report-project-modal-form {
  max-height: 60vh;
  overflow-y: auto;
}
.components-report-tinymce {
  display: flex;
  justify-content: space-between;
  .report-project-tinymce {
    flex: 1;
    max-width: 50%;
    min-width: 600px;
  }
  .editor-content {
    flex: 1;
    max-width: 50%;
    min-width: 600px;
    margin-top: 7rem;
    overflow-y: auto;
    max-height: 288px;
  }
}
.export-content-as-pdf {
  margin-top: 1rem;
}
</style>
