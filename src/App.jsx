import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import JobsPage from './pages/JobsPage';
import EditorPage from './pages/EditorPage';
import QuestionsPage from './pages/QuestionsPage';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen">
        <Routes>
          <Route path="/" element={<JobsPage />} />
          <Route path="/questions/:jobId" element={<QuestionsPage />} />
          <Route path="/editor/:jobId" element={<EditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
