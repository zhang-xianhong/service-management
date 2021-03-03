<template>
  <div>
    <el-row>
      <el-button type="primary" class="el-icon-plus" @click="editDialogVisible = true">新增编辑视图</el-button>
      <el-button type="primary" class="el-icon-plus" @click="listDialogVisible = true">新增列表视图</el-button>
    </el-row>
    <el-row>
      <el-table :data="viewData">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="operator" label="操作"></el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="选择关联对象属性" v-model="editDialogVisible" width="60%">
      <el-form label-width="80px" :model="editForm" inline :rules="rules" label-position="top">
        <el-form-item label="视图名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="视图描述" prop="desc">
          <el-input v-model="editForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="editForm.attrs" :height="300">
        <el-table-column prop="obj" label="所属对象"></el-table-column>
        <el-table-column prop="id" label="字段名称"></el-table-column>
        <el-table-column prop="desc" label="字段描述"></el-table-column>
        <el-table-column prop="type" label="功能类型"></el-table-column>
        <el-table-column prop="name" label="字段别名"></el-table-column>
        <el-table-column prop="required" label="必填"></el-table-column>
        <el-table-column prop="component" label="组件类型"></el-table-column>
        <el-table-column prop="group" label="分组名称"></el-table-column>
        <el-table-column prop="order" label="排序"></el-table-column>
      </el-table>
      <el-row>
        <span>接口选择：</span>
        <el-checkbox-group v-model="editForm.methods">
          <el-checkbox label="保存"></el-checkbox>
          <el-checkbox label="新增"></el-checkbox>
          <el-checkbox label="删除"></el-checkbox>
          <el-checkbox label="更新"></el-checkbox>
          <el-checkbox label="查看"></el-checkbox>
          <el-checkbox label="列表"></el-checkbox>
        </el-checkbox-group>
      </el-row>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveEditForm()">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="选择关联对象属性" v-model="listDialogVisible" width="60%">
      <el-form label-width="80px" :model="listForm" inline :rules="rules" label-position="top">
        <el-form-item label="视图名称" prop="name">
          <el-input v-model="listForm.name"></el-input>
        </el-form-item>
        <el-form-item label="视图描述" prop="desc">
          <el-input v-model="listForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <el-table :data="listForm.attrs" :height="300">
        <el-table-column prop="obj" label="所属对象"></el-table-column>
        <el-table-column prop="id" label="字段名称"></el-table-column>
        <el-table-column prop="desc" label="字段描述"></el-table-column>
        <el-table-column prop="show" label="作为显示项"></el-table-column>
        <el-table-column prop="name" label="字段别名"></el-table-column>
        <el-table-column prop="order" label="排序"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="saveListForm()">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { ref, Ref, defineComponent } from 'vue';

interface EditObjRecord {
  obj: string;
  id: string;
  desc: string;
  type: '可编辑' | '只显示' | '隐藏';
  name: string;
  required: true | false;
  component: string;
  group: string;
  order: string;
}
interface EditViewRecord {
  name: string;
  desc: string;
  type: '编辑视图';
  attrs: Array<EditObjRecord>;
  methods: Array<string>;
}
interface ListObjRecord {
  obj: string;
  id: string;
  desc: string;
  show: true | false;
  name: string;
  order: string;
}
interface ListViewRecord {
  name: string;
  desc: string;
  type: '列表视图';
  attrs: Array<ListObjRecord>;
}

export default defineComponent({
  name: 'BusinessEditView',
  setup() {
    const viewData: Ref<Array<EditViewRecord | ListViewRecord>> = ref([]);

    const defaultEditForm: EditViewRecord = {
      name: '',
      desc: '',
      type: '编辑视图',
      attrs: [],
      methods: [],
    };
    const defaultListForm: ListViewRecord = {
      name: '',
      desc: '',
      type: '列表视图',
      attrs: [],
    };
    const editForm: Ref<EditViewRecord> = ref(defaultEditForm);
    const listForm: Ref<ListViewRecord> = ref(defaultListForm);

    const editDialogVisible = ref(false);
    const listDialogVisible = ref(false);

    const rules = {
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      desc: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    };
    return {
      viewData,
      editForm,
      listForm,
      editDialogVisible,
      listDialogVisible,
      rules,
    };
  },
});
</script>
