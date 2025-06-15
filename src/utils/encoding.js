export function convertToHex(str) {
  if (!str) return '';

  // Удаляем префикс b' и суффикс ' если они есть
  let cleanStr = str;
  if (str.startsWith("b'") && str.endsWith("'")) {
    cleanStr = str.substring(2, str.length - 1);
  }

  // Преобразуем строку в шестнадцатеричный формат без пробелов
  let result = '0x';
  for (let i = 0; i < cleanStr.length; i++) {
    result += cleanStr.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0');
  }

  return result;
}

export function formatDefinitionName(byteString) {
  if (!byteString) return '';

  // Удаляем префикс b' и суффикс ' если они есть
  let cleanStr = byteString;
  if (byteString.startsWith("b'") && byteString.endsWith("'")) {
    cleanStr = byteString.substring(2, byteString.length - 1);

    // Преобразуем строку из байтового представления
    try {
      // Заменяем экранированные последовательности
      cleanStr = cleanStr.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => {
        return String.fromCharCode(parseInt(hex, 16));
      });

      // Заменяем другие экранированные символы
      cleanStr = cleanStr.replace(/\\([nrt'"\\])/g, (match, char) => {
        const escapeMap = {
          'n': '\n',
          'r': '\r',
          't': '\t',
          "'": "'",
          '"': '"',
          '\\': '\\'
        };
        return escapeMap[char] || match;
      });

      return cleanStr;
    } catch (error) {
      console.error('Ошибка при форматировании имени:', error);
      return byteString;
    }
  }

  return byteString;
}
