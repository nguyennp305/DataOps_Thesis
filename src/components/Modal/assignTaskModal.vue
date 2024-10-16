<template>
  <modal
    :title="'Assign Task'"
    :visible.sync="visible"
    :width="'90%'"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <el-form
      ref="dataFormAssignRef"
      :model="dataForm"
      :rules="rules"
      label-position="top"
      class="labeling-modal-form"
    >dđ
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'

const defaultDataForm = {
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
    projectId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dataForm: cloneDeep(defaultDataForm),
      listLoading: true,
      tableKey: 0,
      rules: {
        status: [
          {
            required: true,
            message: 'Status is required',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    projectId: {
      handler(newVal) {
        if (newVal) {
          console.log('newVal', newVal)
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
        this.$refs.dataFormAssignRef.clearValidate()
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
      console.log('this.dataForm', this.dataForm)
    },
    updateTableKey(newVal) {
      this.tableKey = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
