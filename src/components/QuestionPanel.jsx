import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function QuestionPanel({ question }) {
  const [activeTab, setActiveTab] = useState('description');

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">No question selected</div>
      </div>
    );
  }

  const markdownComponents = {
    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">{children}</h3>,
    p: ({ children }) => <p className="mb-4 text-gray-800 dark:text-gray-200">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-800 dark:text-gray-200">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-gray-800 dark:text-gray-200">{children}</ol>,
    li: ({ children }) => <li className="mb-1 text-gray-800 dark:text-gray-200">{children}</li>,
    code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{children}</code>,
    pre: ({ children }) => <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 overflow-x-auto text-gray-800 dark:text-gray-200">{children}</pre>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-800 dark:text-gray-200">{children}</blockquote>,
    a: ({ children, href }) => <a href={href} className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline">{children}</a>,
    table: ({ children }) => <table className="w-full border-collapse mb-4 text-gray-800 dark:text-gray-200">{children}</table>,
    th: ({ children }) => <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold">{children}</th>,
    td: ({ children }) => <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{children}</td>,
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-none border-b border-gray-200 dark:border-gray-700">
        <div className="flex p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex-grow">
            {question.title}
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
            ${question.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
              question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
            {question.difficulty}
          </span>
        </div>
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'description'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'suggestions'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {activeTab === 'description' ? (
            <div className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">{question.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Examples:</h3>
                <div className="space-y-4">
                  {question.examples.map((example, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                      <div className="font-mono text-sm">
                        <div>
                          <span className="font-semibold">Input:</span>
                          <pre className="mt-1 bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm overflow-x-auto">
                            {JSON.stringify(example.input, null, 2)}
                          </pre>
                        </div>
                        <div><span className="font-semibold">Output:</span> {JSON.stringify(example.output, null, 2)}</div>
                        {example.explanation && (
                          <div><span className="font-semibold">Explanation:</span> {example.explanation}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Constraints:</h3>
                <ul className="list-disc list-inside space-y-1 font-mono text-sm">
                  {question.constraints.map((constraint, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              {question.submissions?.suggestions ? (
                <div className="space-y-4">
                  {question.submissions.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <ReactMarkdown components={markdownComponents}>
                        {suggestion}
                      </ReactMarkdown>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white mb-2">Suggestions:</h3>
                  <ul className="list-disc list-inside space-y-1 font-mono text-sm">
                    {question.submissions.map((constraint, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        <ReactMarkdown components={markdownComponents}>
                          {constraint.suggestions}
                        </ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 