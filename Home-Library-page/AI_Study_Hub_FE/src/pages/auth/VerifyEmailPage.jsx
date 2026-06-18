import { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/landing/Navbar";
import Footer from "../../components/landing/Footer";

const ShieldIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#5046e5"
    strokeWidth="1.6"
  >
    <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5z" />
    <rect x="9.5" y="11" width="5" height="4.5" rx="1" />
    <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
  </svg>
);

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "alex@example.com";
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Mock — UI only: chuyển sang trang đặt password mới
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/reset-password");
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f4f0fe",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(80,70,229,0.12)",
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              height: "5px",
              background:
                "linear-gradient(90deg, #6352e5 0%, #4c45e5 60%, #8c84f0 100%)",
            }}
          />

          <div style={{ padding: "44px 40px 36px" }}>
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  background: "rgba(99,82,229,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <ShieldIcon />
              </div>

              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  color: "#5046e5",
                  margin: "0 0 12px",
                }}
              >
                IDENTITY VERIFICATION
              </p>
              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: "900",
                  color: "#1a1637",
                  margin: "0 0 14px",
                  letterSpacing: "-0.5px",
                }}
              >
                Verify your email
              </h1>
              <p
                style={{
                  fontSize: "15px",
                  color: "#524f63",
                  margin: 0,
                  lineHeight: "1.6",
                }}
              >
                We've sent a 6-digit code to
                <br />
                <span style={{ color: "#1a1637", fontWeight: "600" }}>
                  {email}
                </span>
              </p>
            </div>

            {/* Form (UI only — chưa xử lý submit) */}
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  marginBottom: "28px",
                }}
              >
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    style={{
                      width: "100%",
                      maxWidth: "56px",
                      height: "64px",
                      textAlign: "center",
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#1a1637",
                      borderRadius: "12px",
                      border: "1.5px solid #e0dbf5",
                      background: "#fff",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "#7a70e8")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "#e0dbf5")
                    }
                  />
                ))}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #6352e5 0%, #4c45e5 60%, #8c84f0 100%)",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 8px 24px rgba(80,70,229,0.3)",
                }}
              >
                Verify code
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#6b6880",
                margin: "20px 0 0",
              }}
            >
              Didn't receive the code ?{" "}
              {/* TODO: xử lý resend thật khi có backend */}
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#5046e5",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Resend
              </button>
            </p>

            <div
              style={{ height: "1px", background: "#e8e4f5", margin: "24px 0" }}
            />

            <p style={{ textAlign: "center", fontSize: "14px", margin: 0 }}>
              <Link
                to="/login"
                style={{
                  color: "#5046e5",
                  fontWeight: "700",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5046e5"
                  strokeWidth="2.5"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
