<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '../components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
    components: {
    HelloWorld
  }
})
</script>
