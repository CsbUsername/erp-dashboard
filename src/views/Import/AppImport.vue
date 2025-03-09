<script>
  import AppImportComponent from "@/components/Import/AppImportComponent.vue";

  export default {
    components:{AppImportComponent},
    props: ['sectionID']
  }
</script>

<template>
  <v-card class="mh-100">
    <v-card-title>
      Импорт заказов
    </v-card-title>
    <v-card-text>
      <AppImportComponent :section-i-d="sectionID"/>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
