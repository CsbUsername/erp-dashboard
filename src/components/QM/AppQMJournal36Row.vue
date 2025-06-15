<script>
import {URLS} from "@/constants/urls.js";
import httpMixin from "@/mixins/httpMixin.js";
import {debounce} from 'lodash';
import accessMixin from "@/mixins/accessMixin.js"; // Опционально (для дебаунса)


export default {
  mixins: [httpMixin, accessMixin],
  props: {
    rowItem: {
      type: Object,
      required: true,
    },
    qmDiseaseList: {
      type: Array,
      required: true,
      default: [],
    },
    qm307List: {
      type: Array,
      required: true,
      default: [],
    },
    sy11List: {
      type: Array,
      required: true,
      default: [],
    },
    sy8211List: {
      type: Array,
      required: true,
      default: [],
    },
    vi0041List: {
      type: Array,
      required: true,
      default: [],
    },
    vi0044List: {
      type: Array,
      required: true,
      default: [],
    },
    vi7281List: {
      type: Array,
      required: true,
      default: [],
    }
  },

  data: () => ({
    diseaseRefs: {}, // Храним ссылки на <p> элементы
    resizeObserver: null, // Обсервер для ResizeObserver
  }),
  methods: {


    formatYYYYMMDDtoDate(d) {
      return `${d.slice(6, 8)}.${d.slice(4, 6)}.${d.slice(0, 4)}`;
    },

    // Сохраняем ссылки на элементы
    setDiseaseRef(el, index, type) {
      if (!el) return; // Игнорируем удалённые элементы
      if (!this.diseaseRefs[index]) {
        this.diseaseRefs[index] = {};
      }
      this.diseaseRefs[index][type] = el;
      this.syncHeight(index); // Сразу синхронизируем высоту
    },

    // Сохраняем ссылки на элементы
    syncHeight(index) {
      const nameEl = this.diseaseRefs[index]?.name;
      const countEl = this.diseaseRefs[index]?.count;

      if (nameEl && countEl) {
        // Сбрасываем высоту, чтобы scrollHeight был актуальным
        nameEl.style.minHeight = '';
        countEl.style.minHeight = '';

        // Вычисляем максимальную высоту
        const maxHeight = Math.max(
          nameEl.scrollHeight,
          countEl.scrollHeight
        );

        // Применяем новую высоту
        nameEl.style.minHeight = `${maxHeight}px`;
        countEl.style.minHeight = `${maxHeight}px`;
      }
    },

    handleResize: debounce(function () {
      Object.keys(this.diseaseRefs).forEach(index => {
        this.syncHeight(index);
      });
    }, 100),

    // Инициализация ResizeObserver для конкретных <td>
    initResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect(); // Отключаем старый observer
      }

      this.resizeObserver = new ResizeObserver(this.handleResize);

      // Наблюдаем за <td>, в которых находятся name и count
      const nameTd = this.$refs.nameCells;
      const countTd = this.$refs.countCells;

      if (nameTd) this.resizeObserver.observe(nameTd);
      if (countTd) this.resizeObserver.observe(countTd);
    },
  },

  computed: {
    qm_datum() {
      const d = this.rowItem.QM0306_DATUM
      return this.formatYYYYMMDDtoDate(d)
    },

    qm_part_nr() {
      // Возвращает номер поставки
      return this.rowItem.QM0306_IDENTNR.slice(5,)
    },

    qm_eing_nr() {
      // Возвоащат данные по поставке из 41 таблицы
      if (this.vi0041List && this.vi0041List.length) {
        const elem = this.vi0041List.find(el => parseInt(el.VI0041_EING_NR) === parseInt(this.qm_part_nr))
        return elem
      }
    },

    qm_address_provider() {
      if (this.sy8211List && this.sy8211List.length) {
        const eing_nr = this.qm_eing_nr
        const elem = this.sy8211List.find(el => parseInt(el.SY8211_ADR_NR) === parseInt(eing_nr.VI0041_ULIEF_NR))
        return `${elem.SY8211_SPED_TXT1} ${elem.SY8211_SPED_TXT2}`
      }
    },

    qm_herk_nachweis() {
      // Номер вет. свидетельства
      if (this.vi0041List && this.vi0041List.length) {
        return this.qm_eing_nr.VI0041_HERK_NACHWEIS
      }
    },

    qm_herk_nachweis_datum() {
      // Дата вет. свидетельства
      if (this.vi7281List && this.vi7281List.length && Object.keys(this.qm_eing_nr).length) {
        const elem = this.vi7281List.find(el => parseInt(el.VI7821_VI_EING_NR) === this.qm_part_nr)
        const d = elem.VI7821_DATUM
        return this.formatYYYYMMDDtoDate(d)
      }
    },

    qm_address() {
      if (this.sy11List && this.sy11List.length && Object.keys(this.qm_eing_nr).length) {
        const elem = this.sy11List.find(el => el.S11_NR === this.qm_eing_nr.VI0041_ULIEF_NR)
        return `${elem.S10_NOTIZ1} ${elem.S10_NOTIZ2}`
      }
    },

    qm_count_tush() {
      // Кол-во осмотренных  тущ
      if (this.qm_eing_nr && Object.keys(this.qm_eing_nr).length) {
        return this.qm_eing_nr.VI0041_ST_ANZAHL_BET
      }
    },

    qm_disease() {
      if (this.vi0044 && this.vi0044.length && this.qmDiseaseList.length) {
        const result = {};

        this.vi0044.forEach(item => {
          // Перебираем все ключи от VI0044_BC_NR_1 до VI0044_BC_NR_10
          for (let i = 1; i <= 10; i++) {
            const key = `VI0044_BC_NR_${i}`;
            const value = item[key];
            const diseaseName = this.qmDiseaseList.find(el => el.VI7846_BC_NR === value)

            // Пропускаем нулевые значения
            if (value !== "0" && diseaseName) {
              if (result[value]) {
                result[value]['count']++;
              } else {
                result[value] = {
                  title: diseaseName['VI2630_BEZ2'],
                  count: 1
                };
              }
            }
          }
        });

        return result;
      }
    },

    qm_messverfahren() {
      if (this.qm307 && this.qm307.length) {
        const total = this.qm_count_tush;
        return total - (this.qm307.reduce(a, b => a.QM0307_SUMME_MESSWERT + b.QM0307_SUMME_MESSWERT, 0))
      } else {
        return this.qm_count_tush
      }
    },

    qm_messverfahren_doubtful() {
      if (this.qm307 && this.qm307.length) {
        const elem = this.qm307.find(el => el.QM0307_MESSVERFAHREN === 10349)
        return (elem) ? elem.QM0307_SUMME_MESSWERT : 0;
      }
      return 0;
    },

    qm_messverfahren_nofresh() {
      if (this.qm307 && this.qm307.length) {
        const elem = this.qm307.find(el => el.QM0307_MESSVERFAHREN === '10350')
        return (elem) ? elem.QM0307_SUMME_MESSWERT : 0;
      }
      return 0;
    }
  },

  async mounted() {
    if (this.rowItem && Object.keys(this.rowItem).length) {
      // this.vi0041 = await this.load_data(URLS.VI.VI41_EING_NR, {eing_nr: this.qm_part_nr})
      if (this.vi0041 && this.vi0041.length) {

        // this.vi7281 = await this.load_data(URLS.VI.VI7281, {
        //   eing_nr: this.qm_part_nr,
        //   merkmal_nr_start: 9,
        //   merkmal_nr_end: 9
        // })

        // this.sy8211 = await this.load_data(URLS.ADDRESS.S8211, {nr: this.vi0041[0].VI0041_ULIEF_NR})
        // this.sy11 = await this.load_data(URLS.ADDRESS.S11, {nr: this.vi0041[0].VI0041_ULIEF_NR})

        this.vi0044 = await this.load_data(URLS.VI.VI44_EING_NR, {
          eing_nr: this.qm_part_nr,
          sc_datum_start: this.vi0041[0].VI0041_LS_DATUM,
          sc_datum_end: this.addMonthToDate(this.vi0041[0].VI0041_LS_DATUM, 1),
          fields: ['VI0044_SC_DATUM', 'VI0044_EING_NR', 'VI0044_TIER_NR', 'VI0044_REF_NR', 'VI0044_ART_NR_LAGER', 'VI0044_NVE',
            'VI0044_BC_NR_1', 'VI0044_BC_NR_2', 'VI0044_BC_NR_3', 'VI0044_BC_NR_4', 'VI0044_BC_NR_5', 'VI0044_BC_NR_6',
            'VI0044_BC_NR_7', 'VI0044_BC_NR_8', 'VI0044_BC_NR_9', 'VI0044_BC_NR_10']
        })

        if (this.rowItem && Object.keys(this.rowItem).length) {
          this.qm307 = await this.load_data(URLS.QM.QM307, {
            fields: ['QM0307_MESSVERFAHREN', 'QM0307_SUMME_MESSWERT'],
            qm_nr: this.rowItem.QM0306_NR,
            datum: this.rowItem.QM0306_DATUM
          })
        }

        // Загрузка данных...
        this.$nextTick(() => {
          this.initResizeObserver(); // Запускаем observer после рендера
        });
      }
    }
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect(); // Очищаем observer
    }
  },
}
</script>

