/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

import 'jquery/dist/jquery.js'
import 'bootstrap/dist/js/bootstrap.js'
// Components
import App from './App.vue'
import '@/assets/css/bootstrap.min.css'

// Composables
import { createApp } from 'vue'



const app = createApp(App)

registerPlugins(app)

app.mount('#app')
