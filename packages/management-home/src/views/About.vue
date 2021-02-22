<template>
  <div :class="$style.primary" class="button">
    About 按钮
  </div>
</template>

<script>
import { useCssModule } from 'vue'
export default {
  setup () {
    const $style = useCssModule()
    console.log($style)
    return {
      $style
    }
  }
}
</script>

<style module>
.primary {
  color: red;
}
</style>
