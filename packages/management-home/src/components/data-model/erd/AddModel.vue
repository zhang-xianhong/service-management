<template>
  <div class="add-model-btn" @click="showDialog">
    <i class="el-icon-plus"></i>
    <span>添加数据对象</span>
    <el-dialog v-model="dialogVisible" title="创建数据对象" width="600px">
      <el-form ref="formRef" label-width="120px" label-position="left" :model="form" :rules="rules">
        <el-form-item label="数据对象名称" prop="name">
          <el-input v-model.trim="form.name" ref="objectName"></el-input>
        </el-form-item>
        <el-form-item label="数据对象描述" prop="description">
          <el-input v-model.trim="form.description" ref="objectDescription"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="addModel" :loading="submitting">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, ref } from 'vue';
import { createModel } from '@/api/schema/model';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'AddModel',
  setup() {
    const serviceId = inject('serviceId');
    const erdEmit = inject('erdEmit') as Function;
    const formRef: any = ref(null);
    const dialogVisible = ref(false);
    const submitting = ref(false);
    const form = ref({
      name: '',
      description: '',
    });
    const objectName = ref(null as any);
    const objectDescription = ref(null as any);
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
      objectName.value.handleBlur();
      objectDescription.value.handleBlur();
      if (
        !form.value.name ||
        !form.value.description ||
        form.value.name?.length > 36 ||
        form.value.description?.length > 255
      ) {
        return false;
      }
      const reg = /^([A-Z][a-z]+)+$/;
      if (!reg.test(form.value.name)) {
        return false;
      }
      // 英文驼峰名验证
      submitting.value = true;
      const { code } = await createModel({
        ...form.value,
        serviceId,
      });
      if (code === 0) {
        dialogVisible.value = false;
        ElMessage.success('创建成功');
        erdEmit('model-change');
      }
      submitting.value = false;
    };
    const rules = {
      name: [
        { required: true, message: '请输入对象名称', trigger: 'blur' },
        { pattern: /^([A-Z][a-z]+)+$/, message: '名称必须是大驼峰格式，均为英文字母，请重新输入', trigger: 'blur' },
        { max: 23, message: '长度不可超过23个字符', trigger: 'blur' },
      ],
      description: [
        { required: true, message: '请输入对象描述', trigger: 'blur' },
        { max: 255, message: '长度不可超过255个字符', trigger: 'blur' },
      ],
    };
    return {
      form,
      dialogVisible,
      showDialog,
      addModel,
      rules,
      formRef,
      objectName,
      objectDescription,
      submitting,
    };
  },
});
</script>

<style lang="scss" scoped>
.add-model-btn {
  position: absolute;
  width: 140px;
  height: 100px;
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
  &:deep(.el-dialog__footer) {
    padding: 0 0 30px 0;
    text-align: center;
  }
}
</style>
