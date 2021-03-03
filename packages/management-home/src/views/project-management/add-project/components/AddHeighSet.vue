<template>
  <div class="add-heigh-set">
    <el-form :model="heigherSetForm" label-position="top">
      <el-form-item label="继承星级">
        <el-slider v-model="heigherSetForm.extends" :step="10" show-stops> </el-slider>
      </el-form-item>
      <el-form-item label="在创建模块页面的时候是否启用模板功能">
        <el-radio-group v-model="heigherSetForm.template">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="在创建模型的时候是否必须选择其对应需求">
        <el-radio-group v-model="heigherSetForm.tapds">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否禁用接口单元测试">
        <el-radio-group v-model="heigherSetForm.test">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否将跨服务调用导向NGINX">
        <el-radio-group v-model="heigherSetForm.nginx">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="删除服务时是否检测依赖">
        <el-radio-group v-model="heigherSetForm.deleteService">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="删除模块时是否检测依赖">
        <el-radio-group v-model="heigherSetForm.deleteModules">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="删除对象时是否检测依赖">
        <el-radio-group v-model="heigherSetForm.deleteObject">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否限制对象属性">
        <el-radio-group v-model="heigherSetForm.limitProps">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="代码生成器模板">
        <el-radio-group v-model="heigherSetForm.codeTemplate">
          <el-radio label="默认模板"></el-radio>
          <el-radio label="TSF模板"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="腾讯TSF项目ID">
        <el-input v-model="heigherSetForm.tsfId"></el-input>
      </el-form-item>
      <el-form-item label="行业性质">
        <el-checkbox-group v-model="heigherSetForm.others">
          <el-checkbox label="GIS" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { heigherSetForm } from '@/views/project-management/add-project/components/addProjectBus';

export default defineComponent({
  name: 'AddHeighSet',
  setup() {
    return {
      heigherSetForm,
    };
  },
});
</script>

<style lang="scss">
.add-heigh-set {
  width: 40%;
  padding-left: 40px;
}
</style>
