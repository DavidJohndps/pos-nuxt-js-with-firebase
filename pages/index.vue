<template>
  <v-row>
    <v-col v-for="product in Products" :key="product.id" cols="12" md="4">
      <v-card>
        <v-card-title>{{ product.name }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">Harga: {{ product.base_price }}</v-col>
            <v-col cols="6">Profit: {{ product.profit }}</v-col>
            <v-col cols="4">Stock: {{ product.stock }}</v-col>
            <v-col cols="4">Discount 1: {{ product.discount1 }}</v-col>
            <v-col cols="4">Discount 2: {{ product.discount2 }}</v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded icon color="primary" outlined @click="addItem(product)">
            <i class="material-icons">add_shopping_cart</i>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  mounted() {
    if(!this.Products.length) this.$store.dispatch('getProducts')
  },
  computed: {
    Products() {
      return this.$store.getters.getProducts
    },
  },
  methods: {
    addItem(product) {
      this.$store.commit('addCartItem', {
        product: {
          id: product.id,
          name: product.name,
          base_price: product.base_price,
          profit: product.profit,
          discount1: product.discount1,
          discount1Qty: product.discount1Qty,
          discount2: product.discount2,
          discount2Qty: product.discount2Qty
        }
      })
    }
  }
}
</script>
