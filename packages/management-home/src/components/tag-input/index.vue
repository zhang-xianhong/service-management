<template>
  <div class="tag-input-container" ref="container" @click="focusInput">
    <el-tag v-for="tag in modelValue" :key="tag.value" closable @close="handleClose(tag)">
      {{ tag.label }}
    </el-tag>
    <div class="input-wrap">
      <input type="text" @keydown.enter="onEnterKey" v-model="text" />
      <!-- 通过span自动撑开来动态input宽度 -->
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import _ from 'lodash/fp';
export default defineComponent({
  name: 'TagInput',
  props: {
    modelValue: {
      required: true,
      type: Array,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const container: any = ref(null);
    const text = ref(' ');

    const handleClose = ({ value = '' }) => {
      emit('update:modelValue', _.reject({ value })(props.modelValue));
    };

    const onEnterKey = () => {
      if (!text.value.trim()) return;
      emit('update:modelValue', props.modelValue.concat({ value: text.value, label: text.value }));
      text.value = ' ';
    };

    const focusInput = () => {
      container.value.querySelector('input').focus();
    };

    return {
      container,
      text,
      handleClose,
      onEnterKey,
      focusInput,
    };
  },
});
</script>
<style lang="scss" scoped>
.tag-input-container {
  font-size: 13px;
  line-height: 32px;
  display: inline-block;
  width: 100%;
  cursor: pointer;
  border: solid 1px #dcdfe6;
  padding: 0 15px;
  border-radius: 4px;
  &:hover,
  &:active,
  &:focus {
    outline: 0;
    border-color: #409eff;
  }
  &:deep(.el-tag) {
    margin-right: 5px;
  }
  div.input-wrap {
    display: inline-block;
    height: 24px;
    line-height: 22px;
    position: relative;
    padding: 0 3px;
    vertical-align: middle;
  }
  input {
    &,
    &:hover,
    &:active,
    &:focus {
      display: inline-block;
      position: absolute;
      border: none;
      outline: 0;
      width: 100%;
      line-height: 22px;
      font-size: 13px;
    }
    & + span {
      visibility: hidden;
      height: 0;
    }
  }
}
</style>
