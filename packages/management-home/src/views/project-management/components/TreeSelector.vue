<template>
  <el-dialog v-model="dialogVisible" width="800px">
    <el-row>
      <el-col :span="10" :offset="1">
        <div class="title">添加人员</div>
        <div>
          <div class="field-label">{{ optionLabel }}</div>
          <div class="input-wrapper">
            <el-input :placeholder="optionPlaceholder" suffix-icon="el-icon-search"></el-input>
          </div>
          <div class="tree-wrapper">
            <el-tree :data="option" :default-expand-all="true"></el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="10" :offset="2">
        <div class="title">已选择({{ modelValue.length }})</div>
        <div>
          <div class="field-label">{{ valueLabel }}</div>
          <div class="list-wrapper">
            <div v-for="(user, $index) in modelValue" :key="$index">
              <span>{{ user.label }}</span>
              <span>{{ user.department }}</span>
              <i class="el-icon-error" style="float: right;"></i>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref } from 'vue';
export default {
  name: 'TreeSelector',
  props: {
    option: {
      required: true,
      type: Array,
    },
    optionLabel: {
      required: true,
      type: String,
    },
    optionPlaceholder: {
      required: true,
      type: String,
    },
    modelValue: {
      required: true,
      type: Array,
    },
    valueLabel: {
      required: true,
      type: String,
    },
  },
  setup() {
    const dialogVisible = ref(false);
    const show = () => {
      dialogVisible.value = true;
    };
    return {
      dialogVisible,
      show,
    };
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin-top: -20px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 700;
  color: #000;
}
.field-label {
  text-align: center;
  border: 1px solid #ccc;
  border-bottom: none;
  padding: 5px 0;
  font-weight: 600;
  color: #888;
}
.input-wrapper {
  border: 1px solid #ccc;
  border-bottom: none;
  &:deep(input) {
    border: none;
  }
}
.tree-wrapper {
  border: 1px solid #ccc;
  height: 35vh;
  color: #444;
}
.list-wrapper {
  color: #444;
  border: 1px solid #ccc;
  height: calc(35vh + 34px);
  & > div {
    padding: 5px 10px;
    height: 32px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    &:hover {
      background: #f5f7fa;
    }
    span,
    i {
      line-height: 22px;
    }
    i:hover {
      color: $primary;
    }
    span + span {
      margin-left: 10px;
      color: #888;
    }
  }
}
</style>
