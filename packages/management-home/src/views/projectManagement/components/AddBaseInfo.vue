<template>
  <div class="add-base-info">
    <el-form :model="baseInfoForm" label-width="80px">
      <el-form-item label="项目名称">
        <el-input v-model="baseInfoForm.projectName"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { baseInfoForm } from '@/views/projectManagement/components/addProjectBus'

export default defineComponent({
  name: 'addBaseInfo',
  setup () {
    return {
      baseInfoForm
    }
  }
})
</script>

<style lang="scss">
.add-base-info{
  width: 100%;
}
</style>
