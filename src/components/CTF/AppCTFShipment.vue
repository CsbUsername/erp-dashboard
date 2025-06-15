<script>
import httpMixin from "@/mixins/httpMixin.js";
import utilsMixin from "@/mixins/utilsMixin.js";
import {URLS} from "@/constants/urls.js"
import {DT, DT_HANDLE_URL} from "@/constants/dt.js";
import accessMixin from "@/mixins/accessMixin.js";

export default {
  mixins: [httpMixin, utilsMixin, accessMixin],
  name: 'AppCTFShipment',
  props: ['orderId', 'orderNetto'],
  emits: ['isShipped'],
  data: () => ({
    positions: [],
    shippingItem: {
      articul: '',
      name: '',
      netto: null,
      position_id: null
    },
    task_id: null,
    nve: null,
    delivery: {},
    error: null,
    process: []
  }),
  methods: {
    itemProps(item) {
      return {
        title: item.title,
        subtitle: item.subtitle,
        position_id: item.position_id
      }
    },

    handleSelectChange(newValue) {
      const item = this.positions.find(elem => elem.title === newValue)
      if (item.subtitle) {
        this.shippingItem.name = item.subtitle
        this.shippingItem.position_id = item.position_id
      }
    },

    async load_delivery_data() {
      this.delivery = await this.sendRequest({
        method: 'POST',
        url: URLS.CTF.DELIVERY_DATA,
        data: {
          order_id: this.orderId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!this.delivery) {
        this.error = 'Не удалось получить данные о принятой машине'
        return
      }
    },

    async load_positions() {
      const positions = await this.send_dt_commnad(DT.ORDER.POSITIONS, {'order_id': this.orderId});

      if (await positions.succes) {
        if (Array.isArray(positions.succes)) {
          this.positions = positions.succes.map(elem => ({
            title: elem.T5_1,
            subtitle: elem.T12_1,
            position_id: elem.L1_1
          }));
        } else if (typeof positions.succes === 'object') {
          this.positions = [{
            title: positions.succes.T5_1,
            subtitle: positions.succes.T12_1,
            position_id: positions.succes.L2_1
          }];
        } else {
          this.positions = []; // или другое значение по умолчанию
        }
      }
    },

    findMaxT6WithT1Zero(data) {
      // Фильтруем элементы, где T1_1 === "0"
      const filteredData = data.filter(item => item.T1_1 === "0" && parseFloat(item.L1_1) === parseFloat(this.shippingItem.netto));

      if (filteredData.length === 0) {
        return null; // Если нет подходящих элементов, возвращаем null
      }

      // Сортируем отфильтрованные данные по T6_1 в порядке убывания
      const sortedData = filteredData.sort((a, b) => {
        // Преобразуем T6_1 в числа для корректного сравнения
        const numA = parseInt(a.T6_1, 10);
        const numB = parseInt(b.T6_1, 10);
        return numB - numA;
      });

      // Возвращаем первый элемент (с максимальным T6_1)
      return sortedData[0];
    },

    changeProcessStatus(response) {
      if (this.checkL2Status(response)) {
        this.process[this.process.length - 1].status = 'success'
      } else {
        this.process[this.process.length - 1].status = 'error'
      }
    },

    async task_create(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }

      this.process.push({text: 'Создание задания', status: 'active'})
      if (this.shippingItem.articul && this.shippingItem.netto) {
        const response = await this.send_dt_commnad(DT.CTF.CREATE_TASK, {
          volume: this.shippingItem.netto,
          date: this.formatDateYYYYMMDD(),
          articul: this.shippingItem.articul
        }, handle_id)

        this.changeProcessStatus(response)
      }
    },

    async issue_from_task(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }

      this.process.push({text: 'Выпуск ГП из задания', status: 'active'})

      const task_data = await this.send_dt_commnad(DT.TASK.EXISTS_ORDERS, {
        lager: 4302,
        articul: this.shippingItem.articul,
        date: this.formatDateYYYYMMDD()
      }, handle_id)

      const task = this.findMaxT6WithT1Zero(task_data.succes)
      const nve = await this.send_dt_commnad(DT.SSCC.CREATE, {
        index: 4
      }, handle_id)
      const art_data = await this.send_dt_commnad(DT.ARTICUL.MAIN_INFO, {articul: this.shippingItem.articul}, handle_id)
      const msx = new Date(Date.now() + 864e5 * art_data.succes.T140_1);

      if (task && nve) {
        this.task_id = task.T6_1
        this.nve = nve.succes.L1_1

        await this.send_dt_commnad(DT.CTF.FAT_SSCC, {
          articul: this.shippingItem.articul,
          nve: nve.succes.L1_1,
          task_id: task.T6_1,
          date: this.formatDateYYYYMMDD(),
          volume: this.shippingItem.netto,
          user_id: this.user_id,
          netto: this.shippingItem.netto,
          brutto: this.shippingItem.netto,
          tara: 0,
          lager: 4302,
          client: '0',
          lot: '',
          msx_date: this.formatDateYYYYMMDD(msx)
        }, handle_id)

        const response = await this.send_dt_commnad(DT.TASK.POSTING, {
          task_id: task.T6_1,
          nve: nve.succes.L1_1,
          user_id: this.user_id
        })

        this.changeProcessStatus(response)
      }
    },

    async close_task(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }

      this.process.push({text: 'Закрывается задание', status: 'active'})
      const close_commands = [DT.TASK.PROC, DT.TASK.CALC, DT.TASK.UPDATE]

      for (const command of close_commands) {
        await this.send_dt_commnad(command, {task_id: this.task_id}, handle_id)
      }
      this.process[this.process.length - 1].status = 'success'
    },

    async open_order(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }

      this.process.push({text: 'Открытие заказа на отгрузку', status: 'active'})
      const response = await this.send_dt_commnad(DT.ORDER.OPEN, {order_id: this.orderId}, handle_id)
      this.changeProcessStatus(response)
    },

    async scan_sscc_to_order(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }

      this.process.push({text: 'Сканирование SSCC в заказ', status: 'active'})

      const response = await this.send_dt_commnad(DT.ORDER.ADD, {
        order_id: this.orderId,
        position_id: this.shippingItem.position_id,
        lager: 8010,
        user_id: this.user_id,
        sscc: this.nve
      }, handle_id)

      this.changeProcessStatus(response)
    },

    async close_order(handle_id) {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }

      this.process.push({text: 'Закрытие заказа', status: 'active'})
      const response = await this.send_dt_commnad(DT.ORDER.CLOSE, {order_id: this.orderId}, handle_id)
      this.changeProcessStatus(response)
    },

    async updating_data() {
      if (this.process.length && this.process[this.process.length - 1].status === 'error') {
        return
      }

      this.process.push({text: 'Обновление данных в промежутоной таблице', status: 'active'})
      const response = await this.sendRequest({
        method: 'POST',
        url: URLS.CTF.UPDATE_DELIVERY,
        data: {
          order_id: this.orderId,
          brutto: (parseFloat(this.delivery.tara) + parseFloat(this.shippingItem.netto) + parseFloat(this.orderNetto)).toFixed(3),
          taskNumber: this.task_id,
          userId: this.user_id
        }
      })

      if (response.error) {
        this.process[this.process.length - 1].status = 'error'
      } else {
        this.process[this.process.length - 1].status = 'success'
      }
    },

    async processed() {
      try {
        const handle_id = await this.sendRequest({
          method: 'POST', // Используем POST для отправки данных
          url: URLS.SERVICE.DT_PROXY, // Ваш внутренний endpoint для проксирования запросов
          data: {url: DT_HANDLE_URL}, // Отправляем данные в теле запроса
          isUserID: false
        });

        if (handle_id) {
          this.process = [];
          await this.task_create(handle_id);
          await this.issue_from_task(handle_id);
          await this.close_task(handle_id);
          await this.open_order(handle_id);
          await this.scan_sscc_to_order(handle_id);
          await this.close_order(handle_id);
          await this.updating_data();

          await this.load_delivery_data()
          this.shippingItem = {
            articul: '',
            name: '',
            netto: null,
            position_id: null
          }

          this.$emit('isShipped')

          await this.send_log({
            userid: this.user_id,
            fullname: this.username,
            component_id: this.$options.name,
            description: `В заказ ${this.orderId} просканирована SSCC ${this.nve}`
          })

        }
      } catch (error) {
        console.error('Error in processed method:', error);
        // Здесь вы можете добавить обработку ошибок, например, показать уведомление пользователю
      }
    }
  },

  computed: {
    netto() {
      if (this.delivery.brutto > 0) {
        return (this.delivery.brutto - this.delivery.tara).toFixed(3)
      }

      return 0.000
    }
  },

  async updated() {
    await this.load_delivery_data()
  },

  async mounted() {
    await this.load_positions()
    await this.load_delivery_data()
  }
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-alert
          v-model="error"
          type="error"
          persistent
          variant="outlined"
          :timeout="0"
          v-if="this.error"
        >
          {{ error }}
        </v-alert>
      </v-row>

      <v-row v-if="!this.error">
        <v-col cols="8">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="2" class="py-0">
                  <v-text-field
                    label="ID"
                    variant="outlined"
                    disabled
                    v-model="delivery.id"
                  ></v-text-field>
                </v-col>
                <v-col cols="5" class="py-0">
                  <v-text-field
                    label="Машина"
                    variant="outlined"
                    disabled
                    v-model="delivery.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="5" class="py-0">
                  <v-text-field
                    label="Гос. номер"
                    variant="outlined"
                    disabled
                    v-model="delivery.autoNumber"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="Дата создания"
                    variant="outlined"
                    disabled
                    v-model="delivery.dateCreate"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    label="Брутто"
                    variant="outlined"
                    disabled
                    v-model="delivery.brutto"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    label="Тара"
                    variant="outlined"
                    disabled
                    v-model="delivery.tara"
                  ></v-text-field>
                </v-col>

                <v-col cols="4" class="py-0">
                  <v-text-field
                    label="Нетто"
                    variant="outlined"
                    disabled
                    v-model="netto"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider></v-divider>

              <v-row>
                <v-col cols="4" class="py-0">
                  <v-select
                    clearable
                    label="Артикул"
                    variant="outlined"
                    :item-props="itemProps"
                    :items="positions"
                    v-model="shippingItem.articul"
                    @update:modelValue="handleSelectChange"
                    :rules="[ value => !!value || 'Обязательное поле']"
                  ></v-select>
                </v-col>
                <v-col cols="8" class="py-0">
                  <v-text-field
                    label="Наименование"
                    variant="outlined"
                    v-model="shippingItem.name"
                    required
                    disabled
                  ></v-text-field
                  >
                </v-col>
                <v-col cols="8" class="py-0">
                  <v-text-field
                    label="Укажите вес нетто"
                    variant="outlined"
                    type="number"
                    required
                    v-model="shippingItem.netto"
                    :rules="[ value => !!value || 'Обязательное поле']"
                  ></v-text-field>

                </v-col>
                <v-col cols="4" class="py-0">
                  <v-btn
                    color="danger"
                    variant="outlined"
                    height="55px"
                    width="100%"
                    @click="processed"
                    :disabled="!shippingItem.articul || !shippingItem.netto"
                  >
                    Загрузить
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="5">
                  <v-text-field
                    v-model="task_id"
                    label="Созданное задание"
                    variant="outlined"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    v-model="nve"
                    label="Созданная SSCC"
                    variant="outlined"
                    disabled
                  ></v-text-field>
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
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
