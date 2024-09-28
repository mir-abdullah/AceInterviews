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
      clicks:{
        type:Number,
        default:0
      },
    questions:[{    
        type:mongoose.Schema.Types.ObjectId,
        ref:'QuizQuestion'
    }]
})

export default mongoose.model('QuizTopic',quizTopicSchema)
