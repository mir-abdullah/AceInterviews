import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'BehaviourInterviewTopic', required: true },
  responses: [
    {
      question: { type: String },
      answer: String,
      evaluation: {
        feedback:String,
        confidence:String,
        IdealAnswer:String,
      },
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('BehaviouralInterview', interviewSchema);
