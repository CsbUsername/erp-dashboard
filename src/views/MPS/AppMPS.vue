<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";

export default {
  mixins: [httpMixin],
  props: {
    deviceId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data: () => ({
    errors: [],
    isOpen: [0],
    interval_active: null,
    interval_all: null
  }),
  methods: {
    async load_all_errors(){
      this.errors = await this.sendRequest({
        method: "POST",
        url: URLS.MPS.ERRORS_ALL,
        data: JSON.stringify({deviceId: this.deviceId}),
        isUserID: false
      })
    }
  },
  computed: {
    active_errors_count(){
      return this.errors.filter(item => item.DeActivated === null).length
    },
    all_errors_count(){
      return this.errors.length
    },
    active_errors(){
      if(this.errors.length > 0){
        return this.errors.filter(item => item.DeActivated === null)
      }
    }
  },
  mounted() {
    this.load_all_errors()
    this.interval_all = setInterval(this.load_all_errors, 10000)
  },
  destroyed() {
    clearInterval(this.interval_active)
    clearInterval(this.interval_all)
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-expansion-panels variant="popout" multiple accordion v-model="isOpen">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h6>Активные ошибки</h6>

              <v-badge
                color="error"
                :content="active_errors_count"
                inline
              ></v-badge>

          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-banner lines="one" text="Ошибки отстутвуют" stacked v-if="!active_errors_count">
            </v-banner>
            <v-table class="table table-striped" v-else>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Код ошибки</th>
                  <th>Описание</th>
                  <th>Локация</th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="error in active_errors" :key="error">
                <td>{{ error.Activated.date.slice(0, 19) }}</td>
                <td>{{ error.MessageID }}</td>
                <td>{{ error.MessageText }}</td>
                <td>{{ error.DeviceName }}</td>
              </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h6>История ошибок</h6>
            <v-badge
              color="error"
              :content="all_errors_count"
              inline
            ></v-badge>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-table class="table table-striped">
              <thead>
              <tr>
                <th>Код ошибки</th>
                <th>Локация</th>
                <th>Активировано</th>
                <th>Деактивировано</th>
                <th>Длительность</th>
                <th>Активно</th>
                <th>Описание</th>
                <th>Тип</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="error in errors" :key="error">
                <td>{{ error.MessageID }}</td>
                <td>{{ error.DeviceName }}</td>
                <td>{{ error.Activated?.date.slice(0, 19) }}</td>
                <td>{{ error.DeActivated?.date.slice(0, 19) }}</td>
                <td>{{ error.Totaltime }}</td>
                <td>{{ error.Active }}</td>
                <td>{{ error.MessageText }}</td>
                <td>{{ error.AlarmClass }}</td>
              </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
