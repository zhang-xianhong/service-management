<template>
  <div class="baseinfo-container">
    <div class="baseinfo-title">基本信息</div>
    <el-form :model="formData" label-width="120px" label-position="left" style="height: 87%; overflow: auto;">
      <el-form-item label="数据对象">
        <div class="baseinfo-content">{{ formData.model }}</div>
      </el-form-item>
      <el-form-item label="关联对象">
        <div class="baseinfo-content">{{ formData.relationModel }}</div>
      </el-form-item>
      <el-form-item label="关联类型" v-if="formData.fromModelId !== formData.toModelId">
        <el-radio-group v-model="formData.relationType" @change="relationChange">
          <el-radio :label="0">1对1关联</el-radio>
          <el-radio :label="1">1对多关联</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="remove">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { removeRelation, updateRelation } from '@/api/schema/model';

export default defineComponent({
  name: 'RelationInfo',
  props: {
    data: {
      require: true,
      type: Object,
    },
  },
  setup(props: any) {
    const serviceId = inject('serviceId');
    const afterUpdate = inject('afterUpdate') as Function;
    const afterRemove = inject('afterRemove') as Function;
    const formData = ref(props.data);
    const remove = async () => {
      const { code } = await removeRelation({ ids: [formData.value.relationId] });
      if (code === 0) {
        afterRemove();
      }
    };
    const relationChange = async () => {
      const { code } = await updateRelation(formData.value.relationId, {
        fromModelId: formData.value.fromModelId,
        toModelId: formData.value.toModelId,
        relationType: formData.value.relationType,
        serviceId,
      });
      if (code === 0) {
        afterUpdate();
      }
    };
    return {
      formData,
      relationChange,
      remove,
    };
  },
});
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
