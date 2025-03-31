import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/jobs/${jobId}/questions`, {
          count: 2
        });
        setQuestions(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [jobId]);

  const handleSolveQuestion = (question) => {
    navigate(`/editor/${jobId}`, { state: { question } });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Choose a Question to Solve</h1>
      <div className="grid gap-6">
        {questions.map((question) => (
          <div key={question._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {question.title}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${question.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                  question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                {question.difficulty}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {question.description}
            </p>
            <button
              onClick={() => handleSolveQuestion(question)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Solve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 