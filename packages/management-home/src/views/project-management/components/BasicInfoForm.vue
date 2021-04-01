<template>
  <div>
    <el-form inline label-width="80px" :model="formData">
      <el-form-item label="项目名称">
        <div v-if="!editMode" class="form-content">
          {{ detailInfo.name }}
        </div>
        <el-input
          class="form-content"
          v-if="editMode"
          v-model="formData.name"
          placeholder="请输入项目英文名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目描述">
        <div v-if="!editMode" class="form-content">
          {{ detailInfo.description }}
        </div>
        <el-input
          class="form-content"
          v-if="editMode"
          v-model="formData.description"
          placeholder="请输入中文项目描述，最多支持40个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="代码模板">
        <div v-if="!editMode" class="form-content">
          {{ detailInfo.template }}
        </div>
        <el-select
          class="form-content"
          v-if="editMode"
          v-model="formData.template"
          placeholder="请选择代码模板"
        ></el-select>
      </el-form-item>
      <el-form-item label="负 责 人">
        <div v-if="!editMode" class="form-content">
          {{ detailInfo.owner }}
        </div>
        <el-input
          class="form-content"
          v-if="editMode"
          v-model="formData.owner"
          placeholder="请添加单个或多个项目负责人"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目级别">
        <div v-if="!editMode" class="form-content">
          {{ getLabel(detailInfo.level)(projectLevels) }}
        </div>
        <el-radio-group class="form-content" v-if="editMode" v-model="formData.level">
          <el-radio v-for="level in projectLevels" :key="level.value" :label="level.value">{{ level.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目简介">
        <div v-if="!editMode" class="form-content multiline">
          {{ detailInfo.remark }}
        </div>
        <el-input
          class="form-content"
          type="textarea"
          :rows="4"
          v-if="editMode"
          v-model="formData.remark"
          placeholder="请输入中文项目简介，最多支持255个字"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目状态">
        <div v-if="!editMode" class="form-content">
          {{ getLabel(detailInfo.status)(statusOptions) }}
        </div>
        <el-radio-group class="form-content" v-if="editMode" v-model="formData.status">
          <el-radio v-for="status in statusOptions" :key="status.value" :label="status.value">{{
            status.label
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="text-align: center" v-if="editMode">
      <el-button @click="save" type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash/fp';
import { reactive } from 'vue';
import { getProjectDetail } from '@/api/project/project';
export default {
  name: 'BasicInfoForm',
  props: {
    id: {
      required: true,
    },
    editMode: {
      required: true,
    },
  },
  setup(props: any, context: any) {
    const detailInfo = reactive({
      name: '',
      description: '',
      template: '',
      owner: '',
      level: '',
      remark: '',
      status: '',
    });
    const formData = reactive({
      name: '',
      description: '',
      template: '',
      owner: '',
      level: '',
      remark: '',
      status: '',
    });
    const projectLevels = [
      {
        value: 0,
        label: '通用级',
      },
      {
        value: 1,
        label: '行业级',
      },
      {
        value: 2,
        label: '租户级',
      },
    ];
    const statusOptions = [
      {
        value: 0,
        label: '启用',
      },
      {
        value: 1,
        label: '冻结',
      },
    ];
    const getLabel = (id: any) => (collection: Array<any>) =>
      _.flow(_.find({ value: id }), _.property('label'))(collection);

    // 初始化项目信息
    const getProjectInfo = async () => {
      const { code, data } = await getProjectDetail(props.id);
      if (code === 0) {
        Object.assign(detailInfo, data);
        Object.assign(formData, data);
      }
    };
    getProjectInfo();

    // 表单操作
    const save = () => {
      //
    };
    const cancel = () => {
      context.emit('cancel');
      Object.assign(formData, detailInfo);
    };
    return {
      detailInfo,
      formData,
      getLabel,
      projectLevels,
      statusOptions,
      save,
      cancel,
    };
  },
};
</script>

<style></style>
