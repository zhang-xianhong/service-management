<template>
  <el-row style="font-weight: bolder">企业信息</el-row>
  <el-row style="font-size: 12px">
    <el-form ref="formRef" :model="companyInfo" :rules="rules" inline label-width="140px" label-position="left">
      <el-form-item prop="name" class="form-item" label="企业中文名称">
        <template v-if="isEdit">{{ companyInfo.name }}</template>
        <el-input
          v-else
          v-model="companyInfo.name"
          style="width: 400px"
          placeholder="请输入企业名称"
          maxlength="40"
          @blur="validateName"
        ></el-input>
      </el-form-item>
      <el-form-item prop="nameShort" class="form-item" label="企业别称">
        <el-input
          v-model="companyInfo.nameShort"
          style="width: 400px"
          placeholder="请输入企业简称"
          maxlength="40"
        ></el-input>
      </el-form-item>
      <el-form-item prop="tenantEngAbbr" class="form-item" label="企业英文简称">
        <template v-if="isEdit">{{ companyInfo.tenantEngAbbr }}</template>
        <el-input
          v-else
          v-model="companyInfo.tenantEngAbbr"
          style="width: 400px"
          placeholder="请输入企业英文简称"
          maxlength="16"
        ></el-input>
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
      <el-form-item prop="industryId" class="form-item" label="所属行业">
        <template v-if="isEdit">{{ computedIndustryName || companyInfo.industryId }}</template>
        <el-select v-else v-model="companyInfo.industryId" style="width: 400px" placeholder="请选择所属行业">
          <el-option
            v-for="(item, index) in industryOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="addrDetail" class="form-item" label="详细地址">
        <el-input
          v-model="companyInfo.addrDetail"
          style="width: 400px"
          placeholder="请输入详细地址"
          maxlength="255"
        ></el-input>
      </el-form-item>
      <el-form-item prop="natureId" class="form-item" label="企业性质">
        <template v-if="isEdit">{{ computedNature || companyInfo.natureId }}</template>
        <el-select v-else v-model="companyInfo.natureId" style="width: 400px" placeholder="请选择企业性质">
          <el-option
            v-for="(item, index) in natureOptions"
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
      <el-form-item prop="scaleId" class="form-item" label="企业规模">
        <template v-if="isEdit">{{ computedScale || companyInfo.scaleId }}</template>
        <el-select v-else v-model="companyInfo.scaleId" style="width: 400px" placeholder="请选择企业规模">
          <el-option
            v-for="(item, index) in scaleOptions"
            :key="index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="license" label="营业执照号" style="display: block">
        <template v-if="isEdit">{{ companyInfo.license }}</template>
        <el-input
          v-else
          v-model="companyInfo.license"
          style="width: 400px"
          placeholder="请输入营业执照号"
          maxlength="18"
          @blur="validateLicenseId"
        ></el-input>
      </el-form-item>
      <el-form-item prop="licenseUrl" class="form-item" label="营业执照">
        <template v-slot:label>
          营业执照
          <i class="el-icon-question info-icon"></i>
        </template>
        <img v-if="isEdit" :src="licenseUrl" class="avatar" />
        <el-upload
          v-else
          class="avatar-uploader"
          :action="IMAGE_UPLOAD"
          accept=".jpg, .bmp, .png, jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @error="uploadFailed"
          @success="licenseUploadSuccess"
        >
          <img v-if="licenseUrl" :src="licenseUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="logoUrl" class="form-item">
        <template v-slot:label>
          企业LOGO
          <i class="el-icon-question info-icon"></i>
        </template>
        <el-upload
          class="avatar-uploader"
          :action="IMAGE_UPLOAD"
          accept=".jpg, .bmp, .png, jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @error="uploadFailed"
          @success="logoUploadSuccess"
        >
          <img v-if="logoUrl" :src="logoUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { computed, ref, WritableComputedRef, getCurrentInstance, Ref, watch } from 'vue';
