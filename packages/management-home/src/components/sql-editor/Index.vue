<template>
  <t-ace-editor
    class="code-ace-editor"
    v-model="editorValue"
    :lang="cmOptions.lang"
    width="100%"
    height="300"
    :theme="cmOptions.theme"
    :readonly="cmOptions.readonly"
    :font-size="cmOptions.fontSize"
    :wrap="cmOptions.wrap"
  ></t-ace-editor>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue';
import TAceEditor from './Editor.vue';
import 'brace/ext/language_tools';
import 'brace/mode/sql';
import 'brace/snippets/sql';
import 'brace/theme/chrome';

export default defineComponent({
  name: 'CodeEditor',
  components: {
    TAceEditor,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const editorValue = ref(props.value);
    const cmOptions = reactive({
      lang: 'sql',
      readonly: false,
      theme: 'chrome',
      fontSize: 12,
      wrap: true,
    });
    return {
      editorValue,
      cmOptions,
    };
  },
});
</script>
<style>
.code-ace-editor.ace_editor * {
  font: 12px / normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace !important;
}
</style>
