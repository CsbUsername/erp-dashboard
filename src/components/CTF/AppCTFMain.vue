<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js"
import EquipmentModal from "@/components/Orders/EquipmentModal.vue";
import AppCTFStorno from "@/components/CTF/AppCTFStorno.vue";
import AppCTFShipment from "@/components/CTF/AppCTFShipment.vue";
import utilsMixin from "@/mixins/utilsMixin.js";

export default {
  components: {AppCTFShipment, AppCTFStorno, EquipmentModal},
  name: "AppCTFMain",
  mixins: [httpMixin, utilsMixin],
  data: () => ({
    order: '',
    sscc_list: [],
    errors: null,
    tab: null,
    isShowTabs: false
  }),

  methods: {
    async load_order() {
      this.isShowTabs = false
      this.errors = null;
      const fat_order = await this.sendRequest({
        method: 'POST',
        url: URLS.CTF.DELIVERY_DATA,
        data: {
          order_id: this.order
        },
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!fat_order.error) {
        this.sscc_list = await this.sendRequest({
          url: URLS.ORDERS.SSCC_LIST + this.order,
          method: "GET"
        })
      } else {
        this.handlerSetErrors({error: `Заказ ${this.order} не является заказом на отгрузку жира. Или машина для данного заказа еще не принята`})
      }

      this.isShowTabs = true
    },

    handlerSetErrors(arg) {
      const result = [];
      if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
        result.push(arg);
        this.errors = result
        return;
      }

      if (Array.isArray(arg)) {
        this.errors = arg
      }
    }
  },
  computed: {
    order_netto() {
      if (this.sscc_list && this.sscc_list.length > 0) {
        return this.sscc_list.reduce((sum, item) => {
          const nettoGew = parseFloat(item.S8581_NETTO_GEW) || 0;
          return sum + nettoGew;
        }, 0).toFixed(2);
      }
      return '0.00';
    }
  },

  mounted() {
    this.errors = null
  },
  updated() {
    this.errors = null
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Отгрузка жира
    </v-card-title>
    <v-card-text>
      <p>Нетто в заказе: {{  order_netto }}</p>
      <v-row>
        <v-col cols="12">
          <v-alert
            border="top"
            type="warning"
            variant="outlined"
            prominent
            v-if="errors"
            density="compact"
          >
            <p v-for="error in errors">
              {{ error }}
            </p>
          </v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="order"
            placeholder="Укажите номер заказа на отгрузку"
            @keyup.enter="load_order"
            type="number"
          >

          </v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="!errors && isShowTabs">
        <v-col cols="12">
          <v-tabs
            v-model="tab"
          >
            <v-tab value="one">Сторнирование из заказа</v-tab>
            <v-tab value="two">Отгрузка</v-tab>

          </v-tabs>

          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="one">
                <AppCTFStorno
                  :sscc-list="sscc_list"
                  :order="order"
                  @set-errors="handlerSetErrors"
                  @is-storno="load_order"
                />
              </v-tabs-window-item>

              <v-tabs-window-item value="two">
                <AppCTFShipment
                  :order-id="order"
                  :order-netto="order_netto"
                  @is-shipped="load_order"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>


        </v-col>
      </v-row>

    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
