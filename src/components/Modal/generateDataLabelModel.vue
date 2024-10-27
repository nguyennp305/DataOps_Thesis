<template>
  <modal
    :title="'Generate Data'"
    :visible.sync="visible"
    :width="'60%'"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form ref="dataFormRef" :model="dataForm" label-position="top">
      <el-form-item :label="$t('route.datasetNameData')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.datasetNameData')"
          disabled
        />
      </el-form-item>

      <el-form-item
        :label="
          dataset?.labelType === 'objectDetection'
            ? 'Label type: Object Detection'
            : 'Label type: Label Classification'
        "
        prop="labelType"
      >
      </el-form-item>

      <el-form-item :label="'Model training'" prop="model">
        <el-select
          v-model="modelTrainingLabelImage"
          :placeholder="'Model training'"
          clearable
        >
          <el-option
            v-for="item in dataset?.labelType === 'objectDetection'
              ? isModelTrainingLabelImageOptionsObjectDetection
              : isModelTrainingLabelImageOptionsClassification"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="dataset?.labelType === 'objectDetection'"
        :label="'Type Dataset Model Generate'"
        prop="typeDatasetModelGenerate"
      >
        <el-select
          v-model="typeDatasetModelGenerate"
          :placeholder="'Type Dataset Model Generate'"
          clearable
        >
          <el-option
            v-for="item in isTypeDatasetModelGenerateOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="'Type File Model Generate'"
        prop="typeFileModelGenerate"
      >
        <el-select
          v-model="typeFileModelGenerate"
          :placeholder="'Type File Model Generate'"
          clearable
        >
          <el-option
            v-for="item in isTypeFileModelGenerateOptions"
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

const defaultDataForm = {
  // datasetId: null,
  name: '',
  labelType: null
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
    dataset: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dataForm: cloneDeep(defaultDataForm),
      modelTrainingLabelImage: null,
      typeDatasetModelGenerate: null,
      typeFileModelGenerate: null,
      isModelTrainingLabelImageOptionsClassification: [
        { key: 'VGGNet', displayName: 'VGGNet' },
        { key: 'ResNet', displayName: 'ResNet' },
        { key: 'Inception', displayName: 'Inception' },
        { key: 'MobileNet', displayName: 'MobileNet' },
        { key: 'DenseNet', displayName: 'DenseNet' },
        { key: 'EfficientNet', displayName: 'EfficientNet' }
      ],
      isModelTrainingLabelImageOptionsObjectDetection: [
        { key: 'SSDMobileNe', displayName: 'SSD MobileNe' },
        { key: 'YOLOv3', displayName: 'YOLOv3' },
        { key: 'YOLOv4', displayName: 'YOLOv4' },
        { key: 'YOLOv8', displayName: 'YOLOv8' },
        { key: 'R-CNN', displayName: 'R-CNN' },
        { key: 'Faster R-CNN', displayName: 'Faster R-CNN' },
        { key: 'RetinaNet', displayName: 'RetinaNet' }
      ],
      isTypeDatasetModelGenerateOptions: [
        { key: 'COCO', displayName: 'COCO' },
        { key: 'Pascal VOC', displayName: 'Pascal VOC' },
        { key: 'KITTI', displayName: 'KITTI' },
        { key: 'Cityscapes', displayName: 'Cityscapes' }
      ],
      isTypeFileModelGenerateOptions: [
        { key: 'json', displayName: 'Json' },
        { key: 'txt', displayName: 'TXT' },
        { key: 'csv', displayName: 'CSV' },
        { key: 'xml', displayName: 'XML' }
      ]
    }
  },
  watch: {
    dataset: {
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
      this.generateDataLabel()
    },
    generateDataLabel() {
      // const BASE_URL = 'http://localhost:8089/api/'
      // this.$refs.dataFormRef.validate(async(valid) => {
      //   if (valid) {
      //     this.dataSubmitLabelingImage.dataId = this.dataForm.id
      //     this.dataSubmitLabelingImage.status = this.dataForm.status
      //     this.dataSubmitLabelingImage.labeledIdClassification =
      //       this.dataForm.labeledIdClassification
      //     await axios
      //       .post(BASE_URL + 'data/crop-label', this.dataSubmitLabelingImage)
      //       .then((res) => {
      //         console.log('res', res)
      //         this.$notify({
      //           title: 'Success',
      //           message: 'Label Successfully',
      //           type: 'success',
      //           duration: 2000
      //         })
      //         this.$emit('update:reload-table')
      //         this.$emit('update:visible', false)
      //       })
      //       .catch((err) => {
      //         console.log('err', err)
      //       })
      //   } else {
      //     console.log('Form update is invalid')
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped></style>
