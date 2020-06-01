<template>
  <div>
    <div class="page-title">
      <h3>Ваши контакты</h3>
    </div>
    <div class="input-field col s6">
      <i class="material-icons prefix">search</i>
      <input id="icon_prefix" type="text" v-model="searchFilterInput" class="validate" />
      <label for="icon_prefix">Поиск по именам</label>
    </div>
    <Loader v-if="loading" />
    <div class="row" v-else>
      <table class="responsive-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Мобильный телефон</th>
            <th>Домашний телефон</th>
            <th>Рабочий телефон</th>
            <th>Email</th>
            <th>Skype</th>
            <th>Discord</th>
            <th>Telegram</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in searchFilter" :key="c.id">
            <td>{{ c.name }}</td>
            <td>{{ c.mobile || 'нет' }}</td>
            <td>{{ c.home || 'нет' }}</td>
            <td>{{ c.work || 'нет' }}</td>
            <td>{{ c.email || 'нет' }}</td>
            <td>{{ c.skype || 'нет' }}</td>
            <td>{{ c.discord || 'нет' }}</td>
            <td>{{ c.telegram || 'нет' }}</td>
            <td class="action-btn">
              <div class="btn-floating btn-small green" @click="editHandler(c.id)">
                <i class="large material-icons">create</i>
              </div>
              <div class="btn-floating btn-small red" @click="removeHandler(c.id)">
                <i class="large material-icons">delete_forever</i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      ref="btn"
      class="fixed-action-btn tooltipped"
      data-position="left"
      data-tooltip="Добавить контакт"
    >
      <router-link class="btn-floating btn-large blue" to="/record">
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Loader from '../components/Loader'
  export default {
    name: 'home',
    data: () => ({
      loading: false,
      tooltip: undefined,
      searchFilterInput: ''
    }),
    components: {
      Loader
    },
    computed: {
      ...mapGetters(['contacts']),
      searchFilter() {
        if (this.searchFilterInput !== '') {
          return this.contacts.filter(c => c.name.includes(this.searchFilterInput))
        }

        return this.contacts
      }
    },
    methods: {
      editHandler(id) {
        this.$router.push('/edit/' + id)
      },
      async removeHandler(id) {
        this.loading = true
        await this.$store.dispatch('removeContact', id)
        this.loading = false
      }
    },
    mounted() {
      this.tooltip = window.M.Tooltip.init(this.$refs.btn)
    },
    destroy() {
      this.tooltip.destroy()
    }
  }
</script>

<style scoped>
  .action-btn {
    display: flex;
    justify-content: space-between;
    width: 85px;
  }
</style>
