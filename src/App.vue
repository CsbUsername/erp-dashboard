<template>
  <v-app v-if="isLogined">
    <Sidebar :links="sidebarLinks" :drawer="drawer"/>
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


        </v-app-bar-title>
      </v-app-bar>

      <router-view :key="$route.fullPath"/>
    </v-main>
  </v-app>
  <AppLoginForm v-if="!isLogined" @is-login="handlerIsLogin" :allowedGroups="['0']"/>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import routers_list from "@/router/routers_list.js";
import AppLoginForm from "@/components/AppLoginForm.vue";

export default {
  components: {AppLoginForm, Sidebar},
  data: () => ({
    drawer: true,
    sidebarLinks: routers_list,
    loading: false,
    isLogined: false,
  }),

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    handlerIsLogin(data){
      console.log(data)
      this.isLogined = data.isLogin;
    },
    handleLogout(){
      localStorage.removeItem('token')
      this.isLogined = false
    }
  },

  beforeMount() {
    if (localStorage.getItem('token')) {
      this.isLogined = true;
    }
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
