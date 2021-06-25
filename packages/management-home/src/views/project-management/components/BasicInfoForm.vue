<template>
  <div>
    <el-form inline label-width="100px" :model="formData" :rules="rules">
      <el-form-item label="项目英文名" prop="name">
        <div class="form-content">{{ detailInfo.name }}</div>
      </el-form-item>
      <el-form-item label="项目中文名" prop="description">
        <div v-if="!editMode" class="form-content">{{ detailInfo.description }}</div>
        <el-input v-else class="form-content" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="代码模板" prop="templateId">
        <div v-if="!editMode" class="form-content">{{ detailInfo.templateName }}</div>
        <el-select class="form-content" v-if="editMode" v-model="formData.templateId" placeholder="请选择代码模板">
          <el-option
            v-for="template in templates"
            :key="template.id"
            :label="template.name"
            :value="template.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负 责 人">
        <div v-if="!editMode" class="form-content">{{ ownersName }}</div>
        <owner-select
          v-else
          class="form-content"
          :value="formData.owners"
          :options="formData.ownerUsers"
          @change="selectOwners"
        ></owner-select>
      </el-form-item>
      <el-form-item label="项目级别" prop="level">
        <div v-if="!editMode" class="form-content">{{ getLabel(detailInfo.level)(projectLevels) }}</div>
        <el-radio-group class="form-content" v-if="editMode" v-model="formData.level">
          <el-radio v-for="level in projectLevels" :key="level.value" :label="level.value">{{ level.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目简介" prop="remark">
        <div v-if="!editMode" class="form-content multiline">{{ detailInfo.remark }}</div>
        <el-input
          class="form-content"
          type="textarea"
          :rows="4"
          v-if="editMode"
          v-model="formData.remark"
          placeholder="请输入中文项目简介，最多支持512个字"
        ></el-input>
      </el-form-item>
      <el-form-item label="许可类型" prop="license">
        <div v-if="!editMode" class="form-content">{{ getLabel(detailInfo.license)(licenseTypes) }}</div>
        <el-radio-group class="form-content" v-if="editMode" v-model="formData.license">
          <el-radio v-for="license in licenseTypes" :key="license.value" :label="license.value">{{
            license.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目状态" prop="status">
        <div v-if="!editMode" class="form-content">{{ getLabel(detailInfo.status)(statusOptions) }}</div>
        <el-radio-group class="form-content" v-if="editMode" v-model="formData.status">
          <el-radio v-for="status in statusOptions" :key="status.value" :label="status.value">{{
            status.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="text-align: center" v-if="editMode">
      <el-button @click="save" type="primary">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash/fp';
import { reactive, ref, Ref, watchEffect, watch } from 'vue';
import { updateProject } from '@/api/project/project';
import { getAllTemplates } from '@/api/settings/templates';
import OwnerSelect from '@/components/owners-select/Index.vue';
import { ElMessage } from 'element-plus';
// import Message from 'element-plus/es/el-message';

export default {
  name: 'BasicInfoForm',
  props: {
    editMode: {
      required: true,
    },
    projectDetail: {
      required: true,
    },
  },
  components: {
    OwnerSelect,
  },
  setup(props: any, context: any) {
    const detailInfo = reactive({
      name: '',
      description: '',
      templateId: '',
      owner: '',
      owners: [],
      ownerUsers: [],
      level: 0,
      remark: '',
      status: 0,
      license: 1,
    });
    const formData = reactive({
      name: '',
      description: '',
      templateId: '',
      owner: '',
      owners: [],
      ownerUsers: [],
      level: 0,
      remark: '',
      status: 0,
      license: 1,
    });
    let projectDetail = {};
    watchEffect(() => {
      projectDetail = props.projectDetail;
      Object.assign(detailInfo, projectDetail);
      Object.assign(formData, projectDetail);
    });
    const projectLevels = [
      {
        value: 1,
        label: '通用级',
      },
      {
        value: 2,
        label: '行业级',
      },
      {
        value: 3,
        label: '租户级',
      },
    ];
    const licenseTypes = [
      {
        value: 1,
        label: '租户',
      },
      {
        value: 0,
        label: '永久',
      },
    ];
    const statusOptions = [
      {
        value: 1,
        label: '启用',
      },
      {
        value: 0,
        label: '冻结',
      },
    ];
    const templates = ref([]) as Ref<Array<Record<string, string>>>;
    const getLabel = (id: any) => (collection: Array<any>) =>
      _.flow(_.find({ value: id }), (item: any) => item || { label: '' }, _.property('label'))(collection);

    // 初始化模板信息
    const getTemplates = async () => {
      const { code, data } = await getAllTemplates();
      if (code === 0) {
        templates.value = data;
      }
    };
    getTemplates();

    // 负责人名称
    const ownersName = ref('');

    watch(
      () => formData.owners,
      (newValue: Array<{ userId: number }>) => {
        // newValue.forEach((item: { userId: number }) => {
        //   const target: any = formData.ownerUsers.filter((user: any) => user.id === item.userId)[0] || {};
        //   ownersName.value = ownersName.value === '' ? target.displayName : `${ownersName.value},${target.displayName}`;
        // });
        let newValueStr = '';
        if (newValue.length === 0) {
          return (ownersName.value = newValueStr);
        }
        formData.ownerUsers.forEach((element: any) => {
          newValueStr += `${element.displayName},`;
        });
        ownersName.value = newValueStr.slice(0, newValueStr.length - 1);
      },
    );

    // 负责人选择
    const selectOwners = (value: any) => {
      formData.owner = value.owner;
      formData.owners = value.owners;
      formData.ownerUsers = value.ownerUsers;
    };

    // 表单操作
    const save = async () => {
      if (formData.remark.length > 512) {
        return false;
      }
      const ownersArr = ownersName.value.split(',');
      if (ownersArr.length > 10) {
        return ElMessage.warning('最多支持10个负责人');
      }
      const item = { ...formData };
      item.owner = item.owners.map((x: any) => x.userId).join(',');
      const { code } = await updateProject((projectDetail as any).id, item);
      if (code === 0) {
        Object.assign(detailInfo, formData);
        context.emit('submit');
      }
    };
    const cancel = () => {
      context.emit('cancel');
      Object.assign(formData, detailInfo);
    };

    // 校验规则
    const rules = {
      name: [{ required: true, message: '请输入项目英文名', trigger: 'blur' }],
      description: [{ required: true, message: '请输入项目中文名', trigger: 'blur' }],
      templateId: [{ required: true, message: '请选择代码模板', trigger: 'blur' }],
      level: [{ required: true, message: '请选择项目级别', trigger: 'blur' }],
      status: [{ required: true, message: '请选择项目状态', trigger: 'blur' }],
      remark: [{ max: 512, message: '最多支持512个字符', trigger: 'blur' }],
    };
    return {
      detailInfo,
      formData,
      ownersName,
      selectOwners,
      getLabel,
      projectLevels,
      licenseTypes,
      statusOptions,
      templates,
      save,
      cancel,
      rules,
    };
  },
};
</script>

<style></style>
