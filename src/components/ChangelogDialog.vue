<script>
export default {
  name: 'ChangelogDialog',
  props: {
    version: String,
    changelog: Array,
  },
  data: () => ({
    show: false
  }),
  methods: {
    openDialog() {
      this.show = true;
    },
    closeDialog() {
      localStorage.setItem('seenVersion', this.version);
      this.show = false;
    }
  }
}
</script>


<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title class="headline">
        Что нового в версии {{ version }}
      </v-card-title>

      <v-card-text>
        <v-list>
          <v-list-item v-for="(item, index) in changelog" :key="index"
                       prepend-icon="mdi mdi-arrow-right-thin-circle-outline">
            {{ item }}
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeDialog">Понятно</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
