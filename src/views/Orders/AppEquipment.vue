<script>
  import httpMixin from "@/mixins/httpMixin.js";
  import {URLS} from "@/constants/urls.js"
  import fieldsMixin from "@/mixins/fieldsMixin.js";
  import EquipmentModal from "@/components/Orders/EquipmentModal.vue";
  import AppSSCCInfo from "@/components/AppSSCCInfo.vue";

  export default {
    name: "AppEquipment",
    components: {EquipmentModal, AppSSCCInfo},
    mixins: [httpMixin, fieldsMixin],
    data: () => ({
      order: null,
      sscc_list: [],
      fields: {},
      isOpenDialog: false,
      cuurentArt: null,
      details: {
        header: {},
        positions: [],
        pos_details: []
      },
      isNotFoundOrder: false
    }),
    methods: {
      async load_data(){
        // Загрузка данных по заказу
        this.details.header = await this.sendRequest({
          method: "GET",
          url: URLS.ORDERS.HEADER + this.order
        })

        if (Object.keys(this.details.header).length > 0 && this.details.header) {
          // Загрузка данных по позициям заказа
          this.details.positions = await this.sendRequest({
            method: "GET",
            url: URLS.ORDERS.POSITIONS + this.order
          })

          // Загрузка данных по позициям заказа
          this.details.pos_details = await this.sendRequest({
            method: "GET",
            url: URLS.ORDERS.POSITIONS_DETAILS + this.order
          })

          // Загрузка данных по sscc в заказе
          this.sscc_list = await this.sendRequest({
            method: "GET",
            url: URLS.ORDERS.SSCC_LIST + this.order
          })
        }else{
          this.isNotFoundOrder = true
        }

      },

      getPositionDetails(art_nr) {
        // Убедимся, что данные существуют и являются объектами
        if (typeof this.details !== "object" || typeof this.sscc_list !== "object") {
          console.error("details или sscc_list не являются объектами.");
          return [];
        }

        // Преобразуем объекты в массивы
        const detailsArray = Object.values(this.details.pos_details);
        const ssccListArray = Object.values(this.sscc_list)

        // Найдём записи в details, связанные с art_nr
        const relatedDetails = detailsArray.filter(detail => detail.FA3177_ART_NR === art_nr);

        // Для каждой записи в relatedDetails ищем связанные записи в sscc_list
        return relatedDetails.flatMap(detail =>
          ssccListArray.filter(sscc => sscc.S8586_REC_NR === detail.FA3177_NR)
        )
      },

      handlerSuccsesAdd(data){
        if(data){
          this.load_data()
        }
      }
    },
    watch: {
      order(newValue, oldValue){
        this.isNotFoundOrder = (newValue === oldValue);

        if(newValue !== oldValue){
          this.details = {
            header: {},
            positions: [],
              pos_details: []
          }
        }
      }
    },
    mounted() {
      this.load_fields('8581', 'sy8581')
      this.load_fields('8586', 'sy8586')
    }
  }
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Комплектация заказа
    </v-card-title>
    <v-card-text>
      <v-alert
        :text="`Заказ ${order} не найден в системе`"
        variant="outlined"
        color="error"
        v-if="isNotFoundOrder"
        class="mb-3"
      ></v-alert>
      <div>
        <form @submit.prevent>
          <v-text-field
            v-model="order"
            label="Укажите номер заказа"
            @keyup.enter="load_data"
          ></v-text-field>
        </form>
      </div>

      <div>
        <v-expansion-panels variant="popout">
          <v-expansion-panel v-for="postition in details.positions" :key="postition.FA077_ART_NR">
            <v-expansion-panel-title>
              <v-row>
                <v-col cols="1">
                  <span>{{ postition.FA077_ART_NR }}</span>
                </v-col>
                <v-col cols="3">
                  <span>{{ postition.FA077_ART_BEZ }}</span>
                </v-col>
                <v-col cols="2">
                  <span>{{ parseFloat(postition.FA077_BS_MENGE) }} {{ postition.FA077_ME_1 }}</span>
                </v-col>
                <v-col cols="2">
                  <span>{{ parseFloat(postition.FA077_LI_MENGE) }} {{ postition.FA077_ME_1 }}</span>
                </v-col>
                <v-col cols="2">
                  <span>{{ parseFloat(postition.FA077_KG_MENGE) }} кг</span>
                </v-col>

                <v-col cols="2">
                  <v-btn
                    density="compact"
                    @click.stop="isOpenDialog = true, cuurentArt = postition.FA077_ART_NR"
                    color="red">
                    Отгрузить
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-table class="table table-bordered" density="compact">
                <thead>
                  <tr>
                      <th>{{ getKurzBezByKey('S8586_NVE') }}</th>
                      <th>{{ getKurzBezByKey('S8581_BRUTTO_GEW') }}</th>
                      <th>{{ getKurzBezByKey('S8581_NETTO_GEW') }}</th>
                      <th>{{ getKurzBezByKey('S8581_TARA') }}</th>
                      <th>{{ getKurzBezByKey('S8581_MENGE_LE') }}</th>
                      <th>{{ getKurzBezByKey('S8581_MENGE_PE') }}</th>
                      <th>{{ getKurzBezByKey('S8581_MENGE_ST') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="elem in getPositionDetails(postition.FA077_ART_NR )">
                    <td>{{ elem.S8586_NVE }}</td>
                    <td>{{ parseFloat(elem.S8581_BRUTTO_GEW) }}</td>
                    <td>{{ parseFloat(elem.S8581_NETTO_GEW) }}</td>
                    <td>{{ parseFloat(elem.S8581_TARA) }}</td>
                    <td>{{ parseFloat(elem.S8581_MENGE_LE) }}</td>
                    <td>{{ parseFloat(elem.S8581_MENGE_PE) }}</td>
                    <td>{{ parseFloat(elem.S8581_MENGE_ST) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card-text>
    <EquipmentModal
      v-model:dialog="isOpenDialog"
      :articul="cuurentArt ? cuurentArt : ''"
      :order-id="order ? order : ''"
      @success-add="handlerSuccsesAdd"
    />
  </v-card>


</template>

<style scoped>

</style>
