<script>
import AppSSCCInfo from '@/components/SSCC/AppSSCCInfo.vue'
import {DT, DT_BASE_URL, DT_HANDLE_URL} from "@/constants/dt.js";
import httpMixin from "@/mixins/httpMixin.js";
import accessMixin from "@/mixins/accessMixin.js";

export default {
  name: "EquipmentModal",
  components: {AppSSCCInfo},
  mixins: [httpMixin, accessMixin],
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    articul: {
      type: String,
      required: true,
      default: ''
    },
    orderId: {
      type: String,
      required: true
    }
  },
  emits: ['update:dialog', 'successAdd'],
  data: () => ({
    eq_sscc: null,
    isShowDetails: false,
    isCheckArt: false,
    error: ''
  }),
  methods: {
    closeDialog() {
      this.$emit('update:dialog', false)
      this.isShowDetails = false
      this.eq_sscc = null
    },

    handleIsCheckArt(enter_art) {
      if (this.articul && enter_art && parseFloat(this.articul) === parseFloat(enter_art)) {
        this.isCheckArt = true
        return
      }
      this.isCheckArt = false
      this.error = 'Артикул SSCC и артикул позиции заказа не совпадают'
    },

    async loadToOrder() {
      const status = await this.send_dt_commnad(DT.ORDER.STATUS, {'order_id': this.orderId})
      if (parseFloat(status.L1_1) > 40) {
        this.error = 'Заказ уже скомплектован. Откатите статус'
        return false
      }

      const positions = await this.send_dt_commnad(DT.ORDER.POSITIONS, {'order_id': this.orderId})
      let position_id = null
      if (!positions.error) {
        if (Array.isArray(positions)) {
          const elem = positions.find((el) => el.T5_1 === this.articul)
          position_id = elem.succes.L1_1
        } else {
          position_id = positions.succes.L1_1
        }
      } else {
        this.error = `Load positions error: ${positions.error[0].L1_3}`
      }

      const handleId = await this.sendRequest({
        method: "GET",
        url: DT_HANDLE_URL,
        isUserID: false
      })

      // Открытие заказа
      const open = await this.send_dt_commnad(DT.ORDER.OPEN, {'order_id': this.orderId}, handleId)
      if (!open.error) {
        // Сканирование SSCC
        const add = await this.send_dt_commnad(DT.ORDER.ADD, {
          'position_id': position_id,
          'sscc': this.eq_sscc,
          'user_id': this.user_id,
          'lager': 7120
        }, handleId)

        await this.send_log({
          userid: this.user_id,
          fullname: this.username,
          component_id: this.$options.name,
          description: `В заказ ${this.orderId} добавлено SSCC ${this.eq_sscc}`
        })

        if (add.error) {
          this.error = 'Load SSCC error: ' + (add.error[0]?.L1_3 ? add.error[0]?.L1_3 : add.error.L1_3)
          return false
        } else {
          // Закрытие зазака
          await this.send_dt_commnad(DT.ORDER.CLOSE, {}, handleId)
        }
      } else {
        this.error = 'Open order error: ' + (open.error[0]?.L1_3 ? open.error[0]?.L1_3 : open.error.L1_3)
        return false
      }
      this.$emit('successAdd', true)
      this.closeDialog()
    }
  },
  beforeUpdate() {
    this.error = null
    this.eq_sscc = null
  }
}
</script>

<template>
  <v-dialog
    :model-value="dialog"
    @update:dialog="val => $emit('update:dialog', val)"
    max-width="1100"
    persistent
    @keyup.esc="closeDialog"
  >
    <v-card>
      <v-card-title>
        <h5>Укажите SSCC для добавления в заказ</h5>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-alert
              color="error"
              icon="$error"
              variant="outlined"
              :text='error'
              v-if="isShowDetails && error"
            ></v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              @keyup.enter="isShowDetails = true"
              v-model="eq_sscc"
            >

            </v-text-field>
          </v-col>
        </v-row>

        <AppSSCCInfo
          :sscc="eq_sscc"
          :required_art="articul ? articul : ''"
          v-if="isShowDetails"
          @closeDialog="closeDialog"
          @change-art="handleIsCheckArt"
        />
      </v-card-text>

      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn
          @click="loadToOrder" color="success" variant="outlined" :disabled="!isCheckArt">
          Загрузить
        </v-btn>

        <v-btn @click="closeDialog">
          Закрыть
        </v-btn>
      </template>
    </v-card>

  </v-dialog>
</template>

<style scoped>

</style>
