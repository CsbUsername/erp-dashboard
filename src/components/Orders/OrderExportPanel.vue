<script >
  import fieldsMixin from "@/mixins/fieldsMixin.js";

  export default{
    props: ['title', 'data', 'headers'],
    mixins: [fieldsMixin]
  }
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <h6>{{ title }}</h6>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-row>
        <v-col cols="12">
          <v-table>
            <thead>
            <tr>
              <th v-for="header in headers">
                {{ header }}
              </th>

            </tr>
            </thead>
            <tbody>
            <tr v-for="el in data">
              <td v-for="header in headers">{{ parseToFloat(el[header]) }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>

</style>
