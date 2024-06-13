<template>
  <modal
    :title="isEdit ? $t('route.edit') : $t('route.add')"
    :visible.sync="visible"
    @close="handleModalClose"
    @cancel="handleModalCancel"
    @confirm="handleModalConfirm"
  >
    <p>Modal Content Here</p>
  </modal>
</template>

<script>
import Modal from '@/components/Commons/modal.vue'

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
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleModalClose() {
      console.log('handleModalClose')
      this.$emit('update:visible', false)
    },
    handleModalCancel() {
      console.log('handleModalCancel')
      this.$emit('update:visible', false)
    },
    handleModalConfirm() {
      console.log('handleModalConfirm')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
/* Add your styles here */
</style>
