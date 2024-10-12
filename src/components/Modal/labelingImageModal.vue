<template>
  <modal
    :title="$t('table.label')"
    :visible.sync="visible"
    :width="'90%'"
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
      <el-form-item :label="$t('route.labelGroupName')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.labelGroupName')"
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

const defaultDataForm = {
  // datasetId: null,
  description: '',
  id: null,
  imageUrl: null,
  labeledImages: [],
  name: '',
  projectId: null,
  status: '',
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
      ]
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (newVal) {
          this.listLoading = true
          this.dataForm = cloneDeep(newVal)
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
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          console.log('updateLabelingImageModal', this.dataForm)
        }
      })
    },
    handleUpdateLabelingImageInTable(row) {
      console.log('handleUpdateLabelingImageInTable', row)
    },
    updateTableKey(newVal) {
      this.tableKey = newVal
    },
    handleUpdateLabelingImageComponent(data) {
      this.dataForm.labeledImages.push(data)
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
