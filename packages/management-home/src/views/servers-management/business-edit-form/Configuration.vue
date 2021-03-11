<template>
  <div>
    <el-form :model="argsForm" label-position="top">
      <el-form-item label="server.undertow.io-threads" prop="undertowIoThreads">
        <el-input v-model.number="confForm.undertowIoThreads"></el-input>
      </el-form-item>
      <el-form-item label="server.tomcat.max-threads" prop="tomcatMaxThreads">
        <el-input v-model.number="confForm.tomcatMaxThreads"></el-input>
      </el-form-item>
      <el-form-item label="server.undertow.worker-threads" prop="undertowWorkerThreads">
        <el-input v-model.number="confForm.undertowWorkerThreads"></el-input>
      </el-form-item>
      <el-form-item label="server.tomcat.max-connections" prop="tomcatMaxConn">
        <el-input v-model.number="confForm.tomcatMaxConn"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
export default defineComponent({
  name: 'BusinessEditConf',
  setup() {
    const confForm = ref({
      undertowIoThreads: 5,
      tomcatMaxThreads: 5,
      undertowWorkerThreads: 5,
      tomcatMaxConn: 5,
    });

    return {
      confForm,
    };
  },
});
</script>
