<template>
  <modal
    title="Import File"
    :visible.sync="visible"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form ref="dataFormRef" :model="dataForm" label-position="top">
      <el-form-item prop="name">
        <div class="editor-container">
          <dropzone
            id="myVueDropzone"
            url="https://httpbin.org/post"
            :max-files="1"
            @dropzone-success="dropzoneSuccess"
            @dropzone-removed-file="dropzoneRemovedFile"
          />
        </div>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import Dropzone from '@/components/Dropzone/index.vue'
import axios from 'axios'

const defaultDataForm = {
  file: null
}

export default {
  components: {
    Modal,
    Dropzone
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    urlAPI: {
      type: String,
      default: 'label'
    }
  },
  data() {
    return {
      dataForm: cloneDeep(defaultDataForm)
    }
  },
  methods: {
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.dataFormRef.clearValidate()
      })
    },
    handleModalClose() {
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      this.handleModalClose()
    },
    handleModalConfirm() {
      const BASE_URL = 'http://localhost:8089/api/'
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          // Tạo form-data
          const dataCreateData = new FormData()
          // Kiểm tra nếu image là một file, thì thêm nó vào formData
          if (this.dataForm.file instanceof File) {
            dataCreateData.append('file', this.dataForm.file)
          }
          await axios
            .post(BASE_URL + `${this.urlAPI}/import`, dataCreateData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((res) => {
              console.log('res', res)
              this.$notify({
                title: 'Success',
                message: 'Import Successfully',
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
          console.log('Form Import is invalid')
        }
      })
    },
    dropzoneSuccess(file, response) {
      this.$message({ message: 'Upload success', type: 'success' })
      console.log('dropzoneSuccess', file, response)
      this.dataForm.file = file
      console.log('dataform', this.dataForm)
    },
    dropzoneRemovedFile(file, error, xhr) {
      this.$message({ message: 'Delete success', type: 'success' })
      console.log('dropzoneRemovedFile', file, error, xhr)
    }
  }
}
</script>

<style lang="scss" scoped></style>
