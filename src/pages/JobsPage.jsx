import JobListings from '../components/JobListings';
import { useNavigate } from 'react-router-dom';

export default function JobsPage() {
  const navigate = useNavigate();

  const handleJobSelect = (job) => {
    navigate(`/questions/${job._id}`);
  };

  return (
    <div className="h-full">
      <JobListings onSelectJob={handleJobSelect} />
    </div>
  );
} 
