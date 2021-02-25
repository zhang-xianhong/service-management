<template>
  <div class="add-base-info">
    <el-form :model="baseInfoForm" label-width="140px">
      <el-form-item label="项目名称">
        <el-input v-model="baseInfoForm.projectName"></el-input>
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input v-model="baseInfoForm.projectDescirption"></el-input>
      </el-form-item>
      <el-form-item label="项目别名">
        <el-input v-model="baseInfoForm.projectOtherName"></el-input>
      </el-form-item>
      <el-form-item label="项目级别">
        <el-radio-group v-model="baseInfoForm.level">
          <el-radio label="平台级"></el-radio>
          <el-radio label="产品级"></el-radio>
          <el-radio label="租户级"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否经营性项目">
        <el-radio-group v-model="baseInfoForm.operate">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="许可模式">
        <el-radio-group v-model="baseInfoForm.acceetMode">
          <el-radio label="永久"></el-radio>
          <el-radio label="租用"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预估新增微服务">
        <el-input-number v-model="baseInfoForm.micoPrecount"></el-input-number>
      </el-form-item>
      <el-form-item label="库依赖">
        <el-input v-model="baseInfoForm.modules" placeholder="请输入库依赖信息"></el-input>
      </el-form-item>
      <el-form-item label="负责人">
        <el-select v-model="baseInfoForm.persion" multiple clearable collapse-tags placeholder="请选择">
          <el-option v-for="item in persions" :key="item.id" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板">
        <el-input v-model="baseInfoForm.projectModel" placeholder="new"></el-input>
      </el-form-item>
      <el-form-item label="日志文件大小">
        <el-input-number v-model="baseInfoForm.logs"></el-input-number>&nbsp;&nbsp;
        <span>Mbs</span>
      </el-form-item>
      <el-form-item label="修改次数">
        <el-input-number v-model="baseInfoForm.changeCount" disabled></el-input-number>
      </el-form-item>
      <el-form-item label="变更历史">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" disabled v-model="baseInfoForm.changeLogs">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { baseInfoForm } from '@/views/projectManagement/add-project/components/addProjectBus';

export default defineComponent({
  name: 'addBaseInfo',
  data() {
    return {
      persions: [
        {
          name: 'aiden',
          id: 'i12345',
        },
      ],
    };
  },
  setup() {
    return {
      baseInfoForm,
    };
  },
});
</script>

<style lang="scss">
.add-base-info {
  width: 40%;
}
</style>
