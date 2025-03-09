<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";

export default {
  props: ['ext_order'],
  mixins: [httpMixin],
  data: () => ({
    import_data: null,
    headers: ["ID", "Address_1", "Address_2", "Ext_order_number", "Delivery_date", "Order_date", "Line_number", "Item", "Price", "Qty_PU", "Qty_OU", "NDS", "Sum_NDS", "Item_customer", "1C_order_number", "Contract", "Contract_date", "User", "Currency", "Created_1C", "Imported_CSB", "Delivery_time", "Labeling", "Type", "Store", "Canceled", "Text", "Client_order_nr", "Client_order_date", "Reason", "Reason_text", "Ext_client", "Comment", "GLN", "Readiness_time", "Ext_client_region", "Ext_client_KMD", "Ext_client_parent_KMD", "Otvethran", "Otvethran_Order"]
  }),


  async mounted() {
    this.import_data = await this.sendRequest({
      method: "POST",
      url: URLS.ORDERS.IMPORT_DATA,
      data: JSON.stringify({'ext_order_id': this.ext_order}),
      headers: {
        'content-type': 'application/json'
      }
    })
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-table density="compact" class="table table-bordered">
        <thead>
        <tr>
          <th v-for="header in headers">
            {{ header }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in import_data">
          <td v-for="tdItem in Object.values(item) ">{{ tdItem}}</td>
        </tr>
        </tbody>
      </v-table>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
