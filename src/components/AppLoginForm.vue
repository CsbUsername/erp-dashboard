<template>
  <div class="login">
    <v-container>
      <v-row class="login-box">
        <v-col md="6" form-section>
          <div class="form-inner">
            <router-link to="#" class="logo">
              <img src="http://csb.apkholding.ru/ebartenev/img/logo.png" alt="logo">
            </router-link>

            <h3>Авторизация</h3>

            <v-alert
              color="error"
              icon="$error"
              density="compact"
              :text="error"
              class="text-left mb-5"
              v-if="isLogined === false"
            ></v-alert>

            <v-form @submit.prevent="onLogin">
              <div class="form-group position-relative clearfix">
                <v-text-field
                  v-model="csbID"
                  :rules="nameRules"
                  label="Номер учетной записи CSB"
                  required
                ></v-text-field>
                <div class="form-group clearfix position-relative password-wrapper">
                  <v-text-field
                    v-model="password"
                    :rules="nameRules"
                    type="password"
                    label="Пароль"
                    required
                  ></v-text-field>
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <v-checkbox
                  v-model="isRemember"
                  label="Запомнить меня"
                ></v-checkbox>
              </div>

              <div class="form-group clearfix mb-0">
                <v-btn
                  type="submit"
                  text="Войти"
                  height="3em"
                  class="btn btn-primary btn-lg btn-theme"
                >
                  Войти
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-col>

        <v-col md="6" form-section class="bg-img">
          <div class="photo">
            <img src="http://csb.apkholding.ru/ebartenev/img/img_login_page.png" alt="logo"
                 class="w-100 img-fluid">
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import '@/assets/css/login.css'
import httpMixin from "@/mixins/httpMixin.js";

export default {
  mixins: [httpMixin],
  emits: ['is-login'],
  props: ['allowedGroups'],
  data: () => ({
    valid: false,
    csbID: null,
    password: null,
    isRemember: false,
    isLogined: null,
    error: '',
    nameRules: [
      value => {
        if (value) return true
        return 'ID пользователя CSB обязательно для заполенния.'
      },
      value => {
        if (value?.length <= 10) return true
        return 'Name must be less than 10 characters.'
      },
    ]
  }),

  methods: {
    async onLogin() {
      console.log('onLogin вызван');
      const response = await this.sendRequest({
        method: 'POST',
        url: 'http://csb.apkholding.ru/v2/login',
        data: JSON.stringify({
          userid: this.csbID,
          password: this.password
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        isUserID: false
      })

      if(response.access_token && this.allowedGroups.includes(response.group)) {
        localStorage.setItem('token', JSON.stringify(response));
        this.isLogined = true;
      }else{
        this.isLogined = false;
        this.error = 'Доступ разрешен только сотрудникам ERP'
      }

      if (!response.access_token) {
        this.isLogined = false;
        this.error = 'Неверно указан логин или пароль'
      }

      this.$emit('is-login', { isLogin: this.isLogined });

    }
  },
}
</script>

<style scoped>
  *{
    font-family: "Roboto", "SansSerif", sans-serif;
  }
</style>
