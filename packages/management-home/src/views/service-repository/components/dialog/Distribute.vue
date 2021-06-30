<template>
  <el-dialog title="下发服务" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="选择项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="请选择项目" filterable style="width: 100%">
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="共享方式" prop="platformShareType">
          <el-radio-group v-model="form.platformShareType" name="platformShareType" @change="handleClearValidate">
            <el-radio-button :label="1">克隆</el-radio-button>
            <el-radio-button :label="2">引用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否重命名" prop="rename" v-if="form.platformShareType === 1">
          <el-radio-group v-model="form.rename" name="rename" @change="handleClearValidate">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="`${useNewName ? '原服务英文名' : '服务英文名'}`">
          <span v-if="sourceData">{{ sourceData.serviceName }}</span>
        </el-form-item>
        <el-form-item label="新服务英文名" prop="serviceName" v-if="useNewName">
          <el-input v-model.trim="form.serviceName" placeholder="请输入英文服务名" />
        </el-form-item>
        <el-form-item :label="`${useNewName ? '原服务中文名' : '服务中文名'}`">
          <span v-if="sourceData && sourceData.snapshotInfo">{{ sourceData.snapshotInfo.serviceNameZh }}</span>
        </el-form-item>
        <el-form-item label="新服务中文名" prop="serviceNameZh" v-if="useNewName">
          <el-input v-model.trim="form.serviceNameZh" placeholder="请输入中文服务名" />
        </el-form-item>
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
import { defineComponent, ref, reactive, computed } from 'vue';
import ServiceDependDialog from './Depend.vue';
import _ from 'lodash';
import { ElMessage } from 'element-plus';
import { distributeRepository } from '@/api/repository';
import { getAllProjectList } from '@/api/project';

export default defineComponent({
  name: 'DistributeDialog',
  components: {
    ServiceDependDialog,
  },
  props: {
    refresh: {
      type: Function,
      default: _.noop,
    },
  },
  setup(props) {
    const visible = ref(false);
    const submitting = ref(false);
    const formRef = ref(null as any);
    const serviceDependDialog = ref(null as any);
    const sourceData = ref(null as any);
    const projectList = ref([] as any[]);
    const form = reactive({
      projectId: '',
      platformShareType: 1,
      rename: 0,
      serviceName: '',
      serviceNameZh: '',
    });
    const formRules = reactive({
      projectId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
      serviceName: [
        { required: true, message: '请输入服务英文名称', trigger: 'blur' },
        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
      ],
      serviceNameZh: [
        { required: true, message: '请输入服务中文名称', trigger: 'blur' },
        { min: 2, max: 64, message: '长度在 2 到 64 个字符', trigger: 'blur' },
      ],
    });
    const useNewName = computed(() => form.platformShareType === 1 && form.rename === 1);
    // 获取项目列表
    const fetchProjectList = async () => {
      const { data } = await getAllProjectList({});
      projectList.value = data;
      console.log(data);
    };
    const handleClose = () => {
      visible.value = false;
      formRef.value.resetFields();
    };
    const handleOpen = (row: any) => {
      visible.value = true;
      sourceData.value = row;
      fetchProjectList();
    };
    const handleSubmit = async () => {
      try {
        submitting.value = true;
        const valid = await formRef.value.validate();
        if (!valid) {
          return;
        }
        const postData: any = {
          platformShareType: form.platformShareType,
          projectId: form.projectId,
          repositoryId: sourceData.value.id,
        };
        // 需要重命名
        if (form.platformShareType && form.rename === 1) {
          postData.serviceName = form.serviceName;
          postData.serviceNameZh = form.serviceNameZh;
        }
        await distributeRepository(postData);
        ElMessage.success('服务下发成功');
        props.refresh && props.refresh();
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
      sourceData,
      projectList,
      useNewName,
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
