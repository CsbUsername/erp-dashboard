<template>
  <v-app>
    <Sidebar :links="sidebarLinks" :drawer="drawer"/>
    <v-main>
      <v-app-bar :elevation="1" rounded>
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>
          <router-link to="/" class="app-title">
            Dashboard ERP
          </router-link>

        </v-app-bar-title>
      </v-app-bar>

      <router-view :key="$route.fullPath"/>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import routers_list from "@/router/routers_list.js";

export default {
  components: {Sidebar},
  data: () => ({
    drawer: true,
    sidebarLinks: routers_list,
    loading: false
  }),

  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
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
