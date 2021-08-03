<template>
  <el-row class="tenant-title">企业信息</el-row>
  <el-row style="font-size: 12px">
    <el-form
      ref="formRef"
      :model="companyInfo"
      :rules="rules"
      class="companyInfo-form"
      inline
      label-width="140px"
      label-position="left"
    >
      <el-form-item prop="name" class="form-item" label="企业中文名称">
        <template v-if="!isCreate">{{ companyInfo.name }}</template>
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
        <template v-if="!isEdit">{{ companyInfo.nameShort }}</template>
        <el-input
          v-else
          v-model="companyInfo.nameShort"
          style="width: 400px"
          placeholder="请输入企业简称"
          maxlength="40"
        ></el-input>
      </el-form-item>
      <el-form-item prop="tenantEngAbbr" class="form-item" label="企业英文简称">
        <template v-if="!isCreate">{{ companyInfo.tenantEngAbbr }}</template>
        <el-input
          v-else
          v-model="companyInfo.tenantEngAbbr"
          style="width: 400px"
          placeholder="请输入企业英文简称"
          maxlength="16"
          @blur="validateEngAbbrName"
        ></el-input>
      </el-form-item>
      <el-form-item prop="addr" class="form-item" label="企业地址">
        <template v-if="!isEdit">{{ computedAddrName }}</template>
        <el-select v-else v-model="companyInfo.addr" style="width: 400px" placeholder="请选择省份">
          <el-option
            v-for="(item, index) in provinceOptions"
            :key="index"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="industryId" class="form-item" label="所属行业">
        <template v-if="!isEdit">{{ computedIndustryName }}</template>
        <el-select v-else v-model="companyInfo.industryId" style="width: 400px" placeholder="请选择所属行业">
          <el-option
            v-for="(item, index) in industryOptions"
            :key="index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="addrDetail" class="form-item" label="详细地址">
        <template v-if="!isEdit">{{ companyInfo.addrDetail }}</template>
        <el-input
          v-else
          v-model="companyInfo.addrDetail"
          style="width: 400px"
          placeholder="请输入详细地址"
          maxlength="225"
        ></el-input>
      </el-form-item>
      <el-form-item prop="natureId" class="form-item" label="企业性质">
        <template v-if="!isEdit">{{ computedNatureName }}</template>
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
        <template v-if="!isEdit">{{ companyInfo.intro }}</template>
        <el-input
          v-else
          type="textarea"
          v-model="companyInfo.intro"
          style="width: 400px"
          placeholder="请输入公司简介，最多支持225个字符"
          maxlength="225"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item prop="scaleId" class="form-item" label="企业规模">
        <template v-if="!isEdit">{{ computedScaleName }}</template>
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
        <template v-if="!isEdit">{{ companyInfo.license }}</template>
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
        <el-upload
          v-if="isEdit"
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
        <el-image v-else class="avatar" hide-on-click-modal :src="licenseUrl" :preview-src-list="[licenseUrl]">
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </template>
        </el-image>
      </el-form-item>
      <el-form-item prop="logoUrl" class="form-item">
        <template v-slot:label>
          企业LOGO
          <i class="el-icon-question info-icon"></i>
        </template>
        <el-upload
          v-if="isEdit"
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
        <el-image v-else class="avatar" hide-on-click-modal :src="logoUrl" :preview-src-list="[logoUrl]">
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </template>
        </el-image>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { computed, defineComponent, ref, WritableComputedRef, getCurrentInstance, Ref, watch } from 'vue';
import useCompanyInfo from '../utils/tenant-config';
import { IMAGE_UPLOAD } from '@/shared/constant/file';
import { SuccessResponse } from '@/types/response';
import { getImageUrl } from '@/api/files';
import { validateCompanyName, validateLicense, validateEngAbbr } from '@/api/tenant';
import CompanyInfoInterface from '../types/company-info-interface';
import { uploadValidate } from '@/utils/validate';
export default defineComponent({
  name: 'CompanyInfo',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: { isEdit: boolean; isCreate: boolean; modelValue: any }) {
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
          pattern: /^[\u4e00-\u9fa5|a-zA-Z|()（）]+$/g,
          message: '包含非法字符，只能输入中文、大小写字母及中英文()',
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
          pattern: /^[\u4e00-\u9fa5|a-zA-Z|()（）]+$/g,
          message: '包含非法字符，只能输入中文、大小写字母及中英文()',
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
          pattern: /^[a-zA-Z]+$/g,
          message: '该企业英文简称只支持英文大小写字母，请重新输入',
          trigger: 'blur',
        },
      ],
      industryId: [{ required: true, message: '请选择所属行业' }],
      natureId: [{ required: true, message: '请选择企业性质' }],
      scaleId: [{ required: true, message: '请选择企业规模' }],
      license: [
        { required: true, message: '请输入营业执照号', trigger: 'blur' },
        {
          pattern: /(^[A-Z0-9]{18}$)|(^\d{15}$)/,
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
      () => industryOptions.value.filter((item: any) => item.key === companyInfo.value.industryId)[0]?.value || '',
    );

    // 省份选项信息
    const provinceOptions = ref([] as any[]);

    const computedAddrName = computed(
      () => provinceOptions.value.filter((item: any) => String(item.code) === companyInfo.value.addr)[0]?.name || '',
    );

    // 企业性质选项信息
    const natureOptions = ref([] as any[]);

    const computedNatureName = computed(
      () => natureOptions.value.filter((item: any) => item.key === companyInfo.value.natureId)[0]?.value || '',
    );

    // 企业规模选项信息
    const scaleOptions = ref([] as any[]);

    const computedScaleName = computed(
      () => scaleOptions.value.filter((item: any) => item.key === companyInfo.value.scaleId)[0]?.value || '',
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
      uploadValidate(instance, file);
    };

    // 企业执照上传成功回调
    const licenseUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        companyInfo.value.licenseUrl = res.data.fileKey;
        licenseUrl.value = URL.createObjectURL(file.raw);
        formRef.value.validateField('licenseUrl');
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

    // 企业名称校验
    const validateEngAbbrName = async (el: any) => {
      if (el.target.value === '') {
        return;
      }
      const { data } = await validateEngAbbr(el.target.value);
      if (!data.usable) {
        (instance as any).proxy.$message({
          type: 'error',
          message: '该英文简称已存在，请重新输入！',
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
      computedAddrName,
      natureOptions,
      computedNatureName,
      scaleOptions,
      computedScaleName,
      beforeUpload,
      licenseUploadSuccess,
      logoUploadSuccess,
      uploadFailed,
      validateName,
      validateEngAbbrName,
      validateLicenseId,
    };
  },
});
</script>

<style lang="scss" scoped>
.companyInfo-form {
  width: 100%;
}
.form-item {
  word-break: break-all;
}
.info-icon {
  &:hover {
    &::after {
      content: '建议尺寸115x85';
      position: absolute;
      margin-top: -30px;
      margin-left: -40px;
      z-index: 11;
      padding: 5px;
      background-color: white;
      box-shadow: 0 0 6px rgb(0 0 0 / 20%);
    }
  }
}
</style>
