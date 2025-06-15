<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";

export default {
  mixins: [httpMixin],
  props: ['oberNve'],
  data: () => ({
    itemsPerPage: 40,
    items: [],
    headers: [
      {title: 'SSCC', align: 'start', sortable: false, key: 'S8580_NVE'},
      {title: 'Артикул', align: 'start', sortable: false, key: 'S8581_ART_NR'},
      {title: '', align: 'start', sortable: false, key: 'S12_BEZ1'},
      {title: 'Склад', align: 'start', sortable: false, key: 'S8583_KST_NR'},
      {title: 'Нетто', align: 'start', sortable: false, key: 'S8581_NETTO_GEW'},
      {title: 'Брутто', align: 'start', sortable: false, key: 'S8581_BRUTTO_GEW'}
    ],
    loading: false,
    error: null,
  }),
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;

      try {
        const response = await this.sendRequest({
            method: "POST",
            url: URLS.SSCC.SUB_SSCC,
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({
              'ober_nve': this.oberNve
            })
          }
        )

        if (response.error) {
          this.error = response.error;
          this.loading = false;
        } else {
          this.items = response;
          this.loading = false;
        }

      } catch (e) {
        this.error = this.httpError
      }
    }

  },
  async mounted() {
    await this.fetchData();
  }
}
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    :error="error"
    :loading-text="loading? 'Loading...' : ''"
    :items-per-page="itemsPerPage"
    :sort-by="['name']"
    :sort-descending="false"
    class="elevation-1"
    v-if="items.length"
  >

  </v-data-table>

  <v-alert v-if="error" type="warning" border="top"
           variant="outlined"
           prominent>{{ error.error }}
  </v-alert>
</template>

<style scoped>

</style>
