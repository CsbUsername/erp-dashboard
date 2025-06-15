import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql"
import 'highlight.js/styles/github.min.css'

hljs.registerLanguage('sql', sql)

export default {
  install(app) {
    // Добавляем глобально как $hljs
    app.config.globalProperties.$hljs = hljs
  }
}
