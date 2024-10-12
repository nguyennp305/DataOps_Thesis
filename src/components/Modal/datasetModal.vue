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
      <el-form-item :label="$t('route.datasetNameData')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.datasetNameData')"
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

      <el-form-item :label="$t('route.labelGroupName')" prop="labelGroupIds">
        <el-select
          v-model="labelGroupDataListSelected"
          :placeholder="$t('route.labelGroupName')"
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="item in labelGroupDataOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <div class="component-add-items-to-list-select">
            <el-button
              size="mini"
              type="primary"
              :disabled="
                totalItemsLabelGroupDataOptions === labelGroupDataOptions.length
              "
              @click="handleAddLabelsGroupData"
            >
              Add Items
            </el-button>
            <span>Total: {{ totalItemsLabelGroupDataOptions }}</span>
          </div>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('route.image')" prop="image">
        <el-select
          v-model="imageDataListSelected"
          :placeholder="$t('route.image')"
          :filter-method="onInputChangeSearchImage"
          multiple
          filterable
          clearable
        >
          <el-option
            v-for="item in imageDataOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          >
            <span style="float: left" class="cropped-image">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                alt="Cropped Image"
                class="css-and-hover-image"
              />
              <div v-else class="crop-placeholder" />
            </span>
            <span style="float: right">{{ item.displayName }}</span>
          </el-option>
          <div class="component-add-items-to-list-select">
            <el-button
              size="mini"
              type="primary"
              :disabled="totalItemsImageDataOptions === imageDataOptions.length"
              @click="handleAddImageData"
            >
              Add Items
            </el-button>
            <span>Total: {{ totalItemsImageDataOptions }}</span>
          </div>
        </el-select>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep, debounce } from 'lodash'
import { getProjectList } from '@/api/project-management/project-list'
import {
  createDataset,
  updateDatasetById
} from '@/api/dataset-management/dataset'
import { UserModule } from '@/store/modules/user'
import { getLabelGroupList } from '@/api/labeling-management/label-group'
import { getDataList } from '@/api/data-management/data'

