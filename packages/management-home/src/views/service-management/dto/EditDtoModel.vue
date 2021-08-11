<template>
  <div>
    <el-form ref="dtoForm" class="create-dto-form" :model="localDtoData" :rules="rules" label-width="120px">
      <el-form-item label="模型名称" prop="name">
        <div class="dto-name__container">
          <el-input v-model="localDtoData.name"></el-input>
          <div class="btn-group"><span @click="openDtoSelector">克隆</span></div>
        </div>
      </el-form-item>
      <el-form-item label="模型中文名称" prop="zhName">
        <div class="dto-name__container">
          <el-input v-model="localDtoData.zhName"></el-input>
          <div class="btn-group"></div>
        </div>
      </el-form-item>
    </el-form>
    <PropertiesList :propertiesList="localDtoData.list" ref="propertiesListRef"></PropertiesList>
    <SelectDtoProperties ref="dtoSelector" @on-confirm="onConfirm" :dto-id="dtoId"></SelectDtoProperties>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { computed, defineComponent, PropType, provide, watch } from '@vue/runtime-core';
import { ElForm } from 'element-plus';
import { CreatDtoModel, DtoModel, DtoProperties, dtoUniqueId } from './dto';
import PropertiesList from './PropertiesList.vue';
import SelectDtoProperties from './SelectDtoProperties.vue';
export default defineComponent({
  name: 'EditDtoModel',
  props: {
    dtoData: {
      type: Object as PropType<DtoModel | CreatDtoModel>,
      default: () => ({}),
    },
  },

  components: {
    PropertiesList,
    SelectDtoProperties,
  },

  emits: ['selectDto'],

  setup(props) {
    const dtoSelector = ref<InstanceType<typeof SelectDtoProperties>>();

    const localDtoData = ref({ ...props.dtoData });

    const dtoForm = ref<InstanceType<typeof ElForm>>();
    const rules = {
      name: [
        { required: true, message: '请输入 Dto 名称', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1到 20 个字符', trigger: 'blur' },
      ],
      zhName: [
        { required: true, message: '请输入中文名称', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在 1到 20 个字符', trigger: 'blur' },
      ],
    };
    watch(
      () => props.dtoData,
      () => {
        localDtoData.value = { ...props.dtoData };
      },
    );

    const propertiesListRef = ref<InstanceType<typeof PropertiesList>>();

    const onConfirm = (selectedDto: DtoModel) => {
      localDtoData.value.name = selectedDto.name;
      localDtoData.value.list = [...localDtoData.value.list, ...selectedDto.list];
      // eslint-disable-next-line no-unused-expressions
      dtoSelector.value?.closeDialog();
    };

    const reset = () => {
      localDtoData.value.name = '';
      // 将所有属性名置空
      const traversal: (nodes: DtoProperties[], cb: (node: DtoProperties) => any) => void = (nodes, cb) => {
        for (const node of nodes) {
          cb(node);
          if (node.children) {
            traversal(node.children, cb);
          }
        }
      };
      traversal(localDtoData.value.list, (node) => {
        // eslint-disable-next-line no-param-reassign
        node.name = '';
      });
    };

    const getData = async () => {
      const validRes = await dtoForm.value?.validate();
      if (validRes) {
        const properties = propertiesListRef.value.getData();
        if (properties) {
          localDtoData.value.list = properties;
          return localDtoData.value;
        }
        throw new Error('properties 校验失败');
      }
    };

    const openDtoSelector = () => {
      // eslint-disable-next-line no-unused-expressions
      dtoSelector.value?.openDialog();
    };

    const dtoId = computed(() => ('uniqueId' in props.dtoData ? props.dtoData.uniqueId : undefined));

    provide(dtoUniqueId, dtoId);

    return {
      dtoSelector,
      localDtoData,
      propertiesListRef,
      rules,
      dtoForm,
      dtoId,
      reset,
      onConfirm,
      getData,
      openDtoSelector,
    };
  },
});
</script>
<style lang="scss" scoped>
.dto-name__container {
  display: flex;
  width: 50%;
  .btn-group {
    width: 200px;
    color: #006eff;
    margin-left: 1em;
    cursor: pointer;
  }
}
</style>
