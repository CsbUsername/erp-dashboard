import Page404 from "@/views/Page404.vue";

const links = [
  {
    item: 'orders',
    title: 'Заказы',
    items: [
      {text: 'Просмотр заказа', url: '/details', icon: 'mdi mdi-file-tree'},
      {text: 'Изменение заказа', url: '/change', icon: 'mdi mdi-file-tree'},
      {text: 'Комплектация', url: '/equipment', icon: 'mdi mdi-file-tree'},
      // {text: 'Test', url: '/test', icon: 'mdi mdi-file-tree'},
    ]
  },
  {
    item: 'mps',
    title: 'MPS',
    items: [
      {text: 'Ошибки холодильник', url: '/coolroom', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'Ошибки убой', url: '/slaughter', icon: 'mdi mdi-format-list-bulleted'},
    ]
  },
  {
    item: 'import',
    title: 'Импорт данных',
    items: [
      {text: 'Заказы', url: '/orders', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'ДМПЗ', url: '/dmpz', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'ШК', url: '/barcodes', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'Адреса', url: '/address', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'Арт. тексты', url: '/art_text', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'Маршруты', url: '/routers', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'Машины', url: '/cars', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'Путевые листы', url: '/waybills', icon: 'mdi mdi-format-list-bulleted'},
    ]
  },

  {
    item: 'dinamo',
    title: 'Динамо',
    items: [
      {text: 'Ошибки', url: '/errors', icon: 'mdi mdi-format-list-bulleted'},
      {text: 'Вызов ящика', url: '/сalling_box', icon: 'mdi mdi-format-list-bulleted'},
    ]
  },
  {
    item: 'sscc',
    title: 'SSCC',
    items: [
      {text: 'Изменение маркировки', url: '/change_labeling', icon: 'mdi mdi-format-list-bulleted'}
    ]
  },
  {
    item: 'coolroom',
    title: 'Холодильник',
    items: [
      {text: 'Туши в 100', url: '/carcasses', icon: 'mdi mdi-format-list-bulleted'}
    ]
  },
]

const routers = links.map(link => ({
  ...link,
  items: link.items.map(item => ({
    ...item,
    url: `/${link.item}${item.url.trim()}/`,
  }))
}))


export default routers
