<template>
  <el-dialog width="600px" v-model="isVisable" @close="closeReleaseForm">
    <template v-slot:title>
      <span class="pop-title">
        {{ isEditable ? '编辑服务' : '发布服务' }}
      </span>
    </template>
    <el-form :model="releaseData.serviceInfo" :rules="releaseRules" label-position="left" ref="releaseFormRef">
      <el-form-item label="发布类型" prop="type" :label-width="labelWidth">
        <el-select placeholder="请选择类型" v-model="releaseData.serviceInfo.type" clearable :disabled="isEditable">
          <el-option v-for="(item, index) in releaseData.types" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务名称" prop="name" :label-width="labelWidth">
        <el-select
          placeholder="请选择服务"
          v-model="releaseData.serviceInfo.name"
          filterable
          clearable
          :disabled="isEditable"
          @change="changeService"
        >
          <el-option v-for="(item, index) in releaseData.serviceList" :key="index" :value="item.name">
            <service-name :name="item.name"></service-name>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="publisherName" :label-width="labelWidth">
        <template v-slot:label>
          <span class="publisher-name">申请账号</span>
        </template>
        <el-input v-model="releaseData.serviceInfo.publisherName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="发布版本" prop="serviceVersion" :label-width="labelWidth">
        <el-select
          placeholder="请选择发布版本"
          v-model="releaseData.serviceInfo.serviceVersion"
          clearable
          :disabled="isEditable"
        >
          <el-option
            v-for="(item, index) in releaseData.versionOptions"
            :key="index"
            :label="item.label"
            :value="item.version"
            :disabled="item.versionStatus !== 10"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布说明" prop="publishContent" :label-width="labelWidth">
        <el-input
          v-model="releaseData.serviceInfo.publishContent"
          type="textarea"
          :rows="5"
          placeholder="请输入发布说明，不得超过1024个字符"
          :maxlength="2048"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitReleaseForm" :loading="btnLoading">确定</el-button>
      <el-button @click="closeReleaseForm">取消</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed, SetupContext, PropType } from 'vue';
import { ElMessage } from 'element-plus';
import { addApply, updateApply } from '@/api/deploy/deploy-apply';
import ServiceName from '@/views/service-management/components/ServiceName.vue';

interface ReleaseState {
  disabled: boolean;
  isEdit: boolean;
  id: string;
  serviceList: Array<object>;
  versionOptions: Array<object>;
  services: Array<object>;
  types: Array<object>;
  serviceInfo: {
    type: number;
    moduleId: number;
    name: string;
    serviceVersion: string;
    publisher: number;
    publisherName: string;
    publishContent: string;
  };
}
export default defineComponent({
  name: 'AddService',
  props: {
    visable: {
      type: Boolean,
      default: false,
    },
    releaseForms: {
      type: Object as PropType<ReleaseState>,
      default: () => ({}),
    },
  },
  components: {
    ServiceName,
  },
  setup(props: { visable: boolean; releaseForms: ReleaseState }, ctx: SetupContext) {
    const btnLoading = ref(false);
    const labelWidth = ref('80px');
    const isVisable: any = computed(() => props.visable);
    const releaseData: Ref<ReleaseState> = computed(() => props.releaseForms);
    const isEditable: Ref<boolean> = computed(() => releaseData.value.isEdit);
    const releaseFormRef: any = ref(null);
    const releaseRules = {
      type: [{ required: true, message: '请选择发布类型', trigger: 'change' }],
      name: [{ required: true, message: '请输入服务名称', trigger: 'change' }],
      serviceVersion: [{ required: true, message: '请选择发布版本', trigger: 'change' }],
      publisher: [{ type: 'number', message: '请输入数值', trigger: 'change' }],
      publishContent: [
        { required: true, message: '请输入发布说明', trigger: 'blur' },
        { min: 1, max: 2048, message: '长度在 1 到 2048 个字符', trigger: 'blur' },
      ],
    };

    const changeService = () => {
      releaseData.value.serviceInfo.serviceVersion = '';
      const temp: any = ref(
        releaseData.value.services.find((item: any) => item.serviceName === releaseData.value.serviceInfo.name),
      );
      releaseData.value.versionOptions = temp.value.versions.map((item: any) => {
        const label = ref('');
        const statusStr = ['（发版成功）', '（发版中）', '（发版失败）'];
        if (item.versionStatus === 10) {
          label.value = `${item.version}${statusStr[0]}`;
        } else if (item.versionStatus === 1) {
          label.value = `${item.version}${statusStr[1]}`;
        } else if (item.versionStatus === 2) {
          label.value = `${item.version}${statusStr[2]}`;
        }
        return {
          version: item.version,
          label: label.value,
          versionStatus: item.versionStatus,
        };
      });
    };

    const closeReleaseForm = () => {
      isEditable.value = false;
      releaseFormRef.value.resetFields();
      ctx.emit('close');
    };

    // 提交与编辑表单信息
    const submitReleaseForm = async () => {
      releaseFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
          btnLoading.value = true;
          if (!isEditable.value) {
            const releaseInfo = releaseData.value.serviceInfo;
            try {
              const { code } = await addApply(releaseInfo);
              if (code === 0) {
                ElMessage({
                  type: 'success',
                  message: '添加成功',
                });
                ctx.emit('getTableInfo');
              } else {
                ElMessage({
                  type: 'error',
                  message: '添加失败',
                });
              }
              btnLoading.value = false;
              closeReleaseForm();
            } catch (e) {
              console.log(e);
              btnLoading.value = false;
            }
          } else {
            try {
              const { code } = await updateApply(Number(releaseData.value.id), {
                ...releaseData.value.serviceInfo,
              });
              if (code === 0) {
                ElMessage({
                  type: 'success',
                  message: '更新成功',
                });
                ctx.emit('getTableInfo');
              } else {
                ElMessage({
                  type: 'error',
                  message: '编辑失败',
                });
              }
              closeReleaseForm();
              btnLoading.value = false;
            } catch (e) {
              console.log(e);
              btnLoading.value = false;
            }
          }
        }
      });
    };

    return {
      labelWidth,
      releaseRules,
      releaseData,
      releaseFormRef,
      isVisable,
      isEditable,
      closeReleaseForm,
      submitReleaseForm,
      changeService,
      btnLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.pop-title {
  font-weight: bolder;
  font-size: 16px;
}
.el-select {
  width: 100%;
}
.publisher-name {
  padding-left: 4px;
}
.dialog-footer {
  margin-top: 35px;
  display: flex;
  justify-content: center;
}
</style>
