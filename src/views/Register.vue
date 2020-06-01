<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">Записная книжка</span>
      <div class="input-field">
        <input
          id="name"
          type="text"
          v-model.trim="name"
          :class="{
            invalid: ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength)
          }"
        />
        <label for="email">Email</label>
        <small class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required"
          >Имя не должно быть пустым</small
        >
        <small class="helper-text invalid" v-else-if="$v.name.$dirty && !$v.name.minLength"
          >Минимальная длина имени 2 символа</small
        >
      </div>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="email"
          :class="{
            invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)
          }"
        />
        <label for="email">Email</label>
        <small class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.required"
          >Поле Email не должно быть пустым</small
        >
        <small class="helper-text invalid" v-else-if="$v.email.$dirty && !$v.email.email"
          >Введите корретный Email</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          v-model.trim="$v.password.$model"
          :class="{
            invalid:
              ($v.password.$dirty && !$v.password.required) ||
              ($v.password.$dirty && !$v.password.minLength)
          }"
        />
        <label for="password">Пароль</label>
        <small class="helper-text invalid" v-if="$v.password.$dirty && !$v.password.required">
          Введите пароль
        </small>
        <small class="helper-text invalid" v-else-if="$v.password.$dirty && !$v.password.minLength">
          Пароль должен быть минимум {{ $v.password.$params.minLength.min }} символов. Сейчас он
          {{ password.length }}
        </small>
      </div>
      <div class="input-field">
        <input
          id="confirm"
          type="password"
          v-model.trim="$v.repeatPassword.$model"
          :class="{ invalid: !$v.repeatPassword.sameAsPassword }"
        />
        <label for="confirm">Повторите пароль</label>
        <small class="helper-text invalid" v-if="!$v.repeatPassword.sameAsPassword">
          Пароли не совпадают
        </small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button
          class="btn waves-effect waves-light auth-submit"
          @click.prevent="submitHandler"
          type="submit"
        >
          Зарегистрироваться
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        Уже есть аккаунт?
        <router-link to="/login">Войти!</router-link>
      </p>
    </div>
  </form>
</template>

<script>
  import { email, required, minLength, sameAs } from 'vuelidate/lib/validators'
  import messages from '../utils/messages'

  export default {
    name: 'register',
    data: () => ({
      name: '',
      email: '',
      password: '',
      repeatPassword: ''
    }),
    validations: {
      name: { required, minLength: minLength(2) },
      email: { email, required },
      password: { required, minLength: minLength(6) },
      repeatPassword: {
        sameAsPassword: sameAs('password')
      }
    },
    methods: {
      async submitHandler() {
        if (this.$v.$invalid) {
          return this.$v.$touch()
        }

        const formData = {
          name: this.name,
          email: this.email,
          password: this.password
        }

        try {
          await this.$store.dispatch('register', formData)
          this.$router.push('/login?message=register')
        } catch (e) {
          console.log(e)
          this.$error(messages[e.code])
        }
      }
    }
  }
</script>
