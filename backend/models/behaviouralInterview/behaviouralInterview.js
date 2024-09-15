import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewTopic', required: true },
  responses: [
    {
      question: { type: String },
      answer: String,
      evaluation: {
        accuracyOfAnswer:String,
        speechAndGrammarAnalysis:String,
        SpeechQualityAndConfidence:String,
        TipsAndIdealAnswer:String,
      },
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Interview', interviewSchema);
