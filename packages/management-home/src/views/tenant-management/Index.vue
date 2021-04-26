<template>
  <div style="background: #fff; padding: 30px">
    <company-info :isEdit="isEdit" v-model="tenantDetail"></company-info>
    <user-info :isEdit="isEdit" v-model="tenantDetail"></user-info>
    <manager-info :isEdit="isEdit" v-model="tenantDetail"></manager-info>
    <el-row>
      <el-button v-if="!isEdit" type="primary" @click="isEdit = true">修改</el-button>
      <el-button v-else type="primary" @click="onSave">保存</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { ref, getCurrentInstance } from 'vue';
import CompanyInfo from './components/CompanyInfo.vue';
import UserInfo from './components/UserInfo.vue';
import ManagerInfo from './components/ManagerInfo.vue';
import { getTenantDetail, updateTenant } from '@/api/tenant';

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

    // TODO: 后续从用户信息中获取，目前先写死
    const tenantId = '1';

    const isEdit = ref(false);

    // 租户详情
    const tenantDetail = ref({
      contact: {},
      manager: {},
    } as any);

    const getDetail = async () => {
      const { data } = await getTenantDetail(tenantId);
      tenantDetail.value = data;
    };

    getDetail();

    const onSave = async () => {
      const { code } = await updateTenant(tenantId, {
        ...tenantDetail.value,
        ...{ contact: undefined, manager: undefined },
      });
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '更新成功',
        });
        isEdit.value = false;
      }
    };

    return {
      isEdit,
      tenantDetail,
      onSave,
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
</style>
