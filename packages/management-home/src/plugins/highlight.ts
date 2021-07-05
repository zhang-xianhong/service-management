import hljs from 'highlight.js';
import 'highlight.js/scss/vs.scss';

export const addHighLight = (app: any) => {
  app.directive('highlight', {
    mounted(el: HTMLElement) {
      hljs.configure({ useBR: true });
      const blocks = el.querySelectorAll('pre code');
      blocks.forEach((block: any) => {
        hljs.highlightBlock(block);
      });
    },
  });
};
