<template>
  <modal
    :title="$t('table.label')"
    :visible.sync="visible"
    :width="'80%'"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-position="top"
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
          :labeledImages="dataForm.labeledImages"
        />
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import LabelingImageComponent from '@/components/LabelingImage/index'

const defaultDataForm = {
  datasetId: null,
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
    LabelingImageComponent
  },
  props: {
    visible: {
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
      dataForm: cloneDeep(defaultDataForm)
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
  methods: {
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
    },
    handleModalConfirm() {
      this.updateLabelingImageModal()
    },
    updateLabelingImageModal() {
      console.log('updateLabelingImageModal')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
