<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import {th} from "vuetify/locale";
import OrderExportPanel from "@/components/Orders/OrderExportPanel.vue";

export default {
  components: {OrderExportPanel},
  mixins: [httpMixin],
  props: ['order_id'],
  data: () => ({
    export_data: {
      tara: {
        headers: [
          "НомерЗаказаCSB",
          "КоличествоТары",
          "ВесТары",
          "КоличествоПалет",
          "ВесПалет",
          "УсловиеВидаТары"
        ],
        data: {}
      },
      production_dates: {
        headers: [
          "НомерЗаказаCSB",
          "АртикулCSB",
          "ДатаПроизводства",
          "Количество"
        ],
        data: {}
      },
      art_perersort: {
        headers: ['НомерЗаказаCSB', 'АртикулCSB', 'Количетсво', 'КоличетсвоДоп', 'ПодартикулCSB'],
        data: {}
      },
      download_1c: {
        headers: ['НомерЗаказаCSB', 'НомерЗаказа', 'МестоОтгрузки', 'УИДЗаказа', 'НомерПалеты', 'АртикулCSB', 'ДатаПартии', 'НомерМаршрутаCSB', 'КодМастерДанныхТС', 'КодМастерДанныхТТ', 'Вес', 'Количество', 'КоличествоМест', 'ВесТары', 'ВесПалеты', 'УсловиеВидаТары', 'Контроль', 'Запрет', 'КоличествоВложений'],
        data: {}
      }
    }
  }),


  async mounted() {
    this.export_data.tara.data = await this.sendRequest({
      method: "GET",
      url: URLS.ORDERS.EXPORT_TARA + this.order_id
    })

    this.export_data.production_dates.data = await this.sendRequest({
      method: "GET",
      url: URLS.ORDERS.EXPORT_PRODUCTION_DATES + this.order_id
    })

    this.export_data.production_dates.data = await this.sendRequest({
      method: "GET",
      url: URLS.ORDERS.EXPORT_PRODUCTION_DATES + this.order_id
    })


    this.export_data.download_1c.data = await this.sendRequest({
      method: "GET",
      url: URLS.ORDERS.EXPORT_DOWNLOAD_1C + this.order_id
    })
  }
}
</script>

<template>
  <v-container>

    <v-expansion-panels class="my-4" variant="popout">
      <OrderExportPanel title="Позиции заказа"
                        :data="export_data.download_1c.data"
                        :headers="export_data.download_1c.headers"/>

      <OrderExportPanel title="Данные по таре"
                        :data="export_data.tara.data"
                        :headers="export_data.tara.headers"/>

      <OrderExportPanel title="Даты партий"
                        :data="export_data.production_dates.data"
                        :headers="export_data.production_dates.headers"/>

      <OrderExportPanel title="Пересорт артикулов"
                        :data="export_data.art_perersort.data"
                        :headers="export_data.art_perersort.headers"/>

    </v-expansion-panels>

  </v-container>
</template>

<style scoped>

</style>
