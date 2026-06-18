import { useState } from "react";
import { LIBRARY_SEMESTERS } from "../../mocks/libraryMock";

const SparkleIcon = ({ style }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
    <path
      d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14z"
      opacity="0.7"
    />
  </svg>
);

const DocIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5046e5"
    strokeWidth="1.8"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const ExamIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5046e5"
    strokeWidth="1.8"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M8 9l1.5 1.5L12 8" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="13" y2="18" />
  </svg>
);

const PaperclipIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9892ab"
    strokeWidth="1.8"
  >
    <path d="M12 5v9a3 3 0 0 1-6 0V6a2 2 0 0 1 4 0v8" />
  </svg>
);

const MicIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9892ab"
    strokeWidth="1.8"
  >
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2.2"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#5046e5">
    <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6b6880"
    strokeWidth="2.2"
    style={{
      transform: open ? "rotate(0deg)" : "rotate(-90deg)",
      transition: "transform 0.15s",
    }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9892ab"
    strokeWidth="1.8"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// Chỉ lấy semester có khóa học thật, theo quyết định đã chốt
const SEMESTERS_WITH_COURSES = LIBRARY_SEMESTERS.filter(
  (s) => s.courses.length > 0,
);

// Mock — UI only, chưa nối lịch sử chat thật
const RECENT_CHATS = [
  "Calculus III: Chain Rule",
  "ATP Synthesis Steps",
  "Supply and Demand Curve",
  "Python Loops Exercise",
];

export default function AITutorPage() {
  const [expanded, setExpanded] = useState({ "Semester 1": true });
  const [message, setMessage] = useState("");

  const toggleSemester = (sem) => {
    setExpanded((prev) => ({ ...prev, [sem]: !prev[sem] }));
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {/* Sidebar nội bộ của AI Tutor — riêng biệt với StudentSidebar toàn cục */}
      <div
        style={{
          width: "240px",
          flexShrink: 0,
          borderRight: "1px solid #e8e4f5",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "20px 16px",
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #6352e5 0%, #4c45e5 100%)",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "18px", lineHeight: 1 }}>+</span>
          New chat
        </button>

        <div style={{ position: "relative", marginBottom: "24px" }}>
          <div
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9892ab"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search chats"
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              borderRadius: "10px",
              border: "1px solid #ece8f5",
              background: "#f7f5fc",
              fontSize: "14px",
              color: "#1a1637",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.8px",
            color: "#9892ab",
            marginBottom: "12px",
          }}
        >
          COURSE FOLDERS
        </div>

        <div
          style={{ flex: "0 0 auto", overflowY: "auto", marginBottom: "20px" }}
        >
          {SEMESTERS_WITH_COURSES.map(({ semester, courses }) => (
            <div key={semester} style={{ marginBottom: "4px" }}>
              <button
                onClick={() => toggleSemester(semester)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 4px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "#1a1637",
                  textAlign: "left",
                }}
              >
                <ChevronIcon open={expanded[semester]} />
                <FolderIcon />
                {semester}
              </button>
              {expanded[semester] && (
                <div
                  style={{
                    paddingLeft: "38px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {courses.map((course) => (
                    <button
                      key={course}
                      style={{
                        padding: "7px 8px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#474554",
                        textAlign: "left",
                        borderRadius: "8px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f4f0fe")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      {course}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.8px",
            color: "#9892ab",
            marginBottom: "12px",
          }}
        >
          RECENT
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {RECENT_CHATS.map((title) => (
            <button
              key={title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "#474554",
                textAlign: "left",
                borderRadius: "8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f4f0fe")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <ChatIcon />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "64px 32px 32px",
          background:
            "linear-gradient(to bottom right, #f7f5fc, #f1edfb, #f5f3ff)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #6352e5 0%, #4c45e5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            boxShadow: "0 12px 28px rgba(80,70,229,0.3)",
          }}
        >
          <SparkleIcon style={{ width: 30, height: 30, color: "#fff" }} />
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#1a1637",
            textAlign: "center",
            margin: "0 0 16px",
            maxWidth: "680px",
            lineHeight: "1.3",
          }}
        >
          Hello Alex, what subject would you like to{" "}
          <span style={{ color: "#5046e5", textDecoration: "underline" }}>
            study today ?
          </span>
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#524f63",
            textAlign: "center",
            maxWidth: "560px",
            lineHeight: "1.7",
            margin: "0 0 40px",
          }}
        >
          I can help you summarize notes, solve complex equations, or practice
          for your upcoming midterms. Just ask !
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            width: "100%",
            maxWidth: "680px",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          {/* UI only — chưa gắn logic theo quyết định đã chốt */}
          <div
            style={{
              flex: 1,
              minWidth: "220px",
              background: "#fff",
              border: "1px solid #ece8f5",
              borderRadius: "16px",
              padding: "28px 20px",
              textAlign: "center",
              cursor: "default",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <DocIcon />
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1a1637",
                marginBottom: "6px",
              }}
            >
              Summarize notes
            </div>
            <div
              style={{ fontSize: "14px", color: "#6b6880", lineHeight: "1.5" }}
            >
              Extract key points from uploaded PDF
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "220px",
              background: "#fff",
              border: "1px solid #ece8f5",
              borderRadius: "16px",
              padding: "28px 20px",
              textAlign: "center",
              cursor: "default",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <ExamIcon />
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1a1637",
                marginBottom: "6px",
              }}
            >
              Practice exam
            </div>
            <div
              style={{ fontSize: "14px", color: "#6b6880", lineHeight: "1.5" }}
            >
              Create a 10-question Bio test
            </div>
          </div>
        </div>

        <div style={{ width: "100%", maxWidth: "680px", marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#fff",
              border: "1px solid #ece8f5",
              borderRadius: "16px",
              padding: "10px 14px",
              boxShadow: "0 4px 16px rgba(80,70,229,0.08)",
            }}
          >
            <button
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "6px",
              }}
              aria-label="Attach file"
            >
              <PaperclipIcon />
            </button>
            <input
              type="text"
              placeholder="Type your question here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "15px",
                color: "#1a1637",
                background: "transparent",
              }}
            />
            <button
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "6px",
              }}
              aria-label="Voice input"
            >
              <MicIcon />
            </button>
            <button
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                background: "linear-gradient(135deg, #6352e5 0%, #4c45e5 100%)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              color: "#9892ab",
              marginTop: "12px",
            }}
          >
            AI TUTOR CAN MAKE MISTAKES. VERIFY IMPORTANT ACADEMIC INFORMATION.
          </p>
        </div>
      </div>
    </div>
  );
}