import useCompanyInfo from '../utils/tenant-config';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import { SuccessResponse } from '@/types/response';
import { getImageUrl } from '@/api/files';
import { validateCompanyName, validateLicense } from '@/api/tenant';
import CompanyInfoInterface from '../types/company-info-interface';
const iamgeTypes = ['jpg', 'bmp', 'png', 'jpeg'];
export default {
  name: 'CompanyInfo',
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
  setup(props: { isEdit: boolean; modelValue: any }) {
    // 组件实例
    const instance = getCurrentInstance();

    // 表单引用
    const formRef: Ref<any> = ref(null);

    // 企业信息
    const companyInfo: WritableComputedRef<CompanyInfoInterface> = computed(() => props.modelValue);

    // 企业执照图片url
    const licenseUrl: Ref<string> = ref('');

    // 企业logo图片url
    const logoUrl: Ref<string> = ref('');

    // 根据fileKey获取文件url
    const getFileUrl = async (type: 'licenseUrl' | 'logoUrl') => {
      if (companyInfo.value[type]) {
        const { data } = await getImageUrl({
          fileKey: companyInfo.value[type],
        });
        return data;
      }
    };

    watch(
      () => companyInfo.value.licenseUrl,
      async () => {
        if (!licenseUrl.value) {
          if (props.modelValue.sourceUrl?.licenseUrl) {
            licenseUrl.value = props.modelValue.sourceUrl.licenseUrl;
          } else {
            const url = await getFileUrl('licenseUrl');
            licenseUrl.value = url;
          }
        }
      },
    );

    watch(
      () => companyInfo.value.logoUrl,
      async () => {
        if (!logoUrl.value) {
          if (props.modelValue.sourceUrl?.logoUrl) {
            logoUrl.value = props.modelValue.sourceUrl.logoUrl;
          } else {
            const url = await getFileUrl('logoUrl');
            logoUrl.value = url;
          }
        }
      },
    );

    // 表单校验规则
    const rules = {
      name: [
        { required: true, message: '请输入企业名称', trigger: 'blur' },
        {
          min: 2,
          max: 40,
          message: '企业名称长度在2到40个字符之间',
          trigger: 'blur',
        },
        {
          pattern: /^[\u4e00-\u9fa5|a-zA-Z|()]+$/g,
          message: '包含非法字符，只能输入中文、大小写字母及()',
          trigger: 'blur',
        },
      ],
      nameShort: [
        {
          min: 2,
          max: 40,
          message: '企业别称长度在2到40个字符之间',
          trigger: 'blur',
        },
        {
          pattern: /^[\u4e00-\u9fa5|a-zA-Z|()]+$/g,
          message: '该企业简称包含非法字符，请重新输入',
          trigger: 'blur',
        },
      ],
      tenantEngAbbr: [
        { required: true, message: '请输入企业英文简称', trigger: 'blur' },
        {
          min: 6,
          max: 16,
          message: '企业英文简称长度在6到16个字符之间',
          trigger: 'blur',
        },
        {
          pattern: /^[a-z]+$/g,
          message: '该企业英文简称只支持英文小写字母，请重新输入',
          trigger: 'blur',
        },
      ],
      industryId: [{ required: true, message: '请选择所属行业' }],
      natureId: [{ required: true, message: '请选择企业性质' }],
      scaleId: [{ required: true, message: '请选择企业规模' }],
      license: [
        { required: true, message: '请输入营业执照号', trigger: 'blur' },
        {
          pattern: /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/,
          message: '营业执照号不合法，请重新输入',
          trigger: 'blur',
        },
      ],
      licenseUrl: [{ required: true, message: '请上传营业执照' }],
    };

    // 行业选项信息
    const industryOptions = ref([] as any[]);

    // 已选行业展示
    const computedIndustryName = computed(
      () =>
        industryOptions.value.filter((item: any) => item.key === companyInfo.value.industryId)[0]?.value ||
        companyInfo.value.industryId,
    );

    // 省份选项信息
    const provinceOptions = ref([] as any[]);

    // 企业性质选项信息
    const natureOptions = ref([] as any[]);

    // 已选企业性质展示
    const computedNature = computed(
      () =>
        natureOptions.value.filter((item: any) => item.key === companyInfo.value.natureId)[0]?.value ||
        companyInfo.value.natureId,
    );

    // 企业规模选项信息
    const scaleOptions = ref([] as any[]);

    // 已选企业规模展示
    const computedScale = computed(
      () =>
        scaleOptions.value.filter((item: any) => item.key === companyInfo.value.scaleId)[0]?.value ||
        companyInfo.value.scaleId,
    );

    // 获取企业所有配置相关信息
    useCompanyInfo().then((res: any) => {
      industryOptions.value = res.industryOptions;
      natureOptions.value = res.natureOptions;
      scaleOptions.value = res.scaleOptions;
      provinceOptions.value = res.provinceOptions;
    });

    // 图片上传大小校验
    const beforeUpload = (file: { size: number; name: string }) => {
      if (iamgeTypes.indexOf(file.name.split('.')[1]) === -1) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '图片格式错误，仅支持bmp,jpg,png,jpeg格式图片',
        });
      }
      if (file.size > 1024 * 1024 * 3) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '上传图片大小不能超过 3Mb',
        });
        return false;
      }
    };

    // 企业执照上传成功回调
    const licenseUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        companyInfo.value.licenseUrl = res.data.fileKey;
        licenseUrl.value = URL.createObjectURL(file.raw);
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '上传失败，请重新上传！',
        });
      }
    };

    // 上传失败，请重新上传
    const uploadFailed = () => {
      (instance as any).proxy.$message({
        type: 'error',
        message: '上传失败，请重新上传！',
      });
    };

    // 企业logo上传成功回调
    const logoUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        companyInfo.value.logoUrl = res.data.fileKey;
        logoUrl.value = URL.createObjectURL(file.raw);
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '上传失败，请重新上传！',
        });
      }
    };

    // 企业名称校验
    const validateName = async (el: any) => {
      if (el.target.value === '') {
        return;
      }
      const { data } = await validateCompanyName(el.target.value);
      if (!data.usable) {
        (instance as any).proxy.$message({
          type: 'error',
          message: '企业名称已存在，请重新输入！',
        });
      }
    };

    // 营业执照号校验
    const validateLicenseId = async (el: any) => {
      if (el.target.value === '') {
        return;
      }
      const { data } = await validateLicense(el.target.value);
      if (!data.usable) {
        (instance as any).proxy.$message({
          type: 'error',
          message: '营业执照号已存在，请重新输入！',
        });
      }
    };

    return {
      IMAGE_UPLOAD,
      formRef,
      companyInfo,
      licenseUrl,
      logoUrl,
      rules,
      industryOptions,
      computedIndustryName,
      provinceOptions,
      natureOptions,
      computedNature,
      scaleOptions,
      computedScale,
      beforeUpload,
      licenseUploadSuccess,
      logoUploadSuccess,
      uploadFailed,
      validateName,
      validateLicenseId,
    };
  },
};
</script>

<style lang="scss" scoped>
.info-icon {
  &:hover {
    &::after {
      content: '建议尺寸115x85';
      position: absolute;
      margin-top: -20px;
      margin-left: -40px;
    }
  }
}
</style>