const defaultDataForm = {
  name: '',
  description: '',
  projectId: null,
  labelGroupIds: [],
  labeledImageIds: [],
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
      labelGroupDataOptions: [],
      labelGroupDataListSelected: [],
      totalItemsLabelGroupDataOptions: 0,
      listQueryLabelGroupDataOptions: {
        page: 1,
        size: 10
      },
      imageDataOptions: [],
      imageDataListSelected: [],
      totalItemsImageDataOptions: 0,
      listQueryLabelImageOptions: {
        page: 1,
        size: 10
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.fetchDataGetProject(this.listQueryProjectOptions)
        this.fetchDataGetLabelGroupData(this.listQueryLabelGroupDataOptions)
        this.fetchDataGetImageData(this.listQueryLabelImageOptions)
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
          if (newVal.projectId) {
            this.fetchDataGetProjectsByListIdWhenEdit(newVal.projectId)
          }
          if (newVal.labelGroupIds && newVal.labelGroupIds.length > 0) {
            this.labelGroupDataListSelected = newVal.labelGroupIds.map(
              (item) => item
            ) // Tạo mảng mới
            this.fetchDataGetLabelGroupDataByListIdWhenEdit(
              newVal.labelGroupIds.map((item) => item).join(',')
            )
          } else {
            this.labelGroupDataListSelected = [] // Mảng trống nếu không có member
          }
          if (newVal.labeledImageIds && newVal.labeledImageIds.length > 0) {
            this.imageDataListSelected = newVal.labeledImageIds.map(
              (item) => item
            ) // Tạo mảng mới
            this.fetchDataGetImageDataByListIdWhenEdit(
              newVal.labeledImageIds.map((item) => item).join(',')
            )
          } else {
            this.imageDataListSelected = [] // Mảng trống nếu không có member
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
    this.fetchDataGetLabelGroupData(this.listQueryLabelGroupDataOptions)
    this.fetchDataGetImageData(this.listQueryLabelImageOptions)
  },
  methods: {
    async fetchDataGetLabelGroupData(queryLabelData) {
      const { data } = await getLabelGroupList(queryLabelData)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.labelGroupDataOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.labelGroupDataOptions.push(newItem)
        }
      })
      this.totalItemsLabelGroupDataOptions = data.total
    },
    async handleAddLabelsGroupData() {
      this.listQueryLabelGroupDataOptions.page += 1
      await this.fetchDataGetLabelGroupData(
        this.listQueryLabelGroupDataOptions
      )
    },
    async fetchDataGetLabelGroupDataByListIdWhenEdit(ids) {
      const newQueryLabelGroupData = {
        page: 1,
        size: 20,
        ids: ids
      }
      await this.fetchDataGetLabelGroupData(newQueryLabelGroupData)
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
        size: 20,
        ids: ids
      }
      await this.fetchDataGetProject(newQueryUsers)
    },
    async fetchDataGetImageData(queryImageData) {
      const { data } = await getDataList(queryImageData)
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name,
        imageUrl: item.imageUrl
      }))
      // Kiểm tra và chỉ thêm những item chưa tồn tại
      newArray.forEach((newItem) => {
        const isExist = this.imageDataOptions.some(
          (existingItem) => existingItem.key === newItem.key
        )
        if (!isExist) {
          this.imageDataOptions.push(newItem)
        }
      })
      this.totalItemsImageDataOptions = data.total
    },
    async handleAddImageData() {
      this.listQueryLabelImageOptions.page += 1
      await this.fetchDataGetImageData(this.listQueryLabelImageOptions)
    },
    async fetchDataGetImageDataByListIdWhenEdit(ids) {
      const newQueryImageData = {
        page: 1,
        size: 20,
        ids: ids
      }
      await this.fetchDataGetImageData(newQueryImageData)
    },
    handleSearchDebounceImage: debounce(async function(name) {
      if (!name || name === '') {
        this.listQueryLabelImageOptions.page = 1
        this.imageDataOptions = []
        await this.fetchDataGetImageData(this.listQueryLabelImageOptions)
      } else {
        const newQuery = {
          page: 1,
          size: 10,
          name: name
        }
        const { data } = await getDataList(newQuery)
        const newArray = data.items.map((item) => ({
          key: item.id,
          displayName: item.name,
          imageUrl: item.imageUrl
        }))
        this.imageDataOptions = newArray
        this.totalItemsImageDataOptions = data.total
      }
    }, 2000),
    async onInputChangeSearchImage(name) {
      await this.handleSearchDebounceImage(name)
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

      this.labelGroupDataListSelected = []

      this.labelGroupDataOptions = []
      this.totalItemsLabelGroupDataOptions = 0
      this.listQueryLabelGroupDataOptions.page = 1

      this.imageDataListSelected = []
      this.imageDataOptions = []
      this.totalItemsImageDataOptions = 0
      this.listQueryLabelImageOptions.page = 1

      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
      // this.$emit("update:visible", false);
    },
    handleModalConfirm() {
      if (this.isEdit) {
        this.updateDatasetModal()
      } else {
        this.createDatasetModal()
      }
    },
    updateDatasetModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          const dataUpdateDataset = {
            description: this.dataForm.description,
            id: this.dataForm.id,
            labelGroupIds: this.labelGroupDataListSelected,
            labeledImageIds: this.imageDataListSelected,
            name: this.dataForm.name,
            projectId: this.dataForm.projectId,
            updatedBy: UserModule.id
          }
          await updateDatasetById(dataUpdateDataset)
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
          console.log('Form update Dataset is invalid')
        }
      })
    },
    createDatasetModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          const dataCreateDataset = {
            description: this.dataForm.description,
            id: this.dataForm.id,
            labelGroupIds: this.labelGroupDataListSelected,
            labeledImageIds: this.imageDataListSelected,
            name: this.dataForm.name,
            projectId: this.dataForm.projectId,
            createdBy: UserModule.id
          }
          await createDataset(dataCreateDataset)
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
          console.log('Form create Dataset is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cropped-image img {
  max-width: 100%;
  height: 30px;
  object-fit: contain;
}
.css-and-hover-image {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
}
.crop-placeholder {
  width: 100%;
  height: 30px;
  background: #ccc;
}
</style>
