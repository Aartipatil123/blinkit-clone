import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    mobile: "",
    verify_email: false,
    last_login_date: "",
    status: "",
    address_details: [],
    shopping_cart: [],
    orderHistory: [],
    role: ""
};

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,

    reducers: {
        setUserDetails: (state, action) => {
            const payload = action.payload || {};

            state._id = payload._id || "";
            state.name = payload.name || "";
            state.email = payload.email || "";
            state.avatar = payload.avatar || "";
            state.mobile = payload.mobile || "";
            state.verify_email = payload.verify_email || false;
            state.last_login_date = payload.last_login_date || "";
            state.status = payload.status || "";
            state.address_details = payload.address_details || [];
            state.shopping_cart = payload.shopping_cart || [];
            state.orderHistory = payload.orderHistory || [];
            state.role = payload.role || "";
        },

        logout: (state) => {
            state._id = "";
            state.name = "";
            state.email = "";
            state.avatar = "";
            state.mobile = "";
            state.verify_email = false;
            state.last_login_date = "";
            state.status = "";
            state.address_details = [];
            state.shopping_cart = [];
            state.orderHistory = [];
            state.role = "";
        }
    }
});

export const { setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;