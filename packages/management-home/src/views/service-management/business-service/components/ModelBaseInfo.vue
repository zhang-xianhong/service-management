<template>
  <div class="baseinfo-container">
    <div class="baseinfo-title">基本信息</div>
    <el-form :model="formData" label-width="120px">
      <el-form-item label="数据对象名称">
        <div class="baseinfo-content">{{ formData.name }}</div>
      </el-form-item>
      <el-form-item label="数据对象描述">
        <div class="baseinfo-content">{{ formData.description }}</div>
      </el-form-item>
      <el-form-item label="负责人">
        <div v-if="isShowMode" class="baseinfo-content">{{ formData.owner }}</div>
        <el-select v-else :value="computedOwner" multiple placeholder="请选择">
          <el-option v-for="(item, index) in allOwners" :key="index">{{ item.name }}</el-option>
        </el-select>
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
        <div v-if="isShowMode" class="baseinfo-content">{{ formData.remarks }}</div>
        <el-input
          v-else
          type="textarea"
          placeholder="请输入内容"
          v-model="formData.detail"
          maxlength="255"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="isShowMode" type="primary" @click="modifyFormData">修改</el-button>
        <el-button v-else type="primary" @click="saveFormData">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { reactive, ref, computed } from 'vue';
import useClassifications from '../utils/service-baseinfo-classification';
import useTags from '../utils/service-baseinfo-tag';
import { updateModel } from '@/api/schema/model';

export default {
  name: 'ModelBaseInfo',
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
    const formData = reactive({
      id: props.data.id,
      serviceId: props.data.serviceId,
      name: props.data.name,
      description: props.data.description,
      owner: props.data.owner,
      classification: props.data.classification,
      tag: props.data.tag,
      remarks: props.data.remarks || '',
    });

    // 负责人数组
    const computedOwner = computed(() => formData.owner.split(','));

    // 所有负责人
    const allOwners = reactive([]);

    const { classificationName, classificationValue } = useClassifications(
      formData.classification,
      props.classifications,
    );

    // 分类选择
    const selectClassification = (value: Array<Array<string>>) => {
      formData.classification = value.map((item: Array<string>) => item[item.length - 1]).join(',');
    };

    const { tagNames, tagValue } = useTags(formData.tag, props.tags);

    // 标签选择
    const selectTag = (tags: string[]) => {
      formData.tag = tags.join(',');
    };

    // 修改表单数据
    const modifyFormData = () => {
      isShowMode.value = false;
    };

    // 保存表单修改
    const saveFormData = async () => {
      const { code } = await updateModel(formData, formData.id);
      if (code === 0) {
        isShowMode.value = true;
        useTags(formData.tag, props.tags);
        useClassifications(formData.classification, props.classifications);
      }
    };

    return {
      isShowMode,
      formData,
      computedOwner,
      allOwners,
      classificationName,
      classificationValue,
      selectClassification,
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
