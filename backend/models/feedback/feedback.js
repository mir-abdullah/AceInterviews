import mongoose from "mongoose";

const feedbackSchema =  mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true 
  },
  comment: {
    type: String,
    trim: true,
    required: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Feedback', feedbackSchema);


