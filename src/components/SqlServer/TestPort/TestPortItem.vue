<script>
export default {
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  inject: ['template_items'],
  methods: {


    template_port(job_id) {
      const job = this.item.ED4351_PLAN_NR
      return ('00000' + job.port).slice(-5)
    }
  },

  computed: {
    ip_address() {
      // Извлекаем часть с IP (11 цифр, начиная с позиции 16)
      const ipPart = this.item.ED4351_TYP_DATEN.slice(this.item.ED4351_TYP_DATEN.indexOf('192168')).trim();
      // Форматируем IP: 192 168 188 041 -> 192.168.188.41
      return `${ipPart.substring(0, 3)}.${ipPart.substring(3, 6)}.${ipPart.substring(6, 9)}.${(ipPart.substring(9, 12))}`;
    },
    port() {
      // Извлекаем порт (последние 5 цифр)
      const portPart = this.item.ED4351_TYP_DATEN.substring(27);
      return portPart.trim();
    },
    template_ip() {
      const job_id = this.item.ED4351_PLAN_NR
      console.log(this.template_items)
      if (this.template_items.length > 0) {
        const elem = this.template_items.find(el => parseInt(el.job_id) === parseInt(job_id))
        return elem.ip_address
      }
    },

  }
}
</script>

<template>
  <tr>
    <td class="font-weight-bold">{{ item.ED4351_PLAN_NR }}</td>
    <td>{{ item.ED4351_BEZ }}</td>
    <td>{{ item.ED4351_KURZ_BEZ }}</td>
    <td>
      <p class="m-0">
        <span class="font-weight-bold">Текущие значение: </span>
      </p>
      <p class="m-0">
        <span class="font-weight-bold">Базовое значение</span>
      </p>
    </td>
    <td>
      <p class="m-0">
        <span class="text-danger font-weight-bold">{{ ip_address }}</span>
      </p>

      <p class="m-0">
        <span class="text-success font-weight-bold"> {{ template_ip }}</span>
      </p>
    </td>
    <td>
      <p class="m-0 text-danger font-weight-bold">{{ port }}</p>
      <p class="m-0 text-success font-weight-bold">{{ template_port(item.ED4351_PLAN_NR) }}</p>
    </td>

  </tr>
</template>

<style scoped>

</style>
