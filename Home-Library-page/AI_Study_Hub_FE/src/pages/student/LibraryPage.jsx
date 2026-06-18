import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { useState, useEffect } from "react";
import HomeCourseUploadModal from "../../components/common/HomeCourseUploadModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { semesterApi, subjectApi } from "../../services/api";

const SEMESTER_BADGE = {
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
  const [grouped, setGrouped] = useState([]);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  useEffect(() => {
    semesterApi.getAll().then((data) => {
      const formatted = data.map((sem) => ({
        semester: sem.semesterName,
        semesterId: sem.semesterId,
        courses: sem.subjects.map((sub) => sub.subjectName),
        subjectMap: Object.fromEntries(
          sem.subjects.map((sub) => [sub.subjectName, sub.subjectId]),
        ),
      }));
      setGrouped(formatted);
    });
  }, []);

  function handleCourseCreated(semesterName, courseCode) {
    const sem = grouped.find((s) => s.semester === semesterName);
    if (!sem) return;

    subjectApi.add(sem.semesterId, courseCode).then((newSubject) => {
      setGrouped((prev) =>
        prev.map((s) =>
          s.semester === semesterName && !s.courses.includes(courseCode)
            ? {
                ...s,
                courses: [...s.courses, courseCode].sort(),
                subjectMap: {
                  ...s.subjectMap,
                  [courseCode]: newSubject.subjectId,
                },
              }
            : s,
        ),
      );
    });
  }

  function handleDeleteCourse(semesterName, courseCode) {
    setConfirmDialog({
      title: "Delete course ?",
      fileName: courseCode,
      onConfirm: () => {
        const sem = grouped.find((s) => s.semester === semesterName);
        if (!sem) return;
        const subjectId = sem.subjectMap?.[courseCode];
        if (!subjectId) return;

        subjectApi.delete(subjectId).then(() => {
          setGrouped((prev) =>
            prev.map((s) =>
              s.semester === semesterName
                ? { ...s, courses: s.courses.filter((c) => c !== courseCode) }
                : s,
            ),
          );
          setConfirmDialog(null);
        });
      },
    });
  }

  const totalCourses = grouped.reduce((sum, s) => sum + s.courses.length, 0);
  const totalFiles = 0;
  const totalStorageBytes = 0;
  const totalStorageMB = "0.0";
  const totalStorageGB = "0.00";
  const storagePercent = "0.0";

  return (
    <div className="p-7 bg-gray-50 min-h-screen">
      {confirmDialog && (
        <ConfirmDialog
          type="delete"
          title={confirmDialog.title}
          fileName={confirmDialog.fileName}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
      {showCreateCourse && (
        <HomeCourseUploadModal
          mode="createCourse"
          onClose={() => setShowCreateCourse(false)}
          onCreated={({ semesterName, courseCode }) => {
            handleCourseCreated(semesterName, courseCode);
            setShowCreateCourse(false);
          }}
        />
      )}

      <PageHeader
        title="Library"
        description="My courses organized by semester."
        action={
          <button
            onClick={() => setShowCreateCourse(true)}
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
            Create course
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
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
          </div>
          <div>
            <span className="text-xl font-black text-gray-900">
              {totalFiles}
            </span>
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              FILES
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
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
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-gray-900">
                {totalStorageBytes < 1024 * 1024 * 1024
                  ? totalStorageMB + "MB"
                  : totalStorageGB + "GB"}
              </span>
              <span className="text-xl font-black text-gray-400">/ 10GB</span>
            </div>
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              STORAGE USED
            </p>
            <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: storagePercent + "%" }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="1.8"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-black text-gray-900">
              {totalCourses}
            </span>
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              COURSES
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#b45309"
              strokeWidth="1.8"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-black text-gray-900">0</span>
            <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              GENERATED
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="grid grid-cols-[1fr_130px_100px_80px] px-5 py-3 bg-indigo-50 border-b border-indigo-100">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
            SEMESTER &amp; COURSES
          </span>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase text-center">
            COURSES
          </span>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase text-center">
            FILES
          </span>
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase text-center">
            ACTION
          </span>
        </div>

        {grouped.map(({ semester, courses }, i) => {
          const badge = SEMESTER_BADGE[semester];
          return (
            <div
              key={semester}
              className={
                "grid grid-cols-[1fr_130px_100px_80px] px-5 py-5 items-center hover:bg-gray-50 transition-colors" +
                (i < grouped.length - 1 ? " border-b border-gray-200" : "")
              }
            >
              <div className="flex gap-4 items-start pr-8">
                <div
                  className={
                    "w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 " +
                    badge.bg +
                    " " +
                    badge.text
                  }
                >
                  {badge.id}
                </div>
                <div className="flex-1">
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
                      <div key={c} className="flex items-center">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/student/library/" + c);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:underline transition-colors"
                        >
                          <span className="text-indigo-400">
                            <FolderIcon />
                          </span>
                          {c}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center border-l border-gray-200 self-stretch py-2">
                <span className="text-xl font-black text-red-500">
                  {courses.length}
                </span>
              </div>

              <div className="flex justify-center items-center border-l border-gray-200 self-stretch py-2">
                <span className="text-xl font-black text-red-500">0</span>
              </div>

              <div className="flex justify-center items-center border-l border-gray-200 self-stretch py-2">
                <CourseActionMenu
                  courses={courses}
                  onDeleteCourse={(courseCode) =>
                    handleDeleteCourse(semester, courseCode)
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourseActionMenu({ courses, onDeleteCourse }) {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  if (courses.length === 0)
    return (
      <button
        disabled
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 cursor-not-allowed"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
    );

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          setSubmenuOpen(false);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setOpen(false);
              setSubmenuOpen(false);
            }}
          />
          <div className="absolute right-0 z-20 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => setSubmenuOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors whitespace-nowrap"
            >
              <span className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Delete course
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={
                  "transition-transform " + (submenuOpen ? "rotate-90" : "")
                }
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {submenuOpen && (
              <div className="border-t border-gray-100 max-h-60 overflow-y-auto">
                {courses.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onDeleteCourse(c);
                      setOpen(false);
                      setSubmenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
