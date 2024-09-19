import mongoose from "mongoose";

const quizTopicSchema =mongoose.Schema({
    title :{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    picture: {
        type: String, 
        required: false
      },
    questions:[{    
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }]
})

export default mongoose.model('QuizTopic',quizTopicSchema)
