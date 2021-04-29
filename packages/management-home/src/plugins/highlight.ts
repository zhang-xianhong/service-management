import hljs from 'highlight.js';
import 'highlight.js/scss/vs.scss';

export const addHighLight = (app: any) => {
  app.directive('highlight', (el: any) => {
    hljs.configure({ useBR: true });
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block: any) => {
      hljs.highlightBlock(block);
    });
  });
};
