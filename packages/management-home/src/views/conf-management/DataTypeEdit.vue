<template>
  <el-form :model="typeForm" ref="formRef" :rules="formRules" label-width="120px">
    <el-form-item label="类型名称" prop="name" required>
      <el-input v-model.trim="typeForm.name" placeholder="请选择"></el-input>
    </el-form-item>
    <el-form-item label="数据类型" prop="type" required>
      <el-select v-model="typeForm.type" placeholder="请选择">
        <el-option
          v-for="item in datatypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="typeForm.type === 'Float' || typeForm.type === 'Double'" label="精度" prop="length" required>
      <el-input-number v-model="typeForm.precision" :min="0" :max="10"></el-input-number>
    </el-form-item>
    <el-form-item label="长度" prop="length" required>
      <el-input-number v-model="typeForm.length" :min="1" :max="4294967295"></el-input-number>
    </el-form-item>
    <el-form-item label="类型描述" prop="description" required>
      <el-input v-model="typeForm.description" placeholder="请选择"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" v-if="getShowBool('update')">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { ref, reactive, computed, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { addDataType, getDataTypeDetail, updateDataType } from '@/api/settings/data-types';
import { getShowBool } from '@/utils/permission-show-module';

export default {
  name: 'DataTypeEdit',
  setup() {
    // 路由器
    const router = useRouter();

    // 路由信息
    const route = useRoute();

    // 表单数据
    const typeForm = reactive({
      name: '',
      type: '',
      length: 1,
      description: '',
      precision: 0,
    });

    // 是否为新建数据类型
    const isCreate = computed(() => route.params.id === '0');

    // 初始化表单数据
    const initTypeForm = async () => {
      if (!isCreate.value) {
        const {
          data: { name, description, length, type, precision },
        } = await getDataTypeDetail(route.params.id as string);
        typeForm.name = name;
        typeForm.description = description;
        typeForm.length = length;
        typeForm.type = type;
        typeForm.precision = precision;
      }
    };

    initTypeForm();

    // 获取组件实例
    const instance = getCurrentInstance();

    // 表单引用
    const formRef: any = ref(null);

    // 表单校验规则
    const formRules = {
      name: [
        { required: true, message: '请输入类型名称', trigger: 'blur' },
        { max: 64, message: '长度不超过 64 个字符', trigger: 'blur' },
      ],
      type: [{ required: true, message: '请输入数据类型', trigger: 'blur' }],
      length: [{ required: true, message: '请输入长度', trigger: 'blur' }],
      description: [
        { required: true, message: '请输入类型描述', trigger: 'blur' },
        { max: 255, message: '长度不超过 255 个字符', trigger: 'blur' },
      ],
    };

    // 数据类型选项
    const datatypeOptions = [
      { label: '整数类型', value: 'Integer' },
      { label: '长整型', value: 'Long' },
      { label: '浮点类型', value: 'Float' },
      { label: '双精度浮点类型', value: 'Double' },
      { label: '布尔类型', value: 'Boolean' },
      { label: '字符类型', value: 'String' },
      { label: '日期时间类型', value: 'java.util.Date' },
    ];

    // 提交表单
    const onSubmit = () => {
      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          if (isCreate.value) {
            const { code }: any = await addDataType(typeForm);
            if (code === 0) {
              (instance as any).proxy.$message({
                message: '新建成功',
                type: 'success',
              });
              router.back();
            }
          } else {
            const { code }: any = await updateDataType(route.params.id as any, typeForm);
            if (code === 0) {
              (instance as any).proxy.$message({
                message: '更新成功',
                type: 'success',
              });
              router.back();
            }
          }
        }
      });
    };

    const onCancel = () => {
      router.back();
    };

    return {
      typeForm,
      formRef,
      formRules,
      datatypeOptions,
      onSubmit,
      onCancel,
      getShowBool,
    };
  },
};
</script>

<style scoped></style>
