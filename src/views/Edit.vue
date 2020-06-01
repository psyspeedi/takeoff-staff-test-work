<template>
  <Loader v-if="loading" />
  <div v-else class="record">
    <form class="autocomplete">
      <div class="record-container">
        <div class="input-field col s6">
          <i class="material-icons prefix">account_circle</i>
          <input
            id="icon_prefix"
            type="text"
            class="validate"
            v-model.trim="name"
            @change="changed = true"
            :class="{
              invalid:
                ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength)
            }"
          />
          <label for="icon_prefix">Имя</label>
          <small class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required">
            Имя не может быть пустым
          </small>
          <small class="helper-text invalid" v-else-if="$v.name.$dirty && !$v.name.minLength">
            Имя не может быть короче 2 символов
          </small>
        </div>

        <div class="input-field col s6">
          <i class="material-icons prefix">phone_iphone</i>
          <imask-input
            id="phone_iphone"
            type="tel"
            class="validate"
            v-model="mobile"
            :mask="'+{7}(000)000-00-00'"
            @change="changed = true"
            :class="{
              invalid: $v.mobile.$dirty && !$v.mobile.minLength
            }"
          />
          <label for="phone_iphone">Мобильный телефон</label>
          <small class="helper-text invalid" v-if="$v.mobile.$dirty && !$v.mobile.minLength">
            Введите корректный телефон
          </small>
        </div>

        <div class="input-field col s6">
          <i class="material-icons prefix">phone</i>
          <imask-input
            id="icon_telephone"
            type="tel"
            class="validate"
            v-model="home"
            @change="changed = true"
            :mask="'+{7}(000)000-00-00'"
            :class="{
              invalid: $v.home.$dirty && !$v.home.minLength
            }"
          />
          <label for="icon_telephone">Домашний телефон</label>
          <small class="helper-text invalid" v-if="$v.home.$dirty && !$v.home.minLength">
            Введите корректный телефон
          </small>
        </div>

        <div class="input-field col s6">
          <i class="material-icons prefix">contact_phone</i>
          <imask-input
            id="contact_phone"
            type="tel"
            class="validate"
            v-model="work"
            @change="changed = true"
            :mask="'+{7}(000)000-00-00'"
            :class="{
              invalid: $v.work.$dirty && !$v.work.minLength
            }"
          />
          <label for="contact_phone">Рабочий телефон</label>
          <small class="helper-text invalid" v-if="$v.work.$dirty && !$v.work.minLength">
            Введите корректный телефон
          </small>
        </div>

        <div class="input-field col s6">
          <i class="material-icons prefix">email</i>
          <input
            id="icon_email"
            type="tel"
            class="validate"
            v-model.trim="email"
            @change="changed = true"
            :class="{
              invalid: $v.email.$dirty && !$v.email.email
            }"
          />
          <label for="icon_email">Email</label>
          <small class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.email"
            >Введите корретный Email</small
          >
        </div>

        <div class="input-field col s6">
          <i class="material-icons prefix">duo</i>
          <input id="skype" type="tel" class="validate" v-model="skype" @change="changed = true" />
          <label for="skype">Skype</label>
        </div>

        <div class="input-field col s6">
          <i class="material-icons prefix">dialer_sip</i>
          <input
            id="dialer_sip"
            type="tel"
            class="validate"
            v-model="discord"
            @change="changed = true"
          />
          <label for="dialer_sip">Discord</label>
        </div>

        <div class="input-field col s6">
          <i class="material-icons prefix">message</i>
          <input
            id="message"
            type="tel"
            class="validate"
            v-model="telegram"
            @change="changed = true"
          />
          <label for="message">Telegram</label>
        </div>
      </div>
      <div class="buttons">
        <button class="btn primary" @click.prevent="backHandler">Отмена</button>
        <button class="btn red" @click.prevent="removeHandler">удалить</button>
        <button class="btn green" :disabled="!changed" @click.prevent="submitHandler">
          Отредактировать
        </button>
      </div>
    </form>

    <div
      ref="btn"
      class="fixed-action-btn back-btn tooltipped"
      data-position="left"
      data-tooltip="Назад"
    >
      <router-link class="btn-floating btn-large blue btn-flat" to="/">
        <i class="large material-icons">backspace</i>
      </router-link>
    </div>
  </div>
</template>

<script>
  import Loader from '../components/Loader'
  import { email, required, minLength } from 'vuelidate/lib/validators'
  import { IMaskComponent } from 'vue-imask'
  import { mapGetters } from 'vuex'
  export default {
    name: 'record',
    components: {
      'imask-input': IMaskComponent,
      Loader
    },
    data: () => ({
      name: undefined,
      mobile: undefined,
      home: undefined,
      work: undefined,
      email: undefined,
      skype: undefined,
      discord: undefined,
      telegram: undefined,
      id: undefined,
      loading: true,
      tooltip: undefined,
      changed: false
    }),
    validations: {
      name: { required, minLength: minLength(2) },
      mobile: { minLength: minLength(11) },
      home: { minLength: minLength(11) },
      work: { minLength: minLength(11) },
      email: { email }
    },
    computed: {
      ...mapGetters(['currentContact'])
    },
    methods: {
      async submitHandler() {
        this.loading = true

        if (this.$v.$invalid) {
          this.loading = false
          return this.$v.$touch()
        }

        if (
          this.mobile === '' &&
          this.home === '' &&
          this.work === '' &&
          this.email === '' &&
          this.skype === '' &&
          this.discord === '' &&
          this.telegram === ''
        ) {
          this.loading = false
          return this.$error('Заполните хотя бы один способ связи')
        }

        await this.$store.dispatch('updateContact', {
          name: this.name,
          mobile: this.mobile || null,
          home: this.home || null,
          work: this.work || null,
          email: this.email || null,
          skype: this.skype || null,
          discord: this.discord || null,
          telegram: this.telegram || null,
          id: this.id
        })

        this.loading = false
        this.$message('Контакт отредактирован')
        this.$router.push('/')
      },
      async removeHandler() {
        this.loading = true
        await this.$store.dispatch('removeContact', this.id)
        this.loading = false
        this.$router.push('/')
        this.$message('Контакт удален')
      },
      backHandler() {
        this.$router.push('/')
      }
    },
    mounted() {
      this.$store.commit('setCurrentContactId', this.$route.params.id)
      setTimeout(() => {
        window.M.updateTextFields()
        this.tooltip = window.M.Tooltip.init(this.$refs.btn)
      }, 0)

      this.name = this.currentContact.name || ''
      this.mobile = this.currentContact.mobile || ''
      this.home = this.currentContact.home || ''
      this.work = this.currentContact.work || ''
      this.email = this.currentContact.email || ''
      this.skype = this.currentContact.skype || ''
      this.discord = this.currentContact.discord || ''
      this.telegram = this.currentContact.telegram || ''
      this.id = this.$route.params.id

      this.loading = false
    },
    destroy() {
      this.tooltip.destroy()
    }
  }
</script>

<style>
  form {
    width: 500px;
    margin: 0 auto;
  }

  .record-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .fixed-action-btn.back-btn {
    bottom: initial !important;
    top: 70px;
  }

  .input-field > label {
    left: 0 !important;
  }
</style>
