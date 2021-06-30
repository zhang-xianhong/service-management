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
        <el-select placeholder="请选择服务" v-model="releaseData.serviceInfo.name" clearable :disabled="isEditable">
          <el-option
            v-for="(item, index) in releaseData.serviceList"
            :key="index"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="publisher" :label-width="labelWidth">
        <template v-slot:label>
          <span class="publisher">申请账号</span>
        </template>
        <el-input v-model="releaseData.serviceInfo.publisher" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="发布版本" prop="version" :label-width="labelWidth">
        <el-select
          placeholder="请选择发布版本"
          v-model="releaseData.serviceInfo.version"
          clearable
          :disabled="isEditable"
        >
          <el-option
            v-for="(item, index) in releaseData.versionOptions"
            :key="index"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布说明" prop="publishContent" :label-width="labelWidth">
        <el-input
          v-model="releaseData.serviceInfo.publishContent"
          type="textarea"
          :rows="3"
          placeholder="请输入发布说明，小于512字"
          maxlength="512"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitReleaseForm">提 交</el-button>
      <!-- <el-button type="primary" @click="updateReleaseForm" v-else>编辑</el-button> -->
      <el-button @click="closeReleaseForm">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed, SetupContext, PropType } from 'vue';
import { ElMessage } from 'element-plus';
import { addApply, updateApply } from '@/api/deploy/deploy-apply';
interface ReleaseState {
  disabled: boolean;
  isEdit: boolean;
  id: string;
  serviceList: Array<object>;
  versionOptions: Array<object>;
  types: Array<object>;
  serviceInfo: {
    type: number;
    name: string;
    version: string;
    publisher: string;
    publisherId: string;
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
  setup(props: { visable: boolean; releaseForms: ReleaseState }, ctx: SetupContext) {
    const labelWidth = ref('80px');
    const isVisable: any = computed(() => props.visable);
    const releaseData: Ref<ReleaseState> = computed(() => props.releaseForms);
    console.log('releaseData: ', releaseData);
    const isEditable: Ref<boolean> = computed(() => releaseData.value.isEdit);
    // 表单
    const releaseFormRef: any = ref(null);
    const releaseRules = {
      type: [{ required: true, message: '请选择发布类型', trigger: 'change' }],
      name: [{ required: true, message: '请输入服务名称', trigger: 'change' }],
      // publisher: [{ required: true, message: '请选择申请账号', trigger: 'change' }],
      version: [{ required: true, message: '请选择发布版本', trigger: 'change' }],
      publishContent: [
        { required: true, message: '请输入发布说明', trigger: 'blur' },
        { min: 3, max: 512, message: '长度在 3 到 512 个字符', trigger: 'blur' },
      ],
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
          // 添加
          if (!isEditable.value) {
            const releaseInfo = releaseData.value.serviceInfo;
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
            closeReleaseForm();
          } else {
            // 编辑
            console.log('releaseData.value.id: ', releaseData.value.id);
            const { code } = await updateApply(releaseData.value.id, {
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
    };
  },
});
</script>

<style lang="scss" scoped>
.pop-title {
  font-weight: bolder;
}
.el-select {
  width: 100%;
}
.publisher {
  padding-left: 3px;
}
.dialog-footer {
  margin-top: 35px;
  display: flex;
  justify-content: center;
}
</style>
