<template>
  <div class="business-edit-advance">
    <el-form label-position="top" :model="advanceForm">
      <el-form-item label="对象依赖" prop="objDep">
        <el-input :value="advanceForm.objDep.join()" readonly class="readonly-input"></el-input>
      </el-form-item>
      <el-form-item label="服务依赖" prop="svcDep">
        <el-input
          placeholder="请选择服务"
          :value="advanceForm.svcDep.join()"
          readonly
          class="readonly-input"
        ></el-input>
      </el-form-item>
      <el-form-item label="库依赖" prop="libDep">
        <el-input placeholder="请输入库信息" :value="advanceForm.libDep.join()"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, Ref, defineComponent } from 'vue';

interface AdvanceForm {
  objDep: Array<Record<string, string>>;
  svcDep: Array<Record<string, string>>;
  libDep: Array<Record<string, string>>;
}

export default defineComponent({
  name: 'BusinessEditBasic',
  setup() {
    const advanceForm: Ref<AdvanceForm> = ref({
      objDep: [],
      svcDep: [],
      libDep: [],
    });
    return {
      advanceForm,
    };
  },
});
</script>

<style lang="scss" scoped>
.business-edit-advance {
  .readonly-input::v-deep input {
    cursor: pointer;
  }
}
</style>
