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
import { computed, defineComponent, onMounted, PropType, reactive, watch, ref } from 'vue';
import { parse, ReleaseType } from './version';
import { DEFAULT_VESION } from './release';
import { useForceUpdare } from './useVerionInput';
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
    const localValue = ref({
      major: 1,
      minor: 0,
      patch: 0,
    });

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const semVer = parse(props.lastVersion) ?? parse(DEFAULT_VESION)!;
      if (props.lastVersion) {
        semVer.inc('patch');
      }
      const { major, minor, patch } = semVer;
      localValue.value = reactive({
        major,
        minor,
        patch,
      });
    };

    init();

    watch(
      () => props.lastVersion,
      () => {
        init();
      },
    );

    const currentVersion = computed(
      () => `v${localValue.value.major}.${localValue.value.minor}.${localValue.value.patch}`,
    );
    const handleInput = (type: ReleaseType, value: string | undefined) => {
      if (value === undefined) return;

      const identifier = parseInt(value, 10);

      if (Math.sign(identifier) === -1) return;
      if (type === 'major') {
        localValue.value.major = identifier;
      }
      if (type === 'minor') {
        localValue.value.minor = identifier;
      }
      if (type === 'patch') {
        localValue.value.patch = identifier;
      }
      ctx.emit('update:modelValue', currentVersion);
    };
    onMounted(() => {
      ctx.emit('update:modelValue', currentVersion);
    });
    return {
      localValue,
      handleInput,
      ...useForceUpdare(),
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
