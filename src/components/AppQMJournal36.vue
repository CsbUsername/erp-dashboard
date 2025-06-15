<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from "@/constants/urls.js";
import utilsMixin from "@/mixins/utilsMixin.js";
import AppQMJournal36Row from '@/components/QM/AppQMJournal36Row.vue'

export default {
  mixins: [httpMixin, utilsMixin],
  props: ['shift_id'],
  data: () => ({
    items: [],
    qm_disease_list: [],
    qm_parts_list: [],
    vi0041_list: [],
    vi0044_list: [],
    sy8211_list: [],
    sy11_list: [],
    qm307_list: [],
    vi7281_list: [],
    isLoading: false,
  }),

  methods: {
    async load_probe() {
      // Загружаем пробы
      return await this.sendRequest({
        method: 'POST',
        url: URLS.QM.JOURNAL306,
        data: {
          'shift_id': this.shift_id,
          'date_start': 20250501,
          'date_end': 202505013,
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    async load_diseases_list() {
      // Получить список болезней в CSB из 102 списка
      return await this.sendRequest({
        method: 'POST',
        url: URLS.VI.VI7846,
        data: {list_nr: 102},
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    async load_data(url, data) {
      return await this.sendRequest({
        method: 'POST',
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    async load_vi0041_data() {
      return await this.load_data(URLS.VI.VI41_EING_NR, {eing_nr: this.qm_parts_list})
    },

    async load_vi7281_data() {
      return await this.load_data(URLS.VI.VI7281, {
        eing_nr: this.qm_parts_list,
        merkmal_nr_start: 9,
        merkmal_nr_end: 9
      })
    },

    async load_vi0044_data() {
      const ls_datum_list = this.vi0041_list.map(el => {
        return parseInt(el.VI0041_LS_DATUM)
      });


      // Проверка на пустой массив
      if (ls_datum_list.length === 0) {
        throw new Error("ls_datum_list is empty");
      }

      // Проверка на наличие NaN в массиве
      if (ls_datum_list.some(isNaN)) {
        throw new Error("ls_datum_list contains invalid values");
      }

      const minDate = Math.min(...ls_datum_list);
      const maxDate = Math.max(...ls_datum_list);

      return await this.load_data(URLS.VI.VI44_EING_NR, {
        eing_nr: this.qm_parts_list,
        sc_datum_start: minDate,
        sc_datum_end: parseInt(this.addMonthToDate(maxDate, 1)),
        fields: ['VI0044_SC_DATUM', 'VI0044_EING_NR', 'VI0044_TIER_NR', 'VI0044_REF_NR', 'VI0044_ART_NR_LAGER', 'VI0044_NVE',
          'VI0044_BC_NR_1', 'VI0044_BC_NR_2', 'VI0044_BC_NR_3', 'VI0044_BC_NR_4', 'VI0044_BC_NR_5', 'VI0044_BC_NR_6',
          'VI0044_BC_NR_7', 'VI0044_BC_NR_8', 'VI0044_BC_NR_9', 'VI0044_BC_NR_10']
      })
    },

    async load_qm307_data() {
      const minQmNr = Math.min(...this.items.map(el => {
        return parseInt(el.QM0306_NR)
      }))
      const maxQmNr = Math.max(...this.items.map(el => {
        return parseInt(el.QM0306_NR)
      }))

      const minQmDatum = Math.min(...this.items.map(el => {
        return parseInt(el.QM0306_DATUM)
      }))
      const maxQmDatum = Math.max(...this.items.map(el => {
        return parseInt(el.QM0306_DATUM)
      }))

      console.log('LOAD_QM307_DATA', minQmNr, maxQmNr, minQmDatum, maxQmDatum)

      return await this.load_data(URLS.QM.QM307, {
        fields: ['QM0307_NR', 'QM0307_MESSVERFAHREN', 'QM0307_SUMME_MESSWERT'],
        minQmNr: minQmNr,
        maxQmNr: maxQmNr,
        minQmDatum: minQmDatum,
        maxQmDatum: maxQmDatum
      })
    }
  },
  components: {AppQMJournal36Row},
  async mounted() {
    this.isLoading = true

    const [items, qm_disease_list] = await Promise.all([
      this.load_probe(),
      this.load_diseases_list()
    ])

    this.items = items || [];
    this.qm_disease_list = qm_disease_list || [];

    // Если пробы загружены:
    if (this.items.length > 0) {
      // Выбираем номера партий из проб
      this.qm_parts_list = this.items.map((el) => {
        return el.QM0306_IDENTNR.slice(5,)
      })

      // Закгружаем данные по поставкам животных
      this.vi0041_list = await this.load_vi0041_data() || []

      if (this.vi0041_list.length > 0) {
        const ulief_nrs_list = this.vi0041_list.map((el) => {
          return el.VI0041_ULIEF_NR
        })

        // Загружаем данные по адресам
        const [sy8211, sy11, vi0044, v7281, qm307] = await Promise.all([
          this.load_data(URLS.ADDRESS.S8211, {nr: ulief_nrs_list}),
          this.load_data(URLS.ADDRESS.S11, {nr: ulief_nrs_list}),
          this.load_vi7281_data(),
          this.load_vi0044_data(),
          this.load_qm307_data()
        ])
        this.sy8211_list = sy8211 || [];
        this.sy11_list = sy11 || [];
        this.vi7281_list = v7281 || [];
        this.vi0044_list = vi0044 || [];
        this.qm307_list = qm307 || [];

      }
    }

    this.isLoading = false
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-text>
      <h6>
        <v-row class="text-center">
          <v-col cols="2" class="text-left">
            <img src="@/assets/img/apk_logo.gif" alt="Лого" class="logo">
          </v-col>
          <v-col cols="6" class="font-weight-bold text-center pr-5">
            <p class="p-0 m-0">ООО «Курский мясоперерабатывающий завод»</p>
            <p class="p-0 m-0">Журнал(форма 36) 1 смена</p>
          </v-col>
          <v-col cols="43" class="text-left">
            <v-row class="header-datetime-block">
              <v-col cols="6">
                <p class="m-0 p-0">Дата от: <span class="font-weight-bold">01.04.2025</span></p>
                <p class="m-0 p-0">Время: <span class="font-weight-bold">00:50:55 </span></p>
              </v-col>
              <v-col cols="6">
                <p class="m-0 p-0">до <span class="font-weight-bold">01.04.2025</span></p>
                <p class="m-0 p-0">Страница: <span class="font-weight-bold">1</span></p>
              </v-col>

            </v-row>
          </v-col>
        </v-row>
      </h6>
      <table class="table table-bordered text-center">
        <thead>
        <tr>
          <th rowspan="3">Дата осмотра</th>
          <th rowspan="3">Регистрационный номер партии или
            наименование сдатчика скота
          </th>
          <th rowspan="3">Адрес хозяйства</th>
          <th rowspan="3">Вид животн.</th>
          <th rowspan="3">Кол-во осмотрен. туш</th>
          <th colspan="2">Результаты осмотра</th>
          <th colspan="3">Органолептические показатели (Внешний вид, цвет, консистенция, запах, состояние жира)</th>
          <th rowspan="3">Дата отбора проб и результаты лаб. исследований</th>
          <th colspan="6">По результатам ветсанэкспертизы направлено (забраковано)</th>
          <th rowspan="3">Подпись врача</th>
        </tr>
        <tr>
          <th rowspan="2">Название болезней</th>
          <th rowspan="2">Кол-во больных(число случаев браковки)</th>
          <th rowspan="2">Свежее</th>
          <th rowspan="2">Сомнител. свежести</th>
          <th rowspan="2">Несвежее</th>
          <th colspan="3">Мясо, кг.</th>
          <th colspan="2">Субпродукты, кг.</th>
          <th>Кишки комплектов, шт</th>
        </tr>
        <tr>
          <th>В стерилизац. или на замораживан.</th>
          <th>На колбасные изделия</th>
          <th>На технические цели</th>
          <th>На стерилиз.</th>
          <th>На технические цели</th>
          <th>На технические цели</th>
        </tr>
        <tr>
          <td>1</td>
          <td>2</td>
          <td>3</td>
          <td>4</td>
          <td>5</td>
          <td>6</td>
          <td>7</td>
          <td colspan="3">8</td>
          <td>9</td>
          <td>10</td>
          <td>11</td>
          <td>12</td>
          <td>13</td>
          <td>14</td>
          <td>15</td>
          <td>16</td>
        </tr>
        </thead>
        <tbody>
        <AppQMJournal36Row
          v-for="elem in items"
          :key="elem.QM0306_IDENTNR"
          :row-item="elem"
          :qm-disease-list="qm_disease_list"
          :qm307-list="qm307_list"
          :sy11-list="sy11_list"
          :sy8211-list="sy8211_list"
          :vi0041-list="vi0041_list"
          :vi0044-list="vi0044_list"
          :vi7281-list="vi7281_list"
        />
        </tbody>
      </table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.logo {
  vertical-align: middle;
  border-style: none;
  width: 100%;
  height: auto;
  overflow: hidden;
  margin-top: -30px;
  margin-bottom: -30px;
}

.table * {
  border-color: #000000;
}

.table {
  font-family: sans-serif;
  font-size: 8px;
}

.table thead th, td {
  vertical-align: middle;
  padding: 0 0.2em;
}

.header-datetime-block {
  font-size: 0.85em;
}

/*
.table thead th:nth-child(1),
.table tbody th:nth-child(1) {
  width: 6.66%;
}

.table thead th:nth-child(2),
.table tbody th:nth-child(2) {
  width: 9.2%;
}

.table thead th:nth-child(3),
.table tbody th:nth-child(3) {
  width: 7.77%;
}

.table thead th:nth-child(4),
.table tbody th:nth-child(4) {
  width: 3.7%;
}

.table thead th:nth-child(5),
.table tbody th:nth-child(5) {
  width: 3.7%;
}

.table thead th:nth-child(6),
.table tbody th:nth-child(6) {
  width: 14.07%;
}

.table thead th:nth-child(7),
.table tbody th:nth-child(7) {
  width: 3.7%;
}*/

</style>
