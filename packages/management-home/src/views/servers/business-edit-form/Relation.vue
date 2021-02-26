<template>
  <div class="business-edit-relation">
    <el-form label-position="top" :model="relationForm" :rules="rules">
      <el-form-item label="设置主对象" prop="objMain">
        <el-select v-model="relationForm.objMain" placeholder="请选择主对象"></el-select>
        <el-button type="primary" class="el-icon-male"></el-button>
      </el-form-item>
      <el-button type="primary" @click="addRelation"><i class="el-icon-plus"></i>添加关联</el-button>
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
      </el-table>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from 'vue';

interface RelationRecord {
  type: 'include' | 'reference' | '';
  obj: string;
  objType: 'object' | 'list' | '';
  objAttr: string;
  objMainAttr: string;
}
interface RelationForm {
  objMain: string;
  relationRecords: Array<RelationRecord>;
}

export default defineComponent({
  name: 'BusinessEditRelation',
  setup() {
    const relationForm: Ref<RelationForm> = ref({
      objMain: '',
      relationRecords: [],
    });

    const rules = {
      objMain: [{ required: true, message: '请选择主对象', trigger: 'blur' }],
    };

    const addRelation = () => {
      relationForm.value.relationRecords.push({
        type: '',
        obj: '',
        objType: '',
        objAttr: '',
        objMainAttr: '',
      });
    };
    return {
      relationForm,
      rules,
      addRelation,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-relation {
  &::v-deep {
    table {
      .el-select.el-select--small {
        width: 100%;
      }
    }
    .el-select.el-select--small {
      width: calc(100% - 50px);
    }
  }
}
</style>
