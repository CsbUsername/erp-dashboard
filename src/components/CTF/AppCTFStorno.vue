<script>
import {DT, DT_HANDLE_URL} from "@/constants/dt.js";
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import AppSSCCInfo from "@/components/SSCC/AppSSCCInfo.vue";
import AppModalSSCInfo from "@/components/AppModalSSCInfo.vue";
import accessMixin from "@/mixins/accessMixin.js";


export default {
  name: "AppCTFStorno",
  emits: ['setErrors', 'isStorno'],
  components: {AppModalSSCInfo, AppSSCCInfo},
  mixins: [httpMixin, accessMixin],
  props: {
    ssccList: {
      type: Array,
      required: true,
      default: []
    },
    order: {
      type: [String, Number],
      required: true
    }
  },
  data: () => ({
    nve: null,
    isProdTaskStorno: true,
    error: null,
    showDetailsSSCC: '',
    showDetails: false,
    process: []
  }),

  methods: {
    isNotFoundNve() {
      this.error = null
      if (this.ssccList.length === 0) {
        this.error = 'Не найдены SSCC в заказе'
      }
    },

    showSSCC(sscc) {
      this.showDetailsSSCC = sscc
      this.showDetails = true
    },

    changeProcessStatus(response) {
      if (this.checkL2Status(response)) {
        this.process[this.process.length - 1].status = 'success'
      } else {
        this.process[this.process.length - 1].status = 'error'
      }
    },

    async open_order(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Открытие заказа', status: 'active'})

      const order = await this.send_dt_commnad(DT.ORDER.OPEN, {order_id: this.order}, handle_id)
      this.changeProcessStatus(order)
    },

    async storno_by_order(handle_id, nve) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Сторнирование SSCC', status: 'active'})
      const resposne = await this.send_dt_commnad(DT.ORDER.STORNO, {sscc: nve}, handle_id)
      this.changeProcessStatus(resposne)
    },

    async close_order(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Закрытие заказа', status: 'active'})

      const resposne = await this.send_dt_commnad(DT.ORDER.CLOSE, {}, handle_id)
      this.changeProcessStatus(resposne)
    },

    async move_by_lager(handle_id, nve, item) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Перемещение на МЗ прод. задания', status: 'active'})

      const response = await this.send_dt_commnad(DT.POSTING.MOVE_TO_LAGER, {
        nve: nve,
        lager: item.L52_KST_NR_2 //4001
      }, handle_id)
      this.changeProcessStatus(response)
      return response
    },

    async move_to_zero(handle_id, nve) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Перемещение SSCC на МЗ "0"', status: 'active'})
      const response = await this.send_dt_commnad(DT.POSTING.MOVING_TO_ZERO, {nve: nve}, handle_id)
      this.changeProcessStatus(response)
    },

    async return_from_zero(handle_id, nve, item) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Смена счета', status: 'active'})

      const response = await this.send_dt_commnad(DT.POSTING.RETURN_FROM_ZERO, {
        nve: nve,
        lager: 7150,
        part: item.L52_LAGERTYP_NR_1,
        date: item.L52_LAGERTYP_DATUM_1,
        lot: item.L52_LAGERTYP_LOS_1
      }, handle_id)
      this.changeProcessStatus(response)
    },

    async open_prod_task(item) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Открытие произ. задания', status: 'active'})

      const response = await this.sendRequest({
        method: 'POST',
        url: URLS.PROD_TASK.UPDATE_TASK,
        data: {
          task_id: item.L52_AUFTRAG,
          KA2461_STATUS: 1
        },
        headers: {
          'Content-Type': 'application/json'
        },
        isUserID: false
      })
      this.process[this.process.length - 1].status = 'success'
      return response
    },

    async storno_nve_prod_task(handle_id, nve, item) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Сторно из произ. задания', status: 'active'})

      const response = await this.send_dt_commnad(DT.POSTING.STORNO_WITH_NVE, {
        nve: nve,
        rec_nr: item.L52_REC_NR,
        date: item.L52_BEWEGUNGS_DATUM
      }, handle_id)

      this.changeProcessStatus(response)
    },

    async upddate_prod_task(handle_id, item) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }
      this.process.push({text: 'Обновление произ. задания', status: 'active'})

      const response = await this.send_dt_commnad(DT.TASK.UPDATE, {
        task_id: item.L52_AUFTRAG
      })

      this.changeProcessStatus(response)

    },

    async storno(handle_id, nve) {
      this.process = []

      const postings = await this.sendRequest({
        method: 'GET',
        url: URLS.SSCC.POSTING + nve,
        isUserID: false
      })

      const item = postings.find(item => item.L52_KST_NR_1 === '4302'
        && item.L52_KST_NR_2 === '4001'
        && item.L52_STORNO_REC_NR === '0'
        && item.L52_STORNIERTE_REC_NR === '0')

      if (handle_id) {
        await this.open_order(handle_id)            // Открытие заказа
        await this.storno_by_order(handle_id, nve)  // Сторно SSCC из заказа
        await this.close_order(handle_id)           // Закрытие заказа

        if (item) {
          await this.move_to_zero(handle_id, nve)             // Перемещение на МЗ 0
          await this.return_from_zero(handle_id, nve, item)  // Возврат с МЗ 0
        }

        await this.send_log({
          userid: this.user_id,
          fullname: this.username,
          component_id: this.$options.name,
          description: `Из заказа ${this.order} отсторнирована SSCC ${nve}`
        })

      }

      this.$emit('isStorno')
      return item
    },

    async storno_prod_task(nve, handle_id) {
      const postings = await this.sendRequest({
        method: 'GET',
        url: URLS.SSCC.POSTING + nve,
        isUserID: false
      })

      if (postings.length) {
        const item = postings.find(item => item.L52_KST_NR_1 === '4302'
          && item.L52_KST_NR_2 === '4001'
          && item.L52_STORNO_REC_NR === '0'
          && item.L52_STORNIERTE_REC_NR === '0')

        if (item) {
          await this.open_prod_task(item)
          await this.storno_nve_prod_task(handle_id, nve, item)
          await this.upddate_prod_task(handle_id, item)

          await this.send_log({
            userid: this.user_id,
            fullname: this.username,
            component_id: this.$options.name,
            description: `Из произ. задания ${item.L52_AUFTRAG} отсторнирована SSCC ${nve}.`
          })

        }
      }
    },

    async updating_data(netto) {
      const delivery = await this.sendRequest({
        method: 'POST',
        url: URLS.CTF.DELIVERY_DATA,
        data: {
          order_id: this.order
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (delivery) {
        const brutto = (parseFloat(delivery.brutto) - parseFloat(netto)).toFixed(3)

        const response = await this.sendRequest({
          method: 'POST',
          url: URLS.CTF.UPDATE_DELIVERY,
          data: {
            order_id: this.order,
            brutto: (brutto === delivery.tara) ? 0 : brutto,
            taskNumber: this.task_id,
            userId: this.user_id
          }
        })
      }
    },


    async handlerStorno(nve) {
      const handle_id = await this.sendRequest({
        url: DT_HANDLE_URL,
        method: 'GET',
        isUserID: false
      })

      if (handle_id) {
        const nve_data = await this.sendRequest({
          method: 'GET',
          url: URLS.SSCC.MAIN_INFORMATION + nve
        })

        if (nve_data) {
          const item = await this.storno(handle_id, nve)
          await this.updating_data(nve_data.S8581_NETTO_GEW)

          if (this.isProdTaskStorno) {
            const response = await this.move_by_lager(handle_id, nve, item)  // Перемещение на МЗ 4001
            if (this.checkL2Status(response)) {
              await this.storno_prod_task(nve, handle_id)
            }
          }
          this.$emit('istorno')
        }
      }
    }
  },

  mounted() {
    this.isNotFoundNve()
  }
  ,
  beforeUpdate() {
    this.isNotFoundNve()
  }
}
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-alert
        border="top"
        type="warning"
        variant="outlined"
        prominent
        v-if="error"
        density="compact"
      >
        {{ error }}
      </v-alert>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="8">
      <v-card class="h-100">
        <v-card-text>
          <v-row>

            <v-col cols="12" v-if="ssccList.length && !this.error">
              <v-checkbox
                label="Сторнировать SSCC из произ. задания"
                v-model="isProdTaskStorno"
                color="danger"
              ></v-checkbox>

              <table class="table table-striped table-bordered" v-if="ssccList.length">
                <thead>
                <tr>
                  <th>Номер записи</th>
                  <th>Артикул</th>
                  <th>SSCC</th>
                  <th>Адрес</th>
                  <th>Вес</th>
                  <th>Ед.Изм.</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="sscc in ssccList" :key="sscc.S8586_NVE">
                  <td>{{ sscc.S8586_REC_NR }}</td>
                  <td>{{ sscc.S8581_ART_NR }}</td>
                  <td
                    @click="showSSCC(sscc.S8586_NVE)"
                    style="cursor:pointer;"
                    class="table-cell-hover"
                  >
                    {{ sscc.S8586_NVE }}
                  </td>
                  <td>{{ sscc.S8586_ADR_NR }}</td>
                  <td>{{ parseFloat(sscc.S8581_NETTO_GEW) }}</td>
                  <td>кг</td>
                  <td>
                    <v-btn
                      density="compact"
                      class="text-none text-white align-center"
                      color="primary"
                      variant="flat"
                      width="90"
                      rounded
                      @click="handlerStorno(sscc.S8586_NVE)"
                    >
                      Удалить
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

    </v-col>

    <v-col cols="4">
      <v-card class="h-100">
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(item, i) in process"
              :key="i"
              :value="item"
              color="primary"
            >
              <template v-slot:prepend>
                <v-progress-circular
                  color="primary"
                  indeterminate
                  class="mr-1"
                  style="width: 20px;"
                  v-if="item.status === 'active'"
                >
                </v-progress-circular>

                <v-icon color="success" icon="mdi-check-circle-outline" v-if="item.status === 'success'">
                </v-icon>

                <v-icon color="error" icon="mdi-alert-circle" v-if="item.status === 'error'">
                </v-icon>
              </template>

              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>
          </v-list>

        </v-card-text>
      </v-card>
    </v-col>
  </v-row>


  <AppModalSSCInfo
    :is-show="showDetails"
    :showDetailsSSCC="showDetailsSSCC"
    @hide-dialog="showDetails = false"
  />


</template>

<style scoped>
.table-cell-hover:hover {
  color: #1B9AD6;
}
</style>
