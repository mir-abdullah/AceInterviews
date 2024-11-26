import mongoose from "mongoose";

const LanguageTestResultSchema = new mongoose.Schema({
    testId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stages: {
      mcq: [
        {
          questionId: String,
          selectedOption: String,
          correctOption: String, // Add this field
          isCorrect: Boolean
        }
      ],
      response: [
        {
          questionId: String,
          selectedOption: String,
          correctOption: String, // Add this field
          isCorrect: Boolean
        }
      ],
      speech: [
        {
          questionId: String,
          transcribedText: String,
          analysis: String
        }
      ]
    },
    score: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.model('LanguageTestResult', LanguageTestResultSchema);
  