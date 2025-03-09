<script>
  import fieldsMixin from "@/mixins/fieldsMixin.js";

  export default {
    props: ['details', 'fields'],
    mixins: [fieldsMixin],
    methods: {
      pickField(obj, keys) {
        // Метод для выборки ключей из  объекта
        return keys.reduce((result, key) => {
          result[key] = obj[key]
          return result
        }, {})
      },
    },
    computed: {
      first_half_details() {
        if (!this.details) return {}
        const keys = Object.keys(this.details);      // ключи объекта
        const minIndex = Math.ceil(keys.length / 2); // середина массива
        const firstHalfKeys = keys.slice(0, minIndex);  // Первая половина
        return this.pickField(this.details, firstHalfKeys)
      },

      second_half_details() {
        if (!this.details) return {}
        const keys = Object.keys(this.details);      // ключи объекта
        const minIndex = Math.ceil(keys.length / 2); // середина массива
        const secondHalfKeys = keys.slice(minIndex);    // Вторая половина
        return this.pickField(this.details, secondHalfKeys)
      },
    }
  }
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h5>Заголовок заказа (Таб. fa0078_00111)</h5>
      </v-col>
    </v-row>
    <v-row class="justify-content-between">
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <div class="table-responsive">
              <v-table class="table table-bordered table-responsive-sm" density="compact">
                <tbody>
                <tr v-for="(item, indx) in first_half_details">
                  <th>
                    <v-tooltip :text="indx">
                      <template v-slot:activator="{ props }">
                        <span v-bind="props">{{ getKurzBezByKey(indx) }}</span>
                      </template>
                    </v-tooltip>
                  </th>
                  <td>{{ item }}</td>
                </tr>
                </tbody>
              </v-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <div class="table-responsive">
              <v-table class="table table-bordered table-responsive-sm" density="compact">
                <tbody>
                <tr v-for="(item, indx) in second_half_details">
                  <th>
                    <v-tooltip :text="indx">
                      <template v-slot:activator="{ props }">
                        <span v-bind="props">{{ getKurzBezByKey(indx) }}</span>
                      </template>
                    </v-tooltip>
                  </th>
                  <td>{{ item }}</td>
                </tr>
                </tbody>
              </v-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
