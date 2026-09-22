import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    addressList : []
}

const addressSlice = createSlice({
    name : 'address',
    initialState : initialValue,
    reducers : {
        handleAddAddress : (state,action)=>{
            console.log("Redux Payload:", action.payload);
            state.addressList = [...action.payload]
        }
    }
})

export const {handleAddAddress  } = addressSlice.actions

export default addressSlice.reducer