<template>
  <div>
    <el-form class="create-dto-form">
      <el-form-item label="模型名称">
        <div class="dto-name__container">
          <el-input v-model="localDtoData.name"></el-input>
          <div class="btn-group"><span @click="openDialog">克隆</span> <span @click="reset">重置</span></div>
        </div>
      </el-form-item>
    </el-form>
    <PropertiesList :propertiesList="localDtoData.list" ref="propertiesListRef"></PropertiesList>
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
import { defineComponent, PropType, watch } from '@vue/runtime-core';
import SelectDto from './SelectDto.vue';
import { DtoModel, DtoProperties, useDialog } from './dto';
import PropertiesList from './PropertiesList.vue';
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
    PropertiesList,
  },

  emits: ['selectDto'],

  setup(props) {
    const { openDialog, closeDialog, showDialog } = useDialog();

    const dtoSelector = ref<InstanceType<typeof SelectDto>>();

    const localDtoData = ref({ ...props.dtoData });
    watch(
      () => props.dtoData,
      () => {
        console.log('changejfojfeo');

        localDtoData.value = { ...props.dtoData };
      },
    );

    const propertiesListRef = ref<InstanceType<typeof PropertiesList>>();

    const onConfirm = () => {
      const nodes = dtoSelector.value?.getCheckedNodes();
      console.log(nodes);

      localDtoData.value.list = [...localDtoData.value.list, ...(nodes as DtoProperties[])];
      closeDialog();
    };

    const reset = () => {
      localDtoData.value.name = '';
    };

    const getData = () => {
      localDtoData.value.list = propertiesListRef.value.properties;
      return localDtoData.value;
    };

    return {
      dtoSelector,
      showDialog,
      localDtoData,
      propertiesListRef,
      reset,
      onConfirm,
      openDialog,
      closeDialog,
      getData,
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
