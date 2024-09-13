import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/auth.slice";
import userReducer from "../slices/user/user.slice";

const store=configureStore({
    reducer:{
        auth:authReducer,
        user:userReducer
    }
})

export default store;