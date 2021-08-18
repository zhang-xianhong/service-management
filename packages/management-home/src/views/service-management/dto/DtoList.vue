<template>
  <div class="drawer-content">
    <div class="drawer-content__main">
      <el-button
        type="primary"
        @click="editDtoModel()"
        class="create-dto__bth"
        v-if="getShowBool('apiUpdate') && !isRefrenceService"
        >新建</el-button
      >
      <list-wrap
        :loading="loading"
        :inProject="false"
        :empty="dtoList?.length === 0"
        :hasCreateAuth="getShowBool('apiUpdate') && !isRefrenceService"
        :handleCreate="() => editDtoModel()"
      >
        <el-table :data="dtoList" height="calc(100% - 60px)">
          <el-table-column label="序号">
            <template #default="scope">
              <el-radio name="dto-item" :label="scope.row.uniqueId" v-model="selectedId" v-if="selectable">{{
                scope.$index + 1
              }}</el-radio>
              <span v-else>{{ scope.$index + 1 }}</span>
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
          <el-table-column label="操作" align="right" v-if="getShowBool('apiUpdate') && !isRefrenceService">
            <template #default="scope">
              <el-button @click="editDtoModel(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="removeDtoModel(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </list-wrap>
    </div>
    <div class="drawer-content__btns" v-if="showCloseBtn">
      <el-button @click="handleClose">关闭</el-button>
    </div>

    <!-- 新建Dto modal -->
    <el-dialog title="新建DTO模型" v-model="showEditDto" width="80%">
      <EditDtoModel :dto-data="currentDto" ref="editDtoModelRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="onConfirmEdit" :loading="confirmLoading">确定</el-button>
          <el-button @click="closeEditDto">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { DtoModel, useEditDtoDialog, EditMode, useDtoList, EMPTY_DTO, CreatDtoModel, findReadonlyProp } from './dto';
import { defineComponent, onBeforeMount } from '@vue/runtime-core';
import EditDtoModel from './EditDtoModel.vue';
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getShowBool } from '@/utils/permission-show-module';
import { parseList } from '../api-params/util';
export default defineComponent({
  name: 'DtoListDialog',
  components: {
    EditDtoModel,
  },
  props: {
    selectable: {
      type: Boolean,
      default: false,
    },
    showCloseBtn: {
      type: Boolean,
      default: false,
    },
    isRefrenceService: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on-confirm', 'back'],
  setup(props, { emit }) {
    const { fetchDtoList, dtoList, loading, removeDto } = useDtoList();

    const route = useRoute();

    const { serviceId, apiId, id } = route.params;

    const currentServiceId = (serviceId ?? id) as string;
    const confirmLoading = ref<boolean>(false);

    onBeforeMount(() => {
      fetchDtoList(currentServiceId);
    });
    const {
      currentDto,
      showDialog: showEditDto,
      initEdit,
      closeDialog: closeEditDto,
      syncDtoData,
      setDtoModel,
    } = useEditDtoDialog();

    const selectedId = ref<any>(); // hold ids of mutilple select

    const editDtoModelRef = ref<InstanceType<typeof EditDtoModel>>();
    const editDtoModel = (data?: DtoModel) => {
      // eslint-disable-next-line no-unused-expressions
      editDtoModelRef.value?.dtoForm?.resetFields();
      if (data) {
        // update
        initEdit(EditMode.Update, data);
      } else {
        // create
        const createData: CreatDtoModel = { ...EMPTY_DTO, serviceId: Number(currentServiceId), apiId: Number(apiId) };
        initEdit(EditMode.Create, createData);
      }
    };

    const onConfirmEdit = async () => {
      try {
        confirmLoading.value = true;
        const dtoData = await editDtoModelRef.value?.getData();
        if (dtoData) {
          setDtoModel(dtoData);
          await syncDtoData();
          closeEditDto();
          // 刷新列表
          fetchDtoList(currentServiceId);
          confirmLoading.value = false;
        }
      } catch (error) {
        console.log(error);
        confirmLoading.value = false;
      }
    };
    const getSelectedData = () => {
      const selected = selectedId.value;
      const row = dtoList.value?.find((item) => item.uniqueId === selected);
      if (!row) {
        ElMessage.error('请至少选择一项');
        return;
      }
      return row;
    };
    const resetList = () => {
      selectedId.value = '';
      // eslint-disable-next-line no-unused-expressions
      editDtoModelRef.value?.dtoForm?.resetFields();
      confirmLoading.value = false;
    };
    const removeDtoModel = async (row: DtoModel) => {
      // 是否包含引用的DTO

      const properties = findReadonlyProp(parseList(row.list));
      if (properties) {
        ElMessage.warning('该DTO已被只读引入，请删除引入关系后再操作');
        return;
      }
      ElMessageBox.confirm(`确认删除DTO${row.name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        removeDto({
          serviceId: currentServiceId,
          uniqueId: row.uniqueId,
        });
      });
    };
    const handleClose = () => {
      confirmLoading.value = false;
      emit('back');
    };
    return {
      dtoList,
      currentDto,
      showEditDto,
      editDtoModelRef,
      loading,
      selectedId,
      confirmLoading,
      onConfirmEdit,
      closeEditDto,
      editDtoModel,
      fetchDtoList,
      getSelectedData,
      resetList,
      removeDtoModel,
      handleClose,
      getShowBool,
    };
  },
});
</script>

<style scoped lang="scss">
.create-dto__bth {
  margin-bottom: 1em;
}
</style>
