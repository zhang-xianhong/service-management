<template>
  <div class="add-openset">
    <el-form :model="openSetForm" label-width="140px">
      <el-form-item label="开放微对象">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          readonly
          v-model="openSetForm.openObject">
        </el-input>
      </el-form-item>
      <el-form-item label="开放微服务">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          readonly
          v-model="openSetForm.openService">
        </el-input>
      </el-form-item>
      <el-form-item label="开放微模块">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          readonly
          v-model="openSetForm.openModel">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { openSetForm } from '@/views/projectManagement/components/addProjectBus'

export default defineComponent({
  name: 'AddOpenSet',
  setup () {
    return {
      openSetForm
    }
  }
})
</script>

<style lang="scss">
.add-openset{
  width: 40%;
}
</style>
