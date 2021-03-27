<template>
  <div class="add-model-btn" @click="showDialog">
    <i class="el-icon-plus"></i>
    <span>添加数据对象</span>
    <el-dialog v-model="dialogVisible" title="创建数据对象" width="600px">
      <el-form ref="formRef" label-width="120px" label-position="left" :model="form" :rules="rules">
        <el-form-item label="数据对象名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="数据对象描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addModel">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, ref } from 'vue';
import { createModel } from '@/api/schema/model';
export default defineComponent({
  name: 'AddModel',
  setup() {
    const serviceId = inject('serviceId');
    const erdEmit = inject('erdEmit') as Function;
    const formRef: any = ref(null);
    const dialogVisible = ref(false);
    const form = ref({
      name: '',
      description: '',
    });
    const showDialog = () => {
      dialogVisible.value = true;
      nextTick(() => {
        form.value = {
          name: '',
          description: '',
        };
        formRef.value.clearValidate();
      });
    };
    const addModel = async () => {
      const { code } = await createModel({
        ...form.value,
        serviceId,
      });
      if (code === 0) {
        dialogVisible.value = false;
        erdEmit('model-change');
      }
    };
    const rules = {
      name: [{ required: true, message: '请输入对象名称', trigger: 'blur' }],
      description: [{ required: true, message: '请输入对象描述', trigger: 'blur' }],
    };
    return {
      form,
      dialogVisible,
      showDialog,
      addModel,
      rules,
      formRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.add-model-btn {
  position: absolute;
  width: 140px;
  height: 100px;
  border-radius: 10px;
  border: 1px dashed #ccc;
  margin: 20px 0 0 20px;
  text-align: center;
  color: #999;
  z-index: 1;
  i {
    line-height: 80px;
    font-size: 22px;
  }
  span {
    display: inline-block;
    position: absolute;
    top: 60px;
    left: 30px;
    font-size: 14px;
  }
  &:hover {
    color: #0595db;
    border-color: #0595db;
    background: #fcfcfc;
    cursor: pointer;
  }
  &:deep(.el-dialog__header) {
    text-align: left;
  }
}
</style>
