<template>
  <div class="item">
    <span class="item-title">{{ title }}</span>
    <span class="item-value">
      <el-input
        :class="{ 'item-value__input--show': !isModifyMode }"
        :readonly="!isModifyMode"
        :placeholder="isModifyMode ? `请输入${title}` : ''"
        v-model="recentValue"
      ></el-input>
    </span>
    <span v-show="changable" class="item-operation">
      <template v-if="isModifyMode">
        <a @click="onSave">保存</a>
        <a @click="onCancel">取消</a>
      </template>
      <template v-else>
        <a @click="onModify">修改</a>
      </template>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch, watchEffect, getCurrentInstance, SetupContext } from 'vue';
import { updateProfile } from '@/api/user';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Item',
  props: {
    title: {
      type: String,
      default: '',
    },
    prop: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    changable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: { title: string; prop: string; value: string }, ctx: SetupContext) {
    const instance = getCurrentInstance();
    const initialValue: Ref<string> = ref('');
    const recentValue: Ref<string> = ref('');
    const isModifyMode: Ref<boolean> = ref(false);

    watch(
      () => props.value,
      (newValue: string) => {
        initialValue.value = newValue;
      },
      {
        immediate: true,
      },
    );

    watchEffect(() => {
      recentValue.value = initialValue.value;
    });

    const onSave = async () => {
      if (props.prop === 'displayName' || recentValue.value.length > 20) {
        return ElMessage.warning('管理员姓名长度在2-20个字符之间');
      }
      const { code } = await updateProfile({ [props.prop]: recentValue.value });
      if (code === 0) {
        (instance as any).proxy.$message({
          type: 'success',
          message: '保存成功',
        });
        isModifyMode.value = false;
      }
    };

    const onCancel = () => {
      recentValue.value = initialValue.value;
      isModifyMode.value = false;
    };

    const onModify = () => {
      if (ctx.attrs.onModify) {
        ctx.emit('modify');
        return;
      }
      isModifyMode.value = true;
    };

    return {
      initialValue,
      recentValue,
      isModifyMode,
      onSave,
      onCancel,
      onModify,
    };
  },
});
</script>

<style lang="scss">
.item-value {
  &__input--show {
    .el-input__inner {
      border-color: transparent;
    }
  }
}
</style>

<style scoped lang="scss">
.item {
  width: 100%;
  align-items: center;
  display: flex;
  height: 50px;
  border-top: 1px solid #e6e6e6;
  padding-right: 50%;
  &-title {
    width: 260px;
    &::after {
      content: '*';
      color: #f56c6c;
      margin-left: 4px;
    }
  }
  &-value {
    flex: 1;
  }
  &-operation {
    width: 80px;
    margin-left: 30px;
    a {
      margin-right: 8px;
    }
  }
}
</style>
