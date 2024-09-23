import mongoose from "mongoose";

const interviewTopicSchema =mongoose.Schema({
    title :{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    picture:{
        type:String,

    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }]
})

export default mongoose.model('InterviewTopic',interviewTopicSchema)
