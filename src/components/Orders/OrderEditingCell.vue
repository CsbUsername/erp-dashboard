<script>
import fieldsMixin from "@/mixins/fieldsMixin.js";

export default {
  name: "OrderEditingCell",
  mixins: [fieldsMixin],
  props: ['position', 'targetField', 'field'],
  emits: ['saveCell'],
  data: () => ({
    editing: {
      editingCell: null,
      editingField: null,
      editValue: ''
    },
    isEdit: false
  }),
  methods: {
    editCell(position, field) {
      this.editing.editingCell = position.FA077_ART_NR;
      this.editing.editingField = field;
      this.editing.editValue = position[field];
      this.isEdit = true;
    },

    updateEditingCell(){
      this.$emit('saveCell', this.editing.editingField, this.editing.editValue, this.editing.editingCell)
      this.isEdit = false;
    }
  },

  computed: {
    checkField(){
      return parseInt(this.editing.editingCell) === parseInt(this.targetField) && this.editing.editingField === this.field
    }
  }
}
</script>

<template>
  <td @click="editCell(position, field)" style="cursor: pointer;">
    <!-- Если эта ячейка в режиме редактирования -->
    <v-text-field
      v-if="checkField && isEdit"
      v-model="editing.editValue"
      @keyup.enter="updateEditingCell"
      @focusout="isEdit = false"
      dense
      solo
      hide-details
    />
    <!-- Если ячейка не в режиме редактирования -->
    <div v-else>
      {{ parseToFloat(position[field]) }}
    </div>
  </td>
</template>

<style scoped>

</style>
