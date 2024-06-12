// CommonLabel.vue
<template>
  <div :style="{width: computedWidth}" class="common-label">
    <div class="label">{{ label }}</div>
    <div class="input-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabelingSlot',
  props: {
    label: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '200px'
    }
  },
  computed: {
    computedWidth() {
      return this.width || '200px'
    }
  }
}
</script>

<style lang="scss" scoped>
.common-label {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.common-label .label {
  margin-bottom: 5px;
  font-weight: 400;
  font-size: 14px;
  color: #303133;
}
.input-container {
  display: flex;
  align-items: center;
  width: 100%;
}
.input-container ::v-deep > * {
  width: 100%;
}
</style>
