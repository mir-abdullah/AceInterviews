import mongoose from 'mongoose';


const responseQuestionSchema = mongoose.Schema({
  questionAudio: {
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

export default mongoose.model('ResponseQuestion', responseQuestionSchema);