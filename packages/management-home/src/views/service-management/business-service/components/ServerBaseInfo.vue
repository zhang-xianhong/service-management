<template>
  <div class="baseinfo-container">
    <div class="baseinfo-title">基本信息</div>
    <el-form :model="formData" label-width="60px" label-position="left" style="height: 87%; overflow: auto">
      <el-form-item label="服务名称">
        <div class="baseinfo-content">{{ formData.name }}</div>
      </el-form-item>
      <el-form-item label="服务描述">
        <div class="baseinfo-content">{{ formData.description }}</div>
      </el-form-item>
      <el-form-item label="负责人">
        <div v-if="isShowMode" class="baseinfo-content">{{ ownersName }}</div>
        <owner-select
          v-else
          :value="formData.owners"
          :options="formData.ownerUsers"
          :use-project="true"
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
          :props="{ multiple: false, label: 'name', value: 'id' }"
          @change="selectClassification"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="标签">
        <div v-if="isShowMode" class="baseinfo-content">{{ tagNames }}</div>
        <el-select v-else v-model="tagValue" multiple filterable placeholder="请选择" @change="selectTag">
          <el-option v-for="(item, index) in tags" :key="index" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务详情">
        <div v-if="isShowMode" class="baseinfo-content">{{ formData.detail }}</div>
        <el-input
          v-else
          type="textarea"
          placeholder="请输入内容"
          v-model="formData.detail"
          maxlength="50"
          show-word-limit
        >
        </el-input>
      </el-form-item>
      <el-form-item label="服务依赖">
        <div v-if="isShowMode" class="baseinfo-content">{{ computedDependencyName }}</div>
        <el-select v-else v-model="formData.dependencies" clearable multiple>
          <el-option v-for="item in computedServices" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
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
import { updateService } from '@/api/servers';
import { allService, getAllService } from '../utils/service-data-utils';
import OwnerSelect from '@/components/owners-select/Index.vue';

export default {
  name: 'ServerBaseInfo',
  components: {
    OwnerSelect,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: Number,
      default: 0,
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
  setup(props: { data: any; id: number; tags: any[]; classifications: any[] }) {
    getAllService();
    // 是否为显示模式标识，默认为true
    const isShowMode = ref(true);

    const computedServices = computed(() => allService.value.filter((service: any) => service.id !== props.id));
    const ownersArr = props.data.owners?.map((x: any) => x.userId) || [];
    const allOwnersArr = props.data.ownerUsers?.map((x: any) => x.id) || [];
    const realOwners = ownersArr
      // eslint-disable-next-line array-callback-return
      .map((x: any) => {
        if (allOwnersArr.includes(x)) {
          return { userId: x };
        }
      })
      .filter((x: any) => x);

    // 表单数据
    const formData = reactive({
      name: props.data.name,
      description: props.data.description,
      owner: props.data.owner,
      owners: realOwners,
      ownerUsers: props.data.ownerUsers,
      classification: props.data.classification,
      tag: props.data.tag,
      detail: props.data.detail,
      dependencies: props.data.dependencies,
    });

    const computedDependencyName = computed(() => {
      if (allService.value.length === 0) {
        return '';
      }
      const names = formData.dependencies
        .map((id: number) => allService.value.filter((item: any) => item.id === id)[0]?.name)
        .filter((x: any) => x);
      return names.join(',');
    });

    // 负责人名称
    const ownersName = ref('');

    // 初始化负责人名称
    formData.owners.forEach((item: { userId: number }) => {
      const target = props.data.ownerUsers.filter((user: any) => user.id === item.userId)[0] || {};
      ownersName.value = ownersName.value === '' ? target.displayName : `${ownersName.value},${target.displayName}`;
    });

    // 负责人选择
    const selectOwners = (value: any) => {
      formData.owner = value.owner;
      formData.owners = value.owners;
      formData.ownerUsers = value.ownerUsers;
      ownersName.value = value.ownersName;
    };

    const { classificationName, classificationValue } = useClassifications(
      formData.classification,
      props.classifications,
    );

    // 分类选择
    const selectClassification = (value: Array<Array<string>>) => {
      // formData.classification = value.map((item: Array<string>) => item[item.length - 1])?.join(',');
      formData.classification = value ? value.join(',') : '';
    };

    const { tagValue, tagNames } = useTags(formData.tag, props.tags);

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
      console.log(formData);
      const data = { ...formData };
      data.dependencies = formData.dependencies.map((x: any) => ({ id: x }));
      const { code } = await updateService(String(props.id), data);
      if (code === 0) {
        isShowMode.value = true;
        useTags(formData.tag, props.tags);
        useClassifications(formData.classification, props.classifications);
      }
    };

    return {
      isShowMode,
      computedServices,
      formData,
      classificationName,
      classificationValue,
      selectClassification,
      computedDependencyName,
      ownersName,
      tagValue,
      tagNames,
      selectOwners,
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
  width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
