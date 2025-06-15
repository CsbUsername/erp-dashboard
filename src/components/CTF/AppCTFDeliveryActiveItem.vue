<script>
export default {
  name: "AppCTFDeliveryActiveItem",
  emits: ['saveChanges', 'editDelivery'],
  props: {
    delivery: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      netto: 0.00,
      tara: null,
      brutto: this.delivery.BRUTTO,
      articul: this.delivery.articul,
      showError: false,
    }
  },

  computed: {
    calculatedNetto() {
      if (!this.tara) return 0;
      return (parseFloat(this.delivery.BRUTTO) - parseFloat(this.tara)).toFixed(2);
    }
  },

  methods: {
    validateTara(value) {
      this.showError = value && parseFloat(value) >= parseFloat(this.delivery.BRUTTO);
      return !this.showError;
    },

    updateTara(value) {
      if (this.validateTara(value)) {
        this.tara = value;
      }
    },

    saveChanges() {
      if (!this.showError && this.tara) {
        this.$emit('saveChanges', {
          deliveryID: parseInt(this.delivery.ID),
          tara: parseFloat(this.tara),
          brutto: parseFloat(this.brutto),
          netto: this.calculatedNetto,
          articul: this.articul,
          car_id: this.delivery.CARID,
          container_id: this.delivery.CONTAINERID
        })
      }
    },

    editDelivery() {
      this.$emit('editDelivery', {deliveryID: parseInt(this.delivery.ID)})
    }
  }
}
</script>

<template>
  <tr>
    <td>{{ delivery.ID }}</td>
    <td>{{ delivery.CAR }}</td>
    <td>{{ delivery.NUMBER }}</td>
    <td>{{ delivery.articul }}</td>
    <td>{{ delivery.S12_BEZ1 }}</td>
    <td>{{ delivery.BRUTTO }}</td>
    <td>
      <v-text-field
        v-model="tara"
        variant="outlined"
        type="number"
        density="compact"
        :error="showError"
        :error-messages="showError ? 'Вес тары должен быть меньше веса брутто' : ''"
        @update:modelValue="updateTara"
        @blur="validateTara(tara)"
        width="11rem"
      ></v-text-field>
    </td>
    <td>{{ calculatedNetto }}</td>
    <td>
      <v-row class="justify-center">
        <v-btn
          density="compact"
          size="medium"
          class="mr-2"
          color="primary"
          icon="mdi-pen"
          @click="editDelivery"
        ></v-btn>

        <v-btn
          density="compact"
          size="medium"
          color="success"
          icon="mdi-check"
          @click="saveChanges"
          :disabled="showError || !tara"
        ></v-btn>
      </v-row>
    </td>
  </tr>
</template>

<style scoped>
/* Добавьте стили при необходимости */
</style>
