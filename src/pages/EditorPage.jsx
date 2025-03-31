import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import QuestionPanel from '../components/QuestionPanel';
import ResultPanel from '../components/ResultPanel';
import { submitCode, runCode } from '../services/api';

export default function EditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runResults, setRunResults] = useState(null);
  const [stdin, setStdin] = useState('');
  const [activeTab, setActiveTab] = useState('input');
  const question = location.state?.question;
  const [panelHeight, setPanelHeight] = useState(300);
  const resizeHandleRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Initialize code from submissions if it exists
  useEffect(() => {
    console.log('Question:', question);
    console.log('Submissions:', question?.submissions);
    if (question?.submissions && Array.isArray(question.submissions) && question.submissions.length > 0) {
      const lastSubmission = question.submissions[question.submissions.length - 1];
      console.log('Last submission:', lastSubmission);
      if (lastSubmission.code) {
        setCode(lastSubmission.code);
        console.log('Setting code to:', lastSubmission.code);
      }
    }
  }, [question]);

  useEffect(() => {
    console.log('Current code state:', code);
  }, [code]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      const deltaY = startYRef.current - e.clientY;
      const newHeight = Math.max(100, Math.min(600, startHeightRef.current + deltaY));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    if (isDraggingRef.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleResizeStart = (e) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = panelHeight;
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await submitCode(code, question._id);
      setResults(response);
      setActiveTab('results');
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await runCode(code, language, stdin);
      console.log('Run response:', response);
      setRunResults(response);
      setActiveTab('results');
    } catch (err) {
      console.error('Run error:', err);
      setError(err.message || 'Failed to run code');
    } finally {
      setIsLoading(false);
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No question selected</div>
      </div>
    );
  }

  const hasSuggestions = question.submissions?.some(submission => submission.suggestions);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/jobs')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              ← Back to Jobs
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {question.title}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRun}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isLoading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || hasSuggestions}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isLoading || hasSuggestions
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? 'Submitting...' : hasSuggestions ? 'Already Submitted' : 'Submit'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-4 overflow-hidden">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-full">
            <QuestionPanel question={question} />
          </div>
          <div className="flex flex-col h-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex-1 mb-4">
              <CodeEditor
                code={code}
                language={language}
                onChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden relative"
              style={{ height: `${panelHeight}px` }}
            >
              <div 
                ref={resizeHandleRef}
                className="absolute top-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 cursor-ns-resize hover:bg-indigo-500 dark:hover:bg-indigo-400 transition-colors"
                onMouseDown={handleResizeStart}
              />
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'input'
                      ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('input')}
                >
                  Input
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === 'results'
                      ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('results')}
                >
                  Results
                </button>
              </div>
              <div className="h-[calc(100%-40px)] overflow-hidden">
                {activeTab === 'input' ? (
                  <div className="h-full p-4">
                    <h3 className="text-lg font-semibold mb-2">Input:</h3>
                    <textarea
                      value={stdin}
                      onChange={(e) => setStdin(e.target.value)}
                      placeholder="Enter input for your code..."
                      className="w-full h-[calc(100%-40px)] p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto p-4">
                    {runResults && (
                      <>
                        <div className="mb-4">
                          <h4 className="font-medium mb-1">Output:</h4>
                          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                            {runResults.stdout || 'No output'}
                          </pre>
                        </div>
                        {runResults.stderr && (
                          <div>
                            <h4 className="font-medium mb-1">Error:</h4>
                            <pre className="bg-red-100 dark:bg-red-900 p-4 rounded overflow-x-auto text-red-600 dark:text-red-300 whitespace-pre-wrap">
                              {runResults.stderr}
                            </pre>
                          </div>
                        )}
                      </>
                    )}
                    {results && (
                      <div>
                        <h4 className="font-medium mb-1">Submission Results:</h4>
                        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(results, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
} 