<template>
  <div style="background: #fff; padding: 30px">
    <company-info :isEdit="isEdit" ref="companyRef" v-model="tenantDetail"></company-info>
    <user-info :isEdit="isEdit" v-model="tenantDetail" v-if="getShowBool('update')"></user-info>
    <manager-info :isEdit="isEdit" v-model="tenantDetail" v-if="getShowBool('update')"></manager-info>
    <el-row v-if="getShowBool('update')">
      <el-button v-if="!isEdit" type="primary" @click="isEdit = true">修改</el-button>
      <el-button v-else type="primary" @click="onSave">保存</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, Ref } from 'vue';
import CompanyInfo from './components/CompanyInfo.vue';
import UserInfo from './components/UserInfo.vue';
import ManagerInfo from './components/ManagerInfo.vue';
import { getTenantDetail, updateTenant } from '@/api/tenant';
import { getShowBool } from '@/utils/permission-show-module';

export default {
  name: 'TenantEdit',
  components: {
    CompanyInfo,
    UserInfo,
    ManagerInfo,
  },
  setup() {
    // 组件实例
    const instance = getCurrentInstance();

    const isEdit = ref(false);
    const companyRef: Ref<any> = ref(null);

    // 租户详情
    const tenantDetail = ref({
      contact: {},
      manager: {},
    } as any);

    const getDetail = async () => {
      const { data } = await getTenantDetail();
      tenantDetail.value = data;
    };

    getDetail();

    const onSave = async () => {
      companyRef.value.formRef.validate(async (validator: boolean) => {
        if (validator) {
          const { nameShort, addr, addrDetail, logoUrl, intro } = tenantDetail.value;
          const updateData: any = {
            nameShort,
            addr,
            addrDetail,
            logoUrl,
            intro,
          };
          Object.keys(updateData).forEach((key: string) => {
            if (updateData[key] === '') {
              delete updateData[key];
            }
          });
          const { code } = await updateTenant(updateData);
          if (code === 0) {
            (instance as any).proxy.$message({
              type: 'success',
              message: '更新成功',
            });
            isEdit.value = false;
          }
        }
      });
    };
    return {
      companyRef,
      isEdit,
      tenantDetail,
      onSave,
      getShowBool,
    };
  },
};
</script>

<style lang="scss">
.tenant-form {
  width: 100%;
}
.form-item {
  width: 40%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 115px;
  height: 85px;
  line-height: 85px;
  text-align: center;
}
.avatar {
  width: 115px;
  height: 85px;
  display: block;
}
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}
</style>
