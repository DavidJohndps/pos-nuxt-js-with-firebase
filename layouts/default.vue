<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      permanent
      expand-on-hover
      app
      mini-variant
    >
      <v-list nav>
        <v-list-item>
          <v-list-item-action>
            <i class="material-icons">storefront</i>
          </v-list-item-action>
          <v-list-item-content>Omega</v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(item, i) in NavLink"
          :key="i"
          exact
          active-class=""
        >
          <v-list-item-action>
            <NuxtLink :to="item.to">
              <i class="material-icons">{{ item.icon }}</i>
            </NuxtLink>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="Logout">
          <v-list-item-action>
            <i class="material-icons">logout</i>
          </v-list-item-action>
          <v-list-item-content>Log Out</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: 'Auth',
  computed: {
    NavLink() {
      return this.$store.getters.getLinks
    },
  },
  data() {
    return {
      drawer: false,
    }
  },
  methods: {
    async Logout() {
      try {
        await this.$fire.auth.signOut()
        this.$store.commit('User', { email: '', name: '' })
        this.$router.push('/Login')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style scoped>
.nuxt-link-exact-active {
  color: red;
}
</style>
