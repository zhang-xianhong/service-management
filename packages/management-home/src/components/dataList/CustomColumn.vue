<template>
  <Drawer ref="drawer" :title="title">
    <template v-slot:drawer__content-slot>
      <p class="drawer-message">
        列项显示不小于5项，最多支持10个列项。灰色选中列不支持隐藏和排序。
      </p>
      <p>不固定</p>
      <el-checkbox-group v-model="checkedTableColumns" :min="1" :max="10">
        <el-checkbox v-for="column in unfixedColumnsList" :label="column.prop" :key="column.prop">{{
          column.label
        }}</el-checkbox>
      </el-checkbox-group>
      <p>固定</p>
      <el-checkbox-group v-model="checkedTableColumns" :min="1" :max="10">
        <el-checkbox
          v-for="column in fixedColumnsList"
          :label="column.prop"
          :key="column.prop"
          disabled
          class="column-item"
          >{{ column.label }}</el-checkbox
        >
      </el-checkbox-group>
    </template>
    <template v-slot:drawer__footer-slot>
      <el-button @click="resetTableColumn">重置</el-button>
      <el-button type="primary" @click="submitDrawer">确 定</el-button>
    </template>
  </Drawer>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue';
import Drawer from '@/components/drawer/Drawer';
import { ElMessage } from 'element-plus';

export default defineComponent({
  props: {
    tableColumns: Array,
  },
  name: 'custom-column',
  components: {
    Drawer,
  },
  emits: ['handelChange'],
  setup(props, { emit }) {
    const title = ref('自定义显示列项');
    // 自定义显示的列
    const checkedTableColumns = ref([]);
    // table显示的列
    const tableColumnsList = ref([]);
    // 不固定显示的列
    const unfixedColumnsList = ref([]);
    // 固定显示的列
    const fixedColumnsList = ref([]);

    const drawer = ref(null);
    // 打开抽屉
    const openDrawer = () => {
      drawer.value.openDrawer();
    };
    // 打开抽屉
    const closeDrawer = () => {
      drawer.value.closeDrawer();
    };

    // 重置列显示
    const resetTableColumn = () => {
      tableColumnsList.value = props.tableColumns.filter((c) => c.fixed);
      checkedTableColumns.value = tableColumnsList.value.map((c) => c.prop);
    };
    // 确定
    const submitDrawer = () => {
      const data = checkedTableColumns.value;
      if (data.length < 5) {
        ElMessage({
          message: '列项显示不小于5项!',
          type: 'error',
          duration: 5 * 1000,
        });
        return;
      }
      tableColumnsList.value = props.tableColumns.filter((c) => data.includes(c.prop));
      emit('handelChange', tableColumnsList.value);
      closeDrawer();
    };

    onMounted(() => {
      unfixedColumnsList.value = props.tableColumns.filter((c) => !c.fixed);
      tableColumnsList.value = props.tableColumns.filter((c) => c.fixed);
      fixedColumnsList.value = props.tableColumns.filter((c) => c.fixed);
      checkedTableColumns.value = fixedColumnsList.value.map((c) => c.prop);
      emit('handelChange', tableColumnsList.value);
    });

    return {
      title,
      tableColumnsList,
      openDrawer,
      closeDrawer,
      drawer,
      checkedTableColumns,
      unfixedColumnsList,
      fixedColumnsList,
      resetTableColumn,
      submitDrawer,
    };
  },
});
</script>
<style lang="scss">
$image: url(~@/assets/img/drag.svg);
.drawer__content-slot .el-checkbox {
  display: flex;
  align-items: center;
  padding: 10px 5px;
  &::before {
    content: '';
    position: relative;
    top: -2px;
    flex-shrink: 0;
    margin-right: 5px;
    background: $image no-repeat;
    background-size: cover;
    width: 20px;
    height: 20px;
    display: block;
  }
}
.drawer-message {
  font-size: 12px;
}
</style>
