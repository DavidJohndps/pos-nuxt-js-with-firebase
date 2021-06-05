<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="6" align-self="center">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                type="email"
                v-model="email"
                :rules="emailRule"
                label="Email"
                clearable
                required
              ></v-text-field>
              <v-text-field
                type="password"
                v-model="password"
                label="Password"
                :rules="passwordRule"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-col>
                <div class="text-center">
                  <v-btn rounded color="teal" @click="Login">Log In</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'login',
  data() {
    return {
      email: '',
      emailRule: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRule: [(v) => !!v || 'Password is required'],
    }
  },
  methods: {
    async Login() {
      try {
        await this.$fire.auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then((res) => {
            // console.log(re)
            this.$store.commit('User', {
              email: res.user.email,
              name: res.user.displayName,
            })
            this.$router.push('/')
          })
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style></style>
