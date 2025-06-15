<script>
import httpMixin from "@/mixins/httpMixin.js";
import {URLS} from '@/constants/urls.js';
import {convertToHex, formatDefinitionName} from "@/utils/encoding.js";

export default {
  mixins: [httpMixin],
  data: () => ({
    programm_nr: null,
    definition_id: null,
    text: null,
    all_jobs: [],
    _programList: []
  }),
  methods: {
    formatDefinitionName,
    async loadData() {
      if (this.programm_nr && this.definition_id) {
        const response = await this.sendRequest({
          method: "POST",
          url: URLS.EDI.EDI_JOB_TEXT,
          data: {
            programm: this.programm_nr,
            definition: convertToHex(this.definition_id),
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })

        this.text = (response.text || '').replace(/\x00/g, ' ')
      }
    },
    async loadAllJobs() {
      this.all_jobs = await this.sendRequest({
        method: 'GET',
        url: URLS.EDI.EDI_ALL_JOBS
      })
      if (this.programList.length > 0) {
        this._programList = await this.sendRequest({
          method: 'POST',
          url: URLS.EDI.PROGRAM_LIST,
          data: {programs: this.programList}
        })
      }
    },
    copyText() {
      navigator.clipboard.writeText(this.$refs.textContent.textContent)
        .then(() => alert('Текст скопирован в буфер обмена!'))
        .catch(err => console.error('Ошибка при копирование текста: ', err));
    },
    highlightProcedures(text) {
      // Регулярное выражение для всех форматов:
      // 1. [DataBase].[dbo].[proc_name]
      // 2. [dbo].[proc_name]
      // 3. [proc_name]
      // 4. DataBase.dbo.proc_name
      // 5. dbo.proc_name
      // 6. proc_name
      const regex = /(?:EXEC(?:UTE)?|CALL)\s+((?:\[?[\w]+\]?\.)?(?:\[?[\w]+\]?\.)?\[?[\w]+\]?)/gi;

      return text.replace(regex, (fullMatch, procFullName) => {
        // Очищаем имя от квадратных скобок для атрибута data-proc
        const cleanName = procFullName.replace(/\[|\]/g, '');

        return fullMatch.replace(
          procFullName,
          `<a href="javascript:void(0)" class="proc-link" data-proc="${cleanName}">${procFullName}</a>`
        );
      });
    }


  },
  computed: {
    displayText() {
      if (this.text && this.text.length > 0) {
        // Заменяем специальные символы для лучшей читаемости
        const text = this.text.replace(/\x00/g, ' ')  // Заменяем нулевые байты
        return this.highlightProcedures(text)
      }
      return ''
    },
    programList() {
      if (this.all_jobs.length > 0) {
        return Array.from(new Set(this.all_jobs.map(el => {
          return el.SY4310_PROGRAMM_NUMMER
        })))
      }
      return []
    },
    jobsList() {
      if (this.all_jobs.length > 0) {
        const items = this.all_jobs.filter(el => el.SY4310_PROGRAMM_NUMMER === this.programm_nr)
        return items
      }
      return []
    },

  },
  watch: {
    programm_nr(newValue, oldValue) {
      if (newValue !== oldValue) this.definition_id = null
    }
  },
  async mounted() {
    await this.loadAllJobs()
    await this.loadProgramList()
  }
}
</script>

<template>
  <v-card class="h-100">
    <v-card-title>
      Просмотр текстов EDI конвертеров
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="4">
          <v-select
            variant="outlined"
            density="compact"
            placeholder="Выберите модуль"
            label="Выберите модуль"
            :items="programList"
            v-model="programm_nr"
          >
          </v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            variant="outlined"
            density="compact"
            placeholder="Выберите скрипт"
            label="Выберите скрипт"
            :items="jobsList"
            :item-title="item => formatDefinitionName(item.SY4310_DEFINITIONS_NAME)"
            item-value="SY4310_DEFINITIONS_NAME"
            v-model="definition_id"
            @update:model-value="loadData"
            :disabled="!programm_nr"
          >
          </v-select>
        </v-col>
      </v-row>

      <v-spacer></v-spacer>

      <v-row>
        <div class="container">
          <div class="controls">
            <v-btn variant="outlined" prepend-icon="mdi-reload" @click="loadData">Обновить</v-btn>
            <v-btn variant="outlined" prepend-icon="mdi-content-copy" @click="copyText">Скопировать</v-btn>
          </div>

          <div class="text-content" ref="textContent">
            <pre>
              <code class="language-sql">{{ displayText }}</code>
            </pre>
          </div>
        </div>

      </v-row>

    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-content {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  background: #fafafa;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 3px;
  max-height: 70vh;
  overflow-y: auto;
  line-height: 1rem;
}

.controls {
  margin: 15px 0;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 15px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}

a.proc-link {
  color: #1976d2 !important;
  text-decoration: underline;
  cursor: pointer;
}
</style>
