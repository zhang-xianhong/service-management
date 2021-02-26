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
export default defineComponent({
  name: 'Args',
  setup() {
    const argsForm = ref({
      memory: '',
      syncSvcPoolSize: '',
      baseCtlPoolSize: '',
      rabitPoolSize: '',
      esSvcPoolSize: '',
      jpaPoolSize: '',
      svcBasePoolSize: '',
    });

    const rules = {
      memory: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
      syncSvcPoolSize: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
      baseCtlPoolSize: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
      rabitPoolSize: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
      esSvcPoolSize: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
      jpaPoolSize: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
      svcBasePoolSize: [{ required: true, message: '请输入服务描述', trigger: 'blur' }],
    };

    return {
      argsForm,
      rules,
    };
  },
});
</script>
