import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { useState, useMemo } from "react";
import { useHistoryContext } from "../../hooks/useHistory";
import { semesters } from "../../mocks/coursesMock";
import { generateCourseFiles } from "../../mocks/documentsMock";

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

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.6" />
    <path
      d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default function StudentHomePage() {
  const navigate = useNavigate();
  const onCourseClick = (courseId, semester) =>
    navigate(`/student/courses/${courseId}`);
  const historyCtx = useHistoryContext();
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");

  const filtered = useMemo(() => {
    return semesters.filter(
      (sem) =>
        selectedSemester === "All Semesters" || sem.label === selectedSemester,
    );
  }, [selectedSemester]);
  return (
    <div className="p-7 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <PageHeader
        title="Home"
        description="Browse all courses organized by semester"
        action={
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none cursor-pointer focus:border-indigo-400 transition-all"
            >
              <option>All Semesters</option>
              {semesters.map((s) => (
                <option key={s.id}>{s.label}</option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        }
      />

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_130px_130px_350px] px-5 py-3 border-b border-indigo-100 bg-indigo-50">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            Semester &amp; Courses
          </span>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase text-center block">
            Subjects
          </span>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase text-center block">
            Files
          </span>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase pl-8">
            Recent File
          </span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mb-3 opacity-40"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p className="text-sm font-medium">No courses found</p>
            <button
              onClick={() => setSelectedSemester("All Semesters")}
              className="mt-3 text-xs text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((sem, i) => (
            <div
              key={sem.id}
              className={`grid grid-cols-[1fr_130px_130px_350px] px-5 py-5 items-center hover:bg-gray-50 transition-colors ${i < filtered.length - 1 ? "border-b border-gray-200" : ""}`}
            >
              {/* Col 1 */}
              <div className="flex gap-4 items-start pr-12 text-left">
                <div
                  className={`w-11 h-11 rounded-xl ${sem.badgeBg} ${sem.badgeText} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}
                >
                  {sem.id}
                </div>
                <div>
                  <div className="text-base font-black text-indigo-600 mb-2">
                    {sem.label}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(6, max-content)",
                      gap: "6px 20px",
                    }}
                  >
                    {sem.courses.map((c) => (
                      <a
                        key={c}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onCourseClick?.(c, sem.label);
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

              {/* Col 2 */}
              <div className="w-full flex justify-center items-center border-l border-gray-200 self-stretch py-2">
                <span className="text-xl font-black text-red-500">
                  {sem.subjects}
                </span>
              </div>

              {/* Col 3 */}
              <div className="w-full flex justify-center items-center border-l border-gray-200 self-stretch py-2">
                <span className="text-xl font-black text-red-500">
                  {sem.files.toLocaleString()}
                </span>
              </div>

              {/* Col 4 */}
              <div className="flex items-center gap-2.5 pl-8 border-l border-gray-200 self-stretch py-2">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center flex-shrink-0">
                  <UserIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 leading-snug break-words">
                    {(() => {
                      const idx = filtered.indexOf(sem);
                      const course = sem.courses[idx % sem.courses.length];
                      const files = generateCourseFiles(course, 9);
                      return files[idx % files.length]?.name || "-";
                    })()}
                  </span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {(() => {
                      const idx = filtered.indexOf(sem);
                      const course = sem.courses[idx % sem.courses.length];
                      const files = generateCourseFiles(course, 9);
                      const f = files[idx % files.length];
                      return f ? `${f.date} • ${f.uploader}` : "-";
                    })()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
