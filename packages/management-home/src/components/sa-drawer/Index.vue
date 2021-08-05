<template>
  <div class="sa-drawer" :class="`sa-drawer--${position}`" ref="elRef" :style="{ zIndex: zIndex }" v-show="visible">
    <transition name="slide-fade">
      <aside class="sa-drawer__body" :class="`${panelClass} ${resizeable ? 'with-resizebar' : ''}`" :style="styles">
        <div class="sa-drawer__resizebar" @mousedown="handleMouseDown" v-if="resizeable"></div>
        {{ visibile }}
        <slot />
      </aside>
    </transition>
    <div class="sa-drawer__backdrop" v-if="backdrop" @click="handleClose"></div>
  </div>
</template>
<script>
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

export default defineComponent({
  name: 'SaDrawer',
  props: {
    position: {
      type: String,
      default: 'bottom',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    resizeable: {
      type: Boolean,
      default: true,
    },
    backdrop: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 10000,
    },
    panelClass: {
      type: String,
      default: '',
    },
    /**
     * Drawer 面板尺寸
     */
    size: {
      type: [Number, String],
      default: '30%',
      validator(size) {
        const parsedSize = parseFloat(size);
        const valid = typeof size === 'number' || (!isNaN(parsedSize) && parsedSize >= 0 && parsedSize <= 100);
        return valid;
      },
    },
    /**
     * Drawer 面板最小尺寸
     */
    minSize: {
      type: [Number, String],
      default: 0,
      validator(size) {
        const parsedSize = parseFloat(size);
        const valid = typeof size === 'number' || (!isNaN(parsedSize) && parsedSize >= 0 && parsedSize <= 100);
        return valid;
      },
    },
    /**
     * Drawer 面板最大尺寸
     */
    maxSize: {
      type: [Number, String],
      default: '100%',
      validator(size) {
        const parsedSize = parseFloat(size);
        const valid = typeof size === 'number' || (!isNaN(parsedSize) && parsedSize >= 0 && parsedSize <= 100);
        return valid;
      },
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const rect = reactive({
      width: 0,
      height: 0,
      minWidth: 0,
      maxWidth: 0,
      minHeight: 0,
      maxHeight: 0,
    });

    const resizeInfo = reactive({
      offsetX: 0,
      offsetY: 0,
      mouseX: 0,
      mouseY: 0,
      resizing: false,
    });
    const visible = ref(props.modelValue);
    const elRef = ref(null);
    const isHorizontal = computed(() => ['left', 'right'].includes(props.position));

    const getSizeNumber = (size) => {
      if (typeof size === 'number') {
        return size;
      }
      const parentSize = isHorizontal.value ? window.innerWidth : window.innerHeight;
      const newSize = parentSize * (parseFloat(size) / 100);
      return parseInt(newSize, 10);
    };
    const getWidth = () => {
      if (isHorizontal.value) {
        return getSizeNumber(props.size);
      }
      return window.innerWidth;
    };
    const getHeight = () => {
      if (isHorizontal.value) {
        return window.innerHeight;
      }
      return getSizeNumber(props.size);
    };

    const getMinWidth = () => {
      if (isHorizontal.value) {
        return getSizeNumber(props.minSize);
      }
      return window.innerWidth;
    };
    const getMaxWidth = () => {
      if (isHorizontal.value) {
        return getSizeNumber(props.maxSize);
      }
      return window.innerWidth;
    };
    const getMinHeight = () => {
      if (isHorizontal.value) {
        return window.innerHeight;
      }
      return getSizeNumber(props.minSize);
    };

    const getMaxHeight = () => {
      if (isHorizontal.value) {
        return window.innerHeight;
      }
      return getSizeNumber(props.maxSize);
    };

    const calcRectInfo = () => {
      if (!visible.value) {
        return;
      }
      rect.width = getWidth();
      rect.height = getHeight();
      rect.minWidth = getMinWidth();
      rect.maxWidth = getMaxWidth();
      rect.minHeight = getMinHeight();
      rect.maxHeight = getMaxHeight();
    };

    const styles = computed(() => {
      if (isHorizontal.value) {
        return {
          width: `${rect.width}px`,
        };
      }
      return {
        height: `${rect.height}px`,
      };
    });

    const handleMouseMove = (e) => {
      if (!resizeInfo.resizing) {
        return;
      }
      let diffX = e.clientX - resizeInfo.mouseX + resizeInfo.offsetX;
      let diffY = e.clientY - resizeInfo.mouseY + resizeInfo.offsetY;
      resizeInfo.offsetX = 0;
      resizeInfo.offsetY = 0;
      switch (props.position) {
        case 'top':
          if (rect.height + diffY < rect.minHeight) {
            rect.offsetY = diffY - (diffY = rect.minHeight - rect.height);
          } else if (rect.height + diffY > rect.maxHeight) {
            rect.offsetY = diffY - (diffY = rect.maxHeight - rect.height);
          }
          rect.height += diffY;
          break;
        case 'right':
          if (rect.width - diffX < rect.minWidth) {
            rect.offsetX = diffX - (diffX = rect.width - rect.minWidth);
          } else if (rect.width - diffX > rect.maxWidth) {
            rect.offsetX = diffX - (diffX = rect.width - rect.maxWidth);
          }
          rect.width -= diffX;
          break;
        case 'bottom':
        default:
          if (rect.height - diffY < rect.minHeight) {
            rect.offsetY = diffY - (diffY = rect.height - rect.minHeight);
          } else if (rect.height - diffY > rect.maxHeight) {
            rect.offsetY = diffY - (diffY = rect.height - rect.maxHeight);
          }
          rect.height -= diffY;
          break;
        case 'left':
          if (rect.width + diffX < rect.minWidth) {
            rect.offsetX = diffX - (diffX = rect.minWidth - rect.width);
          } else if (rect.width + diffX > rect.maxWidth) {
            rect.offsetX = diffX - (diffX = rect.maxWidth - rect.width);
          }
          rect.width += diffX;
          break;
      }
      resizeInfo.mouseX = e.clientX;
      resizeInfo.mouseY = e.clientY;
      resizeInfo.resizing = true;
    };
    const handleMouseUp = () => {
      document.documentElement.removeEventListener('mousemove', handleMouseMove, true);
      document.documentElement.removeEventListener('mousemove', handleMouseUp, true);
      resizeInfo.resizing = false;
    };

    const handleMouseDown = (e) => {
      e.stopPropagation();
      e.preventDefault();
      // calcRectInfo();
      resizeInfo.offsetX = 0;
      resizeInfo.offsetY = 0;
      resizeInfo.mouseX = e.clientX;
      resizeInfo.mouseY = e.clientY;
      resizeInfo.resizing = true;
      document.documentElement.addEventListener('mousemove', handleMouseMove, true);
      document.documentElement.addEventListener('mouseup', handleMouseUp, true);
    };

    watch(
      () => props.modelValue,
      (v) => {
        visible.value = v;
        calcRectInfo();
      },
    );

    onMounted(() => {
      elRef.value && document.body.appendChild(elRef.value);
      calcRectInfo();
    });
    onBeforeUnmount(() => {
      handleMouseUp();
      elRef.value && document.body.removeChild(elRef.value);
    });

    const handleClose = () => {
      visible.value = false;
      emit('update:modelValue', visible.value);
    };

    return {
      rect,
      elRef,
      styles,
      visible,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleClose,
    };
  },
});
</script>
<style lang="scss" scoped>
.sa-drawer {
  position: fixed;
  font-size: 12px;
  font-weight: normal;

  &.sa-drawer--top,
  &.sa-drawer--bottom {
    width: 100vw;
    left: 0;
    .sa-drawer__body {
      width: 100%;
    }
  }
  &.sa-drawer--left,
  &.sa-drawer--right {
    height: 100vw;
    top: 0;
    .sa-drawer__body {
      height: 100%;
    }
  }
  &.sa-drawer--top {
    top: 0;
    .sa-drawer__body {
      top: 0;
      &.with-resizebar {
        padding-bottom: 10px;
      }
    }
    .sa-drawer__resizebar {
      left: 0;
      width: 100%;
      height: 10px;
      bottom: 0;
      cursor: ns-resize;
    }
  }
  &.sa-drawer--bottom {
    bottom: 0;
    .sa-drawer__body {
      bottom: 0;
      &.with-resizebar {
        padding-top: 10px;
      }
    }
    .sa-drawer__resizebar {
      left: 0;
      width: 100%;
      height: 10px;
      top: 0;
      cursor: ns-resize;
    }
  }
  &.sa-drawer--left {
    left: 0;
    .sa-drawer__body {
      left: 0;
    }
    .sa-drawer__resizebar {
      right: 0;
      width: 10px;
      height: 100%;
      top: 0;
      cursor: ew-resize;
    }
  }
  &.sa-drawer--right {
    right: 0;
    .sa-drawer__body {
      right: 0;
    }
    .sa-drawer__resizebar {
      left: 0;
      width: 10px;
      height: 100%;
      top: 0;
      cursor: ew-resize;
    }
  }
}
.sa-drawer__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.sa-drawer__body {
  z-index: 1;
  position: absolute;
  overflow: hidden;
  background-color: white;
  box-shadow: 0px 3px 14px 2px rgb(0 0 0 / 5%), 0px 8px 10px 1px rgb(0 0 0 / 6%), 0px 5px 5px -3px rgb(0 0 0 / 10%);
  .sa-drawer__resizebar {
    position: absolute;
  }
}
.slide-fade-enter-active {
  transition: all 0.3s ease-in;
}

.slide-fade-leave-active {
  transition: all 0.8s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(440px);
  height: 0;
}
</style>
