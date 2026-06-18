import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { useState } from "react";
import { myLibraryDocs } from "../../mocks/documentsMock";
import HomeCourseUploadModal from "../../components/common/HomeCourseUploadModal";

// Group docs by semester
function groupBySemester(docs) {
  const map = {};
  docs.forEach((doc) => {
    if (!map[doc.semester]) map[doc.semester] = [];
    map[doc.semester].push(doc);
  });
  // Sắp xếp theo thứ tự semester
  const order = [
    "Other",
    "Semester 0",
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
    "Semester 9",
  ];
  return order
    .filter((s) => map[s])
    .map((s) => ({ semester: s, docs: map[s] }));
}

const SEMESTER_BADGE = {
  Other: { bg: "bg-yellow-100", text: "text-yellow-700", id: "S0" },
  "Semester 0": { bg: "bg-yellow-100", text: "text-yellow-700", id: "S0" },
  "Semester 1": { bg: "bg-cyan-100", text: "text-cyan-600", id: "S1" },
  "Semester 2": { bg: "bg-orange-100", text: "text-orange-500", id: "S2" },
  "Semester 3": { bg: "bg-green-100", text: "text-green-600", id: "S3" },
  "Semester 4": { bg: "bg-purple-100", text: "text-purple-600", id: "S4" },
  "Semester 5": { bg: "bg-blue-100", text: "text-blue-600", id: "S5" },
  "Semester 6": { bg: "bg-pink-100", text: "text-pink-600", id: "S6" },
  "Semester 7": { bg: "bg-indigo-100", text: "text-indigo-600", id: "S7" },
  "Semester 8": { bg: "bg-red-100", text: "text-red-600", id: "S8" },
  "Semester 9": { bg: "bg-teal-100", text: "text-teal-600", id: "S9" },
};

const FolderIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export default function LibraryPage() {
  const navigate = useNavigate();
  const onCourseClick = (courseId, semester) =>
    navigate(`/student/library/${courseId}`);
  const [showUpload, setShowUpload] = useState(false);
  const [docs] = useState(myLibraryDocs);

  const grouped = groupBySemester(docs);
  const totalFiles = docs.length;
  const totalCourses = new Set(docs.map((d) => d.course)).size;
  const totalPublic = docs.filter((d) => d.isPublic).length;

  return (
    <div className="p-7 bg-gray-50 min-h-screen">
      {showUpload && (
        <HomeCourseUploadModal
          courseId="Library"
          mode="create"
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Header */}
      <PageHeader
        title="Library"
        description="Documents uploaded by me, organized by semester."
        action={
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Semester
          </button>
        }
      />

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {
            icon: (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="1.8"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            ),
            bg: "bg-indigo-50",
            value: totalFiles,
            label: "FILES",
          },
          {
            icon: (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="1.8"
              >
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
            ),
            bg: "bg-purple-50",
            value: "3.2GB",
            sub: "/ 10GB",
            label: "STORAGE USED",
            progress: 32,
          },
          {
            icon: (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b45309"
                strokeWidth="1.8"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
              </svg>
            ),
            bg: "bg-amber-50",
            value: totalCourses,
            label: "COURSES",
          },
          {
            icon: (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="1.8"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            ),
            bg: "bg-indigo-50",
            value: totalPublic,
            label: "PUBLIC FILES",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}
            >
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-gray-900">
                  {s.value}
                </span>
                {s.sub && (
                  <span className="text-sm text-gray-400 font-medium">
                    {s.sub}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                {s.label}
              </p>
              {s.progress && (
                <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_130px_100px] px-5 py-3 bg-indigo-50 border-b border-indigo-100">
          {["SEMESTER & COURSES", "SUBJECTS", "FILES"].map((h) => (
            <span
              key={h}
              className={`text-[11px] font-bold tracking-wider text-gray-400 uppercase ${h !== "SEMESTER & COURSES" ? "text-center block" : ""}`}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {grouped.map(({ semester, docs: semDocs }, i) => {
          const badge =
            SEMESTER_BADGE[semester] || SEMESTER_BADGE["Semester 1"];
          const courses = [...new Set(semDocs.map((d) => d.course))];
          const fileCount = semDocs.length;

          return (
            <div
              key={semester}
              className={`grid grid-cols-[1fr_130px_100px] px-5 py-5 items-center hover:bg-gray-50 transition-colors ${i < grouped.length - 1 ? "border-b border-gray-200" : ""}`}
            >
              {/* Col 1: Semester + courses */}
              <div className="flex gap-4 items-start pr-12">
                <div
                  className={`w-11 h-11 rounded-xl ${badge.bg} ${badge.text} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}
                >
                  {badge.id}
                </div>
                <div>
                  <div className="text-base font-black text-indigo-600 mb-2">
                    {semester}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, max-content)",
                      gap: "6px 20px",
                    }}
                  >
                    {courses.map((c) => (
                      <a
                        key={c}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onCourseClick?.(c, semester);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-600 hover:underline transition-colors"
                      >
                        <span className="text-indigo-400">
                          <FolderIcon />
                        </span>
                        {c}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 2: Subjects = unique courses */}
              <div className="flex justify-center items-center border-l border-gray-200 self-stretch py-2">
                <span className="text-xl font-black text-red-500">
                  {courses.length}
                </span>
              </div>

              {/* Col 3: Files uploaded */}
              <div className="flex justify-center items-center border-l border-gray-200 self-stretch py-2">
                <span className="text-xl font-black text-red-500">
                  {fileCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
