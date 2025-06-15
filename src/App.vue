<template>
  <v-app v-if="isLogined">
    <Sidebar
      :links="sidebarLinks"
      :drawer="drawer"
      :version="appVersion"
    />
    <ChangelogDialog
      v-if="isLogined"
      ref="changelogDialog"
      :version="appVersion"
      :changelog="changelog"
    />

    <v-main>
      <v-app-bar :elevation="1" rounded>
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>
          <div class="d-flex justify-content-between">
            <router-link to="/" class="app-title">
              Dashboard ERP
            </router-link>

            <div class="buttons-wrapper">
              <v-btn
                class="text-none mr-2"
                color="blue-darken-4"
                rounded="5"
                variant="outlined"
                prepend-icon="mdi-comment-quote-outline"
                @click="isFeedback = !isFeedback"
                v-model="isFeedback"
              >
                Обратная связь
              </v-btn>

              <v-btn
                class="text-none mr-2"
                color="red-darken-4"
                rounded="5"
                variant="outlined"
                @click="handleLogout"
              >
                Выйти
              </v-btn>
            </div>
          </div>


        </v-app-bar-title>
      </v-app-bar>

      <router-view :key="$route.fullPath"/>
      <AppFeedback
        :is-show-feedback-dialog="isFeedback"
        @close-feedback="isFeedback = false"
        @keyup.esc="isFeedback = false"
      />
    </v-main>
  </v-app>
  <AppLoginForm
    v-if="!isLogined"
    @is-login="handlerIsLogin"
    :allowedGroups="['0']"/>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import routers_list from "@/router/routers_list.js";
import AppLoginForm from "@/components/AppLoginForm.vue";
import AppFeedback from "@/components/AppFeedback.vue";
import packageJson from '../package.json';
import accessMixin from "@/mixins/accessMixin.js";
import httpMixin from "@/mixins/httpMixin.js"; // Импортируем версию из package.json
import ChangelogDialog from "@/components/ChangelogDialog.vue";


export default {
  name: "App",
  components: {AppFeedback, AppLoginForm, Sidebar, ChangelogDialog},
  mixins: [accessMixin, httpMixin],
  data: () => ({
    drawer: true,
    sidebarLinks: routers_list,
    loading: false,
    isLogined: false,
    isFeedback: false,
    appVersion: packageJson.version,
    showChangelog: false,
    changelog: [
      'Изменен функционал приема машин на ЦТФ',
    ]
  }),

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    handlerIsLogin(data) {
      console.log(data)
      this.isLogined = data.isLogin;
    },
    handleLogout() {
      localStorage.removeItem('token')
      this.isLogined = false
    }
  },

  async beforeMount() {
    if (localStorage.getItem('token')) {
      this.isLogined = true;
    }

    // Показываем changelog, если версия изменилась
    const seenVersion = localStorage.getItem('seenVersion');
    if (seenVersion !== this.appVersion) {
      // Открываем диалог после входа
      this.$nextTick(() => {
        this.$refs.changelogDialog?.openDialog();
      });
    }

    // Проверка версии приложения
    const savedVersion = localStorage.getItem('appVersion');
    if (savedVersion !== this.appVersion) {
      localStorage.setItem('appVersion', this.appVersion);
      window.location.reload(true); // Принудительная перезагрузка
    }

    await this.send_log({
      userid: this.user_id,
      fullname: this.username,
      component_id: this.$options.name,
      description: `Загрузка приложения. Вошел пользователь ${this.user_id} (${this.username})`,
    })
  }
}
</script>

<style scoped>
.app-title {
  text-decoration: none;
}

.app-title:hover {
  text-decoration: underline;
}

.app-title:visited {
  color: inherit;
}


</style>
