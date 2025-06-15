<script>
import httpMixin from "@/mixins/httpMixin.js";
import { URLS } from "@/constants/urls.js";
import AppSSCCSub from "@/components/SSCC/AppSSCCSub.vue";
import utilsMixin from "@/mixins/utilsMixin.js";

export default {
  components: {AppSSCCSub},
  mixins: [httpMixin, utilsMixin],
  emits: ['changeArt'],
  props: {
    sscc: {
      type: String,
      default: '' // Указываем значение по умолчанию
    }
  },
  data() {
    return {
      sscc_info: {},
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
      localSscc: this.sscc || '' // Используем значение по умолчанию, если sscc не передан
    };
  },
  watch: {
    // Следим за изменением props.sscc и обновляем localSscc
    sscc(newVal) {
      this.localSscc = newVal;
    }
  },
  methods: {
    yyyymmddToDate(dateString) {
      if (dateString) {
        return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
      }
    },

    toFloat(number) {
      return (number) ? parseFloat(number) : 0;
    },

    async load_details() {
      if (this.localSscc) {
        this.sscc_info = await this.sendRequest({
          method: "GET",
          url: URLS.SSCC.MAIN_INFORMATION + this.localSscc
        });

        this.$emit('changeArt', this.sscc_info.S8581_ART_NR);
      }
    }
  },
  computed: {
    account() {
      return `${this.sscc_info.S8583_LAGERTYP_NR} - ${this.formatDateFromYYYYMMDD(this.sscc_info.S8583_LAGERTYP_DATUM)} - ${this.sscc_info.S8583_LAGERTYP_LOS}`;
    }
  },
  async beforeMount() {
    if(this.sscc) {
      await this.load_details();
    }
  }
};
</script>


