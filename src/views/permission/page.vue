<template>
  <div class="app-container">
    <!-- <switch-roles @change="handleRolesChange" /> -->
    <div style="margin-bottom:15px;">
      {{ $t('permission.roles') }}： {{ roles }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
// import SwitchRoles from './components/SwitchRoles.vue'

@Component({
  name: 'PagePermission',
  components: {
    // SwitchRoles
  }
})
export default class extends Vue {
  // private handleRolesChange() {
  //   this.$router.push({ path: '/permission/index?' + +new Date() }).catch(err => {
  //     console.warn(err)
  //   })
  // }
  get roles() {
    console.log('UserModule.roles', UserModule)
    return UserModule.roles
  }
}
</script>
