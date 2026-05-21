import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  allCategory: [],
  loadingCategory : false,
  allSubCategory: [],
  product: []
}

const productSlice = createSlice({
  name: "product",
  initialState,

  reducers: {

    // ================= CATEGORY =================
    setAllCategory: (state, action) => {
      state.allCategory = Array.isArray(action.payload) ? action.payload : []
    },

    // ================= SUBCATEGORY =================
    setAllSubCategory: (state, action) => {
      state.allSubCategory = Array.isArray(action.payload) ? action.payload : []
    },

    setLoadingCategory : (state,action)=>{
      state.loadingCategory = action.payload
    },

    // ================= PRODUCT =================
    setAllProduct: (state, action) => {
      state.product = Array.isArray(action.payload) ? action.payload : []
    },

    // ================= ADD PRODUCT =================
    addProduct: (state, action) => {
      if (action.payload) {
        state.product.push(action.payload)
      }
    },

    // ================= CLEAR STATE =================
    clearProductState: (state) => {
      state.allCategory = []
      state.allSubCategory = []
      state.product = []
    }

  }
})

export const {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
  setAllProduct,
  addProduct,
  clearProductState
} = productSlice.actions

export default productSlice.reducer