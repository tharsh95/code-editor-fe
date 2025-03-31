// Mock service to simulate code submission and execution

/**
 * Simulates code submission and execution with a delay
 * @param {string} code - The code to execute
 * @param {string} language - The programming language
 * @returns {Promise} - Promise that resolves with execution results
 */
export const submitCode = async (code, language) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock test cases for the Two Sum problem
  const testCases = [
    {
      input: 'nums = [2,7,11,15], target = 9',
      expected: '[0,1]',
      output: '[0,1]',
      passed: true
    },
    {
      input: 'nums = [3,2,4], target = 6',
      expected: '[1,2]',
      output: '[1,2]',
      passed: true
    },
    {
      input: 'nums = [3,3], target = 6',
      expected: '[0,1]',
      output: '[0,1]',
      passed: true
    }
  ];
  
  // Randomly decide if the submission passes or fails (for demo purposes)
  const isSuccess = Math.random() > 0.3;
  
  if (isSuccess) {
    return {
      status: 'success',
      message: 'All test cases passed!',
      testCases,
      runtime: `${Math.floor(Math.random() * 100)} ms`,
      memory: `${Math.floor(Math.random() * 10) + 40} MB`
    };
  } else {
    // If failure, make one test case fail
    const failedTestIndex = Math.floor(Math.random() * testCases.length);
    const testCasesCopy = [...testCases];
    
    testCasesCopy[failedTestIndex] = {
      ...testCasesCopy[failedTestIndex],
      output: `[${failedTestIndex},${failedTestIndex + 2}]`,
      passed: false
    };
    
    return {
      status: 'error',
      message: 'Some test cases failed.',
      testCases: testCasesCopy,
      runtime: `${Math.floor(Math.random() * 100)} ms`,
      memory: `${Math.floor(Math.random() * 10) + 40} MB`
    };
  }
};

/**
 * Gets a list of supported languages
 * @returns {Array} - List of supported languages
 */
export const getSupportedLanguages = () => {
  return [
    { id: 'javascript', name: 'JavaScript', value: 'javascript' },
    { id: 'typescript', name: 'TypeScript', value: 'typescript' },
    { id: 'python', name: 'Python', value: 'python' },
    { id: 'java', name: 'Java', value: 'java' },
    { id: 'cpp', name: 'C++', value: 'cpp' },
    { id: 'csharp', name: 'C#', value: 'csharp' }
  ];
}; 