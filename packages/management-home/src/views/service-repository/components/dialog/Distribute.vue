<template>
  <el-dialog title="下发服务" v-model="visible" width="640px" :before-close="handleClose">
    <div class="dialog-body">
      <el-form :model="form" ref="formRef" label-width="100px">
        <el-form-item
          label="选择项目"
          prop="projectId"
          key="projectId"
          :rules="[{ required: true, message: '请选择项目', trigger: 'blur' }]"
        >
          <el-select
            v-model="form.projectId"
            placeholder="请选择项目"
            filterable
            style="width: 100%"
            @change="handleProjectChange"
          >
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="共享方式" prop="platformShareType" key="platformShareType">
          <el-radio-group v-model="form.platformShareType" name="platformShareType" @change="handleClearValidate">
            <el-radio-button :label="2">克隆</el-radio-button>
            <el-radio-button :label="1">引用</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="是否重命名" prop="rename" key="rename" v-if="form.platformShareType === 2">
          <el-radio-group v-model="form.rename" name="rename" @change="handleClearValidate">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item :label="`${useNewName ? '原服务英文名' : '服务英文名'}`">
          <service-name :name="sourceData.serviceName" v-if="sourceData" />
        </el-form-item>
        <el-form-item
          label="新服务英文名"
          prop="serviceName"
          key="serviceName"
          v-show="useNewName"
          :rules="[
            { required: true, message: '请输入服务名称', trigger: 'blur' },
            { min: 1, max: 32, message: '最大不能超过 32 个字符', trigger: 'blur' },
            {
              validator: validatorEnName,
              message: '仅支持小写英文、数字、中划线，不能以中划线开头和结尾',
              trigger: 'blur',
            },
          ]"
        >
          <el-tooltip effect="dark" :visible-arrow="false" :content="newServiceFullName" placement="top-start">
            <el-input v-model.trim="form.serviceName" placeholder="请输入英文服务名" maxlength="32" />
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="`${useNewName ? '原服务中文名' : '服务中文名'}`">
          <span v-if="sourceData && sourceData.snapshotInfo">{{ sourceData.snapshotInfo.serviceNameZh }}</span>
        </el-form-item>
        <el-form-item
          label="新服务中文名"
          prop="serviceNameZh"
          key="serviceNameZh"
          v-show="useNewName"
          :rules="[
            { required: true, message: '请输入服务描述', trigger: 'blur' },
            { min: 1, max: 60, message: '最大不能超过 60 个字符', trigger: 'blur' },
          ]"
        >
          <el-input v-model.trim="form.serviceNameZh" placeholder="请输入中文服务名" maxlength="60" />
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
import { getTenantDetail } from '@/api/tenant';
import { getServiceShowName } from '@/views/service-management/components/utils';
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
    const currentProject = ref(null as any);
    const tenant = ref(null as any);
    const form = reactive({
      projectId: '',
      platformShareType: 2,
      rename: 1,
      serviceName: '',
      serviceNameZh: '',
    });
    const fetchTenant = async () => {
      const { data } = await getTenantDetail();
      tenant.value = data;
    };

    const useNewName = computed(() => form.platformShareType === 2 && form.rename === 1);
    // 获取项目列表
    const fetchProjectList = async () => {
      const { data } = await getAllProjectList({});
      // 要过滤启用的状态
      projectList.value = data.filter((item: any) => item.status === 1);
    };
    const handleClose = () => {
      visible.value = false;
      formRef.value.resetFields();
    };
    const handleOpen = (row: any) => {
      visible.value = true;
      sourceData.value = row;
      submitting.value = false;
      form.serviceName = getServiceShowName(row.serviceName);
      form.serviceNameZh = row.snapshotInfo.serviceNameZh;
      fetchTenant();
      fetchProjectList();
    };
    const handleSubmit = async () => {
      try {
        submitting.value = true;
        const valid = await formRef.value.validate();
        if (!valid) {
          console.log(222);
          return;
        }
        const postData: any = {
          platformShareType: form.platformShareType,
          projectId: form.projectId,
          repositoryId: sourceData.value.id,
        };
        // 需要重命名
        if (form.platformShareType && form.rename === 1) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          postData.serviceName = newServiceFullName.value;
          postData.serviceNameZh = form.serviceNameZh;
        } else {
          postData.serviceName = sourceData.value.serviceName;
          postData.serviceNameZh = sourceData.value.snapshotInfo.serviceNameZh;
        }
        await distributeRepository(postData);
        ElMessage.success('服务下发成功');
        props.refresh && props.refresh();
        handleClose();
      } catch (e) {
        console.log(111, e);
      } finally {
        submitting.value = false;
      }
    };
    const handleClearValidate = () => {
      formRef.value.clearValidate(['serviceName', 'serviceNameZh']);
    };
    const handleViewServiceDepend = () => {
      serviceDependDialog.value.handleOpen(sourceData.value);
    };

    // 新名全名
    const newServiceFullName = computed(() => {
      if (useNewName.value && currentProject.value) {
        return `public.${tenant.value.tenantEngAbbr}.${currentProject.value.name}.${form.serviceName}`;
      }
      return '请选择项目';
    });
    const handleProjectChange = (projectId: number) => {
      const project = projectList.value.find((item) => item.id === projectId);
      currentProject.value = project;
    };

    const validatorEnName = (rule: any, value: any, callback: any) => {
      const reg = /^(?!-)(?!.*-$)[a-z0-9-]+$/;
      if (!reg.test(value)) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      visible,
      submitting,
      form,
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
      tenant,
      newServiceFullName,
      handleProjectChange,
      validatorEnName,
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
