<template>
  <el-dialog title="选择属性" v-model="showDialog" width="50%">
    <div class="select-dto__box" v-if="isClone">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree
        class="filter-tree"
        show-checkbox
        node-key="id"
        highlight-current
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="treeRef"
      >
      </el-tree>
    </div>
    <div class="select-dto__list" v-else>
      <el-table :data="dtoList" max-height="400">
        <el-table-column label="序号">
          <template #default="scope">
            <el-radio
              name="dto-item"
              :label="scope.row.uniqueId"
              v-model="selectedId"
              :disabled="scope.row.uniqueId === dtoId"
            />
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
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { computed, defineComponent, watch, PropType } from '@vue/runtime-core';
import { ElMessage, ElTree } from 'element-plus';
import { FilterNodeMethodFunction } from 'element-plus/lib/el-tree/src/tree.type';
import { useDialog, useDtoList, DtoProperties, EMPTY_DTO } from './dto';
const enum ReferenceType {
  READONLY = 1,
  CLONE,
}
export default defineComponent({
  name: 'SelectDto',
  emits: ['on-confirm'],
  props: {
    referenceType: {
      type: Number as PropType<ReferenceType>,
      default: ReferenceType.CLONE,
    },
    dtoId: {
      type: String as PropType<string>,
    },
  },
  setup(props, ctx) {
    const defaultProps = {
      children: 'children',
      label: 'name',
    };
    const treeRef = ref<InstanceType<typeof ElTree>>();

    const filterText = ref<string>('');
    const { dtoList } = useDtoList();

    const selectedId = ref<string>();
    watch(filterText, (text) => treeRef.value?.filter(text));

    const filterNode: FilterNodeMethodFunction = (value, data) => {
      if (!value) return true;
      return data.name?.indexOf(value) !== -1;
    };

    const treeData = computed(() =>
      dtoList.value?.map((e) => {
        const { list, ...restProperties } = e;
        // 克隆引入显示一级子节点 引入只显示整个列表
        const dtoList =
          props.referenceType === ReferenceType.CLONE
            ? list.map((e) => ({
                ...e,
                children: [],
              }))
            : [];
        return {
          ...restProperties,
          children: [...dtoList],
        };
      }),
    );
    const isClone = computed(() => props.referenceType === ReferenceType.CLONE);
    const getCheckedNodes = () => {
      if (!isClone.value) {
        const data = dtoList.value?.find((item) => item.uniqueId === selectedId.value);
        if (!data) {
          ElMessage.error('请至少选择一项');
          return;
        }
        return {
          ...data,
        };
      }
      const nodes = treeRef.value?.getCheckedNodes(false, true); // 包含半选的节点

      const rootNodes = nodes?.filter((e) => e.rootId === null); // 根节点

      const properties = nodes?.filter((e) => e.rootId === undefined); // 所有子节点
      if (rootNodes?.length === 1) {
        // 只有一个根节点
        const dto = dtoList.value?.find((e) => e.uniqueId === rootNodes[0].uniqueId);
        if (dto) {
          return {
            ...dto,
            list: properties as DtoProperties[],
          };
        }
      }
      // 跨dto选择,合并为一个dto
      return {
        ...EMPTY_DTO,
        list: properties as DtoProperties[],
      };
    };
    const { openDialog, closeDialog, showDialog } = useDialog();

    const onConfirm = () => {
      ctx.emit('on-confirm', getCheckedNodes());
      closeDialog();
    };

    return {
      treeData,
      dtoList,
      defaultProps,
      filterText,
      treeRef,
      showDialog,
      isClone,
      selectedId,
      filterNode,
      getCheckedNodes,
      openDialog,
      closeDialog,
      onConfirm,
    };
  },
});
</script>
<style lang="scss" scoped>
.select-dto__box {
  min-height: 200px;
}
</style>
