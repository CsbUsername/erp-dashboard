<template>
  <v-dialog v-model="showFeedbackDialog">
    <template v-slot:default="{ isActive }">
      <v-card
        class="mx-auto mt-3"
        style="max-width: 500px;"
      >
        <v-toolbar
          color="deep-purple-accent-4"
          cards
          dark
          flat
        >
          <v-card-title class="text-h6 font-weight-regular">
            Укажите ваши пожелания по улучшению
          </v-card-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-form
          ref="form"
          class="pa-4 pt-6"
        >
          <v-text-field
            v-model="username"
            color="deep-purple"
            counter="6"
            label="Имя пользователя"
            style="min-height: 96px"
            type="text"
            variant="filled"
            disabled
          ></v-text-field>
          <v-textarea
            v-model="message"
            color="deep-purple"
            label="Текст сообщения"
            rows="7"
            variant="filled"
            auto-grow
          ></v-textarea>

        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            variant="text"
            @click="$emit('close-feedback')"
          >
            Закрыть форму
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="deep-purple-accent-4"
            @click="sendMessage"
          >
            Отправить
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import accessMixin from "@/mixins/accessMixin.js";
import httpMixin from "@/mixins/httpMixin.js";

export default {
  mixins: [accessMixin, httpMixin],
  props: ['isShowFeedbackDialog'],
  data: () => ({
    message: '',
    showFeedbackDialog: false,
  }),

  methods: {
    build_message() {
      return `*Пользователь*: ${this.username}\n` + `*Текст*: " ${this.message}\n` + `*Время*: ${new Date().toLocaleString()}\n`;
    },

    async sendMessage() {
      const botToken = '2099481208:AAHQcWDpIQXPR9PIqDvEQx3ph8Ti_BtfuyQ';
      const chatId = '-746011187'; // ID чата, куда отправлять сообщение
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const response = this.sendRequest({
        method: 'POST',
        url,
        data: JSON.stringify({
          chat_id: chatId,
          text: this.build_message().trim(),
          parse_mode: 'Markdown'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        alert('Сообщение отправлено!');
      } else {
        alert('Ошибка при отправке сообщения');
      }

      this.$emit('close-feedback')
    }
  },
  updated(){
    this.showFeedbackDialog = this.isShowFeedbackDialog
  }
}


</script>
