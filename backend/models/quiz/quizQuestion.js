import mongoose from 'mongoose';


const quizQuestionSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true
  },
 
});

export default mongoose.model('QuizQuestion', quizQuestionSchema);

