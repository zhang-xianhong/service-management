<template>
  <div>
    <el-form :model="argsForm" label-position="top" :rules="rules">
      <el-form-item label="Memroy" prop="memory">
        <el-input v-model="argsForm.memory"></el-input>
      </el-form-item>
      <el-form-item label="SyncService ThreadPool Size" prop="syncSvcPoolSize">
        <el-input v-model="argsForm.syncSvcPoolSize"></el-input>
      </el-form-item>
      <el-form-item label="BaseController ThreadPool Size" prop="baseCtlPoolSize">
        <el-input v-model="argsForm.baseCtlPoolSize"></el-input>
      </el-form-item>
      <el-form-item label="RabbitQueueService ThreadPool Size" prop="rabitPoolSize">
        <el-input v-model="argsForm.rabitPoolSize"></el-input>
      </el-form-item>
      <el-form-item label="ESSyncService ThreadPool Size" prop="esSvcPoolSize">
        <el-input v-model="argsForm.esSvcPoolSize"></el-input>
      </el-form-item>
      <el-form-item label="JPAInsertOrUpdateListener ThreadPool Size" prop="jpaPoolSize">
        <el-input v-model="argsForm.jpaPoolSize"></el-input>
      </el-form-item>
      <el-form-item label="SvcBaseService ThreadPool Size" prop="svcBasePoolSize">
        <el-input v-model="argsForm.svcBasePoolSize"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { argsRules } from './form-config';
export default defineComponent({
  name: 'BusinessEditArgs',
  setup() {
    const argsForm = ref({
      memory: '120m',
      syncSvcPoolSize: '5',
      baseCtlPoolSize: '5',
      rabitPoolSize: '5',
      esSvcPoolSize: '5',
      jpaPoolSize: '5',
      svcBasePoolSize: '5',
    });

    const rules = argsRules;

    return {
      argsForm,
      rules,
    };
  },
});
</script>
