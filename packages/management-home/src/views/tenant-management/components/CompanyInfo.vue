<template>
  <el-row>企业信息</el-row>
  <el-row style="padding:0px 20px;">
    <el-form ref="formRef" :model="companyInfo" :rules="rules" inline label-width="140px" label-position="left">
      <el-form-item prop="name" class="form-item" label="企业名称" required>
        <template v-if="isEdit">{{ companyInfo.name }}</template>
        <el-input v-else v-model="companyInfo.name" style="width: 400px" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item prop="nameShort" class="form-item" label="企业简称">
        <el-input v-model="companyInfo.nameShort" style="width: 400px" placeholder="请输入企业简称"></el-input>
      </el-form-item>
      <el-form-item prop="industryId" class="form-item" label="所属行业" required>
        <el-select v-model="companyInfo.industryId" style="width: 400px" placeholder="请选择所属行业">
          <el-option
            v-for="(item, index) in industryOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="addr" class="form-item" label="企业地址">
        <el-select v-model="companyInfo.addr" style="width: 400px" placeholder="请选择省份">
          <el-option
            v-for="(item, index) in provinceOptions"
            :key="index"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="natureId" class="form-item" label="企业性质" required>
        <el-select v-model="companyInfo.natureId" style="width: 400px" placeholder="请选择企业性质">
          <el-option
            v-for="(item, index) in natureOptions"
            :key="index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="addrDetail" class="form-item" label="详细地址">
        <el-input v-model="companyInfo.addrDetail" style="width: 400px" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item prop="scaleId" class="form-item" label="企业规模" required>
        <el-select v-model="companyInfo.scaleId" style="width: 400px" placeholder="请选择企业规模">
          <el-option
            v-for="(item, index) in scaleOptions"
            :key="index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="intro" class="form-item" label="公司简介">
        <el-input
          type="textarea"
          v-model="companyInfo.intro"
          style="width: 400px"
          placeholder="请输入公司简介，最多支持225个字符"
          maxlength="225"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item prop="license" label="营业执照号" required style="display:block;">
        <el-input v-model="companyInfo.license" style="width: 400px" placeholder="请输入营业执照号"></el-input>
      </el-form-item>
      <el-form-item prop="licenseUrl" class="form-item" label="营业执照" required>
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
          <img v-if="companyInfo.licenseUrl" :src="companyInfo.licenseUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="logoUrl" class="form-item" label="企业logo">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
          <img v-if="companyInfo.logoUrl" :src="companyInfo.companyLogoUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-button type="primary" @click="goNextStep">下一步</el-button>
  </el-row>
</template>

<script lang="ts">
import { computed, SetupContext, ref, WritableComputedRef } from 'vue';
import useCompanyInfo from '../utils/tenant-config';

interface CompanyInfoInterface {
  name: string; // 企业名称
  nameShort: string; // 企业简称
  industryId: string; // 行业
  province: string; // 省份
  natureId: string; // 企业性质
  addrDetail: string; // 详细地址
  scaleId: string; // 企业规模
  intro: string; // 企业简介
  license: string; // 企业执照号
  licenseUrl: string; // 营业执照
  logoUrl: string; // 企业logo
}

export default {
  name: 'CompanyInfo',
  emits: ['go', 'update:modelValue'],
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: { isEdit: boolean; modelValue: any }, ctx: SetupContext) {
    const formRef: any = ref(null);

    const companyInfo: WritableComputedRef<CompanyInfoInterface> = computed({
      get: () => props.modelValue || {},
      set: (newValue: any) => ctx.emit('update:modelValue', newValue),
    });

    // 表单校验规则
    const rules = {
      name: [
        { required: true, message: '请输入企业名称', trigger: 'blur' },
        { min: 2, max: 40, message: '企业名称长度在2到40个字符之间', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5|a-zA-Z|()]+$/g, message: '该企业名称包含非法字符，请重新输入', trigger: 'blur' },
      ],
      nameShort: [
        { min: 2, max: 40, message: '企业简称长度在2到40个字符之间', trigger: 'blur' },
        { pattern: /^[\u4e00-\u9fa5|a-zA-Z|()]+$/g, message: '该企业简称包含非法字符，请重新输入', trigger: 'blur' },
      ],
      industryId: [{ required: true, message: '请选择所属行业', trigger: 'blur' }],
      natureId: [{ required: true, message: '请选择企业性质', trigger: 'blur' }],
      scaleId: [{ required: true, message: '请选择企业规模', trigger: 'blur' }],
      license: [{ required: true, message: '请输入营业执照号', trigger: 'blur' }],
      licenseUrl: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
    };
    // 行业选项信息
    const industryOptions = ref([] as any[]);

    // 省份选项信息
    const provinceOptions = ref([] as any[]);

    // 企业性质选项信息
    const natureOptions = ref([] as any[]);

    // 企业规模选项信息
    const scaleOptions = ref([] as any[]);

    useCompanyInfo().then((res: any) => {
      industryOptions.value = res.industryOptions;
      natureOptions.value = res.natureOptions;
      scaleOptions.value = res.scaleOptions;
      provinceOptions.value = res.provinceOptions;
    });

    // 点击前往下一步
    const goNextStep = () => {
      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          ctx.emit('go', 2);
        }
      });
    };
    return {
      formRef,
      companyInfo,
      rules,
      industryOptions,
      provinceOptions,
      natureOptions,
      scaleOptions,
      goNextStep,
    };
  },
};
</script>

<style lang="scss"></style>
