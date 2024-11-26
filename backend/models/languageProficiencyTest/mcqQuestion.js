import mongoose from 'mongoose';


const mcqQuestionSchema = mongoose.Schema({
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

 
});

export default mongoose.model('McqQuestion', mcqQuestionSchema);