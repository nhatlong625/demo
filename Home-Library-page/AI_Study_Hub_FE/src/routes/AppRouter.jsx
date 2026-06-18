import { Navigate, useRoutes } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import StudentLayout from "../components/layout/StudentLayout";
import ScrollToTop from "./ScrollToTop";

// Landing (placeholder)
import FeaturesPage from "../pages/landing/FeaturesPage";
import GuidePage from "../pages/landing/GuidePage";
import PricingPage from "../pages/landing/PricingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ResetSuccessPage from "../pages/auth/ResetSuccessPage";

// Student (Khang làm)
import HomePage from "../pages/student/HomePage";
import HomeCourseDetailPage from "../pages/student/HomeCourseDetailPage";
import LibraryPage from "../pages/student/LibraryPage";
import LibraryCourseDetailPage from "../pages/student/LibraryCourseDetailPage";
import DocumentViewPage from "../pages/student/DocumentViewPage";
import ComingSoonPage from "../pages/student/ComingSoonPage";
import AITutorPage from "../pages/student/AITutorPage";

function AppRouter() {
  const routes = useRoutes([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { index: true, element: <Navigate to="/features" replace /> },
        { path: "features", element: <FeaturesPage /> },
        { path: "guide", element: <GuidePage /> },
        { path: "pricing", element: <PricingPage /> },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "forgot-password", element: <ForgotPasswordPage /> },
        { path: "verify-email", element: <VerifyEmailPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "reset-success", element: <ResetSuccessPage /> },
      ],
    },
    {
      path: "/student",
      element: <StudentLayout />,
      children: [
        { index: true, element: <Navigate to="/student/home" replace /> },
        { path: "home", element: <HomePage /> },
        { path: "ai-tutor", element: <AITutorPage /> },
        { path: "practice-tests", element: <ComingSoonPage /> },
        { path: "courses/:courseId", element: <HomeCourseDetailPage /> },
        { path: "library", element: <LibraryPage /> },
        { path: "library/:courseId", element: <LibraryCourseDetailPage /> },
        { path: "documents/:documentId", element: <DocumentViewPage /> },
        { path: "upload-document", element: <ComingSoonPage /> },
        { path: "ai-chat", element: <ComingSoonPage /> },
        { path: "profile", element: <ComingSoonPage /> },
        { path: "settings", element: <ComingSoonPage /> },
        { path: "quiz/:quizId", element: <ComingSoonPage /> },
        { path: "quiz/:quizId/result", element: <ComingSoonPage /> },
        { path: "generate-practice-test", element: <ComingSoonPage /> },
        { path: "select-context", element: <ComingSoonPage /> },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return (
    <>
      <ScrollToTop />
      {routes}
    </>
  );
}

export default AppRouter;
