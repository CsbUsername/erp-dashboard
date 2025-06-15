<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import LiveSearchInput from "@/components/LiveSearchInput.vue";
import AppCTFDeliveryActiveItem from "@/components/CTF/AppCTFDeliveryActiveItem.vue";

export default {
  mixins: [httpMixin],
  components: {AppCTFDeliveryActiveItem, LiveSearchInput},
  data: () => ({
    cars: [],
    containers: [],
    all_deliveries: [],
    car: {
      model: null,
      number: null
    },
    deliveryType: null,
    ttn: {
      number: 'бн'
    },
    brutto: null,
    countCopy: 1,
    filteredCars: [],
    filteredNumbers: [],
    // filteredContainers: [],
    selectContainer: null,
    showSuggestions: false,
    showNumberSuggestions: false,
    snackbarMessage: null,
    isSnackbar: false,
    isUpdate: false,
    delivery_id: null
  }),

  methods: {
    clear() {
      this.car.model = null;
      this.car.number = null;
      this.deliveryType = null;
      this.selectContainer = null;
      this.brutto = null;
      this.countCopy = 1;
      this.ttn.number = 'бн';
      this.isUpdate = false;
      this.delivery_id = null;
    },

    async saveItem(method, url, fields = {}) {
      return await this.sendRequest({
        method,
        url,
        data: JSON.stringify({
          delivery_id: this.delivery_id,
          car_model: this.car.model,
          car_number: this.car.number,
          container_id: this.selectContainer,
          brutto: this.brutto,
          ttn_id: this.ttn.number,
          delivery_type: this.deliveryType,
          count_copy: this.countCopy,
          car_id: this.carId,
          ...fields
        }),
        headers: {'Content-Type': 'application/json'}
      });
    },

    async saveChangesItem(data) {
      const formData = new FormData();
      formData.append('id', data.deliveryID);
      formData.append('brutto', data.brutto);
      formData.append('tara', data.tara);
      formData.append('articul', data.articul || '');

      const response = await this.sendRequest({
        method: "POST",
        url: URLS.CTF.LEFT_PROVIDER_CSB,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response) {
        await this.saveItem('PUT', URLS.CTF.UPDATE_DELIVERY, {
          car_id: data.car_id,
          container_id: data.container_id,
          brutto: data.brutto,
          delivery_id: data.deliveryID,
          tara: data.tara
        })
        this.all_deliveries = await this.load_all_diliveries();
      }
    },


    async create() {
      const method = this.isUpdate ? 'PUT' : 'POST';
      const url = this.isUpdate ? URLS.CTF.UPDATE_DELIVERY : URLS.CTF.CREATE_DELIVERY;

      const response = await this.saveItem(method, url)

      if (response) {
        this.snackbarMessage = response.message
        this.isSnackbar = true
      }

      this.clear()
      this.all_deliveries = await this.load_all_diliveries()
    },

    async load_all_diliveries() {
      return await this.sendRequest({
        method: 'GET',
        url: URLS.CTF.ALL_DELIVERIES
      })
    },

    onModelSelected(model) {
      this.car.model = model
      this.car.number = null
    },

    onNumberSelected(number) {
      this.car.number = number
    },

    editDeliveryItem(data) {
      const deliveryID = data.deliveryID;
      const elem = this.all_deliveries.find(el => el.ID === deliveryID);
      if (elem && Object.keys(elem).length > 0) {
        this.isUpdate = true;
        this.deliveryType = (elem.TTN_NUMBER) ? 2 : 1;
        this.selectContainer = elem.CONTAINERID;
        this.brutto = parseFloat(elem.BRUTTO);
        this.delivery_id = deliveryID;

        // Используем $nextTick для гарантированного обновления дочерних компонентов
        this.$nextTick(() => {
          // Эмитируем события для обновления LiveSearchInput
          this.$refs.modelInput.selectItem(elem.CAR);
          this.$refs.numberInput.selectItem(elem.NUMBER);
        });
      }
    },


  },

  computed: {
    isFormReady() {
      return this.deliveryType && this.car.model && this.car.number && this.brutto
        && this.car.number.length >= 8
        && this.selectContainer
    },
    carModels() {
      return [...new Set(this.cars.map(car => car.CAR))]
    },

    carNumbers() {
      if (!this.car.model) return []
      return this.cars
        .filter(car => car.CAR === this.car.model)
        .map(car => car.NUMBER)
    },

    carId() {
      if (!this.car.model || !this.car.number) return ''
      const elem = this.cars.find(car => car.CAR === this.car.model && car.NUMBER === this.car.number)
      return elem.ID
    },

    filteredContainers() {
      if (!this.deliveryType) return []
      const ids = this.deliveryType === 1 ? [101, 102, 103] : [101, 102, 103]
      return this.containers.filter(el =>
        this.deliveryType === 1
          ? !ids.includes(el.container)
          : ids.includes(el.container)
      );
    }
  },


  async mounted() {
    const [cars, containers, all_deliveries] = await Promise.all([
      this.sendRequest({method: 'GET', url: URLS.CTF.CARS}),
      this.sendRequest({method: 'GET', url: URLS.CTF.CONTAINERS}),
      this.sendRequest({method: 'GET', url: URLS.CTF.ALL_DELIVERIES})
    ]);

    this.cars = cars || [];
    this.containers = containers || [];
    this.all_deliveries = all_deliveries || [];
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Создание поставки для ЦТФ
    </v-card-title>
    <v-card-text>
      <v-row class="mt-2">
        <v-select
          variant="outlined"
          :items="[{id: 1, title: 'Собственное'}, {id: 2, title: 'Сторонние'}]"
          item-title="title"
          item-value="id"
          label="Укажити тип поставки"
          v-model="deliveryType"
          class="col-5"
        ></v-select>

        <v-select
          variant="outlined"
          :items="filteredContainers"
          item-title="title"
          item-value="container"
          label="Укажите продукцию"
          v-model="selectContainer"
        >

        </v-select>
      </v-row>

      <v-row>
        <div class="col-6">
          <LiveSearchInput
            v-model="car.model"
            :items="carModels"
            placeholder="Укажите модель машины"
            label="Укажите модель машины"
            @item-selected="onModelSelected"
            ref="modelInput"
          />

        </div>

        <div class="col-6">
          <LiveSearchInput
            v-model="car.number"
            :items="carNumbers"
            placeholder="Укажите гос. номер машины"
            label="Укажите гос. номер машины"
            :disabled="!car.model"
            @item-selected="onNumberSelected"
            ref="numberInput"
          />
        </div>
      </v-row>

      <v-row>
        <v-text-field
          variant="outlined"
          placeholder="Укажите вес брутто"
          label="Укажите вес брутто"
          v-model="brutto"
          class="col-12"
          type="number"
          :rules="[v => v > 0 || 'Вес должен быть положительным']"
          min="0"
        >

        </v-text-field>
      </v-row>

      <v-row>
        <v-text-field
          variant="outlined"
          placeholder="Укажите номер ТТН"
          label="Укажите номер ТТН"
          v-model="ttn.number"
          class="col-12"
          v-if="deliveryType === 2"
        >
        </v-text-field>
      </v-row>
      <v-row class="justify-content-end">
        <v-btn
          prepend-icon="mdi-check-circle"
          variant="outlined"
          class="mr-3"
          color="success"
          density="default"
          @click="create"
          :disabled="!isFormReady">
          {{ !isUpdate ? 'Создать' : 'Обновить' }}
        </v-btn>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <h5 class="text-blue-grey">
                Активные поставки
              </h5>
            </v-card-title>
            <v-card-text>
              <v-table class="table-bordered table-responsive table-hover">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Марка</th>
                  <th>Гос.Номер</th>
                  <th>Артикул</th>
                  <th>Наименование</th>
                  <th>Брутто</th>
                  <th>Тара</th>
                  <th>Нетто</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                <AppCTFDeliveryActiveItem
                  v-for="delivery in all_deliveries" :key="delivery.ID"
                  :delivery="delivery"
                  @edit-delivery="editDeliveryItem"
                  @save-changes="saveChangesItem"
                />
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar
        v-model="isSnackbar"
        timeout="2000"
      >
        {{ snackbarMessage }}

        <template v-slot:actions>
          <v-btn
            color="blue"
            variant="text"
            @click="snackbarMessage = null"
          >
            Закрыть
          </v-btn>
        </template>

      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.live-search {
  position: relative;
  z-index: 100;
}

.live-search_card {
  position: absolute;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}
</style>
