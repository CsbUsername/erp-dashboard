<script>
  import AppImportComponent from "@/components/Import/AppImportComponent.vue";

  export default {
    components:{AppImportComponent},
    props: ['sectionID'],
    computed: {
      page_title(){
        const titles = {
          orders: 'Импорт заказов КМПЗ',
          dmpz: 'Импорт заказов ДМПЗ',
          barcodes: 'Импорт штрихкодов',
          address: 'Импорт адресов',
          art_text: 'Импорт артикульных текстов',
          routers: 'Импорт маршрутов',
          cars: 'Импорт машин',
          waybills: 'Импорт путевых листов',
        }
        return titles[this.sectionID];
      }
    }
  }
</script>

<template>
  <v-card class="mh-100">
    <v-card-title>
      {{ page_title }}
    </v-card-title>
    <v-card-text>
      <AppImportComponent :section-i-d="sectionID"/>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
