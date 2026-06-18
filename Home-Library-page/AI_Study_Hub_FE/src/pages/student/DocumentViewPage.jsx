import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { getDocumentData } from "../../mocks/documentsMock";

// TODO: Thay bằng API call khi backend sẵn sàng:
// import { documentApi } from "../../services/api";
// const doc = await documentApi.getById(documentId);

export default function DocumentViewPage() {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const location = useLocation();
  const [message, setMessage] = useState("");

  // TODO: Thay bằng dữ liệu thật từ API khi backend sẵn sàng
  const { comments: mockComments } = getDocumentData({ name: "default" });
  const [comments, setComments] = useState(mockComments);

  // TODO: Thay bằng API: const doc = await documentApi.getById(documentId);
  const doc = location.state?.doc ?? null;

  const handleSend = () => {
    if (!message.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Alex Nguyen",
        initials: null,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: message,
        isLogo: true,
        avatarBg: "bg-indigo-100",
        avatarText: "text-indigo-600",
      },
    ]);
    setMessage("");
  };

  const aiSummary = {
    takeaways: [
      "Document uploaded to AI StudyHub",
      "AI analysis will be available soon",
      "You can discuss this document below",
    ],
    detail: "AI summary will be generated after the Python AI service processes this document. Please check back later.",
  };

  if (!doc) return (
    <div className="flex flex-col bg-white" style={{ height: "calc(100vh - 0px)" }}>
      {/* Sub-header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm font-bold text-gray-800">Document #{documentId}</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gray-100 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-3">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-sm">No preview available</p>
          </div>
        </div>

        <div className="w-[340px] min-w-[340px] border-l border-gray-200 flex flex-col bg-white overflow-hidden">
          <div className="overflow-y-auto p-5 border-b border-gray-100" style={{ maxHeight: "55%" }}>
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-[11px] font-black tracking-[2px] text-gray-700 uppercase">AI Summary</span>
            </div>
            <p className="text-sm font-bold text-indigo-600 mb-2">Key Takeaways</p>
            <ul className="flex flex-col gap-1.5 mb-4">
              {aiSummary.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />{t}
                </li>
              ))}
            </ul>
            <p className="text-sm font-bold text-indigo-600 mb-2">Detailed Summary</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{aiSummary.detail}</p>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5 items-start">
                  <div className={"w-8 h-8 rounded-full " + c.avatarBg + " " + c.avatarText + " flex items-center justify-center flex-shrink-0"}>
                    {c.isLogo ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.6" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </svg>
                    ) : (
                      <span className={"text-xs font-bold " + c.avatarText}>{c.initials}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                      <span className="text-[11px] text-gray-400">{c.time}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-700 leading-relaxed">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about this document..."
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-indigo-400 placeholder-gray-400 transition-all"
              />
              <button onClick={handleSend} className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const fileName = doc.documentName || "document";
  const fileExt = fileName.split(".").pop().toUpperCase();

  return (
    <div className="flex flex-col bg-white" style={{ height: "calc(100vh - 0px)" }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm font-bold text-gray-800">{doc.title}</span>
          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[11px] font-bold rounded-md">{fileExt}</span>
        </div>
        <div className="flex items-center gap-2">
          <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </a>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden bg-gray-100">
          {doc.documentUrl ? (
            <iframe src={doc.documentUrl} className="w-full h-full border-0" title={doc.title} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-3">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <p className="text-sm">No preview available</p>
              </div>
            </div>
          )}
        </div>
        <div className="w-[340px] min-w-[340px] border-l border-gray-200 flex flex-col bg-white overflow-hidden">
          <div className="overflow-y-auto p-5 border-b border-gray-100" style={{ maxHeight: "55%" }}>
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-[11px] font-black tracking-[2px] text-gray-700 uppercase">AI Summary</span>
            </div>
            <p className="text-sm font-bold text-indigo-600 mb-2">Key Takeaways</p>
            <ul className="flex flex-col gap-1.5 mb-4">
              {aiSummary.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />{t}
                </li>
              ))}
            </ul>
            <p className="text-sm font-bold text-indigo-600 mb-2">Detailed Summary</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{aiSummary.detail}</p>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5 items-start">
                  <div className={"w-8 h-8 rounded-full " + c.avatarBg + " " + c.avatarText + " flex items-center justify-center flex-shrink-0"}>
                    {c.isLogo ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.6" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </svg>
                    ) : (
                      <span className={"text-xs font-bold " + c.avatarText}>{c.initials}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                      <span className="text-[11px] text-gray-400">{c.time}</span>
                    </div>
                    <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-700 leading-relaxed">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about this document..."
                className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-indigo-400 placeholder-gray-400 transition-all"
              />
              <button onClick={handleSend} className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center justify-center text-white transition-colors flex-shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
