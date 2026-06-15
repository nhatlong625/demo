import { Navigate, useRoutes } from 'react-router-dom';
import AIChatPage from '../pages/student/AIChatPage';

function AppRouter() {
  return useRoutes([
    { path: '/', element: <Navigate to="/student/ai-tutor/chat" replace /> },
    { path: '/student', element: <Navigate to="/student/ai-tutor/chat" replace /> },
    { path: '/student/ai-tutor', element: <Navigate to="/student/ai-tutor/chat" replace /> },
    { path: '/student/ai-tutor/chat', element: <AIChatPage /> },
    { path: '/student/ai-tutor/chat/:chatId', element: <AIChatPage /> },
    { path: '*', element: <Navigate to="/student/ai-tutor/chat" replace /> },
  ]);
}

export default AppRouter;
