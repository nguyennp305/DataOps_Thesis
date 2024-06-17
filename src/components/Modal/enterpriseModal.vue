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
      <el-form-item :label="$t('table.title')" prop="title">
        <el-input v-model="dataForm.title" :placeholder="$t('table.title')" />
      </el-form-item>

      <el-form-item :label="$t('table.author')" prop="author">
        <el-input v-model="dataForm.author" :placeholder="$t('table.author')" />
      </el-form-item>

      <el-form-item :label="$t('table.reviewer')" prop="reviewer">
        <el-input v-model="dataForm.reviewer" :placeholder="$t('table.reviewer')" />
      </el-form-item>

      <el-form-item :label="$t('table.status')" prop="status">
        <el-select
          v-model="dataForm.status"
          :placeholder="$t('table.status')"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
      </el-select>
      </el-form-item>

      <el-form-item :label="$t('table.type')" prop="type">
        <el-select
          v-model="dataForm.type"
          :placeholder="$t('table.type')"
          clearable
        >
          <el-option
            v-for="item in calendarTypeOptions"
            :key="item.key"
            :label="item.displayName+'('+item.key+')'"
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
  title: '',
  author: '',
  reviewer: '',
  status: '',
  type: ''
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
        title: [{ required: true, message: 'Title is required', trigger: 'blur' }],
        author: [{ required: true, message: 'Author is required', trigger: 'blur' }],
        reviewer: [{ required: true, message: 'reviewer is required', trigger: 'blur' }],
        status: [{ required: true, message: 'status is required', trigger: 'blur' }],
        type: [{ required: true, message: 'type is required', trigger: 'blur' }]
      },
      calendarTypeOptions: [
        { key: 'CN', displayName: 'China' },
        { key: 'US', displayName: 'USA' },
        { key: 'JP', displayName: 'Japan' },
        { key: 'EU', displayName: 'Eurozone' }
      ],
      statusOptions: [
        { key: 'published', displayName: 'Published' },
        { key: 'draft', displayName: 'Draft' },
        { key: 'deleted', displayName: 'Deleted' }
      ]
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
      console.log('handleModalClose')
      this.dataForm = cloneDeep(defaultDataForm)
      this.clearValidate()
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      console.log('handleModalCancel')
      this.$emit('update:visible', false)
    },
    handleModalConfirm() {
      console.log('handleModalConfirm')
      if (this.isEdit) {
        this.updateEnterprise()
      } else {
        this.createEnterprise()
      }
    },
    updateEnterprise() {
      this.$refs.dataFormRef.validate((valid) => {
        if (valid) {
          this.$emit('update:visible', false)
        } else {
          console.log('Form updateEnterprise is invalid')
        }
      })
    },
    createEnterprise() {
      this.$refs.dataFormRef.validate((valid) => {
        if (valid) {
          this.$emit('update:visible', false)
        } else {
          console.log('Form createEnterprise is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* Add your styles here */
</style>
