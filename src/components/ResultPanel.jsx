import React from 'react';

export default function ResultPanel({ results }) {
  if (!results) return null;

  // Check if this is a run result (has stdout/stderr) or submission result (has testCases)
  const isRunResult = 'stdout' in results || 'stderr' in results;
  const isSubmissionResult = 'testCases' in results;

  return (
    <div className="space-y-4">
      {isSubmissionResult && (
        <>
          <h3 className="text-lg font-semibold">Submission Results:</h3>
          <div className="space-y-2">
            <h4 className="font-medium">Test Cases:</h4>
            {results.testCases?.map((testCase, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  testCase.passed
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">
                    Test Case {index + 1}
                    {testCase.passed ? ' ✓' : ' ✗'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {testCase.executionTime}ms
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Input:</span>
                    <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(testCase.input, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <span className="font-medium">Expected Output:</span>
                    <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                      {JSON.stringify(testCase.expectedOutput, null, 2)}
                    </pre>
                  </div>
                  {!testCase.passed && (
                    <div>
                      <span className="font-medium">Your Output:</span>
                      <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                        {JSON.stringify(testCase.actualOutput, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isRunResult && (
        <>
          <h3 className="text-lg font-semibold">Run Results:</h3>
          {results.stdout && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Console Output:</h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
                {results.stdout}
              </pre>
            </div>
          )}

          {results.stderr && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Error Output:</h4>
              <pre className="bg-red-50 dark:bg-red-900/20 p-4 rounded overflow-x-auto text-red-600 dark:text-red-300">
                {results.stderr}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
} 