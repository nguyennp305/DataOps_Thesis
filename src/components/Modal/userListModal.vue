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

      <el-form-item :label="$t('login.username')" prop="username">
        <el-input
          v-model="dataForm.username"
          :placeholder="$t('login.username')"
        />
      </el-form-item>

      <el-form-item :label="$t('login.password')" prop="password">
        <el-input
          v-model="dataForm.password"
          :placeholder="$t('login.password')"
          :disabled="isEdit"
        />
      </el-form-item>

      <el-form-item :label="$t('route.rolePermission')" prop="roleId">
        <el-select
          v-model="dataForm.roleId"
          :placeholder="$t('route.rolePermission')"
          clearable
        >
          <el-option
            v-for="item in rolesTypeOptions"
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
import {
  getAllRoles,
  createUser,
  updateUserById
} from '@/api/user-management/user-list'

const defaultDataForm = {
  username: '',
  email: '',
  password: '',
  roleId: null,
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
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' }
        ],
        username: [
          { required: true, message: 'Username is required', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: 'Role is required', trigger: 'blur' }
        ]
      },
      rolesTypeOptions: []
    }
  },
  watch: {
    isEdit: {
      handler(newVal) {
        if (newVal) {
          this.rules = {
            email: [
              { required: true, message: 'Email is required', trigger: 'blur' }
            ],
            username: [
              {
                required: true,
                message: 'Username is required',
                trigger: 'blur'
              }
            ],
            roleId: [
              { required: true, message: 'Role is required', trigger: 'blur' }
            ]
          }
        }
      },
      deep: true
    },
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
  created() {
    this.fetchDataGetAllRoles()
  },
  methods: {
    async fetchDataGetAllRoles() {
      const { data } = await getAllRoles()
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      this.rolesTypeOptions = newArray
    },
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
        this.updateUserModal()
      } else {
        this.createUserModal()
      }
    },
    updateUserModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          await updateUserById(this.dataForm)
            .then((res) => {
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
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
          console.log('Form updateEnterprise is invalid')
        }
      })
    },
    createUserModal() {
      this.$refs.dataFormRef.validate(async(valid) => {
        if (valid) {
          await createUser(this.dataForm)
            .then((res) => {
              this.$notify({
                title: 'Success',
                message: 'Create Successfully',
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
