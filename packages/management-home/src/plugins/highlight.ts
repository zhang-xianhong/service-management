import hljs from 'highlight.js';
import 'highlight.js/scss/vs.scss';
hljs.configure({});
export const addHighLight = (app: any) => {
  app.directive('highlight', {
    mounted(el: HTMLElement) {
      const blocks = el.querySelectorAll('pre code');
      blocks.forEach((block: any) => {
        hljs.highlightBlock(block);
      });
    },
    updated(el: HTMLElement) {
      const blocks = el.querySelectorAll('pre code');
      blocks.forEach((block: any) => {
        hljs.highlightBlock(block);
      });
    },
  });
};
