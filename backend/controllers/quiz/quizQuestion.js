import express from 'express';
import QuizTopic from '../../models/quiz/quizTopic.js'; // Adjust the path as needed
import QuizQuestion from '../../models/quiz/quizQuestion.js'; // Adjust the path as needed

// Route to add a question
export const addQuestion = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quizTopic = await QuizTopic.findById(quizId);
        if (!quizTopic) {
            return res.status(404).json({ message: 'Quiz Topic not found' });
        }

        const { questionText, options, difficulty } = req.body;
        if (!questionText || !options || !difficulty) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const newQuestion = new QuizQuestion({
            questionText,
            options,
            difficulty
        });
        await newQuestion.save();

        quizTopic.questions.push(newQuestion._id);
        await quizTopic.save();

        res.status(201).json({ message: 'Question added to the quiz topic', quizTopic });
    } catch (error) {
        res.status(500).json({ message: 'Error adding question to quiz topic', error: error.message });
        console.error(error);
    }
};

//route to delete a question
export const deleteQuestion = async (req, res) => {
    try {
        const { quizId, questionId } = req.params;

        const question = await QuizQuestion.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const quizTopic = await QuizTopic.findById(quizId);
        if (!quizTopic) {
            return res.status(404).json({ message: 'Quiz Topic not found' });
        }

        quizTopic.questions.pull(questionId);
        await quizTopic.save();

        res.status(200).json({ message: 'Question deleted from the quiz topic' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting question from quiz topic', error: error.message });
    }
};

//route to update question
export const updateQuestion = async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        const { questionText, options, difficulty } = req.body;

        const question = await QuizQuestion.findByIdAndUpdate(
            questionId,
            { questionText, options, difficulty },
            { new: true, runValidators: true }
        );
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }


        res.status(200).json({ message: 'Question updated in the quiz topic', question });
    } catch (error) {
        res.status(500).json({ message: 'Error updating question in quiz topic', error: error.message });
    }
};