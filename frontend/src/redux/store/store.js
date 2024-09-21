import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/auth.slice";
import userReducer from "../slices/user/user.slice";
import interviewTopicsReducer from '../slices/technicalInterview/technicalInterview.slice';
import QuizTopicReducer from '../slices/quiz/quiz.slice'
import AdminReducer from "../slices/admin/admin.slice"


const store=configureStore({
    reducer:{
        auth:authReducer,
        user:userReducer,
        interviewTopics: interviewTopicsReducer,
        quizTopic:QuizTopicReducer,
        admin:AdminReducer


    }
})

export default store;