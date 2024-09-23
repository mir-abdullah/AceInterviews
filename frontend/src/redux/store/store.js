import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/auth.slice";
import userReducer from "../slices/user/user.slice";
import interviewTopicsReducer from '../slices/technicalInterview/technicalInterview.slice';
import QuizTopicReducer from '../slices/quiz/quiz.slice'
import AdminReducer from "../slices/admin/admin.slice"
import interviewsReducer from "../slices/admin/behaviouralAdmin/behaviouralAdmin.slice";
import behaviourQuestionsReducer from '../slices/admin/behaviouralAdmin/behaviourQuestion'
import technicalInterviewsReducer from '../slices/admin/technicalAdmin/technicalAdmin.slice'
import technicalQuestionsReducer from '../slices/admin/technicalAdmin/technicalQuestions'
import quizAdminReducer from '../slices/admin/quizAdmin/quizAdmin'
import quizQuestionsReducer from '../slices/admin/quizAdmin/quizQuestions'
import feedbackReducer from '../slices/feedback/userFeedback'
import statsReducer from  '../slices/admin/statistics/statisctics'
const store=configureStore({
    reducer:{
        auth:authReducer,
        user:userReducer,
        interviewTopics: interviewTopicsReducer,
        quizTopic:QuizTopicReducer,
        admin:AdminReducer,
        interviews:interviewsReducer,
        behaviourQuestions: behaviourQuestionsReducer, 
        technicalInterviews: technicalInterviewsReducer,
        technicalQuestions: technicalQuestionsReducer,
        quizAdmin: quizAdminReducer,
        quizQuestions: quizQuestionsReducer,
        feedback: feedbackReducer,
        stats: statsReducer





    }
})

export default store;