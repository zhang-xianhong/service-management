<template>
  <el-dialog v-model="showDtoList">
    <el-button type="primary" @click="editDtoModel(null)" class="create-dto__bth">新建</el-button>
    <list-wrap
      :loading="loading"
      :inProject="false"
      :empty="dtoList?.length === 0"
      :handleCreate="
        () => {
          editDtoModel(null);
        }
      "
    >
      <el-table :data="dtoList" max-height="400">
        <el-table-column label="序号">
          <template #default="scope">
            <el-radio name="dto-item" :label="scope.row.uniqueId" v-model="selectedId" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="模型英文名">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="chineseName" label="模型中文名">
          <template #default="scope">
            {{ scope.row.zhName }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="editDtoModel(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </list-wrap>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDtoList">取消</el-button>
        <el-button type="primary" @click="onConfirmSelect" :disabled="!selectedId">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 新建Dto modal -->
  <el-dialog title="新建DTO模型" v-model="showEditDto" width="50%">
    <edit-dto-model @selectDto="onSelectedDto" :dto-data="currentDto" ref="editDtoModelRef" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEditDto">取消</el-button>
        <el-button type="primary" @click="onConfirmEdit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { DtoModel, useEditDtoDialog, EditMode, useDtoList, EMPTY_DTO, CreatDtoModel } from './dto';
import { defineComponent } from '@vue/runtime-core';
import { TreeNodeData } from 'element-plus/lib/el-tree/src/tree.type';
import EditDtoModel from './EditDtoModel.vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'DtoListDialog',
  components: {
    EditDtoModel,
  },
  emits: ['on-confirm'],
  setup(props, ctx) {
    const { fetchDtoList, dtoList, loading } = useDtoList();

    const route = useRoute();
    const { serviceId, apiId } = route.params;

    const {
      currentDto,
      showDialog: showEditDto,
      initEdit,
      closeDialog: closeEditDto,
      syncDtoData,
      setDtoModel,
    } = useEditDtoDialog();

    const showDtoList = ref<boolean>(false);
    const selectedId = ref<any>(); // hold ids of mutilple select

    const editDtoModelRef = ref<InstanceType<typeof EditDtoModel>>();

    const openDtoList = () => {
      showDtoList.value = true;
      fetchDtoList(serviceId as string);
    };

    const closeDtoList = () => {
      showDtoList.value = false;
      selectedId.value = undefined;
    };

    const editDtoModel = (data?: DtoModel) => {
      if (data) {
        // update
        initEdit(EditMode.Update, data);
      } else {
        // create
        const createData: CreatDtoModel = { ...EMPTY_DTO, serviceId: Number(serviceId), apiId: Number(apiId) };
        initEdit(EditMode.Create, createData);
      }
    };

    const onSelectedDto = (nodes: TreeNodeData[] | undefined) => {
      console.log('selected', nodes);
    };

    const onConfirmSelect = () => {
      const selected = selectedId.value;
      const row = dtoList.value?.find((item) => item.uniqueId === selected);
      if (!row) {
        ElMessage.error('请至少选择一项');
        return;
      }
      ctx.emit('on-confirm', row);
      closeDtoList();
      // console.log(selecttions.value);
    };

    const onConfirmEdit = async () => {
      const dtoData = editDtoModelRef.value?.getData();
      console.log('dtodata===', dtoData);

      if (dtoData) {
        setDtoModel(dtoData);
        await syncDtoData();
        closeEditDto();
        // 刷新列表
        fetchDtoList(serviceId as string);
      }
    };
    return {
      dtoList,
      currentDto,
      showEditDto,
      showDtoList,
      editDtoModelRef,
      loading,
      openDtoList,
      closeDtoList,
      onConfirmEdit,
      closeEditDto,
      editDtoModel,
      onSelectedDto,
      selectedId,
      onConfirmSelect,
    };
  },
});
</script>

<style scoped>
.create-dto__bth {
  margin-bottom: 1em;
}
</style>
