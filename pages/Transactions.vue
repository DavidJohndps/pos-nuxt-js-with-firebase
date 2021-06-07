<template>
  <v-row justify="center">
    <v-col
      cols="12"
      md="4"
      v-for="transaction in Transactions"
      :key="transaction.id"
    >
      <v-card>
        <v-card-title>ID: {{ transaction.id }}</v-card-title>
        <v-card-text>
          <v-list three-line>
            <template v-for="(item, id) in transaction.items">
              <v-list-item :key="id">
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="item.price"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon outlined v-text="item.qty"></v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  mounted() {
    if (!this.Transactions.length) this.$store.dispatch('getTransactions')
  },
  computed: {
    Transactions() {
      return this.$store.getters.getTransactions
    },
  },
}
</script>

<style></style>
