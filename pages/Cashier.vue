<template>
  <div v-if="Cart">
    <v-simple-table dark>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Name</th>
            <th class="text-left">Quantity</th>
            <th class="text-left">Price</th>
            <th class="text-left">Total</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in Cart" :key="idx">
            <td>{{ idx + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>
              <v-text-field
                type="number"
                :rules="inputRules"
                :value="item.qty"
                @change="
                  $store.commit('addCartItem', {
                    product: { id: item.id },
                    qty: $event,
                  })
                "
              ></v-text-field>
            </td>
            <td>{{ item.base_price }}</td>
            <td>{{ item.total }}</td>
            <td>
              <v-btn rounded outlined icon @click="Remove(item.id)">
                <i class="material-icons">remove_shopping_cart</i>
              </v-btn>
            </td>
          </tr>
          <tr v-if="Cart.length">
            <td class="text-right" colspan="4">Total:</td>
            <td>{{ CartTotal }}</td>
          </tr>
          <tr v-if="!Cart.length">
            <td class="text-center" colspan="6">No Items in Cart</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-btn rounded icon outlined @click="Pay(Cart, CartTotal)">
      <i class="material-icons">payments</i>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputRules: [(v) => v > 0 || 'Quantity at least 1'],
    }
  },
  computed: {
    Cart() {
      return this.$store.getters.getCartItems.map((item) => {
        if (item.qty < item.discount1Qty)
          item.total = item.qty * ((100 + item.profit)/100) * item.base_price
        if (item.qty >= item.discount1Qty && item.qty <= item.discount2Qty)
          item.total = item.qty * ((100 + item.discount1)/100) * item.base_price
        if (item.qty >= item.discount2Qty)
          item.total = item.qty * ((100 + item.discount1)/100) * item.base_price
        return item
      })
    },
    CartTotal() {
      let total = 0
      this.Cart.forEach((item) => {
        total += item.total
      })
      return total
    },
  },
  methods: {
    Remove(id) {
      if (confirm('Remove from cart'))
        this.$store.commit('removeCartItem', { product: { id: id } })
    },
    Pay(items, total) {
      console.log(total)
      if (confirm('Are these items are correct ?'))
        this.$store.dispatch('Transactions', { items: items, total: total })
    },
  },
}
</script>

<style></style>
