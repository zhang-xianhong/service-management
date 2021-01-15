import { App } from 'vue';
import { createStore } from 'vuex';

const inDevEnv = process.env.VUE_APP_ENV === 'local';

const store = createStore({
  modules: {},
  strict: !!inDevEnv,
});

export function setupStore(app: App<Element>) {
  app.use(store);
}

export default store;
