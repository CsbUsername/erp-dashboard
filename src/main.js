/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins'

import 'jquery/dist/jquery.js'
import 'bootstrap/dist/js/bootstrap.js'
// Components
import App from './App.vue'
import '@/assets/css/bootstrap.min.css'
import '@/assets/css/style.css'
import highlight from "@/plugins/highlight.js";
import hljsDirective from '@/directives/highlight'


// Composables
import {createApp} from 'vue'


const app = createApp(App)

registerPlugins(app)

app.use(highlight)

app.directive('highlight', hljsDirective)

app.mount('#app')
