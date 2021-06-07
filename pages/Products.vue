<template>
  <v-container>
    <v-row justify="center">
      <v-col v-for="product in Products" :key="product.id" cols="12" md="4">
        <v-card>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">Harga: {{ product.base_price }}</v-col>
              <v-col cols="4">Discount 1: {{ product.discount1 }}</v-col>
              <v-col cols="4">Discount 2: {{ product.discount2 }}</v-col>
              <v-col cols="4">Stock: {{ product.stock }}</v-col>
            </v-row>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <div>{{ product.note }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn rounded icon outlined color="warning" @click="Edit(product)">
              <i class="material-icons">edit</i>
            </v-btn>
            <v-btn
              rounded
              icon
              outlined
              color="error"
              @click="Delete(product.id)"
            >
              <i class="material-icons">delete</i>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          absolute
          right
          bottom
          color="primary"
          v-bind="attrs"
          v-on="on"
          elevation="2"
        >
          <i class="material-icons">post_add</i>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Product Form</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Nama Barang*"
                  :rules="nameRule"
                  required
                  @change="updateName"
                  :value="Product.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Harga Barang*"
                  :rules="priceRule"
                  required
                  @change="updatePrice"
                  :value="Product.base_price"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  label="Profit*"
                  :rules="profitRule"
                  required
                  @change="updateProfit"
                  :value="Product.profit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Stock*"
                  :rules="stockRule"
                  required
                  @change="updateStock"
                  :value="Product.stock"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Discount 1*"
                  :rules="discount1Rule"
                  required
                  @change="updateDisc1"
                  :value="Product.discount1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Discount 1 Quantity*"
                  :rules="discount1QtyRule"
                  required
                  @change="updateDisc1Qty"
                  :value="Product.discount1Qty"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Discount 2*"
                  :rules="discount2Rule"
                  required
                  @change="updateDisc2"
                  :value="Product.discount2"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Discount 2 Quantity*"
                  :rules="discount2QtyRule"
                  required
                  @change="updateDisc2Qty"
                  :value="Product.discount2Qty"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  auto-grow
                  clearable
                  clear-icon="mdi-close-circle"
                  label="Note*"
                  rows="2"
                  row-height="18"
                  required
                  @change="updateNote"
                  :value="Product.note"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="Close"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="Save"> Save </v-btn>
          <v-btn color="success" text @click="fakefill"> FakeFill </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const faker = require('faker')

export default {
  computed: {
    Products() {
      return this.$store.getters.getProducts
    },
    Product() {
      return this.$store.getters.getProduct
    },
  },
  data() {
    return {
      dialog: false,
      nameRule: [(v) => !!v || 'Name is required'],
      priceRule: [(v) => !!v || 'Price is required'],
      stockRule: [(v) => !!v || 'Stock is required'],
      profitRule: [(v) => !!v || 'Profit is required'],
      discount1Rule: [(v) => !!v || 'Discount 1 is required'],
      discount1QtyRule: [(v) => !!v || 'Discount 1 Quantity is required'],
      discount2Rule: [(v) => !!v || 'Discount 2 is required'],
      discount2QtyRule: [(v) => !!v || 'Discount 2 Quantity is required'],
    }
  },
  methods: {
    Edit(item) {
      // console.log(item,this.dialog = !this.dialog)
      this.dialog = !this.dialog
      this.$store.commit('setProduct', item)
    },
    Close() {
      this.dialog = !this.dialog
      this.$store.commit('emptyProduct', {})
    },
    Save() {
      if (confirm('Save changes ?')) this.$store.dispatch('Product')
      this.dialog = !this.dialog
    },
    Delete(id) {
      // console.log(id)
      if (confirm('Are you sure ?')) {
        this.$store.dispatch('deleteProduct', id)
      }
    },

    updateName(e) {
      // console.log(e)
      this.$store.commit('updateProductName', e)
    },
    updatePrice(e) {
      this.$store.commit('updateProductPrice', parseInt(e))
    },
    updateStock(e) {
      this.$store.commit('updateProductStock', parseInt(e))
    },
    updateProfit(e) {
      this.$store.commit('updateProductProfit', parseInt(e))
    },
    updateDisc1(e) {
      this.$store.commit('updateProductDisc1', parseInt(e))
    },
    updateDisc1Qty(e) {
      this.$store.commit('updateProductDisc1Qty', parseInt(e))
    },
    updateDisc2(e) {
      this.$store.commit('updateProductDisc2', parseInt(e))
    },
    updateDisc2Qty(e) {
      this.$store.commit('updateProductDisc2Qty', parseInt(e))
    },
    updateNote(e) {
      this.$store.commit('updateProductNote', e)
    },

    fakefill() {
      let name = faker.commerce.productName()
      this.$store.commit('setProduct', {
        name: name,
        nameIndex: name.split(' '),
        base_price: faker.finance.amount(),
        profit: faker.datatype.number(25),
        discount1: faker.datatype.number(25),
        discount1Qty: faker.datatype.number(25),
        discount2: faker.datatype.number(25),
        discount2Qty: faker.datatype.number(25),
        stock: faker.datatype.number(100),
        note: faker.commerce.productDescription(),
      })
    },
  },
}
</script>

<style></style>
