<template>
  <modal
    :title="isEdit ? $t('route.edit') : $t('route.add')"
    :visible.sync="visible"
    :width="'60%'"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="top"
      class="labeling-modal-form"
    >
      <el-form-item :label="$t('route.labelNameData')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.labelNameData')"
          disabled
        />
      </el-form-item>

      <el-form-item :label="$t('table.label')" prop="label">
        <div class="label-classification-content">
          <div>
            <img
              v-if="dataForm.imageUrl"
              :src="dataForm.imageUrl"
              alt="Label Image"
              class="css-and-hover-image"
            />
          </div>
          <div class="label-classification-content-right">
            <el-select
              v-model="dataForm.labeledIdClassification"
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
                  :disabled="
                    totalItemsLabelDataOptions === labelDataOptions.length
                  "
                  @click="handleAddLabelsData"
                >
                  Add Items
                </el-button>
                <span>Total: {{ labelDataOptions.length + '/' + totalItemsLabelDataOptions }}</span>
              </div>
            </el-select>
            <classification-label :image-link="dataForm.imageUrl" />
          </div>
        </div>
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
import { getLabelGroupList } from '@/api/labeling-management/label-group'
import { getLabelDataList } from '@/api/labeling-management/label-data'
import classificationLabel from '@/components/AutoLabelWithTensoflow/classificationLabel.vue'
import axios from 'axios'

const defaultDataForm = {
  // datasetId: null,
  description: '',
  id: null,
  imageUrl: null,
  labeledImages: [],
  labeledIdClassification: [],
  name: '',
  projectId: null,
  status: 'notLabel',
  updatedBy: null
}

export default {
  components: {
    Modal,
    classificationLabel
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
    },
    dataset: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dataForm: cloneDeep(defaultDataForm),
      rules: {
        status: [
          {
            required: true,
            message: 'Status is required',
            trigger: 'blur'
          }
        ]
      },
      isStatusOptions: [
        { key: 'notLabel', displayName: 'Not label' },
        { key: 'labeled', displayName: 'Labeled' },
        { key: 'labeling', displayName: 'Labeling' }
      ],
      dataSubmitLabelingImage: {
        dataId: null,
        labeledImages: [],
        status: null,
        labeledIdClassification: []
      },
      labelDataOptions: [],
      totalItemsLabelDataOptions: 0,
      listQueryLabelDataOptions: {
        page: 1,
        size: 100,
        ids: null
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (this.dataset) {
          const newQuery = {
            page: 1,
            size: 10,
            ids: this.dataset.labelGroupIds.join(',') // Tạo mảng mới
          }
          this.fetchDataGetLabelGroupData(newQuery)
        }
        if (newVal) {
          this.dataForm = cloneDeep(newVal)
        } else {
          this.dataForm = cloneDeep(defaultDataForm)
        }
        this.clearValidate()
      },
      deep: true
    },
    dataset: {
      handler(newVal) {
        console.log('dataset', newVal)
        const newQuery = {
          page: 1,
          size: 100,
          ids: newVal.labelGroupIds.join(',') // Tạo mảng mới
        }
        this.fetchDataGetLabelGroupData(newQuery)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate()
      })
    },
    handleModalClose() {
      this.dataForm = cloneDeep(defaultDataForm)
      this.dataSubmitLabelingImage = {
        dataId: null,
        labeledImages: [],
        status: null,
        labeledIdClassification: []
      }
      this.labelDataOptions = []
      this.totalItemsLabelDataOptions = 0
      this.listQueryLabelDataOptions = {
        page: 1,
        size: 100,
        ids: null
      }
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
    },
    handleModalConfirm() {
      this.updateLabelingImageModal()
    },
    updateLabelingImageModal() {
      const BASE_URL = 'http://localhost:8089/api/'
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          this.dataSubmitLabelingImage.dataId = this.dataForm.id
          this.dataSubmitLabelingImage.status = this.dataForm.status
          this.dataSubmitLabelingImage.labeledIdClassification =
            this.dataForm.labeledIdClassification
          await axios
            .post(BASE_URL + 'data/crop-label', this.dataSubmitLabelingImage)
            .then((res) => {
              console.log('res', res)
              this.$notify({
                title: 'Success',
                message: 'Label Successfully',
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
          console.log('Form update is invalid')
        }
      })
    },
    async fetchDataGetLabelGroupData(queryLabelData) {
      const { data } = await getLabelGroupList(queryLabelData)
      const labelIdsSet = new Set()
      data.items.forEach((item) => {
        item.labelIds.forEach((id) => labelIdsSet.add(id))
      })
      this.listQueryLabelDataOptions.ids = Array.from(labelIdsSet).join(',')
      await this.fetchDataGetLabelData(this.listQueryLabelDataOptions)
    },
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
    }
  }
}
</script>

<style lang="scss" scoped>
.labeling-modal-form {
  max-height: 60vh;
  overflow-y: auto;

  .css-and-hover-image {
    height: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }

  .label-classification-content {
    display: flex;
    column-gap: 2rem;
    .label-classification-content-right {
      flex: 1;
    }
  }
}
</style>
