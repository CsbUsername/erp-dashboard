export default {
  methods: {
    formatDateFromYYYYMMDD(d) {
      if (d) {
        // Форматирует дату из формата 20250211 в формат 11.02.25 для испаользования в счете
        return `${d.slice(6, 8)}.${d.slice(4, 6)}.${d.slice(2, 4)}`;
      }
    },

    formatDateYYYYMMDD(date = new Date()) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    },

    addMonthToDate(dateStr, monthsToAdd) {
      // Преобразуем строку в объект Date
      const year = parseInt(String(dateStr).substring(0, 4));
      const month = parseInt(String(dateStr).substring(4, 6)) - 1; // Месяцы в JS от 0 до 11
      const day = parseInt(String(dateStr).substring(6, 8));

      const date = new Date(year, month, day);

      // Добавляем месяцы
      date.setMonth(date.getMonth() + monthsToAdd);

      // Форматируем обратно в yyyyMMdd
      const newYear = date.getFullYear();
      const newMonth = (date.getMonth() + 1).toString().padStart(2, '0');
      const newDay = date.getDate().toString().padStart(2, '0');

      return `${newYear}${newMonth}${newDay}`;
    }
  },


}
