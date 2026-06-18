// src/services/api.js
// ============================================================
// API Service - Kết nối với Spring Boot Backend
// ============================================================

const BASE_URL = "http://localhost:8080/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
});

// ============================================================
// SEMESTER API
// ============================================================
export const semesterApi = {
  // Lấy tất cả semester + subject
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/semesters`, { headers: getHeaders() });
    return res.json();
  },
};

// ============================================================
// SUBJECT API
// ============================================================
export const subjectApi = {
  // Lấy subject theo semester
  getBySemester: async (semesterId) => {
    const res = await fetch(`${BASE_URL}/subjects/semester/${semesterId}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Thêm subject mới
  add: async (semesterId, subjectName, description = "") => {
    const res = await fetch(
      `${BASE_URL}/subjects?semesterId=${semesterId}&subjectName=${encodeURIComponent(subjectName)}&description=${encodeURIComponent(description)}`,
      { method: "POST", headers: getHeaders() },
    );
    return res.json();
  },

  // Xóa subject
  delete: async (subjectId) => {
    const res = await fetch(`${BASE_URL}/subjects/${subjectId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.text();
  },
};

// ============================================================
// DOCUMENT API
// ============================================================
export const documentApi = {
  // Upload file (multipart)
  upload: async (
    file,
    title,
    subjectId,
    userId,
    visibilityStatus = "PRIVATE",
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("subjectId", subjectId);
    formData.append("userId", userId);
    formData.append("visibilityStatus", visibilityStatus);

    const res = await fetch(`${BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData, // Không set Content-Type — browser tự set boundary
    });
    return res.json();
  },

  // Lấy document theo subject
  getBySubject: async (subjectId) => {
    const res = await fetch(`${BASE_URL}/documents/subject/${subjectId}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Lấy document theo user
  getByUser: async (userId) => {
    const res = await fetch(`${BASE_URL}/documents/user/${userId}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Lấy 1 document theo ID
  getById: async (documentId) => {
    const res = await fetch(`${BASE_URL}/documents/${documentId}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Xóa document
  delete: async (documentId) => {
    const res = await fetch(`${BASE_URL}/documents/${documentId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.text();
  },

  //
  updateVisibility: async (documentId, visibilityStatus) => {
    const res = await fetch(
      `${BASE_URL}/documents/${documentId}/visibility?visibilityStatus=${visibilityStatus}`,
      { method: "PATCH", headers: getHeaders() },
    );
    return res.json();
  },

  // Lấy stats tất cả subject (cho HomePage)
  getAllStats: async () => {
    const res = await fetch(`${BASE_URL}/documents/all-stats`, {
      headers: getHeaders(),
    });
    return res.json();
  },
};
