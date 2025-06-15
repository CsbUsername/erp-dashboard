<template>
  <v-card class="ma-4 h-100">
    <v-card-title>Блокировка ЦТФ на время регламентных работ</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-switch
            v-model="isBlocked"
            :label="isBlocked ? 'Сайт заблокирован' : 'Сайт доступен'"
            color="error"
            @change="handleSwitchChange"
            :loading="loading"
          ></v-switch>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Начало блокировки"
            v-model="dateStart"
            type="datetime-local"
            :disabled="isBlocked"
            required
            :rules="[requiredRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Окончание блокировки"
            v-model="dateEnd"
            type="datetime-local"
            :disabled="isBlocked"
            required
            :rules="[requiredRule, endDateRule]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-alert
        v-if="errorMessage"
        type="error"
        dense
        class="mt-4"
      >
        {{ errorMessage }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { URLS } from "@/constants/urls.js";
import httpMixin from "@/mixins/httpMixin.js";
import accessMixin from "@/mixins/accessMixin.js";

export default {
  mixins: [httpMixin, accessMixin],
  data() {
    return {
      isBlocked: false,
      dateStart: null,
      dateEnd: null,
      currentBlockId: null,
      errorMessage: '',
      loading: false
    };
  },
  computed: {
    requiredRule() {
      return v => !!v || 'Обязательное поле';
    },
    endDateRule() {
      return v => {
        if (!this.dateStart || !v) return true;
        return new Date(v) > new Date(this.dateStart) || 'Дата окончания должна быть позже даты начала';
      };
    }
  },
  async created() {
    const now = new Date();
    const future = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 часа

    // Используем формат, совместимый с datetime-local
    this.dateStart = this.formatDate(now);
    this.dateEnd = this.formatDate(future);
    await this.fetchBlockStatus();
  },
  methods: {

    async fetchBlockStatus() {
      try {
        this.loading = true;
        const response = await this.sendRequest({
          method: 'GET',
          url: URLS.CTF.SELECT
        });

        if (response && (response.length || Object.keys(response).length)) {
          const blockData = response;
          this.isBlocked = blockData.STATUS === '1';
          this.currentBlockId = blockData.ID;
          this.dateStart = blockData.DATE_START;
          this.dateEnd = blockData.DATE_END;
        } else {
          const now = new Date();
          const future = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 часа

          this.isBlocked = false;
          this.currentBlockId = null;
          this.dateStart = this.formatDate(now)
          this.dateEnd = this.formatDate(future)
        }
      } catch (error) {
        console.error('Ошибка при получении статуса блокировки:', error);
        this.errorMessage = 'Не удалось получить статус блокировки';
      } finally {
        this.loading = false;
      }
    },
    async handleSwitchChange() {
      try {
        this.loading = true;

        if (this.currentBlockId) {
          // Всегда обновляем существующую запись, если ID известен
          await this.updateBlock();
        } else {
          // Создаем новую запись только если нет currentBlockId
          await this.createBlock();
        }

      } catch (error) {
        console.error('Ошибка при изменении статуса блокировки:', error);
        this.isBlocked = !this.isBlocked; // Возвращаем переключатель в предыдущее состояние
        this.errorMessage = 'Не удалось изменить статус блокировки';
      } finally {
        this.loading = false;
      }
    },
    async createBlock() {
      try {
        console.log(this.dateStart)
        const response = await this.sendRequest({
          method: 'POST',
          url: URLS.CTF.INSERT,
          data: {
            status: '1',
            userid: this.user_id,
            date_start: this.formatDate(this.dateStart),
            date_end: this.formatDate(this.dateEnd)
          }
        });

        if (response && response.items && response.items.ID) {
          this.currentBlockId = response.items.ID;
          // Обновляем данные из ответа сервера
          this.dateStart = response.items.DATE_START;
          this.dateEnd = response.items.DATE_END;
          this.errorMessage = '';
          return true;
        } else {
          throw new Error(response?.message || 'Не удалось создать запись блокировки');
        }
      } catch (error) {
        console.error('Ошибка при создании блокировки:', error);
        this.errorMessage = error.message;
        return false;
      }
    },
    async updateBlock(status) {
      await this.sendRequest({
        method: 'POST',
        url: URLS.CTF.UPDATE,
        data: {
          id: this.currentBlockId,
          status: this.isBlocked ? '1' : '0'
        }
      });
      this.currentBlockId = null
    },
    formatDate(dateTime=new Date()){
      const date = (new Date(dateTime).toJSON()).slice(0, 10)
      const time = (new Date(dateTime).toLocaleTimeString())
      return `${date} ${time}`
    },

    validateDates() {
      if (!this.dateStart || !this.dateEnd) {
        this.errorMessage = 'Заполните даты начала и окончания';
        return false;
      }

      if (new Date(this.dateEnd) <= new Date(this.dateStart)) {
        this.errorMessage = 'Дата окончания должна быть позже даты начала';
        return false;
      }

      this.errorMessage = '';
      return true;
    }
  }
};
</script>

<style scoped>

</style>
