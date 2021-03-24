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
        <div v-if="isShowMode" class="baseinfo-content">{{ owner }}</div>
        <el-select v-else v-model="formData.owner" multiple placeholder="请选择">
          <el-option v-for="(item, index) in allUsers" :key="index">{{ item.name }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <div v-if="isShowMode" class="baseinfo-content">{{ classificationName }}</div>
        <el-cascader
          v-else
          v-model="classificationValue"
          :options="classificationOptions"
          :show-all-levels="false"
          :props="{ multiple: true, label: 'name', value: 'id' }"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="标签">
        <div v-if="isShowMode" class="baseinfo-content">{{ tagNames }}</div>
        <el-select v-else v-model="formData.tags" multiple filterable placeholder="请选择">
          <el-option v-for="item in allTags" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据对象详情">
        <div v-if="isShowMode" class="baseinfo-content">{{ formData.remark }}</div>
        <el-input
          v-else
          type="textarea"
          placeholder="请输入内容"
          v-model="formData.remark"
          maxlength="50"
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
import { computed, onMounted, ref, Ref } from 'vue';
import { getAllTags } from '@/api/settings/tags';
import { getClassificationList } from '@/api/settings/classification';
import _ from 'lodash/fp';

export default {
  name: 'ModleDetailInfo',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: any) {
    const formData = ref({
      ...props.data,
    });
    const tagMap: Ref<Record<string, string>> = ref({});
    const allTags = ref([]);
    const initTags = async () => {
      const { code, data } = await getAllTags();
      if (code === 0) {
        allTags.value = data;
        data.forEach((tag: any) => {
          tagMap.value[tag.id] = tag.name;
        });
      }
    };
    const classificationOptions = ref([]);
    const classificationName = ref('');
    const initClassification = async () => {
      const { code, data } = await getClassificationList();
      if (code === 0) {
        classificationOptions.value = data;
      }
    };
    const allUsers = ref([]);
    const owner = ref('');
    const initUsers = () => {
      // todo
    };
    const tagNames = computed(() => {
      const tagIds = (props.data.tags || '').split(',');
      const names = _.map((tagId: string) => tagMap.value[tagId])(tagIds);
      return names.join(',');
    });

    const isShowMode = ref(true);
    const modifyFormData = () => {
      isShowMode.value = false;
    };
    const saveFormData = () => {
      //
      isShowMode.value = true;
    };

    onMounted(() => {
      initTags();
      initClassification();
      initUsers();
    });
    return {
      formData,
      allUsers,
      allTags,
      classificationOptions,
      modifyFormData,
      isShowMode,
      tagNames,
      classificationName,
      owner,
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
