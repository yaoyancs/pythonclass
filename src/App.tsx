import { Route, Routes } from 'react-router-dom';
import { ClassroomPage, LegacyClassroomRedirect } from './pages/ClassroomPage';
import { HomePage } from './pages/HomePage';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson/:lessonId" element={<ClassroomPage />} />
        <Route path="/classroom" element={<LegacyClassroomRedirect />} />
      </Routes>
    </ErrorBoundary>
  );
}
