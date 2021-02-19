import { createApp } from 'vue'
import App from './App.vue'

import installelement from '@/plugins/initElement'
import installRouter from '@/plugins/installRouter'
import installStore from '@/plugins/installStore'

import './permission'

// eslint-disable-next-line
// @ts-ignore
const app = createApp(App)

installelement(app)
installRouter(app)
installStore(app)

app.mount('#app')
