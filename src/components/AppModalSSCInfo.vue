<script>
import AppSSCCInfo from "@/components/SSCC/AppSSCCInfo.vue";

export default {
  components: {AppSSCCInfo},
  emits: ['hideDialog'],
  props: ['isShow', 'showDetailsSSCC'],
  data: () => ({
    showDetails: false
  }),
  methods: {
    hideDialog() {
      this.showDetails = false
      this.$emit('hideDialog')
    }
  },
  mounted() {
    this.showDetails = this.isShow
  },
  beforeUpdate() {
    this.showDetails = this.isShow
  }
}
</script>

<template>
  <div class="text-center pa-4 overflow-y-scroll">
    <v-dialog
      v-model="showDetails"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <v-card>
        <v-toolbar color="primary">
          <v-spacer></v-spacer>

          <v-toolbar-items>
            <v-btn
              prepend-icon="mdi-close"
              variant="text"
              @click="hideDialog"
            ></v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <AppSSCCInfo :sscc="showDetailsSSCC"/>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

</style>
