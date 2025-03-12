<script>

export default {
  props: ['links', 'drawer'],
  data() {
    return {
      d: this.drawer
    }
  },
  computed: {
    username() {
      const token_data = JSON.parse(localStorage.getItem('token'))
      return token_data.username || 'Guest'
    }
  },

  updated() {
    this.d = this.drawer
  }
}
</script>
<template>
  <v-navigation-drawer v-model="d" color="#425C5A" class="rounded-e-xl">
    <v-sheet color="#3D5654" class="pa-4 rounded-te-xl text-center">
      <v-progress-circular model-value="80" color="#B49239" :size="100" width="2">
        <v-avatar size="85">
          <v-img src="@/assets/avatar.png"></v-img>
        </v-avatar>
      </v-progress-circular>
      <div class="mt-4">{{ username }}</div>
      <span class="mb-6 text-caption">username@apkholding.ru</span>
      <div>
        <span class="mb-6 text-caption">Версия 0.0.1</span>
      </div>
    </v-sheet>

    <v-list>
      <v-list-group :value="item.item" v-for="(item, i) in links" :key="i">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="item.title"
          ></v-list-item>
        </template>

        <v-list-item active-class="border" v-for="(elem, i) in item.items" :key="i">
          <v-list>
            <template v-slot:prepend>
              <v-icon :icon="elem.icon" color="#B49239"></v-icon>
            </template>
            <router-link :to="elem.url" style="text-decoration: none; color: inherit;">
              <v-list-item-title v-text="elem.text.toUpperCase()" class="text-wrap sidebar-item"></v-list-item-title>
            </router-link>
          </v-list>
        </v-list-item>
      </v-list-group>
    </v-list>

  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-item {
  overflow-wrap: normal;
  overflow: hidden;
  padding: 0;
  z-index: 999;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: normal;
  word-wrap: break-word;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: .009375em;
  line-height: 1.5;
  text-transform: none;
}
</style>
