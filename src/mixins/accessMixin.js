export default{
  computed: {
    username() {
      const token_data = JSON.parse(localStorage.getItem('token'))
      return token_data.username || 'Guest'
    },

    user_group() {
      const token_data = JSON.parse(localStorage.getItem('token'))
      return token_data.group || null
    },

    user_id() {
      const token_data = JSON.parse(localStorage.getItem('token'))
      return token_data.userid || null
    },
  }
}
