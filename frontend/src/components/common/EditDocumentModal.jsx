import { useState } from "react";
import { semesters } from "../../mocks/coursesMock";

export default function EditDocumentModal({ doc, onClose, onSave }) {
  const [title, setTitle] = useState(doc.name.replace(/\.[^.]+$/, ""));

  // Tìm semester hiện tại của doc
  const initSemester =
    semesters.find((s) => s.courses.includes(doc.course))?.label || "";
  const [selectedSemester, setSelectedSemester] = useState(initSemester);
  const [selectedCourse, setSelectedCourse] = useState(doc.course);

  const ext = doc.name.split(".").pop();
  const semesterObj = semesters.find((s) => s.label === selectedSemester);
  const courseOptions = semesterObj ? semesterObj.courses : [];

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
    setSelectedCourse("");
  };

  const handleSave = () => {
    onSave?.({ ...doc, name: `${title}.${ext}`, course: selectedCourse });
    onClose();
  };

  const canSave = title.trim() && selectedCourse;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-[480px] mx-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-1">
              Edit Document
            </h2>
            <p className="text-sm text-gray-400 truncate max-w-[320px]">
              {doc.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors mt-1"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 flex flex-col gap-5">
          {/* Document Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">
              Document Title
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-200 transition-all">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none"
              />
              <span className="px-3 py-3 text-sm text-gray-400 bg-gray-50 border-l border-gray-200">
                .{ext}
              </span>
            </div>
          </div>

          {/* Course */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">Course</label>
            <div className="flex gap-2">
              <select
                value={selectedSemester}
                onChange={handleSemesterChange}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition-all appearance-auto"
              >
                <option value="">Select semester...</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.label}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={!selectedSemester}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 bg-white transition-all appearance-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select course...</option>
                {courseOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File info (read-only) */}
          <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-gray-500">
              Uploaded on <span className="font-semibold">{doc.date}</span> by{" "}
              <span className="font-semibold">{doc.uploader}</span> · {doc.size}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-7 pb-7">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
