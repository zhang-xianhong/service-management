<template>
  <span v-if="dataObj.position === 'head'">
    <span class="height-light">{{ dataObj.dataArray[0] }}</span
    >{{ dataObj.dataArray[1] }}
  </span>
  <span v-else-if="dataObj.position === 'middle'">
    {{ dataObj.dataArray[0] }}<span class="height-light">{{ dataObj.dataArray[1] }}</span
    >{{ dataObj.dataArray[2] }}
  </span>
  <span v-else-if="dataObj.position === 'tail'">
    {{ dataObj.dataArray[0] }}<span class="height-light">{{ dataObj.dataArray[1] }}</span>
  </span>
  <span v-else>
    {{ dataObj.dataArray[0] }}
  </span>
</template>

<script lang="ts">
export default {
  name: 'HeightLightDiv',
  props: {
    dataObj: {
      type: Object,
      default: () => ({
        position: 'head',
        dataArray: [''],
      }),
    },
  },
};
</script>

<style lang="scss">
.height-light {
  background-color: yellow;
  color: #2c3e50;
}
</style>
