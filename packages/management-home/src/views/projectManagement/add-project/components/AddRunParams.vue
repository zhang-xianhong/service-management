<template>
  <div class="add-run-params">
    <el-form :model="runParamsForm" label-position="top">
      <el-form-item label="服务可使用最大Java堆内存">
        <el-input v-model="runParamsForm.maxSize"></el-input>
      </el-form-item>
      <el-form-item label="SyncService ThreadPool Size">
        <el-input v-model="runParamsForm.syncService"></el-input>
      </el-form-item>
      <el-form-item label="BaseController ThreadPool Size">
        <el-input v-model="runParamsForm.baseController"></el-input>
      </el-form-item>
      <el-form-item label="RabbitQueueService ThreadPool Size">
        <el-input v-model="runParamsForm.rabbitQueueService"></el-input>
      </el-form-item>
      <el-form-item label="ESSyncService ThreadPool Size">
        <el-input v-model="runParamsForm.SeSyncService"></el-input>
      </el-form-item>
      <el-form-item label="JPAInsertOrUpdateListener ThreadPool Size">
        <el-input v-model="runParamsForm.jPAInsertOrUpdateListener"></el-input>
      </el-form-item>
      <el-form-item label="SvcBaseService ThreadPool Size">
        <el-input v-model="runParamsForm.svcBaseService"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { runParamsForm } from '@/views/projectManagement/add-project/components/addProjectBus'

export default defineComponent({
  name: 'AddRunParams',
  setup () {
    return {
      runParamsForm
    }
  }
})
</script>
s
<style lang="scss">
.add-run-params{
  width: 40%;
  padding-left: 40px;
}
</style>
