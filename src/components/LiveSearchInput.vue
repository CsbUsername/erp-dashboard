<script>

import {debounce} from "lodash";

export default {
  emits: ['update:modelValue', 'item-selected'],

  props: {
    items: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    filterFn: {
      type: Function,
      default: (item, searchTerm) => String(item).toLowerCase().includes(searchTerm.toLowerCase())
    },
    itemText: {
      type: Function,
      default: (item) => String(item)
    },
    modelValue: {
      type: String,
      default: ''
    },
  },

  data() {
    return {
      search: this.modelValue,
      showSuggestions: false,
      filteredItems: []
    }
  },

  watch: {
    modelValue(newVal) {
      this.search = newVal
    },
    items() {
      this.filterItems();
    }
  },


  methods: {
    filterItems: debounce(function () {
      if (typeof this.search !== 'string' || this.search.length < 1) {
        this.filteredItems = []
        this.showSuggestions = false
        return
      }

      const searchTerm = this.search.toLowerCase()
      this.filteredItems = this.items.filter(item =>
        this.filterFn(item, searchTerm))

      this.showSuggestions = this.filteredItems.length > 0
    }, 200),


    selectItem(item) {
      this.search = this.itemText(item)
      this.$emit('update:modelValue', this.search)
      this.showSuggestions = false
      this.$emit('item-selected', item)
    },

    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false
      }, 200)
    }
  }
}
</script>

<template>
  <div class="live-search-wrapper">
    <v-text-field
      variant="outlined"
      :placeholder="placeholder"
      :label="label"
      :model-value="search"
      @update:model-value="val => { search = val; filterItems(); }"
      @focus="filterItems"
      @blur="hideSuggestions"
    />

    <div class="live-search" v-if="showSuggestions">
      <v-card class="live-search_card">
        <v-list>
          <v-list-item
            v-for="(item, index) in filteredItems"
            :key="index"
            @click="selectItem(item)"
            class="suggestion-item"
          >
            <v-list-item-title>{{ itemText(item) }}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="filteredItems.length === 0">
            <v-list-item-title>Ничего не найдено</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </div>

  </div>
</template>

<style scoped>
.live-search-wrapper {
  position: relative;
}

.live-search {
  position: absolute;
  z-index: 100;
  width: 100%;
}

.live-search_card {
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}
</style>
