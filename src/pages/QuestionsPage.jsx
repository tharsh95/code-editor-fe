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
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to fetch questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [jobId]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-blue-600 mr-8 group transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Jobs
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Choose a Question to Solve</h1>
        </div>

        <div className="space-y-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="w-full bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 border border-gray-100 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {question.title}
                  </h2>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {question.submissions?.length || 0} submission{question.submissions?.length !== 1 ? 's' : ''}
                    </span>
                    {question.submissions?.length > 0 && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                {console.log(question,'211')}
                <button
                  onClick={() => navigate(`/editor/${jobId}/${question._id}`, { state: { question } })}
                  className="group/btn px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2 ml-6"
                >
                  <span>{question.submissions?.length > 0 ? 'View Solution' : 'Solve Question'}</span>
                  <svg 
                    className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
                <p className="text-gray-600 line-clamp-3">
                  {question.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 