<template>
  <v-card class="app-sscc-info">
    <v-card-text>
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link active" id="nav-main-tab" data-bs-toggle="tab" data-bs-target="#nav-main"
                  type="button" role="tab" aria-controls="nav-main" aria-selected="true">Общие положение
          </button>
          <button class="nav-link" id="nav-volume-tab" data-bs-toggle="tab" data-bs-target="#nav-volume" type="button"
                  role="tab" aria-controls="nav-volume" aria-selected="false">Размеры и объемы
          </button>
          <button class="nav-link" id="nav-lager-tab" data-bs-toggle="tab" data-bs-target="#nav-lager" type="button"
                  role="tab" aria-controls="nav-lager" aria-selected="false">Складская информация
          </button>
          <button class="nav-link" id="nav-sub-tab" data-bs-toggle="tab" data-bs-target="#nav-sub" type="button"
                  role="tab" aria-controls="nav-sub" aria-selected="false">Суб-SSCC
          </button>
        </div>
        <div class="menu">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-menu" variant="text" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :value="i"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-main" role="tabpanel" aria-labelledby="nav-main-tab">
          <v-card>
            <v-card-text>
              <fieldset class="mb-3">
                <div class="row">
                  <label class="col-sm-2 col-form-label">SSCC</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="localSscc" @keyup.enter="load_details">
                  </div>

                </div>
              </fieldset>
              <fieldset>
                <div class="row">
                  <div class="col-12">
                    <div class="row mb-1">
                      <label class="col-sm-2 col-form-label">Артикул</label>
                      <div class="col-sm-10">
                        <div class="row">
                          <div class="col-4">
                            <input type="text" class="form-control" :value="sscc_info.S8581_ART_NR">
                          </div>
                          <div class="col-8">
                            <input type="text" class="form-control" :value="sscc_info.S12_BEZ1">
                          </div>
                        </div>

                      </div>
                    </div>
                    <div class="row mb-1">
                      <label class="col-sm-2 col-form-label">GTIN</label>
                      <div class="col-sm-10">
                        <div class="row">
                          <div class="col-4">
                            <input type="text" class="form-control" :value="sscc_info.S8581_EAN_14">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mb-1">
                      <label class="col-sm-2 col-form-label">BT</label>
                      <div class="col-sm-10">
                        <div class="row">
                          <div class="col-4">
                            <input type="text" class="form-control">
                          </div>
                          <div class="col-8">
                            <input type="text" class="form-control">
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset class="my-3">
                <div class="row">
                  <div class="col-6">
                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">SSCC-ИД</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" :value="sscc_info.S8583_NVE_ID">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Ссылка</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" :value="sscc_info.S8581_NR">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Вариант</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Ссылка по жив.</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" :value="sscc_info.S8581_VI_REF_NR">
                      </div>
                    </div>
                  </div>


                  <div class="col-6">
                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Номер серии</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" :value="sscc_info.S8581_CHARGE">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Произ. партия</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" :value="sscc_info.S8581_LAGERTYP_LOS">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Идент. животного</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" :value="sscc_info.S8581_TIER_IDENT">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Транспордер 1</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control" :value="sscc_info.L10_3">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-3 col-form-label">Транспордер 2</label>
                      <div class="col-sm-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <div class="row justify-content-between">
                  <div class="col-4">
                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Создание</label>
                      <div class="col-sm-7">
                        <input type="date" class="form-control" :value="yyyymmddToDate(sscc_info.S8581_ANL_DATUM)">
                      </div>
                    </div>
                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Производство</label>
                      <div class="col-sm-7">
                        <input type="date" class="form-control" :value="yyyymmddToDate(sscc_info.S8581_DATUM_HERST)">
                      </div>
                    </div>
                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Конец гарантии</label>
                      <div class="col-sm-7">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Истечение</label>
                      <div class="col-sm-7">
                        <input type="date" class="form-control" :value="yyyymmddToDate(sscc_info.S8581_DATUM_MHD)">
                      </div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Комплектация</label>
                      <div class="col-sm-7">
                        <input type="text" class="form-control">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Маркировка</label>
                      <div class="col-sm-7">
                        <input type="date" class="form-control" :value="yyyymmddToDate(sscc_info.S8581_DATUM_PACK)">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Мин. срок хран.</label>
                      <div class="col-sm-7">
                        <input type="date" class="form-control" :value="yyyymmddToDate(sscc_info.S8581_DATUM_MHD)">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-5 col-form-label">Заморозить</label>
                      <div class="col-sm-7">
                        <input type="text" class="form-control">
                      </div>
                    </div>

                  </div>
                </div>
              </fieldset>

            </v-card-text>
          </v-card>
        </div>
        <div class="tab-pane fade" id="nav-volume" role="tabpanel" aria-labelledby="nav-volume-tab">
          <v-card>
            <v-card-text>
              <div class="row">
                <div class="col-6">
                  <fieldset class="h-100">
                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Цен. единицы</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control" :value="toFloat(sscc_info.S8581_MENGE_PE)">
                          <input type="text" class="col-sm-3 form-control" :value="sscc_info.S12_EK_ME">
                        </div>
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Склад. единицы</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control" :value="toFloat(sscc_info.S8581_MENGE_LE)">
                          <input type="text" class="col-sm-3 form-control" :value="sscc_info.S12_LA_ME">
                        </div>
                      </div>
                    </div>

                  </fieldset>
                </div>
                <div class="col-6">
                  <fieldset>
                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Число трасп. ед.</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" :value="toFloat(sscc_info.S8581_MENGE_LE)">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Кол-во в штука</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" :value="toFloat(sscc_info.S8581_MENGE_ST)">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Количество</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control">
                      </div>
                    </div>

                  </fieldset>
                </div>
              </div>

              <div class="row my-3">
                <div class="col-6">
                  <fieldset>
                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Брутто</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control" :value="toFloat(sscc_info.S8581_BRUTTO_GEW)">
                          <input type="text" class="col-sm-3 form-control" value="кг">
                        </div>
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Нетто</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control" :value="toFloat(sscc_info.S8581_NETTO_GEW)">
                          <input type="text" class="col-sm-3 form-control" value="кг">
                        </div>
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Тара</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control" :value="toFloat(sscc_info.S8581_TARA)">
                          <input type="text" class="col-sm-3 form-control" value="кг">
                        </div>
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Погруз. ср-ва</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control"
                                 :value="toFloat(sscc_info.S8581_PALETTEN_GEW)">
                          <input type="text" class="col-sm-3 form-control" value="кг">
                        </div>
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">BT всего</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control"
                                 :value="toFloat(sscc_info.S8581_PALETTEN_GEW)">
                          <input type="text" class="col-sm-3 form-control" value="кг">
                        </div>
                      </div>
                    </div>
                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Контроль</label>
                      <div class="col-sm-8">
                        <div class="d-flex">
                          <input type="text" class="col-sm-9 form-control"
                                 :value="toFloat(sscc_info.S8581_KONTROLL_GEW)">
                          <input type="text" class="col-sm-3 form-control" value="кг">
                        </div>
                      </div>
                    </div>

                  </fieldset>
                </div>
                <div class="col-6">
                  <fieldset class="h-100">
                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Макс. трансп. уп.</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Число пачек</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control">
                      </div>
                    </div>

                    <div class="row mb-1">
                      <label class="col-sm-4 col-form-label">Число трасп. уп. на пачку</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <div class="tab-pane fade" id="nav-lager" role="tabpanel" aria-labelledby="nav-lager-tab">
          <v-card>
            <v-card-text>
              <fieldset>
                <div class="row mb-1">
                  <label class="col-sm-2 col-form-label">Склад</label>
                  <div class="col-sm-10">
                    <div class="row">
                      <div class="col-3">
                        <input type="text" class="form-control" :value="sscc_info.S8583_KST_NR">
                      </div>
                      <div class="col-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mb-1">
                  <label class="col-sm-2 col-form-label">Ведение склада</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" value="Номер клиента - Дата партии - № лота" disabled>
                  </div>
                </div>
                <div class="row mb-1">
                  <label class="col-sm-2 col-form-label"></label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" :value="account">
                  </div>
                </div>
                <div class="row mb-1">
                  <label class="col-sm-2 col-form-label">Складское место</label>
                  <div class="col-sm-10">
                    <div class="row">
                      <div class="col-3">
                        <input type="text" class="form-control">
                      </div>
                      <div class="col-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row mb-1">
                  <label class="col-sm-2 col-form-label">План. вывод со склада</label>
                  <div class="col-sm-10">
                    <div class="row">
                      <div class="col-3">
                        <input type="text" class="form-control">
                      </div>
                      <div class="col-9">
                        <input type="text" class="form-control">
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </v-card-text>
          </v-card>
        </div>
        <div class="tab-pane fade" id="nav-sub" role="tabpanel" aria-labelledby="nav-sub-tab">
          <AppSSCCSub :ober-nve="localSscc" v-if="localSscc"/>
        </div>
        </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.app-sscc-info{
  overflow-y: auto;
}

.form-control {
  font-size: .9rem;
}

.menu{
  position: absolute;
  top: 0;
  right: 0;
}
</style>
