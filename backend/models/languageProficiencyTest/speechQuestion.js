import mongoose from "mongoose";

const speechQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },

});

export default mongoose.model('SpeechQuestion', speechQuestionSchema);
