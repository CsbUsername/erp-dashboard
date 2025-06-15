// Импортируем необходимые модули и компоненты
import {createWebHistory, createRouter, createWebHashHistory} from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import AppImportComponent from "@/components/Import/AppImportComponent.vue";
import AppCTFMain from "@/components/CTF/AppCTFMain.vue";
import AppQMJournal36 from "@/components/AppQMJournal36.vue";
import AppPackagingQuantFilm from "@/components/Packing/AppPackagingQuantFilm.vue";
import AppCTFDelivery from "@/components/CTF/AppCTFDelivery.vue";


// Ленивая загрузка компонентов
const Page404 = () => import("@/views/Page404.vue");
const AppOrderDetails = () => import("@/views/Orders/AppOrderDetails.vue");
const OrderChange = () => import("@/views/Orders/OrderChange.vue");
const AppEquipment = () => import("@/views/Orders/AppEquipment.vue");
const AppSSCCInfo = () => import("@/components/SSCC/AppSSCCInfo.vue");
const AppMPS = () => import("@/views/MPS/AppMPS.vue");
const AppImport = () => import("@/views/Import/AppImport.vue");
const AppCTFBlock = () => import("@/components/CTF/AppCTFBlock.vue");
const AppSqlCsbTestPort = () => import("@/components/SqlServer/TestPort/AppSqlCsbTestPort.vue");
const AppEdiJobText = () => import("@/components/Edi/AppEdiJobText.vue")


const routes = [
  {
    path: "/",
    component: Dashboard,
  },
  {
    path: "/orders",
    children: [
      {path: "details", component: AppOrderDetails},
      {path: "change", component: OrderChange},
      {path: "equipment", component: AppEquipment},
      {path: "test", component: AppSSCCInfo},
    ],
  },
  {
    path: "/import",
    children: [
      {path: "orders", component: AppImport, props: {sectionID: 'orders'}},
      {path: "dmpz", component: AppImport, props: {sectionID: 'dmpz'}},
      {path: "barcodes", component: AppImport, props: {sectionID: 'barcodes'}},
      {path: "address", component: AppImport, props: {sectionID: 'address'}},
      {path: "art_text", component: AppImport, props: {sectionID: 'art_text'}},
      {path: "routers", component: AppImport, props: {sectionID: 'routers'}},
      {path: "cars", component: AppImport, props: {sectionID: 'cars'}},
      {path: "waybills", component: AppImport, props: {sectionID: 'waybills'}},
    ],
  },
  {
    path: "/mps",
    children: [
      {path: "coolroom", component: AppMPS, props: {deviceId: '2', title: 'Ошибки MPS холодильник'}},
      {path: "slaughter", component: AppMPS, props: {deviceId: '1', title: 'Ошибки MPS убой'}},
    ],
  },
  {
    path: "/export",
    children: [
      {path: "errors", component: Page404},
    ],
  },
  {
    path: "/dinamo",
    children: [
      {path: "errors", component: Page404},
      {path: "calling_box", component: Page404},
    ],
  },
  {
    path: "/sscc",
    children: [
      {path: "information", component: AppSSCCInfo},
      {path: "change_labeling", component: Page404},
    ],
  },
  {
    path: "/coolroom",
    children: [
      {path: "carcasses", component: Page404},
    ],
  },
  {
    path: "/ctf",
    children: [
      {path: "fat-shipping", component: AppCTFMain},
      {path: "block", component: AppCTFBlock},
      {path: "new-delivery", component: AppCTFDelivery},
    ],
  },
  {
    path: "/packing",
    children: [
      {path: 'quant_film', component: AppPackagingQuantFilm},
    ]
  },
  {
    path: "/sql_server",
    children: [
      {path: 'csb-test-ports', component: AppSqlCsbTestPort},
    ]
  },
  {
    path: "/qm",
    children: [
      {path: "journal_form_36_1_shift", component: AppQMJournal36, props: {shift_id: '1'}},
      {path: "journal_form_36_2_shift", component: AppQMJournal36, props: {shift_id: '2'}},
    ],
  },
  {
    path: "/edi",
    children: [
      {path: "edi_job_text", component: AppEdiJobText}
    ]
  },

  // Обработка неизвестных маршрутов
  {path: "/:pathMatch(.*)*", name: "NotFound", component: Page404},
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
