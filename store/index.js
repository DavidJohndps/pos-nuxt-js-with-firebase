export const state = () => ({
  link: [
    { title: 'Dashboard', icon: 'dashboard', to: '/' },
    { title: 'Product', icon: 'inventory_2', to: 'Products' },
    { title: 'Cashier', icon: 'point_of_sale', to: 'Cashier' },
    { title: 'Transactions', icon: 'receipt_long', to: 'Transactions' },
  ],
  user: {
    email: '',
    name: '',
  },
  query: '',
  transactions: [],
  product: {},
  products: [],
  cartItem: [],
})

export const getters = {
  getLinks: state => state.link,
  getTransactions: state => state.transactions,
  getProducts: state => state.products ,
  getProduct: state => state.product,
  getCartItems: state => state.cartItem,
}

export const mutations = {
  setActiveLink: (state, payload) => (state.activeLink = payload),
  User: (state, payload) =>
    (state.user = { email: payload.email, name: payload.name }),
  updateQuery: (state,payload) => state.query = payload,
  addProducts: (state, payload) => state.products.push(payload),
  emptyProducts: (state) => (state.products = []),
  setProduct: (state, payload) => (state.product = payload),
  emptyProduct: (state, payload) => (state.product = payload),
  updateProductName: (state, payload) => (state.product.name = payload,state.product.nameIndex=payload.split(" ")),
  updateProductPrice: (state, payload) => (state.product.base_price = payload),
  updateProductStock: (state, payload) => (state.product.stock = payload),
  updateProductProfit: (state, payload) => (state.product.profit = payload),
  updateProductDisc1: (state, payload) => (state.product.discount1 = payload),
  updateProductDisc1Qty: (state, payload) => (state.product.discount1Qty = payload),
  updateProductDisc2: (state, payload) => (state.product.discount2 = payload),
  updateProductDisc2Qty: (state, payload) => (state.product.discount2Qty = payload),
  updateProductNote: (state, payload) => (state.product.note = payload),
  addCartItem(state, payload) {
    let index = state.cartItem.findIndex(
      (product) => product.id === payload.product.id
    )
    index == -1
      ? state.cartItem.push({ ...payload.product, qty: 1 })
      : payload.qty
      ? (state.cartItem[index].qty = parseInt(payload.qty))
      : (state.cartItem[index].qty += 1)
  },
  removeCartItem(state, payload) {
    // console.log(payload)
    state.cartItem = state.cartItem.filter( product => {product.id === payload.product.id})
  },
  addTransactions: (state, payload) => state.transactions.push(payload),
  emptyTransaction: (state) => (state.transactions = []),
  emptyCartItem: (state) => (state.cartItem = []),
}

export const actions = {
  onAuthStateChangedAction: (state, { authUser, claims }) => {
    if (!authUser) {
      console.log('no user')
      // claims = null
      // Perform logout operations
    } else {
      console.log(authUser)
      // Do something with the authUser and the claims object...
    }
  },

  async Search({state, commit, dispatch}) {
    commit('emptyProducts')
    try {
      state.query ? await this.$fire.firestore.collection('products').where("nameIndex","array-contains", state.query)
      .get()
      .then(res => {
        res.forEach(doc => {
          let data = doc.data()          
          commit('addProducts',{
            id: doc.id,
            name: data.name,
            nameIndex: data.nameIndex,
            base_price: data.base_price,
            profit: data.profit,
            discount1: data.discount1,
            discount1Qty: data.discount1Qty,
            discount2: data.discount2,
            discount2Qty: data.discount2Qty,
            stock: data.stock
          });
        })
      }) : dispatch('getProducts')
    } catch (error) {
      console.log(error);
    }
  },

  async getProducts({ commit }) {
    commit('emptyProducts')
    try {
      await this.$fire.firestore
        .collection('products')
        .limit(9)
        .orderBy("timestamps", "desc")
        .get()
        .then((res) => {
          console.log(res)
          // const data = res.data();
          res.forEach((doc) => {
            let data = doc.data()
            // console.log(new Date(data.timestamps.updatedAt.toMillis()));
            commit('addProducts', {
              id: doc.id,
              name: data.name,
              nameIndex: data.nameIndex,
              base_price: data.base_price,
              discount1: data.discount1,
              discount1Qty: data.discount1Qty,
              discount2: data.discount2,
              discount2Qty: data.discount2Qty,
              profit: data.profit,
              stock: data.stock,
              note: data.note,
              timestamps: {
                createdAt: new Date(data.timestamps.createdAt.toMillis()),
                updatedAt: new Date(data.timestamps.updatedAt.toMillis()),
              },
            })
          })
        })
    } catch (error) {
      console.log(error)
    }
  },

  async Product({ state, dispatch }) {
    const productRefs = this.$fire.firestore.collection('products')
    let product = state.product
    if (product.id) delete product.timestamps.updatedAt
    try {
      product.id
        ? productRefs.doc(product.id).update({
            ...product,
            'timestamps.updatedAt':
              this.$fireModule.firestore.FieldValue.serverTimestamp(),
          })
        : productRefs.add({
            ...product,
            timestamps: {
              createdAt:
                this.$fireModule.firestore.FieldValue.serverTimestamp(),
              updatedAt:
                this.$fireModule.firestore.FieldValue.serverTimestamp(),
            },
          })
      dispatch('getProducts')
    } catch (error) {
      console.log(error)
    }
  },

  deleteProduct: async ({ dispatch }, id) => {
    // console.log(id)
    try {
      await this.$fire.firestore.collection('products').doc(id).delete()
      dispatch('getProducts')
    } catch (error) {
      console.log(error)
    }
  },

  async getTransactions({ commit }) {
    commit('emptyTransaction')
    try {
      await this.$fire.firestore
        .collection('transactions')
        .limit(9)
        .orderBy("timestamps","desc")
        .get()
        .then((res) => {
          res.forEach((doc) => {
            let data = doc.data()
            commit('addTransactions', {
              id: doc.id,
              items: data.items,
              total: data.total,
              timestamps: {
                createdAt: new Date(data.timestamps.createdAt.toDate()),
              },
            })
          })
        })
    } catch (err) {
      console.log(err)
    }
  },

  async Transactions({ commit, dispatch }, payload) {
    // console.log(payload);
    try {
      const batch = this.$fire.firestore.batch()
      payload.items.forEach((item) => {
        const itemQty = this.$fireModule.firestore.FieldValue.increment(
          -parseInt(item.qty)
        )
        batch.update(this.$fire.firestore.collection('products').doc(item.id), {
          stock: itemQty,
        })
      })
      batch.set(this.$fire.firestore.collection('transactions').doc(), {
        items: payload.items,
        total: payload.total,
        timestamps: {
          createdAt: this.$fireModule.firestore.FieldValue.serverTimestamp(),
        },
      })
      batch.commit().then(() => {
        commit('emptyCartItem')
        dispatch('getTransactions')
      })
    } catch (error) {
      console.log(error)
    }
  },
}
