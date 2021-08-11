<template>
  <div class="verion-input__container" :key="renderKey">
    <el-input-number
      class="verion-input__item"
      :modelValue="localValue.major"
      :min="1"
      :max="999"
      :controls="false"
      @blur="forceUpdate"
      @change="handleInput('major', $event)"
    ></el-input-number>
    <el-input-number
      class="verion-input__item"
      :controls="false"
      :min="0"
      :max="999"
      :modelValue="localValue.minor"
      @blur="forceUpdate"
      @change="handleInput('minor', $event)"
    ></el-input-number>
    <el-input-number
      class="verion-input__item"
      :controls="false"
      :modelValue="localValue.patch"
      :min="0"
      :max="999"
      @change="handleInput('patch', $event)"
      @blur="forceUpdate"
    ></el-input-number>
    <span> 上一个版本号: {{ lastVersion }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref, toRef } from 'vue';
import { parse, ReleaseType } from './version';
import { DEFAULT_VESION } from './release';
export default defineComponent({
  name: 'VersionInput',
  props: {
    lastVersion: {
      type: String as PropType<string>,
      default: '',
    },
    modelValue: {
      type: String as PropType<string>,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const lastVersion = toRef(props, 'lastVersion');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const semVer = parse(lastVersion.value) ?? parse(DEFAULT_VESION)!;
    if (lastVersion.value) {
      //
      semVer.inc('patch');
    }
    const { major, minor, patch } = semVer;
    const localValue = reactive({
      major,
      minor,
      patch,
    });

    const renderKey = ref(0);
    const forceUpdate = () => {
      renderKey.value += 1;
    };

    const currentVersion = computed(() => `v${localValue.major}.${localValue.minor}.${localValue.patch}`);
    const handleInput = (type: ReleaseType, value: string | undefined) => {
      if (value === undefined) return;

      const identifier = parseInt(value, 10);

      if (Math.sign(identifier) === -1) return;
      if (type === 'major') {
        localValue.major = identifier;
      }
      if (type === 'minor') {
        localValue.minor = identifier;
      }
      if (type === 'patch') {
        localValue.patch = identifier;
      }
      ctx.emit('update:modelValue', currentVersion);
    };
    onMounted(() => {
      ctx.emit('update:modelValue', currentVersion);
    });
    return {
      localValue,
      renderKey,
      handleInput,
      forceUpdate,
    };
  },
});
</script>
<style scope>
.verion-input__container {
  display: flex;
  align-items: center;
  gap: 1em;
}
.verion-input__item {
  width: 60px;
}
</style>
