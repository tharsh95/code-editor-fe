import axios from 'axios';
import { getStdinTemplate } from './stdinTemplates';

const API_BASE_URL = 'https://onecompiler-apis.p.rapidapi.com/api/v1';
const RAPIDAPI_KEY = 'e165835b8amsh39f518c60cefed4p195814jsn6fdb0889fcc6';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'onecompiler-apis.p.rapidapi.com'
  }
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (error.response) {
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const getJobs = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
};

export const getJobDetails = async (jobId) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw new Error('Failed to fetch job details');
  }
};

export const getQuestions = async (jobId) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/jobs/${jobId}/questions`,{count:4});
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw new Error('Failed to fetch questions');
  }
};

export const submitCode = async (code, questionId) => {
  try {
    console.log('Submitting code:', { code, questionId });
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/submit`, {
      code,
      questionId,
      language: 'javascript'
    });
    console.log('Submit response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting code:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit code');
  }
};

const getFileExtension = (language) => {
  const extensions = {
    javascript: 'js',
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    php: 'php',
    csharp: 'cs',
    kotlin: 'kt',
    golang: 'go',
    r: 'r',
    typescript: 'ts',
    ruby: 'rb',
    perl: 'pl',
    swift: 'swift',
    fortran: 'f90',
    bash: 'sh'
  };
  return extensions[language] || 'txt';
};

export const runCode = async (code, language, stdin = '') => {
  try {

    const response = await api.post('/run', {
      language,
      stdin,
      files: [
        {
          name: `index.${getFileExtension(language)}`,
          content: getStdinTemplate(language, code)
        }
      ]
    });
    return response.data;
  } catch (error) {
    console.error('Run API error:', error.response?.data || error);
    throw new Error(error.response?.data?.message || 'Failed to run code');
  }
};

export const supportedLanguages = [
  'javascript'
];

export default api; 