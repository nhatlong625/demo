import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import DocumentActionMenu from "../../components/common/DocumentActionMenu";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EditDocumentModal from "../../components/common/EditDocumentModal";
import { documentApi, semesterApi } from "../../services/api";

const AVATAR_COLORS = [
  "bg-indigo-400",
  "bg-purple-400",
  "bg-blue-400",
  "bg-orange-400",
  "bg-green-400",
  "bg-pink-400",
  "bg-teal-400",
  "bg-gray-500",
];

function getAvatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

const ITEMS_PER_PAGE = 9;

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={
      "relative inline-flex w-10 h-5 rounded-full transition-colors " +
      (checked ? "bg-indigo-600" : "bg-gray-300")
    }
  >
    <span
      className={
        "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform " +
        (checked ? "translate-x-5" : "translate-x-0")
      }
    />
  </button>
);

export default function LibraryCourseDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const subjectName = params.courseId;

  const [subjectId, setSubjectId] = useState(null);
  const [semesterName, setSemesterName] = useState("My Library");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [editDoc, setEditDoc] = useState(null);

  // Lấy subjectId từ tên subject, sau đó load documents
  useEffect(() => {
    semesterApi.getAll().then((data) => {
      for (const sem of data) {
        const found = sem.subjects.find((s) => s.subjectName === subjectName);
        if (found) {
          setSubjectId(found.subjectId);
          setSemesterName(sem.semesterName);
          documentApi.getBySubject(found.subjectId).then((docs) => {
            setDocs(docs);
            setLoading(false);
          });
          return;
        }
      }
      setLoading(false);
    });
  }, [subjectName]);

  const totalPages = Math.max(1, Math.ceil(docs.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = docs.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const pageNums = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - 1 && i <= safePage + 1)
      )
        arr.push(i);
      else if (arr[arr.length - 1] !== "...") arr.push("...");
    }
    return arr;
  }, [totalPages, safePage]);

  function handleDelete(doc) {
    documentApi.delete(doc.documentId).then(() => {
      setDocs((prev) => prev.filter((d) => d.documentId !== doc.documentId));
      setDialog(null);
    });
  }

  function handleUpdate(doc, title, visibilityStatus) {
    // Nếu visibility thay đổi thì gọi API
    if (doc.visibilityStatus !== visibilityStatus) {
      documentApi.updateVisibility(doc.documentId, visibilityStatus);
    }
    setDocs((prev) =>
      prev.map((d) =>
        d.documentId === doc.documentId ? { ...d, title, visibilityStatus } : d,
      ),
    );
    setEditDoc(null);
  }

  return (
    <div className="p-7 bg-gray-50 min-h-screen">
      {showUpload && (
        <LibraryUploadModal
          subjectId={subjectId}
          onClose={() => setShowUpload(false)}
          onUploaded={(newDoc) => {
            setDocs((prev) => [newDoc, ...prev]);
            setShowUpload(false);
          }}
        />
      )}

      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
        <button
          onClick={() => navigate("/student/library")}
          className="hover:text-indigo-600 transition-colors"
        >
          Library
        </button>
        <span>/</span>
        <span>{semesterName}</span>
        <span>/</span>
        <span className="text-indigo-600 font-medium">{subjectName}</span>
      </div>

      <button
        onClick={() => navigate("/student/library")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-5 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to All Courses
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {subjectName}
        </h1>
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Document
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl">
        <div className="grid grid-cols-[1fr_200px_80px_60px] px-6 py-3.5 bg-indigo-50 border-b border-indigo-100">
          {["FILES", "VISIBILITY", "SIZE", ""].map((h, i) => (
            <span
              key={i}
              className="text-[11px] font-bold tracking-wider text-gray-400 uppercase"
            >
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading...</div>
        ) : docs.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No documents yet. Upload your first document!
          </div>
        ) : (
          paged.map((doc, i) => (
            <div
              key={doc.documentId}
              className={
                "grid grid-cols-[1fr_200px_80px_60px] px-6 py-4 items-center hover:bg-gray-50 transition-colors " +
                (i < paged.length - 1 ? "border-b border-gray-100" : "")
              }
            >
              <div className="flex items-center gap-3">
                <div
                  className={
                    "w-9 h-9 rounded-full " +
                    getAvatarColor(doc.documentName) +
                    " flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  }
                >
                  {doc.documentType?.includes("pdf")
                    ? "P"
                    : doc.documentType?.includes("ppt")
                      ? "S"
                      : "D"}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold text-indigo-600 truncate max-w-[280px] cursor-pointer hover:text-indigo-700"
                    onClick={() =>
                      navigate("/student/documents/" + doc.documentId, {
                        state: { doc },
                      })
                    }
                  >
                    {doc.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {doc.documentName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Toggle
                  checked={doc.visibilityStatus === "PUBLIC"}
                  onChange={() =>
                    handleUpdate(
                      doc,
                      doc.title,
                      doc.visibilityStatus === "PUBLIC" ? "PRIVATE" : "PUBLIC",
                    )
                  }
                />
                <div>
                  <p
                    className={
                      "text-sm font-semibold " +
                      (doc.visibilityStatus === "PUBLIC"
                        ? "text-indigo-600"
                        : "text-gray-500")
                    }
                  >
                    {doc.visibilityStatus === "PUBLIC" ? "Public" : "Private"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {doc.visibilityStatus === "PUBLIC"
                      ? "Visible in course"
                      : "Only you"}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 font-medium">
                {doc.documentSize
                  ? (doc.documentSize / 1024 / 1024).toFixed(1) + " MB"
                  : "—"}
              </div>

              <div>
                <DocumentActionMenu
                  onEdit={() => setEditDoc(doc)}
                  onDelete={() => setDialog({ type: "delete", doc })}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {editDoc && (
        <EditDocumentModal
          doc={{ ...editDoc, name: editDoc.title }}
          onClose={() => setEditDoc(null)}
          onSave={(updated) =>
            handleUpdate(editDoc, updated.name, editDoc.visibilityStatus)
          }
        />
      )}

      {dialog && (
        <ConfirmDialog
          type="delete"
          title="Delete document ?"
          fileName={dialog.doc.title}
          onCancel={() => setDialog(null)}
          onConfirm={() => handleDelete(dialog.doc)}
        />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {pageNums.map((p, i) =>
            p === "..." ? (
              <span
                key={"d" + i}
                className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={
                  "w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all " +
                  (safePage === p
                    ? "bg-indigo-600 text-white border border-indigo-600"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-indigo-400 hover:text-indigo-600")
                }
              >
                {p}
              </button>
            ),
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function LibraryUploadModal({ subjectId, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // TODO: Thay userId = 1 bằng userId thật từ Auth khi có JWT
  const userId = 6;

  function handleUpload() {
    if (!file || !title.trim() || !subjectId) return;
    setUploading(true);
    documentApi
      .upload(file, title.trim(), subjectId, userId, visibility)
      .then((newDoc) => {
        onUploaded?.(newDoc);
        setUploading(false);
      })
      .catch(() => {
        setUploading(false);
        alert("Upload failed! Please try again.");
      });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-[540px] mx-4 shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Upload Document
            </h2>
            <p className="text-sm text-gray-400">
              Add a document to this course.
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

        <div className="px-7 py-6 flex flex-col gap-5">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
            onClick={() => document.getElementById("lib-file-input").click()}
            className={
              "border-2 border-dashed rounded-2xl py-9 px-6 flex flex-col items-center gap-3 cursor-pointer transition-all " +
              (dragOver
                ? "border-indigo-400 bg-indigo-50"
                : "border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300")
            }
          >
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
            </div>
            {file ? (
              <div className="text-center">
                <p className="text-sm font-bold text-indigo-700">{file.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <p className="text-[15px] font-semibold text-gray-800 text-center">
                  Drag and drop files here or{" "}
                  <span className="text-indigo-600 underline underline-offset-2">
                    click to browse
                  </span>
                </p>
                <p className="text-sm text-gray-400 text-center">
                  PDF, DOCX, PPTX, PNG, JPG (Max 50MB)
                </p>
              </>
            )}
            <input
              id="lib-file-input"
              type="file"
              className="hidden"
              accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) setFile(f);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DBI202 Slide Chapter 1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-800">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-indigo-400 transition-all"
            >
              <option value="PRIVATE">Private — Only you</option>
              <option value="PUBLIC">Public — Visible in course</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 px-7 py-5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !title.trim() || uploading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-full transition-colors"
          >
            {uploading ? "Uploading..." : "Upload"}
            {!uploading && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
