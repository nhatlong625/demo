import { Navigate, useRoutes } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import LibraryManagementPage from '../pages/admin/LibraryManagementPage';
import PracticeTestManagementPage from '../pages/admin/PracticeTestManagementPage';
import QuestionReviewQueuePage from '../pages/admin/QuestionReviewQueuePage';
import DocumentManagementPage from '../pages/admin/DocumentManagementPage';
import PaymentManagementPage from '../pages/admin/PaymentManagementPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

function AppRouter() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/admin/dashboard" replace />,
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="/admin/dashboard" replace /> },
        { path: 'dashboard', element: <AdminDashboardPage /> },
        { path: 'users', element: <UserManagementPage /> },
        { path: 'library', element: <LibraryManagementPage /> },
        { path: 'practice-tests', element: <PracticeTestManagementPage /> },
        { path: 'question-review', element: <QuestionReviewQueuePage /> },
        { path: 'documents', element: <DocumentManagementPage /> },
        { path: 'payments', element: <PaymentManagementPage /> },
        { path: 'settings', element: <AdminSettingsPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/admin/dashboard" replace /> },
  ]);
}

export default AppRouter;
