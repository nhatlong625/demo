import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getDocumentData } from "../../mocks/documentsMock";

export default function DocumentViewPage() {
  const navigate = useNavigate();
  const file = null; // TODO: lấy từ location state khi có API
  const onBack = () => navigate(-1);
  const { pages, aiSummary, comments: initialComments } = getDocumentData(file);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(initialComments);

  const fileName = file?.name || "Calculus_Syllabus_2024.pdf";
  const fileExt = fileName.split(".").pop().toUpperCase();

  const handleSend = () => {
    if (!message.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Alex Nguyen",
        initials: null,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: message,
        isLogo: true,
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
      },
    ]);
    setMessage("");
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm font-bold text-gray-800">{fileName}</span>
          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[11px] font-bold rounded-md">
            {fileExt}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-all">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: PDF Viewer — 6 trang */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 flex flex-col items-center gap-4">
          {pages.map((pg) => (
            <div
              key={pg.page}
              className="bg-white rounded-xl shadow-sm w-full max-w-[820px] p-8 relative"
            >
              {/* Chapter title */}
              <h2 className="text-xl font-black text-gray-900 mb-5 text-center">
                {pg.title}
              </h2>

              {/* Paragraphs */}
              {pg.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-gray-600 leading-relaxed mb-4"
                >
                  {para}
                </p>
              ))}

              {/* Visual placeholder nếu có */}
              {pg.hasVisual && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl h-44 flex flex-col items-center justify-center gap-2 mb-4">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c7d2fe"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs text-gray-400">
                    {pg.visualLabel}
                  </span>
                </div>
              )}

              {/* Page number */}
              <div className="absolute bottom-4 right-6 text-xs text-gray-400">
                Page {pg.page}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: AI Summary + Discussion */}
        <div className="w-[340px] min-w-[340px] border-l border-gray-200 flex flex-col bg-white overflow-hidden">
          {/* AI Summary */}
          <div
            className="overflow-y-auto p-5 border-b border-gray-100"
            style={{ maxHeight: "55%" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-[11px] font-black tracking-[2px] text-gray-700 uppercase">
                AI Summary
              </span>
            </div>

            <p className="text-sm font-bold text-indigo-600 mb-2">
              Key Takeaways
            </p>
            <ul className="flex flex-col gap-1.5 mb-4">
              {aiSummary.takeaways.map((t, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>

            <p className="text-sm font-bold text-indigo-600 mb-2">
              Detailed Summary
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {aiSummary.detail}
            </p>

            {aiSummary.warning && (
              <p className="text-sm font-bold text-red-500 leading-relaxed mb-4">
                {aiSummary.warning}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Generated by StudyFlow AI
              </span>
              <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Regenerate
              </button>
            </div>
          </div>

          {/* Discussion */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5 items-start">
                  <div
                    className={`w-8 h-8 rounded-full ${c.avatarBg} ${c.avatarText} flex items-center justify-center flex-shrink-0`}
                  >
                    {c.isLogo ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="4"
                          fill="currentColor"
                          opacity="0.6"
                        />
                        <path
                          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    ) : (
                      <span className={`text-xs font-bold ${c.avatarText}`}>
                        {c.initials}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {c.time}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-700 leading-relaxed">
                      {c.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about this document..."
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-indigo-400 placeholder-gray-400 transition-all"
              />
              <button
                onClick={handleSend}
                className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
