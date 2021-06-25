<template>
  <div class="baseinfo-container">
    <div class="baseinfo-title">基本信息</div>
    <el-form :model="formData" label-width="120px" label-position="left" style="height: 87%; overflow: auto">
      <el-form-item label="数据对象名称">
        <div class="baseinfo-content">{{ formData.name }}</div>
      </el-form-item>
      <el-form-item label="数据对象描述">
        <div class="baseinfo-content">{{ formData.description }}</div>
      </el-form-item>
      <el-form-item label="负责人">
        <div v-if="isShowMode" class="baseinfo-content">{{ ownersName }}</div>
        <owner-select
          v-else
          :value="formData.owners"
          :options="formData.ownerUsers"
          @change="selectOwners"
        ></owner-select>
      </el-form-item>
      <el-form-item label="分类">
        <div v-if="isShowMode" class="baseinfo-content">{{ classificationName }}</div>
        <el-cascader
          v-else
          v-model="classificationValue"
          :options="classifications"
          :show-all-levels="false"
          :props="{ multiple: true, label: 'name', value: 'id' }"
          @change="selectClassification"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="标签">
        <div v-if="isShowMode" class="baseinfo-content">{{ tagNames }}</div>
        <el-select v-else v-model="tagValue" multiple filterable placeholder="请选择" @change="selectTag">
          <el-option v-for="(item, index) in tags" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据对象详情">
        <div v-if="isShowMode" class="baseinfo-content">{{ formData.remark }}</div>
        <el-input
          v-else
          type="textarea"
          placeholder="请输入内容"
          v-model="formData.remark"
          maxlength="255"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isShowMode" type="primary" @click="modifyFormData">修改</el-button>
        <el-button v-else type="primary" @click="saveFormData">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import useClassifications from '../utils/service-baseinfo-classification';
import useTags from '../utils/service-baseinfo-tag';
import { updateModel } from '@/api/schema/model';
import OwnerSelect from '@/components/owners-select/Index.vue';

export default {
  name: 'ModelBaseInfo',
  components: {
    OwnerSelect,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    tags: {
      type: Array,
      default: () => [],
    },
    classifications: {
      type: Array,
      default: () => [],
    },
  },
  setup(props: { data: any; tags: any[]; classifications: any[] }) {
    // 是否为显示模式标识，默认为true
    const isShowMode = ref(true);

    // 表单数据
    const formData = ref({} as any);

    watch(
      () => props.data,
      (newValue) => {
        formData.value = newValue;
      },
      { immediate: true },
    );

    // 负责人名称
    const ownersName = ref('');

    // 初始化负责人名称
    formData.value.owners.forEach((item: { userId: number }) => {
      const target = props.data.ownerUsers.filter((user: any) => user.id === item.userId)[0] || {};
      ownersName.value = ownersName.value === '' ? target.displayName : `${ownersName.value},${target.displayName}`;
    });

    // 负责人选择
    const selectOwners = (value: any) => {
      formData.value.owner = value.owner;
      formData.value.owners = value.owners;
      formData.value.ownerUsers = value.ownerUsers;
      ownersName.value = value.ownersName;
    };

    const { classificationName, classificationValue } = useClassifications(
      formData.value.classification,
      props.classifications,
    );

    // 分类选择
    const selectClassification = (value: Array<Array<string>>) => {
      formData.value.classification = value.map((item: Array<string>) => item[item.length - 1]).join(',');
    };

    const { tagNames, tagValue } = useTags(formData.value.tags, props.tags);

    // 标签选择
    const selectTag = (tags: string[]) => {
      formData.value.tags = tags.join(',');
    };

    // 修改表单数据
    const modifyFormData = () => {
      isShowMode.value = false;
    };

    // 保存表单修改
    const saveFormData = async () => {
      const { code } = await updateModel(formData.value, formData.value.id);
      if (code === 0) {
        isShowMode.value = true;
        useTags(formData.value.tags, props.tags);
        useClassifications(formData.value.classification, props.classifications);
      }
    };

    return {
      isShowMode,
      formData,
      classificationName,
      classificationValue,
      selectClassification,
      ownersName,
      selectOwners,
      tagNames,
      tagValue,
      selectTag,
      modifyFormData,
      saveFormData,
    };
  },
};
</script>

<style lang="scss" scoped>
.baseinfo-container {
  padding: 12px;
  height: 100%;
}
.baseinfo-title {
  margin-bottom: 20px;
}
.baseinfo-content {
  display: inline-block;
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
