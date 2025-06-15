import axios from 'axios';
import {URLS} from "@/constants/urls.js";
import {DT, DT_BASE_URL} from "@/constants/dt.js";

export default {
  data(){
    return {
      loading: false,     // для индикации загрузки
      httpError: null,
      dtErrors: null// для хранения ошибок
    }
  },

  methods: {
    async sendRequest({ method = "get", url, data = null, params = null, headers = {}, isUserID=true }) {
      this.loading = true;
      this.httpError = null;

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
        this.httpError = error.response?.data || error.message;
        console.error("HTTP Error:", this.httpError);
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
        this.$vuetify.toast.error(`Ошибка загрузки: ${this.httpError || 'Неизвестная ошибка'}`)
      }
    },

    async send_dt_commnad(command, params = {}, handleID = '') {
      // Создаем объект с параметрами для отправки на ваш сервер
      const requestData = {
        url: this.buildURL(command, params) + handleID
      };

      // Отправляем запрос на внутренний endpoint вашего сервера
      const response = await this.sendRequest({
        method: 'POST', // Используем POST для отправки данных
        url: URLS.SERVICE.DT_PROXY, // Ваш внутренний endpoint для проксирования запросов
        data: requestData, // Отправляем данные в теле запроса
        isUserID: false
      });

      if(response && response['soa-result']?.Line){
        return {'succes': response['soa-result'].Line, 'status': response['soa-result'].status }
      }

      if(response && response['soa-result']?.Error){
        this.dtErrors = response['soa-result'].Error
        return {'error': response['soa-result'].Error, 'status': response['soa-result'].status }
      }

      return {'withoutRespsonse': response['soa-result'] }
    },

    buildURL(command, params = {}) {
      // Заменяем все вхождения {ключ} значением из params
      const parsedCommand = command.replace(/{(\w+)}/g, (match, key) => {
        return params[key] !== undefined ? params[key] : match; // Если ключ есть, заменяем, иначе оставляем как есть
      });

      return DT_BASE_URL.replace('{cmd}', encodeURIComponent(parsedCommand));
    },

    async _send_dt_commnad(command, params = {}, handleID = '') {
      const resposne = await this.sendRequest({
        method: 'GET',
        url: this.buildURL(command, params) + handleID,
        isUserID: false
      })

      if(resposne && resposne['soa-result']?.Line){
        return {'succes': resposne['soa-result'].Line, 'status': resposne['soa-result'].status }
      }

      if(resposne && resposne['soa-result']?.Error){
        this.dtErrors = resposne['soa-result'].Error
        return {'error': resposne['soa-result'].Error, 'status': resposne['soa-result'].status }
      }

      return {'withoutRespsonse': resposne['soa-result'] }
    },

    async send_log({userid, fullname, component_id, description}){
      const response = await this.sendRequest({
        method: 'POST',
        url: URLS.SERVICE.LOGGER,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          userid: userid,
          fullname: fullname,
          component_id: component_id,
          description: description,
        })
      })
    },

    checkL2Status(response) {
      // Проверяем, что ответ имеет ожидаемую структуру
      if (!response.withoutRespsonse || !response.withoutRespsonse.status) {
        return false;
      }

      const status = response.withoutRespsonse.status;
      return status.includes('L2+0+0');
    }
  }
}
