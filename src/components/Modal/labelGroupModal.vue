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
      <el-form-item :label="$t('route.labelGroupName')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.labelGroupName')"
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
          :disabled="isEdit"
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

      <el-form-item :label="$t('route.labelNameData')" prop="labelIds">
        <el-select
          v-model="labelDataListSelected"
          :placeholder="$t('route.labelNameData')"
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="item in labelDataOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <div class="component-add-items-to-list-select">
            <el-button
              size="mini"
              type="primary"
              :disabled="totalItemsLabelDataOptions === labelDataOptions.length"
              @click="handleAddLabelsData"
            >
              Add Items
            </el-button>
            <span>Total: {{ labelDataOptions.length + '/' + totalItemsLabelDataOptions }}</span>
          </div>
        </el-select>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep, update } from 'lodash'
import { getProjectList } from '@/api/project-management/project-list'
import {
  createLabelGroup,
  updateLabelGroupById
} from '@/api/labeling-management/label-group'
import { UserModule } from '@/store/modules/user'
import { getLabelDataList } from '@/api/labeling-management/label-data'

const defaultDataForm = {
  name: '',
  description: '',
  projectId: null,
  id: null
}

export default {
  components: {
    Modal
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
        ]
      },
      projectByOptions: [],
      totalItemsProjectOptions: 0,
      listQueryProjectOptions: {
        page: 1,
        size: 10
      },
      labelDataOptions: [],
      labelDataListSelected: [],
      totalItemsLabelDataOptions: 0,
      listQueryLabelDataOptions: {
        page: 1,
        size: 100
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.fetchDataGetProject(this.listQueryProjectOptions)
        this.fetchDataGetLabelData(this.listQueryLabelDataOptions)
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
          if (newVal.projectId) {
            this.fetchDataGetProjectsByListIdWhenEdit(newVal.projectId)
          }
          if (newVal.labelIds && newVal.labelIds.length > 0) {
            this.labelDataListSelected = newVal.labelIds.map((item) => item) // Tạo mảng mới
            this.fetchDataGetLabelDataByListIdWhenEdit(newVal.labelIds.map((item) => item).join(','))
          } else {
            this.labelDataListSelected = [] // Mảng trống nếu không có member
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
    this.fetchDataGetLabelData(this.listQueryLabelDataOptions)
  },
  methods: {
    async fetchDataGetLabelData(queryLabelData) {
      const { data } = await getLabelDataList(queryLabelData)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.labelDataOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.labelDataOptions.push(newItem)
        }
      })
      this.totalItemsLabelDataOptions = data.total
    },
    async handleAddLabelsData() {
      this.listQueryLabelDataOptions.page += 1
      await this.fetchDataGetLabelData(this.listQueryLabelDataOptions)
    },
    async fetchDataGetLabelDataByListIdWhenEdit(ids) {
      const newQueryLabelData = {
        page: 1,
        size: 200,
        ids: ids
      }
      await this.fetchDataGetLabelData(newQueryLabelData)
    },
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
        size: 200,
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
      this.labelDataListSelected = []
      this.labelDataOptions = []
      this.totalItemsLabelDataOptions = 0
      this.listQueryLabelDataOptions.page = 1
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
      // this.$emit("update:visible", false);
    },
    handleModalConfirm() {
      if (this.isEdit) {
        this.updateLabelGroupModal()
      } else {
        this.createLabelGroupModal()
      }
    },
    updateLabelGroupModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          const dataUpdateLabelData = {
            description: this.dataForm.description,
            id: this.dataForm.id,
            labelIds: this.labelDataListSelected,
            name: this.dataForm.name,
            projectId: this.dataForm.projectId,
            updatedBy: UserModule.id
          }
          await updateLabelGroupById(dataUpdateLabelData)
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
          console.log('Form update LabelGroup is invalid')
        }
      })
    },
    createLabelGroupModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          const dataCreateLabelData = {
            description: this.dataForm.description,
            id: this.dataForm.id,
            labelIds: this.labelDataListSelected,
            name: this.dataForm.name,
            projectId: this.dataForm.projectId,
            createdBy: UserModule.id
          }
          await createLabelGroup(dataCreateLabelData)
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
          console.log('Form create LabelGroup is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
