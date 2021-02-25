<template>
  <div class="add-code-template">
    <el-form :model="codeTemplateForm" label-position="top">
      <el-form-item label="default zone">
        <el-input v-model="codeTemplateForm.zone"></el-input>
      </el-form-item>
      <el-form-item label="spring boot version">
        <el-input v-model="codeTemplateForm.bootVision"></el-input>
      </el-form-item>
      <el-form-item label="spring cloud version">
        <el-input v-model="codeTemplateForm.cloudVersion"></el-input>
      </el-form-item>
      <el-form-item label="project version">
        <el-input v-model="codeTemplateForm.projectVision"></el-input>
      </el-form-item>
      <el-form-item label="sonar ip">
        <el-input v-model="codeTemplateForm.sonarIp"></el-input>
      </el-form-item>
      <el-form-item label="sonar port">
        <el-input v-model="codeTemplateForm.sonarPort"></el-input>
      </el-form-item>
      <el-form-item label="sonar username">
        <el-input v-model="codeTemplateForm.sonarUsername"></el-input>
      </el-form-item>
      <el-form-item label="sonar password">
        <el-input v-model="codeTemplateForm.sonarPassword"></el-input>
      </el-form-item>
      <el-form-item label="maven ip">
        <el-input v-model="codeTemplateForm.mavenIp"></el-input>
      </el-form-item>
      <el-form-item label="maven port">
        <el-input v-model="codeTemplateForm.mavenPort"></el-input>
      </el-form-item>
      <el-form-item label="其他">
        <el-checkbox-group v-model="codeTemplateForm.others">
          <el-checkbox label="use fast maven repository" name="type"></el-checkbox>
          <el-checkbox label="sonar enabled" name="type"></el-checkbox>
          <el-checkbox label="es enabled" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { codeTemplateForm } from './addProjectBus'

export default defineComponent({
  name: 'AddCodeTemplate',
  setup () {
    return {
      codeTemplateForm
    }
  }
})
</script>

<style lang="scss">
.add-code-template{
  width: 40%;
  padding-left: 40px;
}
</style>
