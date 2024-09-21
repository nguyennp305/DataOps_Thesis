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
      <el-form-item :label="$t('route.labelNameData')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.labelNameData')"
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
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import { getProjectList } from '@/api/project-management/project-list'
import { createLabelData, updateLabelDataById } from '@/api/labeling-management/label-data'
import Pagination from '@/components/Pagination/index.vue'

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
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
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
  },
  methods: {
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
          await updateLabelDataById(this.dataForm)
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
          console.log('Form update LabelData is invalid')
        }
      })
    },
    createProjectModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          await createLabelData(this.dataForm)
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
          console.log('Form create LabelData is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
