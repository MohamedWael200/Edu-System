import {configureStore} from "@reduxjs/toolkit";
import  authReducer from "../features/auth/authSlice.js"
import teacherReducer from "../features/teacher/teacherSlice.js"
import teacherStudentReducer from "../features/teacher/teacherStudentSlice.js"
import assistantsReducer from "../features/assistantsSlice.js";
import notificationsReducer from "../features/notifications/notificationsSlice.js";
import marketplaceReducer from "../features/marketplace/marketplaceTeacherSlice.js";
import studentEnrollmentReducer from "../features/student/studentEnrollmentSlice.js";
import studentLessonsReducer from "../features/student/studentLessonsSlice.js";
import parentReducer from "../features/parent/parentSlice.js";

const store = configureStore({
    reducer: {
        auth :  authReducer,
        teacher : teacherReducer,
        teacherStudent : teacherStudentReducer,
        assistants: assistantsReducer,
        notifications: notificationsReducer,
        marketplace: marketplaceReducer,
        studentEnrollments: studentEnrollmentReducer,
        studentLessons: studentLessonsReducer,
        parent: parentReducer,
    }
})

export default store