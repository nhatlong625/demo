import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { myLibraryDocs } from "../../mocks/documentsMock";
import { semesters } from "../../mocks/coursesMock";
import LibraryCourseUploadModal from "../../components/common/LibraryCourseUploadModal";
import DocumentActionMenu from "../../components/common/DocumentActionMenu";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EditDocumentModal from "../../components/common/EditDocumentModal";

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
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-gray-300"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

export default function LibraryCourseDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.courseId || "MAE101";
  const semObj = semesters.find((s) => s.courses.includes(id));
  const sem = semObj ? semObj.label : "My Library";
  const onBack = () => navigate("/student/library");

  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(1);
  const [vis, setVis] = useState({});
  const [dialog, setDialog] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [localDocs, setLocalDocs] = useState(null); // override mock khi user edit/delete

  const rawDocs = useMemo(() => {
    const source = localDocs !== null ? localDocs : myLibraryDocs;
    if (!source || source.length === 0) return [];
    const matched = source.filter((d) => d.course === id);
    if (matched.length >= 3) return matched;
    return source.map((d, i) => ({ ...d, id: i + 1, course: id }));
  }, [id, localDocs]);

  const docs = rawDocs.map((d) => ({
    ...d,
    isPublic: vis[d.id] !== undefined ? vis[d.id] : Boolean(d.isPublic),
  }));

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

  if (rawDocs.length === 0) {
    return (
      <div className="p-7 flex flex-col items-center justify-center min-h-[400px] text-gray-400">
        <p className="text-sm">No documents found for {id}</p>
        <button
          onClick={onBack}
          className="mt-3 text-xs text-indigo-600 hover:underline"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-7 bg-gray-50 min-h-screen">
      {showUpload && (
        <LibraryCourseUploadModal
          courseId={id}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-2">
        <button
          onClick={onBack}
          className="hover:text-indigo-600 transition-colors"
        >
          Library
        </button>
        <span>/</span>
        <span>{sem}</span>
        <span>/</span>
        <span className="text-indigo-600 font-medium">{id}</span>
      </div>

      {/* Back link */}
      <button
        onClick={onBack}
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {id}
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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_200px_100px_80px_60px] px-6 py-3.5 bg-indigo-50 border-b border-indigo-100">
          {["FILES", "VISIBILITY", "DISCUSSION", "VIEWS", ""].map((h, i) => (
            <span
              key={i}
              className="text-[11px] font-bold tracking-wider text-gray-400 uppercase"
            >
              {h}
            </span>
          ))}
        </div>

        {paged.map((doc, i) => (
          <div
            key={doc.id}
            className={`grid grid-cols-[1fr_200px_100px_80px_60px] px-6 py-4 items-center hover:bg-gray-50 transition-colors ${i < paged.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            {/* File */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full ${getAvatarColor(doc.uploader || "")} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
              >
                {(doc.uploader || "U")[0].toUpperCase()}
              </div>
              <div>
                <p
                  className="text-sm font-semibold text-indigo-600 truncate max-w-[280px] cursor-pointer hover:text-indigo-700"
                  onClick={() => navigate(`/student/documents/${doc.id}`)}
                >
                  {doc.name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {doc.uploader} • {doc.date}
                </p>
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-2.5">
              <Toggle
                checked={doc.isPublic}
                onChange={() =>
                  setVis((v) => ({ ...v, [doc.id]: !doc.isPublic }))
                }
              />
              <div>
                <p
                  className={`text-sm font-semibold ${doc.isPublic ? "text-indigo-600" : "text-gray-500"}`}
                >
                  {doc.isPublic ? "Public" : "Private"}
                </p>
                <p className="text-xs text-gray-400">
                  {doc.isPublic ? "Visible in course" : "Only you"}
                </p>
              </div>
            </div>

            {/* Discussion */}
            <div className="text-sm text-gray-600 font-medium">
              {doc.isPublic ? (
                doc.discussion
              ) : (
                <span className="text-gray-300">—</span>
              )}
            </div>

            {/* Views */}
            <div className="text-sm text-gray-600 font-medium">
              {doc.isPublic ? (
                doc.views
              ) : (
                <span className="text-gray-300">—</span>
              )}
            </div>

            {/* Actions */}
            <div>
              <DocumentActionMenu
                onEdit={() => setEditDoc(doc)}
                onDelete={() => setDialog({ type: "delete", doc })}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editDoc && (
        <EditDocumentModal
          doc={editDoc}
          onClose={() => setEditDoc(null)}
          onSave={(updated) => {
            const source = localDocs !== null ? localDocs : myLibraryDocs;
            setLocalDocs(
              source.map((d) => (d.id === updated.id ? updated : d)),
            );
            setEditDoc(null);
          }}
        />
      )}

      {/* Delete Confirm */}
      {dialog && (
        <ConfirmDialog
          type="delete"
          fileName={dialog.doc.name}
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            const source = localDocs !== null ? localDocs : myLibraryDocs;
            setLocalDocs(source.filter((d) => d.id !== dialog.doc.id));
            setDialog(null);
          }}
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
                key={`d${i}`}
                className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm"
              >
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${safePage === p ? "bg-indigo-600 text-white border border-indigo-600" : "border border-gray-200 bg-white text-gray-600 hover:border-indigo-400 hover:text-indigo-600"}`}
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
