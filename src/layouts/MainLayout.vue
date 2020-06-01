<template>
  <Loader v-if="loading" />
  <div v-else class="app-main-layout">
    <Navbar />
    <main class="app-content">
      <div class="app-page">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
  import Navbar from '../components/Navbar'
  import Loader from '../components/Loader'

  export default {
    name: 'main-layout',
    data: () => ({
      loading: true
    }),
    components: {
      Navbar,
      Loader
    },
    async mounted() {
      await this.$store.dispatch('fetchInfo')
      await this.$store.dispatch('fetchContacts')
      this.loading = false
    }
  }
</script>
