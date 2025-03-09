<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import OrderHeader from "@/components/Orders/OrderHeader.vue";
import OrderPositions from "@/components/Orders/OrderPositions.vue";
import OrderImport from "@/components/Orders/OrderImport.vue";
import OrderExport from "@/components/Orders/OrderExport.vue";

export default {
  components: {OrderExport, OrderImport, OrderPositions, OrderHeader},
  mixins: [httpMixin],
  data: () => ({
    order: null,
    details: [],
    tab: null,
    fields: {},
    positions: {},
    sscc_list: []
  }),

  methods: {
    async loadAndFilterData(url, targetObj, targetKey, options = {}) {
      try {
        const response = await this.sendRequest({
          method: "GET",
          url
        });

        const data = Array.isArray(response) && options.firstItem ? response[0] : response;
        targetObj[targetKey] = Object.fromEntries(
          Object.entries(data).filter(([_, value]) => {
              const stringValue = String(value).trim()
              return !(stringValue === 0 || stringValue === '' || stringValue.startsWith('0'))
            }
          )
        );

      } catch (error) {
        this.$vuetify.toast.error(`Ошибка загрузки: ${this.error || 'Неизвестная ошибка'}`)
      }
    },

    async load_data() {
      await this.loadAndFilterData(URLS.ORDERS.HEADER + this.order, this, 'details', {firstItem: true});
    },

    async load_positions() {
      await this.loadAndFilterData(URLS.ORDERS.POSITIONS + this.order, this.positions, 'header')
    },

    async load_positions_details() {
      await this.loadAndFilterData(URLS.ORDERS.POSITIONS_DETAILS + this.order, this.positions, 'details', {toArray: true})
    },

    async load_sscc_list() {
      await this.loadAndFilterData(URLS.ORDERS.SSCC_LIST + this.order, this, 'sscc_list', {toArray: true})
    },


  },

  watch: {
    details() {
      this.positions = {}

      this.load_positions()
      this.load_positions_details()
      this.load_sscc_list()

    }
  },

  mounted() {
    this.load_fields('78', 'fa078')
    this.load_fields('8581', 'sy8581')
    this.load_fields('8580', 'sy8580')
    this.load_fields('8586', 'sy8586')
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Просмотр заказа
    </v-card-title>
    <v-card-text>
      <div>
        <form @submit.prevent="submit">
          <v-text-field
            v-model="order"
            label="Укажите номер заказа"
            @keyup.enter="load_data"
          ></v-text-field>
        </form>
      </div>

      <div v-if="Object.keys(details).length">
        <v-card>
          <v-tabs
            v-model="tab"
            align-tabs="end"
            color="deep-purple-accent-4"
          >
            <v-tab :value="1">Заголовок</v-tab>
            <v-tab :value="2">Позиции</v-tab>
            <v-tab :value="3">Импорт</v-tab>
            <v-tab :value="4">Экспорт</v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item :value="1">
              <OrderHeader :details="details" :fields="fields"/>
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
              <OrderPositions
                :positions="positions.header"
                :sscc_list="sscc_list"
                :fields="fields"
                :details="positions.details"
              />
            </v-tabs-window-item>
            <v-tabs-window-item :value="3">
              <OrderImport :ext_order="details['FA078_EXT_BS_NR']"/>
            </v-tabs-window-item>
            <v-tabs-window-item :value="4">
              <OrderExport :order_id="order"/>
            </v-tabs-window-item>
          </v-tabs-window>

        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
tbody {
  font-size: 1.2em;
}
</style>
