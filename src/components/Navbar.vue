<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <span class="black-text">{{ date | date('datetime') }}</span>
      </div>
      <ul class="right hide-on-small-and-down">
        <li>
          <a class="dropdown-trigger black-text" href="#" data-target="dropdown" ref="dropdown">
            {{ info.name }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>
          <ul id="dropdown" class="dropdown-content">
            <li class="divider" tabindex="-1"></li>
            <li>
              <a href="#" class="black-text" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>Выйти
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data: () => ({
      date: new Date(),
      interval: null,
      dropdown: null
    }),
    computed: {
      ...mapGetters(['info'])
    },
    methods: {
      async logout() {
        try {
          await this.$store.dispatch('logout')
          this.$router.push('/login?message=logout')
        } catch (e) {
          throw new Error(e)
        }
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.date = new Date()
      }, 1000)
      this.dropdown = window.M.Dropdown.init(this.$refs.dropdown, {
        constrainWidth: false
      })
    },
    beforeDestroy() {
      clearInterval(this.interval)
      if (this.dropdown && this.dropdown.destroy) {
        this.dropdown.destroy()
      }
    }
  }
</script>
