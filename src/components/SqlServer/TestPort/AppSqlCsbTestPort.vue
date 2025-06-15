<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import TestPortItem from '@/components/SqlServer/TestPort/TestPortItem.vue'

export default {
  mixins: [httpMixin],
  components: {
    TestPortItem
  },

  data() {
    return {
      job_items: [],
      template_items: []
    }
  },
  provide() {
    return {
      template_items: this.template_items
    }
  },
  methods: {
    async load_data() {
      this.job_items = await this.sendRequest({
        method: 'GET',
        url: URLS.SQL_SERVER.CSB_JOBS
      })

      // Добавляем поле для isEdit для каждого элемента
      this.job_items.forEach(el => {
        el.isEdit = false;
      });

      this.template_items = await this.sendRequest({
        method: 'GET',
        url: URLS.SQL_SERVER.CSB_JOBS_TEMPLATE
      })
    }
  },

  async mounted() {
    await this.load_data()
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Порты CSB TЕST
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-content-end">
            <v-btn class="ml-2" color="success">
              Обновить порты
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-table class="table-hover table-bordered jobs_table">
            <thead>
            <tr>
              <th>Номер работы</th>
              <th>Наименование</th>
              <th>Описание</th>
              <th></th>
              <th>IP адрес</th>
              <th>Порт</th>
            </tr>
            </thead>
            <tbody>
            <TestPortItem
              v-for="(item, index) in job_items"
              :key="index"
              :item="item"
            />
            </tbody>
          </v-table>
        </v-col>

      </v-row>

    </v-card-text>
  </v-card>
</template>

<style scoped>
td:hover {
  cursor: pointer;
}

.jobs_table td:nth-child(1) {
  width: 10%;
}

.jobs_table td:nth-child(2) {
  width: 22.5%;
}

.jobs_table td:nth-child(3) {
  width: 22.5%;
}
</style>
