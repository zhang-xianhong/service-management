<template>
  <div>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree
      class="filter-tree"
      show-checkbox
      node-key="id"
      highlight-current
      :load="loadNode"
      lazy
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="treeRef"
    >
    </el-tree>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity';
import { defineComponent, watch } from '@vue/runtime-core';
import { ElTree } from 'element-plus';
import { FilterNodeMethodFunction, LoadFunction } from 'element-plus/lib/el-tree/src/tree.type';

export default defineComponent({
  name: 'SelectDto',
  setup() {
    const data = [
      {
        param: '',
        type: 'string',
        required: 1,
        sample: 't',
        des: '',
        validationFormat: {
          type: 'String',
          maxLength: 256,
        },
        id: 'xxx-12',
        zhName: '创建列表1',
        enName: 'creat_list1',
        serverName: 'service_list',
        children: [],
      },
      {
        param: '',
        type: 'string',
        required: 1,
        sample: 't',
        des: '',
        validationFormat: {
          type: 'String',
          maxLength: 256,
        },
        id: 'xxx-13',
        zhName: '创建列表2',
        enName: 'creat_list2',
        serverName: 'service_list',
      },
      {
        param: '',
        type: 'string',
        required: 1,
        sample: 't',
        des: '',
        validationFormat: {
          type: 'String',
          maxLength: 256,
        },
        id: 'xxx-14',
        zhName: '创建列表3',
        enName: 'creat_list3',
        serverName: 'service_list',
      },
    ];
    const defaultProps = {
      children: 'children',
      label: 'enName',
    };
    const treeRef = ref<InstanceType<typeof ElTree>>();

    const filterText = ref<string>('');

    watch(filterText, (text) => treeRef.value?.filter(text));

    const filterNode: FilterNodeMethodFunction = (value, data) => {
      if (!value) return true;
      return data.enName.indexOf(value) !== -1;
    };
    const getCheckedNodes = () => {
      console.log(treeRef.value?.getCheckedNodes(false, false));

      return treeRef.value?.getCheckedNodes(false, false);
    };

    const loadNode: LoadFunction = (node, resolve) => {
      // todo mock data
      if (node.level === 0) {
        return resolve(data);
      }
      if (node.level > 3) {
        return resolve([]);
      }
      if (node.data.id === 'xxx-12') {
        setTimeout(() => {
          resolve([
            {
              param: '',
              type: 'string',
              required: 1,
              sample: 't-1',
              des: '',
              validationFormat: {
                type: 'String',
                maxLength: 256,
              },
              id: 'xxx-12-1',
              zhName: '创建列表1',
              enName: 'creat_list1',
              serverName: 'service_list',
            },
            {
              param: '',
              type: 'string',
              required: 1,
              sample: 't-2',
              des: '',
              validationFormat: {
                type: 'String',
                maxLength: 256,
              },
              id: 'xxx-12-2',
              zhName: '创建列表1',
              enName: 'creat_list1',
              serverName: 'service_list',
            },
          ]);
        }, 1000);
      } else {
        return resolve([]);
      }
    };
    return {
      data,
      defaultProps,
      filterNode,
      filterText,
      treeRef,
      loadNode,
      getCheckedNodes,
    };
  },
});
</script>

<style></style>
