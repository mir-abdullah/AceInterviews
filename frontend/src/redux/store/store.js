import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/auth.slice";
import userReducer from "../slices/user/user.slice";
import interviewTopicsReducer from "../slices/technicalInterview/technicalInterview.slice";
import QuizTopicReducer from "../slices/quiz/quiz.slice";
import AdminReducer from "../slices/admin/admin.slice";
import interviewsReducer from "../slices/admin/behaviouralAdmin/behaviouralAdmin.slice";
import behaviourQuestionsReducer from "../slices/admin/behaviouralAdmin/behaviourQuestion";
import technicalInterviewsReducer from "../slices/admin/technicalAdmin/technicalAdmin.slice";
import technicalQuestionsReducer from "../slices/admin/technicalAdmin/technicalQuestions";
import quizAdminReducer from "../slices/admin/quizAdmin/quizAdmin";
import quizQuestionsReducer from "../slices/admin/quizAdmin/quizQuestions";
import feedbackReducer from "../slices/feedback/userFeedback";
import statsReducer from "../slices/admin/statistics/statisctics";
import resultsReducer from "../slices/results/results.slice";
import behaviouralInterviewReducer from "../slices/behaviouralInterview/behaviouralInterview.slice";
import languageTestReducer from '../slices/languageProficiencyTest/languageTest.slice'
import mcqReducer from '../slices/languageProficiencyTest/mcqQuestion.slice'
import speechQuestionReducer from '../slices/languageProficiencyTest/speechQuestion.slice'
import responseQuestionsReducer from '../slices/languageProficiencyTest/responseQuestion.slice'
import preperationReducer from '../slices/preperation/preperation.slice'



const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    interviewTopics: interviewTopicsReducer,
    quizTopic: QuizTopicReducer,
    admin: AdminReducer,
    interviews: interviewsReducer,
    behaviourQuestions: behaviourQuestionsReducer,
    technicalInterviews: technicalInterviewsReducer,
    technicalQuestions: technicalQuestionsReducer,
    quizAdmin: quizAdminReducer,
    quizQuestions: quizQuestionsReducer,
    feedback: feedbackReducer,
    stats: statsReducer,
    results: resultsReducer,
    behaviouralInterview: behaviouralInterviewReducer,
    languageTest :languageTestReducer,
    mcq:mcqReducer,
    speechQuestion: speechQuestionReducer,
    responseQuestions : responseQuestionsReducer,
    preperation:preperationReducer

  },
});

export default store;
