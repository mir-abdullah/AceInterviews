import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import userRouter from './routes/user/user.js'
import cors from 'cors'


dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/'
app.use(express.json())
app.use(cors())
app.use(fileUpload({
    useTempFiles:true
}))
app.use('/api/user', userRouter)
app.get('/',(req,res)=>{
    res.send('Hello World')
})
mongoose.connect(MONGO_URI).then(()=>{
    console.log('Connected to MongoDB')
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`)
    })
})
