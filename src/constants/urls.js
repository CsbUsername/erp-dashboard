export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const URLS = {
  ORDERS: {
    FA078_FIELDS: `${API_BASE_URL}/erp/orders/table/_table_id_/fields`,
    HEADER: `${API_BASE_URL}/erp/orders/header/`,
    POSITIONS: `${API_BASE_URL}/erp/orders/positions/`,
    POSITIONS_DETAILS: `${API_BASE_URL}/erp/orders/positions/details/`,
    IMPORT_DATA: `${API_BASE_URL}/erp/orders/import/`,
    EXPORT_TARA: `${API_BASE_URL}/erp/orders/export/tara/`,
    EXPORT_PRODUCTION_DATES: `${API_BASE_URL}/erp/orders/export/production_dates/`,
    EXPORT_ORDERS_DATA: `${API_BASE_URL}/erp/orders/export/data/`,
    EXPORT_ART_PERESORT: `${API_BASE_URL}/erp/orders/export/art_perersort/`,
    SSCC_LIST: `${API_BASE_URL}/erp/orders/sscc_list/`,
    SSCC_MIX: `${API_BASE_URL}/erp/orders/sscc_mix/`,
    EXPORT_DOWNLOAD_1C: `${API_BASE_URL}/erp/orders/export/download_1c/`,
    UPDATE_ORDER_POSITIONS: `${API_BASE_URL}/erp/orders/update/positions`
  },
  SSCC : {
    MAIN_INFORMATION: `${API_BASE_URL}/erp/sscc/details/`,
  },
  MPS: {
    ERRORS_ACTIVE: 'http://csb.apkholding.ru/erp/reports/MPS/handler.php',
    ERRORS_ALL: 'http://csb.apkholding.ru/erp/reports/MPS/handler3.php',
  },
  IMPORT: {
    MAIN_DATA: `${API_BASE_URL}/erp/import/`,
  }
}
