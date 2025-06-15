export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const URLS = {
  SERVICE: {
    LOGGER: `${API_BASE_URL}/erp/logger`,
    SEND_SQL: `${API_BASE_URL}/erp/sqlquery_exec`,
    DT_PROXY: `${API_BASE_URL}/erp/dt_proxy`,
  },
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
  SSCC: {
    MAIN_INFORMATION: `${API_BASE_URL}/erp/sscc/details/`,
    SUB_SSCC: `${API_BASE_URL}/erp/sscc/sub/`,
    POSTING: `${API_BASE_URL}/erp/sscc/postings/`,
  },
  MPS: {
    ERRORS_ACTIVE: 'http://csb.apkholding.ru/erp/reports/MPS/handler.php',
    ERRORS_ALL: 'http://csb.apkholding.ru/erp/reports/MPS/handler3.php',
  },
  IMPORT: {
    MAIN_DATA: `${API_BASE_URL}/erp/import/`,
  },
  CTF: {
    DELIVERY_DATA: `${API_BASE_URL}/erp/ctf/delivery/fat/`,
    UPDATE_DELIVERY: `${API_BASE_URL}/erp/ctf/delivery/update/`,
    SELECT: `${API_BASE_URL}/erp/ctf/block/`,
    UPDATE: `${API_BASE_URL}/erp/ctf/block/update/`,
    INSERT: `${API_BASE_URL}/erp/ctf/block/insert/`,
    CARS: `${API_BASE_URL}/erp/ctf/cars/`,
    CONTAINERS: `${API_BASE_URL}/erp/ctf/containers/`,
    CREATE_DELIVERY: `${API_BASE_URL}/erp/ctf/create_delivery/`,
    ALL_DELIVERIES: `${API_BASE_URL}/erp/ctf/all_deliveries/`,
    LEFT_PROVIDER_CSB: 'http://csb.apkholding.ru/reports/ctf/handlers/move/create_writing_left_provider.php',
    OWN_PROVIDER_CSB: 'http://csb.apkholding.ru/reports/ctf/handlers/move/create_wiring.php'
  },
  PROD_TASK: {
    MAIN_DATA: `${API_BASE_URL}/erp/prod_task/main/`,
    UPDATE_TASK: `${API_BASE_URL}/erp/prod_task/update/`
  },
  QM: {
    JOURNAL306: `${API_BASE_URL}/erp/qm/journal36/`,
    QM307: `${API_BASE_URL}/erp/qm/journal36/307`,
  },
  VI: {
    VI41_EING_NR: `${API_BASE_URL}/erp/vi/41/eing_nr`,
    VI44_EING_NR: `${API_BASE_URL}/erp/vi/44/eing_nr`,
    VI44_SC_DATUM: `${API_BASE_URL}/erp/vi/44/sc_datum`,
    VI7281: `${API_BASE_URL}/erp/vi/7821`,
    VI7846: `${API_BASE_URL}/erp/vi/7846`,
    VI2630: `${API_BASE_URL}/erp/vi/2630`
  },
  ADDRESS: {
    S10: `${API_BASE_URL}/erp/address/s10`,
    S11: `${API_BASE_URL}/erp/address/s11`,
    S8211: `${API_BASE_URL}/erp/address/s8211`,
  },
  PACKING: {
    NON_QUANT_INSERT: `${API_BASE_URL}/erp/packing/nonquant_plenka/insert`
  },
  SQL_SERVER: {
    'CSB_JOBS': `${API_BASE_URL}/erp/sql_server/jobs_list`,
    'CSB_JOBS_TEMPLATE': `${API_BASE_URL}/erp/sql_server/jobs_list_template`,
  },
  EDI: {
    EDI_JOB_TEXT: `${API_BASE_URL}/erp/edi/get_edi_text`,
    EDI_ALL_JOBS: `${API_BASE_URL}/erp/edi/all_jobs`,
    PROGRAM_LIST: `${API_BASE_URL}/erp/edi/program_list`,
  }
}
