<template>
  <div class="business-edit-relation">
    <el-form label-position="top" :model="relationForm" :rules="rules" ref="relationFormRef">
      <el-form-item label="设置主对象" prop="objMain">
        <el-select v-model="relationForm.objMain" placeholder="请选择主对象">
          <el-option v-for="obj in objs" :key="obj.id" :label="obj.name" :value="obj.id"></el-option>
        </el-select>
        <el-button type="primary" class="el-icon-male"></el-button>
      </el-form-item>
      <!--       <el-button type="primary" @click="addRelation"><i class="el-icon-plus"></i>添加关联</el-button>
      <el-table :data="relationForm.relationRecords">
        <el-table-column prop="type" label="关联类型">
          <template #default="scope">
            <el-select v-model="scope.row.type">
              <el-option key="include" value="include" label="include"></el-option>
              <el-option key="reference" value="reference" label="reference"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="obj" label="关联对象">
          <template #default="scope">
            <el-select v-model="scope.row.obj"></el-select>
          </template>
        </el-table-column>
        <el-table-column prop="objType" label="关联对象类型">
          <template #default="scope">
            <el-select v-model="scope.row.objType">
              <el-option key="object" value="object" label="object"></el-option>
              <el-option key="list" value="list" label="list"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="objAttr" label="关联对象属性">
          <template #default="scope">
            <el-select v-model="scope.row.objAttr"></el-select>
          </template>
        </el-table-column>
        <el-table-column prop="objMainAttr" label="主对象关联属性">
          <template #default="scope">
            <el-select v-model="scope.row.objMainAttr"></el-select>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作" :width="130">
          <template #default="scope">
            <el-button type="primary" class="el-icon-male" @click="detail(scope.row.obj)"></el-button>
            <el-button @click="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent, onMounted } from 'vue';
import { getModelListAll } from '@/api/schema/model';
import { relationForm } from './form-data';
import { relationRules } from './form-config';

export default defineComponent({
  name: 'BusinessEditRelation',
  setup() {
    const relationFormRef: any = ref(null);

    const rules = relationRules;

    const addRelation = () => {
      relationForm.value.relationRecords.push({
        type: '',
        obj: '',
        objType: '',
        objAttr: '',
        objMainAttr: '',
      });
    };

    const objs: Ref<Array<Record<string, string>>> = ref([]);
    onMounted(async () => {
      const { data } = await getModelListAll();
      objs.value = data.list;
    });

    return {
      relationForm,
      rules,
      addRelation,
      relationFormRef,
      objs,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-relation {
  &:deep(table .el-select.el-select--small) {
    width: 100%;
  }
  &:deep(.el-select.el-select--small) {
    width: calc(100% - 50px);
  }
}
</style>
