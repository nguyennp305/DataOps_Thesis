<template>
  <div>
    <div style="margin-bottom:15px;">
      {{ $t('permission.roles') }}： {{ roles }}
    </div>
    {{ $t('permission.switchRoles') }}：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'SwitchRoles'
})
export default class SwitchRoles extends Vue {
  // State
  switchRoles: string = UserModule.roles[0] || 'admin'

  // Computed property to get roles
  get roles() {
    return UserModule.roles
  }

  // Watcher for switchRoles
  @Watch('switchRoles')
  onSwitchRolesChange(newValue: string) {
    UserModule.ChangeRoles(newValue).then(() => {
      this.$emit('change')
    })
  }
}
</script>
