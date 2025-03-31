import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api';

export default function JobListings({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const {data} = await getJobs();
        console.log('Fetched jobs:', data);
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Available Jobs</h1>
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{job.company}</p>
                </div>
                <span className="text-gray-500 dark:text-gray-400">
                  {job.location} • {job.type}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                  {job.description_text}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  View Job Details →
                </a>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  onClick={() => onSelectJob(job)}
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 