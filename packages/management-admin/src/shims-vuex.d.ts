import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  // 声明State数据结构
  type State = {};

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
