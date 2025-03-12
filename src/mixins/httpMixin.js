import axios from 'axios';
import {URLS} from "@/constants/urls.js";
import {DT, DT_BASE_URL} from "@/constants/dt.js";

export default {
  data(){
    return {
      loading: false,     // для индикации загрузки
      error: null         // для хранения ошибок
    }
  },

  methods: {
    async sendRequest({ method = "get", url, data = null, params = null, headers = {}, isUserID=true }) {
      this.loading = true;
      this.error = null;

      try {
        // Получаем userid из localStorage
        const token_data = JSON.parse(localStorage.getItem('token')) || {};
        const userId = token_data.userid || '';

        if(isUserID){
          // Добавляем пользовательский заголовок
          headers = {
            ...headers, // Сохраняем переданные заголовки
            'X-User-ID': userId || "", // Добавляем заголовок userid
          };
        }

        const response = await axios({
          method,
          url,
          data,
          params,
          headers,
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data || error.message;
        console.error("HTTP Error:", this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async load_fields(table_id, targetField) {
      try {
        this.fields[targetField] = await this.sendRequest({
          method: "GET",
          url: URLS.ORDERS.FA078_FIELDS.replace('_table_id_', table_id)
        })
      } catch (error) {
        this.$vuetify.toast.error(`Ошибка загрузки: ${this.error || 'Неизвестная ошибка'}`)
      }
    },

    buildURL(command, params = {}) {
      // Заменяем все вхождения {ключ} значением из params
      const parsedCommand = command.replace(/{(\w+)}/g, (match, key) => {
        return params[key] !== undefined ? params[key] : match; // Если ключ есть, заменяем, иначе оставляем как есть
      });

      return DT_BASE_URL.replace('{cmd}', encodeURIComponent(parsedCommand));
    },

    async send_dt_commnad(command, params = {}, handleID = '') {
      const resposne = await this.sendRequest({
        method: 'GET',
        url: this.buildURL(command, params) + handleID,
        isUserID: false
      })

      if(resposne && resposne['soa-result']?.Line){
        return {'succes': resposne['soa-result'].Line, 'status': resposne['soa-result'].status }
      }

      if(resposne && resposne['soa-result']?.Error){
        return {'error': resposne['soa-result'].Error, 'status': resposne['soa-result'].status }
      }

      return {'withoutRespsonse': resposne['soa-result'] }
    }
  }
}