<template>
  <tr>
    <td style="width: 6.6%;">{{ qm_datum }}</td>
    <td style="width: 9.2%;">
      {{ qm_address_provider }}
      <br>
      № партии {{ qm_part_nr }}
      <br>
      № вет.свидетельства {{ qm_herk_nachweis }}
      <br/>
      <br/>
      Дата выдачи
      вет.свидетельства
      {{ qm_herk_nachweis_datum }}
    </td>
    <td style="width: 7.77%;">
      {{ qm_address }}
    </td>
    <td style="width: 3.7%;">Свиньи товарные</td>
    <td style="width: 3.7%;">{{ parseFloat(qm_count_tush) }}</td>
    <td ref="nameCells">
      <p v-for="(elem, index) in qm_disease" :key="'name-' + index" :ref="el => setDiseaseRef(el, index, 'name')">
        {{ elem.title }}
      </p>
    </td>
    <td ref="countCells">
      <p v-for="(elem, index) in qm_disease" :key="'count-' + index" :ref="el => setDiseaseRef(el, index, 'count')">
        {{ elem.count }}
      </p>
    </td>
    <td>{{ parseFloat(qm_messverfahren) }}</td>
    <td>{{ qm_messverfahren_doubtful }}</td>
    <td>{{ parseFloat(qm_messverfahren_nofresh) }}</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>0</td>
    <td>
      <div class="m-0 p-0">
        <p>Печень</p>
        <p>2.6</p>
      </div>

      <div class="m-0 p-0">
        <p>Сердце</p>
        <p>7.8</p>
      </div>

      <div class="m-0 p-0">
        <p>Почки</p>
        <p>4.2</p>
      </div>

      <div class="m-0 p-0">
        <p>Селезенка</p>
        <p>1.0</p>
      </div>


    </td>
    <td></td>
    <td class="rotate-text">
      {{ username }}
    </td>
  </tr>
</template>

<style scoped>
td p {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.rotate-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg); /* переворачивает направление */
  text-orientation: mixed;
}
</style>
