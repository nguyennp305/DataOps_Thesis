<template>
  <modal
    :title="$t('table.label')"
    :visible.sync="visible"
    :width="'90%'"
    :confirm-disabled="confirmDisabledButton"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
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
        <labeling-image-component
          v-if="dataForm.imageUrl"
          :imgUrl="dataForm.imageUrl"
          @update="handleUpdateLabelingImageComponent"
        />
      </el-form-item>

      <el-form-item :label="$t('route.table')" prop="table">
        <table-labeling-image
          v-if="dataForm.imageUrl && datasetInfo"
          :loading="listLoading"
          :imgUrl="dataForm.imageUrl"
          :labeledImages="dataForm.labeledImages"
          :tableKey="tableKey"
          :dataset="datasetInfo"
          @update="handleUpdateLabelingImageInTable"
          @update:confirm-disabled-button="handleUpdateConfirmDisabledButton"
        />
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
import LabelingImageComponent from '@/components/LabelingImage/index'
import tableLabelingImage from '@/components/LabelingImage/table-labeling-image'
import axios from 'axios'

const defaultDataForm = {
  // datasetId: null,
  description: '',
  id: null,
  imageUrl: null,
  labeledImages: [],
  name: '',
  projectId: null,
  status: 'notLabel',
  updatedBy: null
}

export default {
  components: {
    Modal,
    LabelingImageComponent,
    tableLabelingImage
  },
  props: {
    visible: {
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
      listLoading: true,
      tableKey: 0,
      datasetInfo: null,
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
      confirmDisabledButton: true
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.listLoading = true
          this.dataForm = cloneDeep(newVal)
          this.datasetInfo = this.dataset
          this.listLoading = false
        } else {
          this.dataForm = cloneDeep(defaultDataForm)
        }
        this.clearValidate()
      },
      deep: true
    },
    dataset: {
      handler(newVal) {
        if (newVal) {
          this.datasetInfo = newVal
        }
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
      this.confirmDisabledButton = true
      this.datasetInfo = null
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
    async handleUpdateLabelingImageInTable(data) {
      this.dataSubmitLabelingImage.labeledImages = data
    },
    updateTableKey(newVal) {
      this.tableKey = newVal
    },
    handleUpdateLabelingImageComponent(data) {
      this.dataForm.labeledImages.push(data)
    },
    handleUpdateConfirmDisabledButton(newVal) {
      this.confirmDisabledButton = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.labeling-modal-form {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
