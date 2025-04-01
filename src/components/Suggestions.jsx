import React from 'react';
import ReactMarkdown from 'react-markdown';

const Suggestions = ({ results }) => {
  if (!results || !results.suggestions) {
    return null;
  }
  console.log(results.suggestions, "results");

  return (
    <div className="suggestions-panel">
      <h3> Suggestions</h3>
      <div className="suggestions-content">

          <div className="suggestion-item">
            <ReactMarkdown>{results.suggestions}</ReactMarkdown>
          </div>

      </div>
    </div>
  );
};

export default Suggestions; 