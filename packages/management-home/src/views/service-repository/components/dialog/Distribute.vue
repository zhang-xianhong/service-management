<template>
  <el-dialog title="下发服务" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="选择项目" prop="project">
          <el-select v-model="form.project" placeholder="请选择项目" style="width: 100%"> </el-select>
        </el-form-item>
        <el-form-item label="共享方式" prop="shareType">
          <el-radio-group v-model="form.shareType" name="shareType" @change="handleClearValidate">
            <el-radio-button :label="1">克隆</el-radio-button>
            <el-radio-button :label="2">引用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否重命名" prop="rename" v-if="form.shareType === 1">
          <el-radio-group v-model="form.rename" name="rename" @change="handleClearValidate">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.shareType === 1 && form.rename === 1">
          <el-form-item label="英文服务名" prop="serviceName">
            <el-input v-model.trim="form.serviceName" placeholder="请输入英文服务名" />
          </el-form-item>
          <el-form-item label="中文服务名" prop="serviceNameZh">
            <el-input v-model.trim="form.serviceNameZh" placeholder="请输入中文服务名" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="英文服务名">
            <span>{{ form.serviceName }}</span>
          </el-form-item>
          <el-form-item label="中文服务名">
            <span>{{ form.serviceNameZh }}</span>
          </el-form-item>
        </template>
        <el-form-item label="服务依赖">
          <el-button type="text" @click="handleViewServiceDepend">查看详情</el-button>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
    <service-depend-dialog ref="serviceDependDialog" />
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import ServiceDependDialog from './Depend.vue';
export default defineComponent({
  name: 'DistributeDialog',
  components: {
    ServiceDependDialog,
  },
  setup() {
    const visible = ref(false);
    const submitting = ref(false);
    const formRef = ref(null as any);
    const serviceDependDialog = ref(null as any);
    const form = reactive({
      project: '',
      shareType: 1,
      rename: 0,
      serviceName: '',
      serviceNameZh: '',
    });
    const formRules = reactive({
      project: [{ required: true, message: '请选择项目', trigger: 'blur' }],
      serviceName: [
        { required: true, message: '请输入服务英文名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
      ],
      serviceNameZh: [
        { required: true, message: '请输入服务中文名称', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
      ],
    });
    const handleClose = () => {
      visible.value = false;
    };
    const handleOpen = () => {
      visible.value = true;
    };
    const handleSubmit = async () => {
      try {
        submitting.value = true;
        const valid = await formRef.value.validate();
        if (!valid) {
          return;
        }
        console.log(form);
        handleClose();
      } catch (e) {
        console.log(e);
      } finally {
        submitting.value = false;
      }
    };
    const handleClearValidate = () => {
      formRef.value.clearValidate(['serviceName', 'serviceNameZh']);
    };
    const handleViewServiceDepend = () => {
      serviceDependDialog.value.handleOpen();
    };
    return {
      visible,
      submitting,
      form,
      formRules,
      formRef,
      serviceDependDialog,
      handleOpen,
      handleClose,
      handleSubmit,
      handleClearValidate,
      handleViewServiceDepend,
    };
  },
});
</script>
<style lang="scss" scoped>
.dialog-body {
  ::v-deep .el-input__inner {
    width: 100%;
  }
}
</style>
