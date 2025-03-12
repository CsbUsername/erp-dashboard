<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import fieldsMixin from "@/mixins/fieldsMixin.js";
import OrderEditingCell from "@/components/Orders/OrderEditingCell.vue";

export default {
  components: {OrderEditingCell},
  mixins: [httpMixin, fieldsMixin],
  data: () => ({
    order: null,
    fields: {},
    header_titles: [
      "FA078_TOUR_NR",
      "FA078_LS_DATUM",
      "FA078_ADR_NR",
      "FA078_AUSLI_DATUM",
      "FA078_STATUS_2",
      "FA078_VERT_NR",
      "FA078_VERS_ST",
      "FA078_VERLADEDATUM",
      "FA078_EXT_BS_NR"
    ],
    positions_titles: [
      "FA077_ART_NR",
      "FA077_ART_BEZ",
      "FA077_HBK_DATUM",
      "FA077_AN_MENGE",
      "FA077_BS_MENGE_ALT",
      "FA077_BS_MENGE",
      "FA077_LI_MENGE",
      "FA077_LS_MENGE",
      "FA077_LA_MENGE",
      "FA077_KG_MENGE",
      "FA077_TARA_GEWICHT"
    ],
    details: {
      header: {},
      positions: {}
    },
    snackbar: {
      text: '',
      isDisplay: false
    }
  }),
  methods: {
    async loadOrderDetails() {
      // Загрузка данных по заказу
      this.details.header = await this.sendRequest({
        method: "GET",
        url: URLS.ORDERS.HEADER + this.order
      })


      this.details.positions = await this.sendRequest({
        method: "GET",
        url: URLS.ORDERS.POSITIONS + this.order
      })
    },

    async saveCell(field, value, art) {
      const elem = this.details.positions.find(el => el.FA077_ART_NR === art);
      elem[field] = value;
      const response = await this.sendRequest({
        method: "POST",
        url: URLS.ORDERS.UPDATE_ORDER_POSITIONS,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          'order_id': this.order,
          'field': field,
          'value': value,
          'art': art
        })
      })

      if(response.success){
        this.snackbar.text = `Заказ ${this.order} успешно обновлен. Для поля ${field} установлено новое значение: "${value}"`
      }else{
        this.snackbar.text = `Ошибка при обновлении заказа ${this.order}. ${response.message}"`
      }
      this.snackbar.isDisplay = true
      setTimeout(()=>{ this.snackbar.isDisplay = false}, 3000)
    },
  },

  mounted() {
    this.load_fields('77', 'fa077')
    this.load_fields('78', 'fa078')
  }
}


</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Изменение заказа
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="order"
            label="Укажите номер заказа"
            @keydown.enter="loadOrderDetails"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-expansion-panels class="my-4" variant="popout" v-if="Object.keys(this.details.header).length">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h5>Заголовок задания</h5>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-table class="table table-borderless table-responsive-sm">
                  <thead>
                  <tr>
                    <th v-for="title in header_titles"> {{ getKurzBezByKey(title) }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td v-for="title in header_titles">
                      {{ details.header[title] }}
                    </td>
                  </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h5>Позиции задания</h5>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-table class="table table-striped table-responsive-sm">
                  <thead>
                  <tr>
                    <th v-for="title in positions_titles">
                      <v-tooltip :text="title">
                        <template v-slot:activator="{ props }">
                          <span v-bind="props">{{ getKurzBezByKey(title) }}</span>
                        </template>
                      </v-tooltip>
                    </th>

                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="position in details.positions">
                    <td>{{ position['FA077_ART_NR'] }}</td>
                    <td>{{ position['FA077_ART_BEZ'] }}</td>
                    <td>{{ position['FA077_HBK_DATUM'] }}</td>
                    <OrderEditingCell :position="position"
                                      field="FA077_AN_MENGE"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />

                    <OrderEditingCell :position="position"
                                      field="FA077_BS_MENGE_ALT"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />

                    <OrderEditingCell :position="position"
                                      field="FA077_BS_MENGE"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />

                    <OrderEditingCell :position="position"
                                      field="FA077_LI_MENGE"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />

                    <OrderEditingCell :position="position"
                                      field="FA077_LS_MENGE"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />

                    <OrderEditingCell :position="position"
                                      field="FA077_LA_MENGE"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />

                    <OrderEditingCell :position="position"
                                      field="FA077_KG_MENGE"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />

                    <OrderEditingCell :position="position"
                                      field="FA077_TARA_GEWICHT"
                                      :target-field="position['FA077_ART_NR']"
                                      @save-cell="saveCell"
                    />
                  </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>


    </v-card-text>
  </v-card>

  <v-snackbar
    v-model="snackbar.isDisplay"
    multi-line
  >
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn
        color="red"
        variant="text"
      >
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>

</style>
