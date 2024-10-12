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
      <el-form-item :label="$t('route.dataName')" prop="name">
        <el-input v-model="dataForm.name" :placeholder="$t('route.dataName')" />
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

      <el-form-item :label="$t('table.status')" prop="status">
        <el-select
          v-model="dataForm.status"
          :placeholder="$t('table.status')"
          clearable
          :disabled="!isEdit"
        >
          <el-option
            v-for="item in isStatusOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('route.image')" prop="image" v-if="!isEdit">
        <div class="editor-container">
          <image-upload
            id="myVueDropzone"
            url="https://httpbin.org/post"
            @dropzone-success="dropzoneSuccess"
            @dropzone-removed-file="dropzoneRemovedFile"
          />
        </div>
      </el-form-item>
      <el-form-item :label="$t('route.image')" prop="image" v-else>
        <div class="cropped-image">
          <img
            v-if="dataForm.image"
            :src="dataForm.image"
            alt="Cropped Image"
            class="css-and-hover-image"
          />
          <div v-else class="crop-placeholder" />
        </div>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import axios from 'axios'
import { cloneDeep } from 'lodash'
import { getProjectList } from '@/api/project-management/project-list'
import { UserModule } from '@/store/modules/user'
import imageUpload from '@/components/Dropzone/imageUpload'

const defaultDataForm = {
  description: '',
  image: null,
  name: '',
  projectId: null,
  status: 'notLabel',
  id: null
}

export default {
  components: {
    Modal,
    imageUpload
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
        status: [
          {
            required: true,
            message: 'Status is required',
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
      isStatusOptions: [
        { key: 'notLabel', displayName: 'Not label' },
        { key: 'labeled', displayName: 'Labeled' },
        { key: 'labeling', displayName: 'Labeling' }
      ]
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.fetchDataGetProject(this.listQueryProjectOptions)
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
          if (newVal.imageUrl) {
            this.dataForm.image = newVal.imageUrl
          }
          if (newVal.projectId) {
            this.fetchDataGetProjectsByListIdWhenEdit(newVal.projectId)
          }
        } else {
          this.dataForm = cloneDeep(defaultDataForm)
        }
        console.log('dataForm', this.dataForm)
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
        this.updateDataModal()
      } else {
        this.createDataModal()
      }
    },
    updateDataModal() {
      const BASE_URL = 'http://localhost:8089/api/'
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          // Tạo form-data
          const dataUpdateData = new FormData()
          dataUpdateData.append('updatedBy', UserModule.id)
          dataUpdateData.append('description', this.dataForm.description)
          dataUpdateData.append('name', this.dataForm.name)
          dataUpdateData.append('projectId', this.dataForm.projectId)
          dataUpdateData.append('status', this.dataForm.status)
          dataUpdateData.append('id', this.dataForm.id)
          await axios
            .put(BASE_URL + 'data', dataUpdateData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
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
          console.log('Form update Data is invalid')
        }
      })
    },
    createDataModal() {
      const BASE_URL = 'http://localhost:8089/api/'
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          // Tạo form-data
          const dataCreateData = new FormData()
          dataCreateData.append('createdBy', UserModule.id)
          dataCreateData.append('description', this.dataForm.description)
          dataCreateData.append('name', this.dataForm.name)
          dataCreateData.append('projectId', this.dataForm.projectId)
          dataCreateData.append('status', this.dataForm.status)
          // Kiểm tra nếu image là một file, thì thêm nó vào formData
          if (this.dataForm.image instanceof File) {
            dataCreateData.append('image', this.dataForm.image)
          }
          await axios
            .post(BASE_URL + 'data', dataCreateData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
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
          console.log('Form create Data is invalid')
        }
      })
    },
    dropzoneSuccess(file, response) {
      this.$message({ message: 'Upload success', type: 'success' })
      console.log('dropzoneSuccess', file, response)
      this.dataForm.image = file
      console.log('dataform', this.dataForm)
    },
    dropzoneRemovedFile(file, error, xhr) {
      this.$message({ message: 'Delete success', type: 'success' })
      console.log('dropzoneRemovedFile', file, error, xhr)
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
