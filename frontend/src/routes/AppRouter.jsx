import { Navigate, useRoutes } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import StudentLayout from '../components/layout/StudentLayout';
import AdminLayout from '../components/layout/AdminLayout';
import LandingPage from '../pages/landing/LandingPage';
import GuidePage from '../pages/landing/GuidePage';
import PricingPage from '../pages/landing/PricingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// Student pages — Khang
import StudentHomePage from '../pages/student/StudentHomePage';
import CoursesPage from '../pages/student/CoursesPage';
import MyCoursesPage from '../pages/student/MyCoursesPage';
import LibraryPage from '../pages/student/LibraryPage';
import LibraryCourseDetailPage from '../pages/student/LibraryCourseDetailPage';
import DocumentViewPage from '../pages/student/DocumentViewPage';
import UploadDocumentPage from '../pages/student/UploadDocumentPage';

// Student pages — others
import AITutorPage from '../pages/student/AITutorPage';
import AIChatPage from '../pages/student/AIChatPage';
import SelectContextPage from '../pages/student/SelectContextPage';
import PracticeTestsPage from '../pages/student/PracticeTestsPage';
import GeneratePracticeTestPage from '../pages/student/GeneratePracticeTestPage';
import QuizTakingPage from '../pages/student/QuizTakingPage';
import QuizResultPage from '../pages/student/QuizResultPage';
import ProfilePage from '../pages/student/ProfilePage';
import StudentSettingsPage from '../pages/student/StudentSettingsPage';

// Admin pages
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
      element: <PublicLayout />,
      children: [
        { index: true, element: <LandingPage /> },
        { path: 'guide', element: <GuidePage /> },
        { path: 'pricing', element: <PricingPage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        { path: 'forgot-password', element: <ForgotPasswordPage /> },
        { path: 'verify-email', element: <VerifyEmailPage /> },
      ],
    },
    {
      path: '/student',
      element: <StudentLayout />,
      children: [
        { index: true, element: <Navigate to="/student/home" replace /> },
        // Khang
        { path: 'home', element: <StudentHomePage /> },
        { path: 'courses', element: <CoursesPage /> },
        { path: 'courses/:courseId', element: <CoursesPage /> },
        { path: 'my-courses', element: <MyCoursesPage /> },
        { path: 'library', element: <LibraryPage /> },
        { path: 'library/:courseId', element: <LibraryCourseDetailPage /> },
        { path: 'documents/:documentId', element: <DocumentViewPage /> },
        { path: 'upload-document', element: <UploadDocumentPage /> },
        // Others
        { path: 'ai-tutor', element: <AITutorPage /> },
        { path: 'ai-tutor/chat', element: <AIChatPage /> },
        { path: 'ai-tutor/chat/:threadId', element: <AIChatPage /> },
        { path: 'ai-tutor/select-context', element: <SelectContextPage /> },
        { path: 'practice-tests', element: <PracticeTestsPage /> },
        { path: 'practice-tests/generate', element: <GeneratePracticeTestPage /> },
        { path: 'quiz', element: <QuizTakingPage /> },
        { path: 'quiz/:quizId', element: <QuizTakingPage /> },
        { path: 'quiz/result', element: <QuizResultPage /> },
        { path: 'quiz/:quizId/result', element: <QuizResultPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'settings', element: <StudentSettingsPage /> },
      ],
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
    { path: '*', element: <Navigate to="/" replace /> },
  ]);
}

export default AppRouter;
