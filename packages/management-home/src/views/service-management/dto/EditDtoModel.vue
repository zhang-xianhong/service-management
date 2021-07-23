<template>
  <div>
    <el-form :model="localDtoData" class="create-dto-form">
      <el-form-item label="模型名称">
        <div class="dto-name__container">
          <el-input v-bind:modelValue="localDtoData.enName"></el-input>
          <div class="btn-group"><span @click="openDialog">克隆</span> <span @click="reset">重置</span></div>
        </div>
      </el-form-item>
    </el-form>
    <PropertiesList :properties="localDtoData.list" @onChange="updateProperties"></PropertiesList>
    <el-dialog title="选择属性" v-model="showDialog" width="50%">
      <select-dto ref="dtoSelector"></select-dto>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { defineComponent, PropType } from '@vue/runtime-core';
import SelectDto from './SelectDto.vue';
import { DataType, DtoModel, DtoProperties, useDialog } from './dto';
import PropertiesList from './PropertiesList.vue';
// import Properties from './Properties.vue';
export default defineComponent({
  name: 'EditDtoModel',
  props: {
    dtoData: {
      type: Object as PropType<DtoModel>,
      default: () => ({}),
    },
  },

  components: {
    SelectDto,
    // Properties,
    PropertiesList,
  },

  emits: ['selectDto'],

  setup(props, ctx) {
    const { openDialog, closeDialog, showDialog } = useDialog();

    const dtoSelector = ref<InstanceType<typeof SelectDto>>();

    const localDtoData = ref({ ...props.dtoData });

    const onConfirm = () => {
      const nodes = dtoSelector.value?.getCheckedNodes();
      ctx.emit('selectDto', nodes);
      closeDialog();
    };

    const reset = () => {
      console.log('reset');
    };

    const add = (row: DtoProperties) => {
      console.log('add', row);
    };
    const config = (row: DtoProperties) => {
      console.log('config', row);
    };
    const refrence = (row: DtoProperties) => {
      console.log('refrence', row);
    };
    const remove = (row: DtoProperties) => {
      console.log('remove', row);
    };
    const updateProperties = (properties: DtoProperties[]) => {
      localDtoData.value.list = properties;
    };
    const isPrimitive = (type: DataType) => !['array', 'object'].includes(type);
    return {
      dtoSelector,
      showDialog,
      localDtoData,
      updateProperties,
      reset,
      onConfirm,
      openDialog,
      closeDialog,
      add,
      config,
      refrence,
      remove,
      isPrimitive,
    };
  },
});
</script>
<style lang="scss" scoped>
.dto-name__container {
  display: flex;
  .btn-group {
    width: 200px;
    color: #006eff;
    margin-left: 1em;
    cursor: pointer;
  }
}
</style>
