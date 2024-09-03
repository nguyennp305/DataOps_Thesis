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
      <el-form-item :label="$t('route.projectName')" prop="name">
        <el-input
          v-model="dataForm.name"
          :placeholder="$t('route.projectName')"
        />
      </el-form-item>

      <el-form-item :label="$t('table.description')" prop="description">
        <el-input
          v-model="dataForm.description"
          :placeholder="$t('table.description')"
        />
      </el-form-item>

      <el-form-item :label="$t('table.startTime')" prop="startDate">
        <el-input
          v-model="dataForm.startDate"
          :placeholder="$t('table.startTime')"
        />
      </el-form-item>

      <el-form-item :label="$t('table.endTime')" prop="endDate">
        <el-input
          v-model="dataForm.endDate"
          :placeholder="$t('table.endTime')"
        />
      </el-form-item>

      <el-form-item :label="$t('route.enterprise')" prop="enterpriseId">
        <el-select
          v-model="dataForm.enterpriseId"
          :placeholder="$t('route.enterprise')"
          filterable
          clearable
        >
          <el-option
            v-for="item in enterpriseTypeOptions"
            :key="item.key"
            :label="item.displayName"
            :value="item.key"
          />
          <pagination
          v-show="totalItemsEnterpriseTypeOptions > 0"
          :total="totalItemsEnterpriseTypeOptions"
          :page.sync="listQueryntEnterpriseTypeOptions.page"
          :limit.sync="listQueryntEnterpriseTypeOptions.size"
          @pagination="fetchDataGetEnterprises"
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
import { getListEnterprise } from '@/api/organization/enterprise'
import Pagination from '@/components/Pagination/index.vue'
const defaultDataForm = {
  name: '',
  description: '',
  enterpriseId: null,
  memberIds: null,
  startDate: null,
  endDate: null,
  id: null
}

export default {
  components: {
    Modal,
    Pagination
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
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        description: [
          {
            required: true,
            message: 'Description is required',
            trigger: 'blur'
          }
        ],
        enterpriseId: [
          {
            required: true,
            message: 'Enterprise is required',
            trigger: 'blur'
          }
        ],
        memberIds: [
          { required: true, message: 'members is required', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: 'StartDate is required', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: 'EndDate is required', trigger: 'blur' }
        ]
      },
      enterpriseTypeOptions: [],
      totalItemsEnterpriseTypeOptions: 0,
      listQueryntEnterpriseTypeOptions: {
        page: 1,
        size: 10
      }
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
  created() {
    this.fetchDataGetEnterprises()
  },
  methods: {
    async fetchDataGetEnterprises() {
      const { data } = await getListEnterprise(
        this.listQueryntEnterpriseTypeOptions
      )
      const newArray = data.items.map((item) => ({
        key: item.id,
        displayName: item.name
      }))
      this.enterpriseTypeOptions = newArray
      this.totalItemsEnterpriseTypeOptions = data.total
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
