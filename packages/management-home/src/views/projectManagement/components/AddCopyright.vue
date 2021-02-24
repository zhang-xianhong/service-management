<template>
  <div class="copyright">
    <el-form :model="copyrightForm" label-position="top">
      <el-form-item label="版权信息">
        <el-input type="textarea" v-model="copyrightForm.message"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { copyrightForm } from './addProjectBus'

export default defineComponent({
  name: 'AddCopyright',
  setup () {
    return {
      copyrightForm
    }
  }
})
</script>

<style lang="scss">
.copyright{
  width: 40%;
  padding-left: 40px;
}
</style>
