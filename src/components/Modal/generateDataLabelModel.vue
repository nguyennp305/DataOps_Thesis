<template>
  <modal
    :title="`Generate Data - ${
      dataset?.labelType === 'objectDetection'
        ? ' Dataset with Object Detection'
        : ' Dataset with Label Classification'
    }`"
    :visible.sync="visible"
    :width="'60%'"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-position="top"
      :rules="rules"
    >
      <el-form-item :label="$t('route.datasetNameData')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.datasetNameData')"
          disabled
        />
      </el-form-item>

      <!-- <el-form-item
        :label="
          dataset?.labelType === 'objectDetection'
            ? 'Label type: Object Detection'
            : 'Label type: Label Classification'
        "
        prop="labelType"
      >
      </el-form-item> -->

      <el-form-item :label="'Model training'" prop="modelTrainingLabelImage">
        <el-select
          v-model="dataForm.modelTrainingLabelImage"
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

      <!-- <el-form-item
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
      </el-form-item> -->

      <el-form-item
        :label="'Type File Model Generate'"
        prop="typeFileModelGenerate"
      >
        <el-select
          v-model="dataForm.typeFileModelGenerate"
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
import { generateDataset } from '@/api/dataset-management/generateData'
import { saveAs } from 'file-saver'

const defaultDataForm = {
  // datasetId: null,
  name: '',
  labelType: null,
  modelTrainingLabelImage: null,
  typeFileModelGenerate: null
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
      // typeDatasetModelGenerate: null,
      isModelTrainingLabelImageOptionsClassification: [
        { key: 'ResNet', displayName: 'ResNet (ResNet-50, ResNet-101)' },
        { key: 'Inception', displayName: 'Inception (v3, v4)' },
        { key: 'MobileNet', displayName: 'MobileNet (v2, v3)' },
        { key: 'EfficientNetV2', displayName: 'EfficientNetV2' }, // Thay thế EfficientNet
        { key: 'ViT', displayName: 'Vision Transformer (ViT)' }, // Xu hướng mới
        { key: 'ConvNeXt', displayName: 'ConvNeXt' } // Mô hình hiện đại, cải tiến ResNet
      ],
      isModelTrainingLabelImageOptionsObjectDetection: [
        { key: 'YOLOv5', displayName: 'YOLOv5' }, // Hiện vẫn phổ biến và dễ sử dụng
        { key: 'YOLOv8', displayName: 'YOLOv8' }, // Bản mới nhất, được tối ưu hóa
        { key: 'YOLO-NAS', displayName: 'YOLO-NAS' }, // Mới nổi bật với hiệu năng cao
        { key: 'Faster R-CNN', displayName: 'Faster R-CNN' },
        { key: 'DETR', displayName: 'DETR (DEtection TRansformer)' }, // Xu hướng mới
        { key: 'RetinaNet', displayName: 'RetinaNet' },
        { key: 'SSD Lite', displayName: 'SSD Lite' } // Thay thế SSD MobileNe
      ],
      // isTypeDatasetModelGenerateOptions: [
      //   { key: 'COCO', displayName: 'COCO' },
      //   { key: 'Pascal VOC', displayName: 'Pascal VOC' },
      //   { key: 'KITTI', displayName: 'KITTI' },
      //   { key: 'Cityscapes', displayName: 'Cityscapes' }
      // ],
      isTypeFileModelGenerateOptions: [
        { key: 'json', displayName: 'Json' },
        { key: 'txt', displayName: 'TXT' },
        { key: 'csv', displayName: 'CSV' }
      ],
      rules: {
        modelTrainingLabelImage: [
          {
            required: true,
            message: 'modelTrainingLabelImage is required',
            trigger: 'blur'
          }
        ],
        typeFileModelGenerate: [
          {
            required: true,
            message: 'typeFileModelGenerate is required',
            trigger: 'blur'
          }
        ]
      }
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
      this.modelTrainingLabelImage = null
      this.typeFileModelGenerate = null
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
    },
    handleModalConfirm() {
      this.generateDataLabel()
    },
    // generateDataLabel() {
    //   this.$refs.dataFormRef.validate(async(valid) => {
    //     if (valid) {
    //       const data = {
    //         id: this.dataForm.id,
    //         name: this.dataForm.name,
    //         labelType: this.dataForm.labelType,
    //         modelTrainingLabelImage: this.dataForm.modelTrainingLabelImage,
    //         typeFileModelGenerate: this.dataForm.typeFileModelGenerate,
    //         labeledImageIds: this.dataForm.labeledImageIds
    //       }
    //       const response = await generateDataset(data)
    //       console.log('response', response)
    //       this.$notify({
    //         title: 'Success',
    //         message: 'Generate Successfully',
    //         type: 'success',
    //         duration: 2000
    //       })
    //       this.$emit('update:reload-table')
    //       this.$emit('update:visible', false)
    //     } else {
    //       console.log('Form generate is invalid')
    //     }
    //   })
    // },
    generateDataLabel() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          const data = {
            id: this.dataForm.id,
            name: this.dataForm.name,
            labelType: this.dataForm.labelType,
            modelTrainingLabelImage: this.dataForm.modelTrainingLabelImage,
            typeFileModelGenerate: this.dataForm.typeFileModelGenerate,
            labeledImageIds: this.dataForm.labeledImageIds
          }

          try {
            const response = await generateDataset(data)

            // Xử lý file trả về
            const fileContent = response.data.contentDataGenerate
            const fileType = this.dataForm.typeFileModelGenerate
            const fileName = `${this.dataForm.name}-${this.dataForm.modelTrainingLabelImage}_Model.${fileType}`

            // Chuyển đổi fileContent thành Blob và tải xuống
            let blob
            switch (fileType) {
              case 'json':
                blob = new Blob([JSON.stringify(fileContent, null, 2)], {
                  type: 'application/json'
                })
                break
              case 'csv':
                blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' })
                break
              case 'txt':
                blob = new Blob([fileContent], { type: 'text/plain' })
                break
              default:
                console.error('Unsupported file type')
                return
            }

            // Sử dụng file-saver để tải file
            saveAs(blob, fileName)

            // Hiển thị thông báo thành công
            this.$notify({
              title: 'Success',
              message: 'Generate Successfully',
              type: 'success',
              duration: 2000
            })

            // Cập nhật giao diện
            this.$emit('update:reload-table')
            this.$emit('update:visible', false)
          } catch (error) {
            console.error('Error generating dataset:', error)
            this.$notify({
              title: 'Error',
              message: 'Failed to generate dataset',
              type: 'error',
              duration: 2000
            })
          }
        } else {
          console.log('Form generate is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
