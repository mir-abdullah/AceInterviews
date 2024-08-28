import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/auth.slice";

const store=configureStore({
    reducer:{
        auth:authReducer
    }
})

export default store;