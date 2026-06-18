import { useLocation } from "react-router-dom";

// Trang tạm dùng chung cho mọi route chưa được implement.
// TODO: Khi làm trang thật, tạo file riêng và thay route trong AppRouter.jsx

const PAGE_LABELS = {
  "/student/ai-tutor": "AI Tutor",
  "/student/practice-tests": "Practice Tests",
  "/student/profile": "Profile",
  "/student/settings": "Settings",
  "/student/ai-chat": "AI Chat",
  "/student/upload-document": "Upload Document",
  "/student/generate-practice-test": "Generate Practice Test",
  "/student/select-context": "Select Context",
};

export default function ComingSoonPage() {
  const location = useLocation();
  const label = PAGE_LABELS[location.pathname] || "Trang này";

  return (
    <div className="p-7 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p className="text-lg font-bold text-gray-800">{label}</p>
        <p className="text-sm text-gray-400 mt-1">Đang được phát triển</p>
      </div>
    </div>
  );
}
