<script>
import httpMixin from "@/mixins/httpMixin.js";
import AppSnackbar from "@/components/AppSnackbar.vue";
import {URLS} from "@/constants/urls.js";

export default {
  name: "AppPackagingQuantFilm",
  components: {AppSnackbar},
  mixins: [httpMixin],
  data: () => ({
    art_gp: null,
    art_gp_name: '',
    art_film: null,
    art_film_name: '',
    lager: null,
    volume_m: null,
    volume_sm: null,
    rules: {
      isAllowedLager: value => ((value >= 5301 && value <= 5314) || value === 5209) || 'Недопустимое МЗ',
    },
    snackbarMessage: null,
    isSnackbar: false
  }),
  methods: {
    clear() {
      this.art_gp = this.art_gp_name = this.art_film_name = this.art_film
        = this.art_film_name = this.lager = this.volume_m = this.volume_sm = null
    },

    async load_article_data(article, model) {
      if (article && article.length) {
        const response = await this.sendRequest({
          method: 'GET',
          url: `http://csb.apkholding.ru/v2/articul/${article}`
        })

        if (response.length > 0) {
          this[model] = response[0].S12_BEZ1
        }
      }
    },

    async send() {
      // Отправка запроса на вставку данных
      const response = await this.sendRequest({
        method: 'POST',
        url: URLS.PACKING.NON_QUANT_INSERT,
        data: JSON.stringify({
          art_gp: this.art_gp,
          art_film: this.art_film,
          lager: this.lager,
          volume_m: this.volume_m,
          volume_sm: this.volume_sm
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        isUserID: false
      })

      if (response) {
        this.snackbarMessage = response
        this.isSnackbar = !this.isSnackbar
      }

      this.clear()
    }
  },
  computed: {
    isFormReady() {
      return this.art_gp && this.art_gp_name && this.art_film
        && this.art_film_name && this.lager
        && this.volume_m && this.volume_sm
        && ((this.lager >= 5301 && this.lager <= 5314) || this.lager === 5209)
        && this.volume_m > 0 && this.volume_sm > 0
    }
  },
  watch: {
    volume_m() {
      if (this.volume_m > 0) {
        this.volume_sm = (this.volume_m * 100).toFixed(3).toString().replace(',', '.')
      }
    }
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Установка кванта на пленку
    </v-card-title>
    <v-card-text>
      <v-row class="mt-2">
        <v-text-field
          class="col-4"
          placeholder="Укажите артикул ГП"
          label="Укажите артикул ГП"
          variant="outlined"
          v-model="art_gp"
          type="number"
          @focusout="load_article_data(art_gp, 'art_gp_name')"
        >
        </v-text-field>
        <v-text-field
          class="col-8"
          placeholder="Наименование ГП"
          variant="outlined"
          v-model="art_gp_name"
          disabled
        >
        </v-text-field>
      </v-row>
      <v-row class="mt-2">
        <v-text-field
          class="col-4"
          placeholder="Укажите артикул пленки"
          label="Укажите артикул пленки"
          variant="outlined"
          v-model="art_film"
          type="number"
          @focusout="load_article_data(art_film, 'art_film_name')"
        >
        </v-text-field>
        <v-text-field
          class="col-8"
          placeholder="Наименование пленки"
          variant="outlined"
          v-model="art_film_name"
          disabled
        >
        </v-text-field>
      </v-row>
      <v-row class="mt-2">
        <v-text-field
          class="col-4"
          placeholder="Укажите МЗ"
          label="Укажите МЗ"
          type="number"
          variant="outlined"
          v-model="lager"
          :rules="[rules.isAllowedLager]"
        >
        </v-text-field>
        <v-text-field
          class="col-4"
          placeholder="Укажите объем в метрах"
          label="Укажите объем в метрах"
          type="number"
          variant="outlined"
          v-model="volume_m"
          :rules="[value => value > 0 || 'Объем должен быть больше 0']"

        >
        </v-text-field>
        <v-text-field
          class="col-4"
          placeholder="Укажите объем в см"
          label="Укажите объем в см"
          type="number"
          variant="outlined"
          v-model="volume_sm"
          :rules="[value => value > 0 || 'Объем должен быть больше 0']"
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
          @click="send"
          :disabled="!isFormReady">
          Создать
        </v-btn>
      </v-row>

      <v-snackbar
        v-model="isSnackbar"
        timeout="2000"
      >
        {{ snackbarMessage.message }}

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

</style>
