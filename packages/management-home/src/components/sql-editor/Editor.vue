<template>
  <div class="code-ace-editor" :style="wrapStyles"></div>
</template>

<script>
import ace from 'brace';
import 'brace/ext/language_tools';
import 'brace/mode/sql';
import 'brace/snippets/sql';
import 'brace/theme/chrome';
import { format } from 'sql-formatter';
export default {
  name: 'BAceEditor',
  props: {
    modelValue: String,
    lang: {
      type: String,
      default: 'json',
    },
    theme: {
      type: String,
      default: 'chrome',
    },
    height: {
      type: String,
      default: '350',
    },
    width: {
      type: String,
      default: '100%',
    },
    fontSize: {
      type: Number,
      default: 12,
    },
    options: Object,
    readonly: Boolean,
    wrap: {
      type: Boolean,
      default: false,
    },
    snippets: {
      type: Boolean,
      default: true,
    },
    styles: {
      type: Object,
    },
  },
  data() {
    return {
      editor: null,
      contentBackup: '',
    };
  },
  emits: ['blur', 'init', 'update:modelValue', 'change'],
  computed: {
    wrapStyles() {
      return {
        width: this.width ? this.px(this.width) : '100%',
        height: this.height ? this.px(this.height) : '100%',
        border: '1px solid #e8e8e8',
        ...this.styles,
      };
    },
  },
  methods: {
    px(n) {
      return /^\d*$/.test(n) ? `${n}px` : n;
    },
    getValue() {
      return this.editor.getValue();
    },
    handleBlur(event) {
      this.$emit('blur', event);
    },
  },
  watch: {
    modelValue(val) {
      if (this.contentBackup !== val) {
        this.editor.session.setValue(val, 1);
        this.contentBackup = val;
      }
    },
    theme(newTheme) {
      this.editor.setTheme(`ace/theme/${newTheme}`);
    },
    lang(newLang) {
      this.editor.getSession().setMode(`ace/mode/${newLang}`);
    },
    options(newOption) {
      this.editor.setOptions(newOption);
    },
    fontSize(newSize) {
      this.editor.setFontSize(newSize);
    },
    readonly(val) {
      this.editor.setReadOnly(val);
    },
    height() {
      this.$nextTick(() => {
        this.editor.resize();
      });
    },
    width() {
      this.$nextTick(() => {
        this.editor.resize();
      });
    },
  },
  beforeUnmount() {
    this.editor.destroy();
    this.editor.container.remove();
  },
  mounted() {
    const vm = this;
    const { lang, theme } = this;
    vm.editor = ace.edit(this.$el);
    const editor = ace.edit(this.$el);
    editor.getSession().setMode(`ace/mode/${lang}`);
    editor.setTheme(`ace/theme/${theme}`);
    editor.$blockScrolling = Infinity;
    editor.setFontSize(this.fontSize);
    editor.setReadOnly(this.readonly);
    editor.getSession().setUseWrapMode(this.wrap);
    editor.setShowPrintMargin(false);
    editor.getSession().setTabSize(2);

    editor.setOptions({
      enableBasicAutocompletion: this.snippets,
      enableSnippets: this.snippets,
      enableLiveAutocompletion: this.snippets,
    });

    this.$emit('init', editor);

    if (this.modelValue) {
      editor.setValue(this.modelValue, 1);
      editor.gotoLine(0, 0, false);
    }
    this.contentBackup = this.modelValue;

    editor.on('change', () => {
      const content = editor.getValue();
      vm.$emit('update:modelValue', content);
      vm.$emit('change', content);
      vm.contentBackup = content;
    });
    editor.on('blur', () => {
      this.handleBlur();
      const content = format(editor.getValue());
      vm.$emit('update:modelValue', content);
      vm.$emit('change', content);
      vm.contentBackup = content;
      editor.setValue(content, 1);
    });
    if (vm.options) {
      editor.setOptions(vm.options);
    }
  },
};
</script>
