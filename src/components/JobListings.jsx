import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api';

export default function JobListings({ onSelectJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    jobsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchJobs(1);
  }, []);

  const fetchJobs = async (page) => {
    try {
      setLoading(true);
      const response = await getJobs(page);
      setJobs(response.data);
      setPagination(response.pagination);
    } catch {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      // Show API limit message
      setError('API LIMIT EXCEEDED');
      setTimeout(() => {
        setError(null);
      }, 2000);
    } catch {
      setError('Failed to refresh jobs');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchJobs(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Available Jobs</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {pagination.totalJobs} position{pagination.totalJobs !== 1 ? 's' : ''} available
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Refresh jobs"
            >
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {job.title}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {job.employment_type?.[0] || 'Full Time'}
                    </span>
                  </div>
                  <p className="text-xl text-gray-600">{job.organization}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Posted {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : 'recently'}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {job.remote_derived ? 'Remote' : job.locations_derived?.[0] || 'Location not specified'}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {job.questionsCount > 0 
                        ? `${job.questionsCount} question${job.questionsCount !== 1 ? 's' : ''}`
                        : 'Yet to fetch questions from OpenAI'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    job.remote_derived 
                      ? 'bg-green-50 text-green-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {job.remote_derived ? 'Remote Work' : 'On-site'}
                  </span>
                  <div className="flex flex-col items-end space-y-3">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center group bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <span className="mr-2 font-medium">View Job Details</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button
                      className="group/btn bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                      onClick={() => onSelectJob(job)}
                    >
                      <span>Apply Now</span>
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
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Job Description</h3>
                  <p className="text-gray-600 line-clamp-3">
                    {job.description_text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className={`px-4 py-2 rounded-lg flex items-center ${
              pagination.hasPrevPage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className={`px-4 py-2 rounded-lg flex items-center ${
              pagination.hasNextPage
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 