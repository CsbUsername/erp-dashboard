<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";

export default {
  props: ['sectionID'],
  mixins: [httpMixin],
  data: () => ({
    interval: null,
    items: []
  }),
  methods: {
    async load_data() {
      this.items = await this.sendRequest({
        method: "GET",
        url: URLS.IMPORT.MAIN_DATA + this.sectionID
      })
    }
  },
  computed: {
    headers() {
      if (this.items.length > 0) {
        console.log(Object.keys(this.items[0]))
        return Object.keys(this.items[0])
      }
    },

    isNotLoaded() {
      if (this.items.length > 0) {
        return this.items.filter(item => this.items.Imported_CSB === "1900-01-01 00:00:00")
      }
    }
  },
  mounted() {
    this.load_data()
    this.interval = setInterval(this.load_data, 30000)
  },
  destroyed() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <v-expansion-panels variant="popout">
    <v-expansion-panel>
      <v-expansion-panel-title>
        В очереди на загрузку
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-table class="table table-bordered">
          <thead>
            <tr>
              <th v-for="header in headers" :key="header">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in isNotLoaded">
              <td v-for="value in Object.values(item)"> {{ value }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title>
        Загружено
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-table density="compact" class="table table-bordered table-hover">
          <thead>
          <tr>
            <th v-for="header in headers">{{ header }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in items" :key="item">
            <td v-for="value in Object.values(item)">{{ value }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
.v-expansion-panel-text__wrapper{
    max-height: calc(100vh - 300px); 
  }
</style>
