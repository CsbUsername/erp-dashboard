export default {
  // data(){
  //   return {
  //     fields: {}
  //   }
  // },

  methods: {
    getKurzBezByKey(keyToSearch) {
      if (!this.fields) return 'Fields не загружено';

      for (const key in this.fields) {
        if (Array.isArray(this.fields[key])) {
          const found = this.fields[key].find(item => item.RS8066_NAME === keyToSearch)
          if (found) {
            return found.RS8066_KURZ_BEZ;
          }
        }
      }
      return 'Описание не найдено'
    },

    parseToFloat(value){
      const regexp = /^\d+\.\d+$/
      if(regexp.test(value)){
        return parseFloat(value.toString())
      }
      return value
    }
  }


}
