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
        type: String, // Store the image URL
        required: false // Make it optional in case some topics don't have images
      },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }]
})

export default mongoose.model('InterviewTopic',interviewTopicSchema)
