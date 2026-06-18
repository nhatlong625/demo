// ============================================================
// MOCK DATA - Library (user's personal courses)
// TODO: Thay bằng API call khi backend sẵn sàng
// ============================================================

export const LIBRARY_SEMESTERS = [
  { semester: "Semester 0", courses: ["TRANS 5", "TRANS 6"] },
  { semester: "Semester 1", courses: ["MAE101"] },
  { semester: "Semester 2", courses: ["OSG202", "PRO191", "SSG104"] },
  { semester: "Semester 3", courses: [] },
  { semester: "Semester 4", courses: [] },
  { semester: "Semester 5", courses: [] },
  { semester: "Semester 6", courses: [] },
  { semester: "Semester 7", courses: [] },
  { semester: "Semester 8", courses: [] },
  { semester: "Semester 9", courses: [] },
];

// Mock documents theo từng mã môn
// TODO: Thay bằng documentApi.getBySubject(subjectId) khi backend sẵn sàng
export const LIBRARY_DOCS = {
  "TRANS 5": [
    { documentId: 1001, title: "TRANS5 - Slide Chương 1", documentName: "trans5_slide_ch1.pdf", documentType: "pdf", documentSize: 2.4 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1002, title: "TRANS5 - Đề thi SP24", documentName: "trans5_exam_sp24.pdf", documentType: "pdf", documentSize: 1.1 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1003, title: "TRANS5 - Tóm tắt lý thuyết", documentName: "trans5_summary.docx", documentType: "docx", documentSize: 0.8 * 1024 * 1024, visibilityStatus: "PRIVATE", documentUrl: null },
  ],
  "TRANS 6": [
    { documentId: 1011, title: "TRANS6 - Slide Chương 1", documentName: "trans6_slide_ch1.pdf", documentType: "pdf", documentSize: 3.2 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1012, title: "TRANS6 - Slide Chương 2", documentName: "trans6_slide_ch2.pdf", documentType: "pdf", documentSize: 2.9 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1013, title: "TRANS6 - Lab Report Template", documentName: "trans6_lab_template.docx", documentType: "docx", documentSize: 0.5 * 1024 * 1024, visibilityStatus: "PRIVATE", documentUrl: null },
    { documentId: 1014, title: "TRANS6 - Đề thi GK SU25", documentName: "trans6_midterm_su25.pdf", documentType: "pdf", documentSize: 1.3 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
  ],
  "MAE101": [
    { documentId: 1021, title: "MAE101 - Slide Week 1: Giới thiệu", documentName: "mae101_w1_intro.pdf", documentType: "pdf", documentSize: 4.1 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1022, title: "MAE101 - Slide Week 2: Số phức", documentName: "mae101_w2_complex.pdf", documentType: "pdf", documentSize: 3.7 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1023, title: "MAE101 - Bài tập chương 1", documentName: "mae101_ex_ch1.pdf", documentType: "pdf", documentSize: 1.2 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1024, title: "MAE101 - Đề thi SP26 RE", documentName: "mae101_sp26_re.pdf", documentType: "pdf", documentSize: 0.9 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1025, title: "MAE101 - Note ôn thi cuối kỳ", documentName: "mae101_final_note.docx", documentType: "docx", documentSize: 1.5 * 1024 * 1024, visibilityStatus: "PRIVATE", documentUrl: null },
    { documentId: 1026, title: "MAE101 - Formula Sheet", documentName: "mae101_formula.pdf", documentType: "pdf", documentSize: 0.4 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
  ],
  "OSG202": [
    { documentId: 1031, title: "OSG202 - Slide Chapter 1: Intro to OS", documentName: "osg202_ch1_intro.pdf", documentType: "pdf", documentSize: 5.2 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1032, title: "OSG202 - Slide Chapter 2: Process", documentName: "osg202_ch2_process.pdf", documentType: "pdf", documentSize: 4.8 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1033, title: "OSG202 - Lab 1: Linux Commands", documentName: "osg202_lab1.pdf", documentType: "pdf", documentSize: 1.6 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1034, title: "OSG202 - Đề thi SP26 PE", documentName: "osg202_sp26_pe.pdf", documentType: "pdf", documentSize: 1.0 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1035, title: "OSG202 - Cheat Sheet Final", documentName: "osg202_cheatsheet.pptx", documentType: "pptx", documentSize: 2.3 * 1024 * 1024, visibilityStatus: "PRIVATE", documentUrl: null },
  ],
  "PRO191": [
    { documentId: 1041, title: "PRO191 - Slide Week 1: Intro to Programming", documentName: "pro191_w1.pdf", documentType: "pdf", documentSize: 3.5 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1042, title: "PRO191 - Slide Week 3: Loops & Arrays", documentName: "pro191_w3_loops.pdf", documentType: "pdf", documentSize: 2.8 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1043, title: "PRO191 - Lab 2: Bài tập vòng lặp", documentName: "pro191_lab2.pdf", documentType: "pdf", documentSize: 0.7 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1044, title: "PRO191 - Project Template", documentName: "pro191_project_template.docx", documentType: "docx", documentSize: 0.3 * 1024 * 1024, visibilityStatus: "PRIVATE", documentUrl: null },
    { documentId: 1045, title: "PRO191 - Đề thi GK SU25", documentName: "pro191_midterm_su25.pdf", documentType: "pdf", documentSize: 1.1 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1046, title: "PRO191 - Đề thi CK SP26", documentName: "pro191_final_sp26.pdf", documentType: "pdf", documentSize: 1.4 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1047, title: "PRO191 - Note tổng hợp", documentName: "pro191_notes.pptx", documentType: "pptx", documentSize: 6.1 * 1024 * 1024, visibilityStatus: "PRIVATE", documentUrl: null },
  ],
  "SSG104": [
    { documentId: 1051, title: "SSG104 - Slide Buổi 1: Kỹ năng học tập", documentName: "ssg104_b1.pdf", documentType: "pdf", documentSize: 2.1 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1052, title: "SSG104 - Slide Buổi 2: Quản lý thời gian", documentName: "ssg104_b2.pdf", documentType: "pdf", documentSize: 1.9 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
    { documentId: 1053, title: "SSG104 - Assignment 1", documentName: "ssg104_assignment1.docx", documentType: "docx", documentSize: 0.4 * 1024 * 1024, visibilityStatus: "PRIVATE", documentUrl: null },
    { documentId: 1054, title: "SSG104 - Rubric chấm điểm", documentName: "ssg104_rubric.pdf", documentType: "pdf", documentSize: 0.6 * 1024 * 1024, visibilityStatus: "PUBLIC", documentUrl: null },
  ],
};
