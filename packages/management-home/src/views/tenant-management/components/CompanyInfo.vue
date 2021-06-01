<template>
  <el-row style="font-size: 12px; font-weight: bolder">企业信息</el-row>
  <el-row>
    <el-form ref="formRef" class="tenant-form" :model="companyInfo" inline label-width="140px" label-position="left">
      <el-form-item prop="name" class="form-item" label="企业名称" required>
        {{ companyInfo.name }}
      </el-form-item>
      <el-form-item prop="nameShort" class="form-item" label="企业别称">
        <template v-if="!isEdit">{{ companyInfo.nameShort }}</template>
        <el-input v-else v-model="companyInfo.nameShort" style="width: 400px" placeholder="请输入企业简称"></el-input>
      </el-form-item>
      <el-form-item prop="tenantEngAbbr" class="form-item" label="企业英文简称" required>
        {{ companyInfo.tenantEngAbbr }}
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
      <el-form-item prop="industryId" class="form-item" label="所属行业" required>
        {{ computedIndustryName }}
      </el-form-item>
      <el-form-item prop="addrDetail" class="form-item" label="详细地址">
        <template v-if="!isEdit">{{ companyInfo.addrDetail }}</template>
        <el-input v-else v-model="companyInfo.addrDetail" style="width: 400px" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item prop="natureId" class="form-item" label="企业性质" required>
        {{ computedNatureName }}
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
      <el-form-item prop="scaleId" class="form-item" label="企业规模" required>
        {{ computedScaleName }}
      </el-form-item>
      <el-form-item prop="license" label="营业执照号" required style="display: block">
        {{ companyInfo.license }}
      </el-form-item>
      <el-form-item prop="licenseUrl" class="form-item" required>
        <template v-slot:label>营业执照<i class="el-icon-question info-icon"></i></template>
        <img :src="companyInfo.sourceUrl?.licenseUrl" class="avatar" />
      </el-form-item>
      <el-form-item prop="logoUrl" class="form-item">
        <template v-slot:label>企业LOGO<i class="el-icon-question info-icon"></i></template>
        <img v-if="companyInfo.sourceUrl?.logoUrl" :src="companyInfo.sourceUrl.logoUrl" class="avatar" />
        <el-upload
          v-else
          class="avatar-uploader"
          :action="IMAGE_UPLOAD"
          accept=".jpg,.bmp,.png,jpeg"
          :show-file-list="false"
          :before-upload="beforeUpload"
          @success="logoUploadSuccess"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script lang="ts">
import { computed, ref, WritableComputedRef, getCurrentInstance } from 'vue';
import useCompanyInfo from '../utils/tenant-config';
import { SuccessResponse } from '@/types/response';
import { IMAGE_UPLOAD } from '@/shared/constant/file';

// 企业信息接口
interface CompanyInfoInterface {
  name: string; // 企业名称
  nameShort: string; // 企业简称
  industryId: string; // 行业
  addr: string; // 省份
  natureId: string; // 企业性质
  addrDetail: string; // 详细地址
  scaleId: string; // 企业规模
  intro: string; // 企业简介
  license: string; // 企业执照号
  licenseUrl: string; // 营业执照
  logoUrl: string; // 企业logo
  sourceUrl: any;
}

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

    // 企业信息
    const companyInfo: WritableComputedRef<CompanyInfoInterface> = computed(() => props.modelValue);

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

    const computedAddrName = computed(
      () =>
        provinceOptions.value.filter((item: any) => String(item.code) === companyInfo.value.addr)[0]?.name ||
        companyInfo.value.addr,
    );

    // 企业性质选项信息
    const natureOptions = ref([] as any[]);

    const computedNatureName = computed(
      () =>
        natureOptions.value.filter((item: any) => item.key === companyInfo.value.natureId)[0]?.value ||
        companyInfo.value.natureId,
    );

    // 企业规模选项信息
    const scaleOptions = ref([] as any[]);

    const computedScaleName = computed(
      () =>
        scaleOptions.value.filter((item: any) => item.key === companyInfo.value.scaleId)[0]?.value ||
        companyInfo.value.scaleId,
    );

    useCompanyInfo().then((res: any) => {
      industryOptions.value = res.industryOptions;
      natureOptions.value = res.natureOptions;
      scaleOptions.value = res.scaleOptions;
      provinceOptions.value = res.provinceOptions;
    });

    // 图片上传大小校验
    const beforeUpload = (file: { size: number }) => {
      if (file.size > 1024 * 1024 * 3) {
        (instance as any).proxy.$message({
          type: 'warning',
          message: '上传图片大小不能超过 3Mb',
        });
        return false;
      }
    };

    // 企业logo上传成功回调
    const logoUploadSuccess = (res: SuccessResponse<any>, file: { raw: unknown }) => {
      if (res.code === 0 && res.data?.fileKey) {
        companyInfo.value.logoUrl = res.data.fileKey;
        companyInfo.value.sourceUrl.logoUrl = URL.createObjectURL(file.raw);
      } else {
        (instance as any).proxy.$message({
          type: 'error',
          message: '上传失败，请重新上传！',
        });
      }
    };

    return {
      IMAGE_UPLOAD,
      companyInfo,
      industryOptions,
      computedIndustryName,
      provinceOptions,
      computedAddrName,
      natureOptions,
      computedNatureName,
      scaleOptions,
      computedScaleName,
      beforeUpload,
      logoUploadSuccess,
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
