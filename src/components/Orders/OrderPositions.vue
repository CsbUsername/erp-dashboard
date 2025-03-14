<script>
import fieldsMixin from "@/mixins/fieldsMixin.js";
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import AppSSCCInfo from "@/components/AppSSCCInfo.vue";

export default {
  components: {AppSSCCInfo},
  props: ['positions', 'sscc_list', 'fields', 'details'],
  mixins: [fieldsMixin, httpMixin],
  data: ()=> ({
    articuls: {},
    showDetails: false,
    showDetailsSSCC: '',
  }),
  methods: {
    async getMixBoxes(ober_nve, art) {
      try {
        const response = await this.sendRequest({
          method: "GET",
          url: URLS.ORDERS.SSCC_MIX + ober_nve
        });

        return Object.values(await response).filter(item => parseInt(item.S8581_ART_NR) === parseInt(art))

      } catch (error) {
        this.$vuetify.toast.error(`Ошибка загрузки: ${this.error || 'Неизвестная ошибка'}`)
      }
    },

    getDetailsMixPallet(art_nr) {
      let items = this.getPositionDetails(art_nr)

      const founded = Object.values(items).filter(item => item.S8581_ART_NR === '999999')

      Object.values(founded).forEach(async (item) => {
        const foundedSSCC = item.S8586_NVE
        let foundedIndx = Object.values(items).findIndex(item => item.S8586_NVE === foundedSSCC)
        const mixBoxs = await this.getMixBoxes(foundedSSCC, art_nr)

        Object.entries(mixBoxs[0]).forEach(([key, value]) => {
          if (key !== 'S8581_ART_NR') {
            items[foundedIndx][key] = value
          }
        })
      })
      return items
    },

    getPositionDetails(art_nr) {
      // Убедимся, что данные существуют и являются объектами
      if (typeof this.details !== "object" || typeof this.sscc_list !== "object") {
        console.error("details или sscc_list не являются объектами.");
        return [];
      }

      // Преобразуем объекты в массивы
      const detailsArray = Object.values(this.details);
      const ssccListArray = Object.values(this.sscc_list);

      // Найдём записи в details, связанные с art_nr
      const relatedDetails = detailsArray.filter(detail => detail.FA3177_ART_NR === art_nr);

      // Для каждой записи в relatedDetails ищем связанные записи в sscc_list
      return relatedDetails.flatMap(detail =>
        ssccListArray.filter(sscc => sscc.S8586_REC_NR === detail.FA3177_NR)
      )
    },

    getTotalSum(art_nr, field) {
      const data = this.getDetailsMixPallet(art_nr)
      return  data.reduce((sum, item) => sum + parseFloat(item[field]), 0).toFixed(3);
    },

    showSSCC(sscc){
      this.showDetailsSSCC = sscc
      this.showDetails =!this.showDetails
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">

        <v-expansion-panels class="my-4" variant="popout">
          <v-expansion-panel
            v-for="(item, i) in positions"
            :key="i"
          >

            <v-expansion-panel-title>
              <template v-slot:default="{ expanded }">
                <v-row no-gutters>
                  <v-table class="w-100">
                    <thead>
                    <tr>
                      <th>Артикул</th>
                      <th>Наименование</th>
                      <th>Заказано</th>
                      <th>Об. поставки</th>
                      <th>Об. поставки</th>
                      <th>Об. в кг</th>
                      <th>Нетто</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>{{ item.FA077_ART_NR }}</td>
                      <td>{{ item.FA077_ART_BEZ }}</td>
                      <td>{{ parseFloat(item.FA077_BS_MENGE) }}</td>
                      <td>{{ parseFloat(item.FA077_LI_MENGE) }}</td>
                      <td>{{ parseFloat(item.FA077_LS_MENGE) }}</td>
                      <td>{{ parseFloat(item.FA077_LA_MENGE) }}</td>
                      <td>{{ parseFloat(item.FA077_KG_MENGE) }}</td>
                    </tr>
                    </tbody>
                  </v-table>
                </v-row>
              </template>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-row no-gutters>
                <v-table class="table table-bordered table-responsive-sm table-striped" density="compact">
                  <thead>
                  <tr>
                    <th>{{ getKurzBezByKey('S8586_NVE') }}</th>
                    <th>{{ getKurzBezByKey('S8586_ADR_NR') }}</th>
                    <th>{{ getKurzBezByKey('S8581_ART_NR') }}</th>
                    <th>{{ getKurzBezByKey('S8581_MENGE_LE') }}</th>
                    <th>{{ getKurzBezByKey('S8581_MENGE_ST') }}</th>
                    <th>{{ getKurzBezByKey('S8581_MENGE_PE') }}</th>
                    <th>{{ getKurzBezByKey('S8581_BRUTTO_GEW') }}</th>
                    <th>{{ getKurzBezByKey('S8581_NETTO_GEW') }}</th>
                    <th>{{ getKurzBezByKey('S8581_TARA') }}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="sscc in getDetailsMixPallet(item.FA077_ART_NR )">
                    <td class="font-weight-bold order-sscc" @click="showSSCC(sscc.S8586_NVE )">
                      {{ sscc.S8586_NVE }}
                    </td>
                    <td>{{ sscc.S8586_ADR_NR }}</td>
                    <td>{{ sscc.S8581_ART_NR }}</td>
                    <td>{{ parseFloat(sscc.S8581_MENGE_LE) }}</td>
                    <td>{{ parseFloat(sscc.S8581_MENGE_ST) }}</td>
                    <td>{{ parseFloat(sscc.S8581_MENGE_PE) }}</td>
                    <td>{{ parseFloat(sscc.S8581_BRUTTO_GEW) }}</td>
                    <td>{{ parseFloat(sscc.S8581_NETTO_GEW) }}</td>
                    <td>{{ parseFloat(sscc.S8581_TARA) }}</td>
                  </tr>
                  </tbody>
                  <tfoot>
                  <tr>
                    <th colspan="3"></th>
                    <th>{{ getTotalSum(item.FA077_ART_NR, 'S8581_MENGE_LE') }}</th>
                    <th>{{ getTotalSum(item.FA077_ART_NR, 'S8581_MENGE_ST') }}</th>
                    <th>{{ getTotalSum(item.FA077_ART_NR, 'S8581_MENGE_PE') }}</th>
                    <th>{{ getTotalSum(item.FA077_ART_NR, 'S8581_BRUTTO_GEW') }}</th>
                    <th>{{ getTotalSum(item.FA077_ART_NR, 'S8581_NETTO_GEW') }}</th>
                    <th>{{ getTotalSum(item.FA077_ART_NR, 'S8581_TARA') }}</th>

                  </tr>
                  </tfoot>
                </v-table>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <div class="text-center pa-4 overflow-y-scroll">
      <v-dialog
        v-model="showDetails"
        transition="dialog-bottom-transition"
        fullscreen
      >
        <v-card >
          <v-toolbar color="primary">
            <v-spacer></v-spacer>

            <v-toolbar-items>
              <v-btn
                prepend-icon="mdi-close"
                variant="text"
                @click="showDetails = false"
              ></v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <AppSSCCInfo :sscc="showDetailsSSCC"/>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<style scoped>
  .order-sscc{
    text-decoration: underline
  }

  .order-sscc:hover{
    text-decoration: none;
    cursor: pointer;
    color: blue;
  }
</style>
