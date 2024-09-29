import mongoose from 'mongoose';

const quizResultSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizTopic',
    required: true
  },
  answers: [{
    question: {
    type:String,

    },
    selectedOption: {
      type: String, // Storing option value directly
      required: true
    },
    correctOption: {
      type: String, // Storing correct option value directly
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('QuizResult', quizResultSchema);
