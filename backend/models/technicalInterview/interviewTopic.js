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
    clicks:{
        type:Number,
        default:0
    },
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Question'
    }]
})

export default mongoose.model('InterviewTopic',interviewTopicSchema)
