import Feedback from "../../models/feedback/feedback.js";

export const submitFeedback = async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const userId = req.userId
  
      const feedback = new Feedback({
        user: userId, 
        rating,
        comment,
      },{
        timestamps:true
      });
  
      await feedback.save();
  
      res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while submitting feedback', details: err.message });
    }
  };

  //get all feedback
 export  const getAllFeedback = async (req, res) => {
    try {
      const feedbacks = await Feedback.find()
        .populate('user', 'name ') 
        .sort({ createdAt: -1 }); 
  
      res.status(200).json({ feedbacks });
    } catch (err) {
      res.status(500).json({ error: 'An error occurred while retrieving feedback', details: err.message });
    }
  };
