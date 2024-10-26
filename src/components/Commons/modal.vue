<template>
  <el-dialog
    :title="title"
    :visible.sync="localVisible"
    :width="width"
    :center="center"
    @close="handleClose"
  >
    <slot></slot>
    <template v-slot:footer>
      <el-button @click="handleCancel">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="confirmDisabled">{{ $t('table.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    title: {
      type: String,
      default: 'Modal Title'
    },
    width: {
      type: String,
      default: '50%'
    },
    visible: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    confirmDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localVisible: this.visible
    }
  },
  watch: {
    visible(newValue) {
      this.localVisible = newValue
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('cancel')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss">
/* Add your styles here */
.el-dialog {
  min-width: 800px !important;
  .el-dialog__header {
    font-weight: bold;
  }
}
</style>
