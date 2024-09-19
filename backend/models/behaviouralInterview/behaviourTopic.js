import mongoose from "mongoose";

const behaviouralInterviewTopic =mongoose.Schema({
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
        ref:'BehaviourQuestion'
    }]
})

export default mongoose.model('BehaviourInterviewTopic',behaviouralInterviewTopic)
