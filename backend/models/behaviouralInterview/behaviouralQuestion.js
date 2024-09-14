import mongoose from "mongoose";

const behaviourQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },

});

export default mongoose.model('Question', behaviourQuestionSchema);
