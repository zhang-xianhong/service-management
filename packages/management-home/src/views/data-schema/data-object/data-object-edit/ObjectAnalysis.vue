<template>
  <item label="修改次数">
    <div class="analysis-items__container">{{ changeNumber }}</div>
  </item>
  <item :label="`对象依赖(${dependencyObject.length})`">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in dependencyObject" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
  <item :label="`作为主对象关联的服务(${relatedServices.length})`">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in relatedServices" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
  <item :label="`直接反向依赖(${directDependsis.length})`">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in directDependsis" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
  <item :label="`间接反向依赖(${indirectDependsis.length})`">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in indirectDependsis" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
  <item :label="`全部反向依赖(${allDependsis.length})`">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in allDependsis" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
  <item label="继承关系">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in inheritRelationship" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
  <item label="被继承关系">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in inheritedRelationShip" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
  <item label="变更历史">
    <div class="analysis-items__container">
      <el-tag v-for="(item, index) in changeHistory" :key="index">{{ item.name }}</el-tag>
    </div>
  </item>
</template>

<script lang="ts">
import { reactive, toRefs, h } from 'vue';

export default {
  name: 'ObjectAnalysis',
  components: {
    Item: {
      name: 'Item',
      props: {
        label: {
          type: String,
        },
      },
      setup(props: any, { slots }: { slots: any }) {
        return () =>
          h('div', { style: { marginBottom: '10px' } }, [
            h(
              'div',
              {
                style: { width: '220px', display: 'inline-block', textAlign: 'left', marginRight: '8px' },
              },
              props.label,
            ),
            slots.default(),
          ]);
      },
    },
  },
  setup() {
    const state = reactive({
      changeNumber: 0, // 修改次数
      dependencyObject: [], // 对象依赖
      relatedServices: [], // 作为主对象关联的服务
      directDependsis: [], // 直接反向依赖
      indirectDependsis: [], // 间接反向依赖
      allDependsis: [], // 全部反向依赖
      inheritRelationship: [], // 继承关系
      inheritedRelationShip: [], // 被继承关系
      changeHistory: [], // 变更历史
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.analysis-items__container {
  width: 560px;
  height: 32px;
  display: inline-block;
  padding: 3px;
  color: #e4e7ed;
  border: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  cursor: not-allowed;
}
</style>
