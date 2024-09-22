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
          filterable
          clearable
        >
          <el-option
            v-for="item in projectByOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <pagination
            v-show="totalItemsProjectOptions > 0"
            :total="totalItemsProjectOptions"
            :page.sync="listQueryProjectOptions.page"
            :limit.sync="listQueryProjectOptions.size"
            @pagination="fetchDataGetProject"
          />
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
          <pagination
            v-show="totalItemsLabelDataOptions > 0"
            :total="totalItemsLabelDataOptions"
            :page.sync="listQueryLabelDataOptions.page"
            :limit.sync="listQueryLabelDataOptions.size"
            @pagination="fetchDataGetLabelData"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep, update } from 'lodash'
import { getProjectList } from '@/api/project-management/project-list'
import { createLabelGroup, updateLabelGroupById } from '@/api/labeling-management/label-group'
import Pagination from '@/components/Pagination/index.vue'
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
    Modal,
    Pagination
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
        size: 10
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
          if (newVal.labelIds && newVal.labelIds.length > 0) {
            this.labelDataListSelected = newVal.labelIds.map((item) => item) // Tạo mảng mới
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
    this.fetchDataGetProject()
    this.fetchDataGetLabelData()
  },
  methods: {
    async fetchDataGetLabelData() {
      const { data } = await getLabelDataList(
        this.listQueryLabelDataOptions
      )
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      this.labelDataOptions = newArray
      this.totalItemsLabelDataOptions = data.total
    },
    async fetchDataGetProject() {
      const { data } = await getProjectList(
        this.listQueryProjectOptions
      )
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      this.projectByOptions = newArray
      this.totalItemsProjectOptions = data.total
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate()
      })
    },
    handleModalClose() {
      this.dataForm = cloneDeep(defaultDataForm)
      this.labelDataListSelected = []
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

<style lang="scss" scoped>
</style>
