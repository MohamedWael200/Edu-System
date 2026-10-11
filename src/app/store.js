import {configureStore} from "@reduxjs/toolkit";
import  authReducer from "../features/auth/authSlice.js"
import teacherReducer from "../features/teacher/teacherSlice.js"
const store = configureStore({
    reducer: {
        auth :  authReducer,
        teacher : teacherReducer,
    }
})

export default store