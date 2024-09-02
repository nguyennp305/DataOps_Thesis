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
      <el-form-item :label="$t('login.email')" prop="email">
        <el-input v-model="dataForm.email" :placeholder="$t('login.email')" />
      </el-form-item>

      <el-form-item :label="$t('route.enterpriseName')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.enterpriseName')"
        />
      </el-form-item>

      <el-form-item :label="$t('table.description')" prop="description">
        <el-input
          v-model="dataForm.description"
          :placeholder="$t('table.description')"
        />
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'
import { cloneDeep } from 'lodash'
import {
  createEnterprise,
  updateEnterpriseById
} from '@/api/organization/enterprise'

const defaultDataForm = {
  name: '',
  email: '',
  description: '',
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
          {
            required: true,
            message: 'Name Enterprise is required',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: 'Email Enterprise is required',
            trigger: 'blur'
          }
        ]
      },
      rolesTypeOptions: []
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
      this.$emit('update:visible', false)
    },
    handleModalConfirm() {
      if (this.isEdit) {
        this.updateEnterpriseModal()
      } else {
        this.createEnterpriseModal()
      }
    },
    updateEnterpriseModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          await updateEnterpriseById(this.dataForm)
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          this.$emit('update:reload-table')
          this.$emit('update:visible', false)
        } else {
          console.log('Form update is invalid')
        }
      })
    },
    createEnterpriseModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          await createEnterprise(this.dataForm)

          this.$notify({
            title: 'Success',
            message: 'Create Successfully',
            type: 'success',
            duration: 2000
          })
          this.$emit('update:reload-table')
          this.$emit('update:visible', false)
        } else {
          console.log('Form create is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* Add your styles here */
</style>
