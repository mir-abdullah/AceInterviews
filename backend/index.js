import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import userRouter from './routes/user/user.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import TechnicalInterviewRouter from './routes/technicalInterview/interviewTopic.js'
import TechnicalQuestionRouter from './routes/technicalInterview/question.js'
import InterviewRouter from './routes/technicalInterview/interview.js'
import quizQuestionRouter from './routes/quiz/quizQuestion.js'
import quizRouter from './routes/quiz/quiz.js'
import quizTopicRouter from './routes/quiz/quizTopic.js'
import BehaviouralInterviewRouter from './routes/behaviouralInterview/behaviouralInterview.js'
import BehaviouralQuestionRouter from './routes/behaviouralInterview/behaviourQuestion.js'
import BehaviouralTopicRouter from './routes/behaviouralInterview/behaviourTopic.js'
import Admin from './routes/admin/admin.js'
import FeedbackRouter from './routes/feedback/feedback.js'


dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/'
app.use(express.json({limit:'40mb'}))
const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
  };
  
  app.use(cors(corsOptions));
  
app.use(fileUpload({
    useTempFiles:true
}))
app.use(cookieParser());
//user
app.use('/api/user', userRouter)

//admin
app.use('/api/admin', Admin)

//technical interview
app.use('/technicalInterviewTopic',TechnicalInterviewRouter)
app.use('/technicalQuestion',TechnicalQuestionRouter)
app.use('/technicalInterview',InterviewRouter)

//behavioural interview
app.use('/behaviouralInterview',BehaviouralInterviewRouter)
app.use('/behaviouralQuestion',BehaviouralQuestionRouter)
app.use('/behaviouralTopic',BehaviouralTopicRouter)

//quiz
app.use('/quiz',quizRouter)
app.use('/quiz-questions',quizQuestionRouter)
app.use('/quizTopic',quizTopicRouter)

//feedback
app.use('/feedback',FeedbackRouter)

app.get('/',(req,res)=>{
    res.send('Hello World')
})
mongoose.connect(MONGO_URI).then(()=>{
    console.log('Connected to MongoDB')
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
})
