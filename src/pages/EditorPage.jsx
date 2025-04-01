import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import QuestionPanel from "../components/QuestionPanel";
import ResultPanel from "../components/ResultPanel";
import Suggestions from "../components/Suggestions";
import { submitCode, runCode } from "../services/api";
import ReactMarkdown from "react-markdown";

export default function EditorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runResults, setRunResults] = useState(null);
  const [stdin, setStdin] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [copySuccess, setCopySuccess] = useState({});
  const question = location.state?.question;
  const [activeMainTab, setActiveMainTab] = useState("question");

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  // Initialize code from submissions if it exists
  useEffect(() => {
    if (
      question?.submissions &&
      Array.isArray(question.submissions) &&
      question.submissions.length > 0
    ) {
      const lastSubmission =
        question.submissions[question.submissions.length - 1];
      if (lastSubmission.code) {
        setCode(lastSubmission.code);
      }
    }
  }, [question]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    console.log(code,'211')
    try {
      const response = await submitCode(code, question._id);
      setResults(response);
      setActiveTab("results");

      // Show success message and stay on the page
      setError("Solution submitted successfully!");
      setTimeout(() => {
        setError(null);
      }, 2000);
      navigate(`/questions/${jobId}`);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to submit code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await runCode(code, 'javascript', stdin);

      setRunResults(response);
      setActiveTab("results");
    } catch (err) {
      console.error("Run error:", err);
      setError(err.message || "Failed to run code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopySuccess((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setError("Failed to copy to clipboard");
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No question selected</div>
      </div>
    );
  }

  const hasSuggestions = question.submissions?.some(
    (submission) => submission.suggestions
  );

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(`/questions/${jobId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-8 group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Questions
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{question.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeMainTab === "question"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMainTab("question")}
                >
                  Question Description
                </button>
                <button
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeMainTab === "suggestions"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMainTab("suggestions")}
                >
                  Suggestions
                </button>
              </div>

              <div className="p-8">
                {activeMainTab === "question" ? (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                        Question Description
                      </h2>
                      <div className="prose max-w-none">
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {question.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                        Example
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              Input:
                            </h3>
                            <button
                              onClick={() =>
                                handleCopyToClipboard(
                                  JSON.stringify(
                                    question.examples[0].input,
                                    null,
                                    2
                                  ),
                                  "example-input"
                                )
                              }
                              className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                              </svg>
                              {copySuccess["example-input"]
                                ? "Copied!"
                                : "Copy"}
                            </button>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                              {JSON.stringify(
                                question.examples[0].input,
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              Output:
                            </h3>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                              {JSON.stringify(
                                question.examples[0].output,
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                        Test Cases
                      </h2>
                      <div className="space-y-4">
                        {question.test_cases &&
                          question.test_cases.map((testCase, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                  Test Case {index + 1}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  {testCase.is_hidden && (
                                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                      Hidden
                                    </span>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleCopyToClipboard(
                                        testCase.input,
                                        `test-input-${index}`
                                      )
                                    }
                                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                      />
                                    </svg>
                                    {copySuccess[`test-input-${index}`]
                                      ? "Copied!"
                                      : "Copy Input"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCopyToClipboard(
                                        testCase.output,
                                        `test-output-${index}`
                                      )
                                    }
                                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                      />
                                    </svg>
                                    {copySuccess[`test-output-${index}`]
                                      ? "Copied!"
                                      : "Copy Output"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[800px] overflow-y-auto">
                    {question?.submissions && question.submissions.length > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-2xl font-semibold text-gray-900">
                            Improvement Suggestions
                          </h2>
                          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            {question.submissions.length} submissions
                          </span>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6">
                          <ul className="space-y-6">
                            {question.submissions.map((submission, index) => (
                              <li key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start space-x-3">
                                  <svg
                                    className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm text-gray-500 mb-2">
                                      Submission {index + 1}
                                    </div>
                                    <div className="prose prose-sm max-w-none break-words">
                                      {submission.suggestions ? (
                                        <div className="text-blue-800">
                                          <ReactMarkdown
                                            components={{
                                              p: ({ children }) => <p className="mb-2">{children}</p>,
                                              ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                              li: ({ children }) => <li className="mb-1">{children}</li>,
                                              code: ({ children }) => (
                                                <code className="bg-blue-100 px-1 rounded text-blue-800">{children}</code>
                                              ),
                                              pre: ({ children }) => (
                                                <pre className="bg-blue-100 p-2 rounded mb-2 overflow-x-auto">{children}</pre>
                                              ),
                                              blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-blue-300 pl-4 italic my-2">{children}</blockquote>
                                              ),
                                              h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                                              h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                                              h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
                                            }}
                                          >
                                            {submission.suggestions}
                                          </ReactMarkdown>
                                        </div>
                                      ) : (
                                        <div className="text-gray-500 italic">
                                          No suggestions available for this submission
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No suggestions available yet. Submit your solution to
                          get feedback.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Code Editor
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleRun}
                    disabled={isLoading}
                    className="px-6 py-2 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Run Code
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || hasSuggestions}
                    className="px-6 py-2 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Solution
                  </button>
                </div>
              </div>

              <div className="h-[500px] overflow-hidden">
                <CodeEditor
                  code={code}
                  language={"javascript"}
                  onChange={handleCodeChange}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === "input"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("input")}
                >
                  Input
                </button>
                <button
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === "results"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("results")}
                >
                  Results
                </button>
              </div>

              <div className="h-[300px] overflow-y-auto">
                {activeTab === "input" ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Test Input
                    </h3>
                    <textarea
                      value={stdin}
                      onChange={(e) => setStdin(e.target.value)}
                      placeholder="Enter test input here..."
                      className="w-full h-[250px] text-black p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Output
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                        {runResults && runResults.stdout
                          ? (() => {
                              try {
                                const parsed = JSON.parse(runResults.stdout);
                                // Check if the parsed value is undefined
                                if (parsed === undefined) {
                                  return "undefined";
                                }
                                // Check if the parsed value is an object or array
                                if (typeof parsed === 'object' && parsed !== null) {
                                  return JSON.stringify(parsed, null, 2);
                                }
                                // If it's a simple value (number, string, etc.), return it directly
                                return parsed.toString();
                              } catch {
                                // If parsing fails, return the original stdout
                                return runResults.stdout;
                              }
                            })()
                          : "No output"}
                      </pre>
                    </div>
                    {runResults?.stderr && (
                      <div>
                        <h3 className="text-lg font-medium text-red-900">
                          Error
                        </h3>
                        <div className="bg-red-50 rounded-lg p-4">
                          <pre className="text-red-700 whitespace-pre-wrap font-mono text-sm">
                            {runResults.stderr}
                          </pre>
                        </div>
                      </div>
                    )}
                    {results && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Submission Results
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-gray-700 whitespace-pre-wrap font-mono text-sm">
                            {JSON.stringify(results, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                <h2 className="text-2xl font-semibold mb-4 text-red-900">
                  Error
                </h2>
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
