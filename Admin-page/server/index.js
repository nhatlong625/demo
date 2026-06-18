import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import sql from 'mssql';

const port = Number(process.env.PORT || 3001);
const databaseName = process.env.SQLSERVER_DATABASE || 'AIStudyHub';

const seedUsers = [
  {
    name: 'Sarah Jenkins',
    email: 's.jenkins@study.app',
    role: 'Admin',
    plan: 'Pro',
    folders: 24,
    tests: 45,
    type: 'logo',
    initials: 'SJ',
    color: '#E9E8F4',
    textColor: '#5E5B73',
    location: 'San Francisco, CA',
    lastLogin: 'Today, 09:42 AM',
    latestAction: "Updated permissions for 'Midterm Prep' folder.",
    actionTime: '2 hours ago',
  },
  {
    name: 'Marcus Chen',
    email: 'm.chen@academy.edu',
    role: 'User',
    plan: 'Plus',
    folders: 12,
    tests: 30,
    type: 'initials',
    initials: 'MC',
    color: '#DBEAFE',
    textColor: '#1D4ED8',
    location: 'New York, NY',
    lastLogin: 'Yesterday, 4:15 PM',
    latestAction: "Completed practice test 'Biology Finals'.",
    actionTime: '1 day ago',
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena.r@college.net',
    role: 'User',
    plan: 'Basic',
    folders: 8,
    tests: 15,
    type: 'initials',
    initials: 'ER',
    color: '#FCE7F3',
    textColor: '#BE185D',
    location: 'Miami, FL',
    lastLogin: 'Today, 07:30 AM',
    latestAction: "Uploaded 'Chemistry Notes.pdf'.",
    actionTime: '3 hours ago',
  },
  {
    name: 'David Miller',
    email: 'd.miller@tutors.org',
    role: 'User',
    plan: 'Plus',
    folders: 18,
    tests: 52,
    type: 'initials',
    initials: 'DM',
    color: '#D1FAE5',
    textColor: '#047857',
    location: 'Chicago, IL',
    lastLogin: 'Today, 11:00 AM',
    latestAction: "Created quiz 'Advanced Math Ch.5'.",
    actionTime: '30 minutes ago',
  },
  {
    name: 'James Kim',
    email: 'james.kim@university.edu',
    role: 'User',
    plan: 'Plus',
    folders: 15,
    tests: 22,
    type: 'initials',
    initials: 'JK',
    color: '#F3E8FF',
    textColor: '#7C3AED',
    location: 'Seattle, WA',
    lastLogin: '3 days ago',
    latestAction: "Shared folder 'Physics Notes' with group.",
    actionTime: '3 days ago',
  },
  {
    name: 'Sophia Lee',
    email: 'sophia.l@testprep.com',
    role: 'User',
    plan: 'Pro',
    folders: 31,
    tests: 64,
    type: 'initials',
    initials: 'SL',
    color: '#FEF3C7',
    textColor: '#B45309',
    location: 'Austin, TX',
    lastLogin: 'Today, 08:00 AM',
    latestAction: 'Reviewed 15 student submissions.',
    actionTime: '1 hour ago',
  },
  {
    name: 'Noah Williams',
    email: 'noah.williams@studyhub.com',
    role: 'User',
    plan: 'Basic',
    folders: 7,
    tests: 12,
    type: 'initials',
    initials: 'NW',
    color: '#E0F2FE',
    textColor: '#0369A1',
    location: 'Denver, CO',
    lastLogin: 'Yesterday, 10:10 AM',
    latestAction: "Downloaded 'Physics Formula Sheet'.",
    actionTime: '20 hours ago',
  },
  {
    name: 'Ava Thompson',
    email: 'ava.thompson@campus.edu',
    role: 'User',
    plan: 'Pro',
    folders: 28,
    tests: 58,
    type: 'initials',
    initials: 'AT',
    color: '#FFE4E6',
    textColor: '#BE123C',
    location: 'Portland, OR',
    lastLogin: 'Today, 01:05 PM',
    latestAction: "Generated quiz 'Organic Chemistry Review'.",
    actionTime: '45 minutes ago',
  },
  {
    name: 'Ethan Brooks',
    email: 'ethan.brooks@academy.edu',
    role: 'User',
    plan: 'Plus',
    folders: 19,
    tests: 36,
    type: 'initials',
    initials: 'EB',
    color: '#DCFCE7',
    textColor: '#15803D',
    location: 'Boston, MA',
    lastLogin: 'Today, 02:20 PM',
    latestAction: "Shared 'Economics Notes' with a study group.",
    actionTime: '15 minutes ago',
  },
  {
    name: 'Mia Carter',
    email: 'mia.carter@learn.io',
    role: 'User',
    plan: 'Basic',
    folders: 5,
    tests: 9,
    type: 'initials',
    initials: 'MC',
    color: '#FDE68A',
    textColor: '#92400E',
    location: 'Phoenix, AZ',
    lastLogin: '4 days ago',
    latestAction: "Saved flashcards for 'World History'.",
    actionTime: '4 days ago',
  },
  {
    name: 'Lucas Nguyen',
    email: 'lucas.nguyen@school.edu',
    role: 'User',
    plan: 'Plus',
    folders: 16,
    tests: 41,
    type: 'initials',
    initials: 'LN',
    color: '#EDE9FE',
    textColor: '#6D28D9',
    location: 'San Jose, CA',
    lastLogin: 'Today, 12:00 PM',
    latestAction: "Completed practice test 'Data Structures'.",
    actionTime: '2 hours ago',
  },
  {
    name: 'Grace Patel',
    email: 'grace.patel@university.edu',
    role: 'User',
    plan: 'Pro',
    folders: 34,
    tests: 72,
    type: 'initials',
    initials: 'GP',
    color: '#CCFBF1',
    textColor: '#0F766E',
    location: 'Atlanta, GA',
    lastLogin: 'Today, 09:15 AM',
    latestAction: "Reviewed AI tutor transcript for 'Linear Algebra'.",
    actionTime: '5 hours ago',
  },
];

const seedSemesters = [
  { name: 'Spring 2024', startDate: '29/04/2026', endDate: '29/04/2027', description: 'Standard Spring term encompassing core curriculum and undergraduate electives.', status: 'ACTIVE', storage: '320 MB' },
  { name: 'Summer 2024', startDate: '01/06/2024', endDate: '31/08/2024', description: 'Condensed summer course schedule for accelerated learning.', status: 'ACTIVE', storage: '110 MB' },
  { name: 'Fall 2024', startDate: '01/09/2024', endDate: '20/12/2024', description: 'Main fall academic term with full course availability.', status: 'ACTIVE', storage: '280 MB' },
  { name: 'Spring 2025', startDate: '15/01/2025', endDate: '30/05/2025', description: 'Spring term for advanced and elective courses.', status: 'ACTIVE', storage: '410 MB' },
  { name: 'Fall 2023', startDate: '01/09/2023', endDate: '20/12/2023', description: 'Archived fall term retained for historical documents.', status: 'ARCHIVED', storage: '260 MB' },
];

const seedCourses = {
  'Spring 2024': [
    { name: 'Introduction to Algorithms', code: 'CS-101', instructor: 'Dr. Alan Turing', docs: 24, updated: 'Oct 24, 2023', status: 'Active', icon: 'code', color: '#e0e7ff', iconColor: '#4648D4' },
    { name: 'Advanced Calculus', code: 'MATH-302', instructor: 'Prof. Isaac Newton', docs: 18, updated: 'Oct 22, 2023', status: 'Draft', icon: 'calc', color: '#fef3c7', iconColor: '#d97706' },
    { name: 'Modern World Literature', code: 'LIT-205', instructor: 'Dr. Virginia Woolf', docs: 42, updated: 'Oct 20, 2023', status: 'Active', icon: 'book', color: '#d1fae5', iconColor: '#059669' },
    { name: 'Cellular Biology', code: 'BIO-410', instructor: 'Dr. Rosalind Franklin', docs: 0, updated: 'Oct 18, 2023', status: 'Archived', icon: 'science', color: '#fce7f3', iconColor: '#db2777' },
  ],
  'Summer 2024': [
    { name: 'Data Structures', code: 'CS-201', instructor: 'Dr. Ada Lovelace', docs: 12, updated: 'Aug 10, 2024', status: 'Active', icon: 'code', color: '#e0e7ff', iconColor: '#4648D4' },
    { name: 'Linear Algebra', code: 'MATH-201', instructor: 'Prof. Emmy Noether', docs: 8, updated: 'Aug 08, 2024', status: 'Active', icon: 'calc', color: '#fef3c7', iconColor: '#d97706' },
    { name: 'Intro to Philosophy', code: 'PHIL-101', instructor: 'Prof. Immanuel Kant', docs: 10, updated: 'Aug 06, 2024', status: 'Active', icon: 'book', color: '#d1fae5', iconColor: '#059669' },
  ],
  'Fall 2024': [
    { name: 'Computer Networks', code: 'CS-401', instructor: 'Dr. Vint Cerf', docs: 20, updated: 'Dec 05, 2024', status: 'Active', icon: 'code', color: '#e0e7ff', iconColor: '#4648D4' },
    { name: 'Organic Chemistry', code: 'CHEM-301', instructor: 'Dr. Marie Curie', docs: 15, updated: 'Dec 03, 2024', status: 'Active', icon: 'science', color: '#fce7f3', iconColor: '#db2777' },
    { name: 'World History', code: 'HIST-101', instructor: 'Prof. Howard Zinn', docs: 30, updated: 'Dec 01, 2024', status: 'Draft', icon: 'book', color: '#d1fae5', iconColor: '#059669' },
  ],
  'Spring 2025': [
    { name: 'Machine Learning', code: 'CS-501', instructor: 'Dr. Geoffrey Hinton', docs: 35, updated: 'May 12, 2025', status: 'Active', icon: 'code', color: '#e0e7ff', iconColor: '#4648D4' },
    { name: 'Statistics II', code: 'STAT-301', instructor: 'Prof. Ronald Fisher', docs: 22, updated: 'May 10, 2025', status: 'Active', icon: 'calc', color: '#fef3c7', iconColor: '#d97706' },
    { name: 'Molecular Biology', code: 'BIO-501', instructor: 'Dr. James Watson', docs: 28, updated: 'May 08, 2025', status: 'Active', icon: 'science', color: '#fce7f3', iconColor: '#db2777' },
  ],
  'Fall 2023': [
    { name: 'Classical Literature', code: 'LIT-101', instructor: 'Prof. Homer Simpson', docs: 18, updated: 'Dec 10, 2023', status: 'Archived', icon: 'book', color: '#d1fae5', iconColor: '#059669' },
    { name: 'Genetics', code: 'BIO-301', instructor: 'Dr. Gregor Mendel', docs: 11, updated: 'Dec 08, 2023', status: 'Archived', icon: 'science', color: '#fce7f3', iconColor: '#db2777' },
    { name: 'Database Systems', code: 'CS-302', instructor: 'Dr. Edgar Codd', docs: 16, updated: 'Nov 28, 2023', status: 'Archived', icon: 'code', color: '#e0e7ff', iconColor: '#4648D4' },
  ],
};

const seedPracticeTests = [
  { name: 'Software Requirement Quiz', docs: 3, questions: 20, subject: 'Software Engineering', creatorInitials: 'AN', creatorName: 'Alex Nguyen', creatorColor: '#DBEAFE', creatorText: '#1D4ED8', attempts: 128, avg: 82, status: 'Published', createdType: 'AI Generated' },
  { name: 'Business Analysis Fundamentals', docs: 2, questions: 30, subject: 'Business Analysis', creatorInitials: 'MT', creatorName: 'Minh Tran', creatorColor: '#D1FAE5', creatorText: '#047857', attempts: 86, avg: 76, status: 'Pending Review', createdType: 'AI Generated' },
  { name: 'Database Design Test', docs: 1, questions: 25, subject: 'Database', creatorInitials: 'KA', creatorName: 'Kim Anh', creatorColor: '#FEF3C7', creatorText: '#B45309', attempts: 52, avg: 58, status: 'Flagged', createdType: 'AI Generated' },
  { name: 'AI Introduction Quiz', docs: 4, questions: 20, subject: 'Artificial Intelligence', creatorInitials: 'JP', creatorName: 'John Pham', creatorColor: '#F3E8FF', creatorText: '#7C3AED', attempts: 210, avg: 88, status: 'Published', createdType: 'Manual' },
  { name: 'Data Structures Checkpoint', docs: 2, questions: 18, subject: 'Database', creatorInitials: 'LN', creatorName: 'Linh Nguyen', creatorColor: '#E0F2FE', creatorText: '#0369A1', attempts: 74, avg: 69, status: 'Published', createdType: 'AI Generated' },
  { name: 'Machine Learning Basics', docs: 3, questions: 22, subject: 'Artificial Intelligence', creatorInitials: 'GP', creatorName: 'Grace Patel', creatorColor: '#CCFBF1', creatorText: '#0F766E', attempts: 94, avg: 81, status: 'Pending Review', createdType: 'Manual' },
];

const seedPracticeQuestions = {
  'Software Requirement Quiz': [
    { question: 'What is the primary purpose of a Software Requirements Specification (SRS)?', type: 'Multiple Choice', difficulty: 'Medium', aiScore: 94 },
    { question: 'Which diagram is used to model the functional requirements of a system?', type: 'Multiple Choice', difficulty: 'Easy', aiScore: 98 },
    { question: 'Explain the difference between functional and non-functional requirements.', type: 'Essay', difficulty: 'Hard', aiScore: 72 },
    { question: 'What does the acronym FURPS stand for in software engineering?', type: 'Multiple Choice', difficulty: 'Medium', aiScore: 88 },
  ],
  'Business Analysis Fundamentals': [
    { question: 'What is Business Analysis and what are its core objectives?', type: 'Essay', difficulty: 'Medium', aiScore: 87 },
    { question: 'Explain the SWOT analysis framework with an example.', type: 'Short Answer', difficulty: 'Easy', aiScore: 95 },
    { question: 'Which tool is most commonly used for process modeling in BA?', type: 'Multiple Choice', difficulty: 'Easy', aiScore: 92 },
  ],
  'Database Design Test': [
    { question: 'What is database normalization and why is it important?', type: 'Essay', difficulty: 'Medium', aiScore: 79 },
    { question: 'What is the difference between a primary key and a foreign key?', type: 'Multiple Choice', difficulty: 'Easy', aiScore: 96 },
    { question: 'Explain the concept of ACID properties in database transactions.', type: 'Essay', difficulty: 'Hard', aiScore: 61 },
  ],
  'AI Introduction Quiz': [
    { question: 'What is supervised learning?', type: 'Short Answer', difficulty: 'Easy', aiScore: 91 },
    { question: 'Explain the role of training data in machine learning.', type: 'Essay', difficulty: 'Medium', aiScore: 84 },
    { question: 'Which metric is commonly used for classification accuracy?', type: 'Multiple Choice', difficulty: 'Easy', aiScore: 89 },
  ],
  'Data Structures Checkpoint': [
    { question: 'What is the difference between a stack and a queue?', type: 'Short Answer', difficulty: 'Easy', aiScore: 92 },
    { question: 'Explain Big O notation with an example.', type: 'Essay', difficulty: 'Medium', aiScore: 78 },
  ],
  'Machine Learning Basics': [
    { question: 'What is overfitting?', type: 'Short Answer', difficulty: 'Medium', aiScore: 86 },
    { question: 'Compare regression and classification tasks.', type: 'Essay', difficulty: 'Medium', aiScore: 80 },
  ],
};

const seedPracticeReviewQueue = [
  {
    queueId: 'Q-1042',
    course: 'BIOLOGY 101 - MIDTERM PREP',
    time: 'Generated 2h ago',
    flag: 'Low Confidence',
    flagScore: 45,
    question: 'What is the primary function of the mitochondria in a eukaryotic cell?',
    aiAnswer: 'The mitochondria is responsible for storing genetic information and controlling cell division.',
    flagNote: 'Flag: Likely hallucination. Conflicts with standard biological definitions.',
    type: 'low',
    status: 'Pending',
  },
  {
    queueId: 'Q-0891',
    course: 'US HISTORY - AP PRACTICE',
    time: 'Reported 5h ago',
    flag: 'User Reported',
    question: 'Which president signed the Emancipation Proclamation?',
    currentAnswer: 'George Washington',
    userReportStudent: 'student_99',
    userReportText: '"This is completely wrong. It was Abraham Lincoln."',
    type: 'reported',
    status: 'Pending',
  },
  {
    queueId: 'Q-0774',
    course: 'CALCULUS II - FINAL PREP',
    time: 'Generated 4h ago',
    flag: 'Low Confidence',
    flagScore: 38,
    question: 'What is the integral of sin(x)?',
    aiAnswer: 'The integral of sin(x) is cos(x) + C.',
    flagNote: 'Flag: Sign error detected. Expected -cos(x) + C.',
    type: 'low',
    status: 'Pending',
  },
];

const seedDocuments = [
  {
    title: 'Software Requirements Specification v2.pdf',
    type: 'PDF',
    size: '3.4 MB',
    sizeMb: 3.4,
    course: 'Software Engineering',
    semester: 'Spring 2025',
    uploader: { name: 'Minh Tran', initials: 'MT', color: '#D1FAE5', text: '#047857' },
    uploadedAt: 'Jun 11, 2025 - 14:32',
    status: 'Pending',
    description: 'Updated SRS document including new functional requirements for the user authentication module.',
  },
  {
    title: 'Business Analysis Slide Deck.pptx',
    type: 'PPTX',
    size: '12.1 MB',
    sizeMb: 12.1,
    course: 'Business Analysis',
    semester: 'Spring 2025',
    uploader: { name: 'Alex Nguyen', initials: 'AN', color: '#DBEAFE', text: '#1D4ED8' },
    uploadedAt: 'Jun 11, 2025 - 11:05',
    status: 'Pending',
    description: 'Lecture slides covering SWOT analysis, stakeholder mapping, and process modeling techniques.',
  },
  {
    title: 'Database Design Cheatsheet.docx',
    type: 'DOCX',
    size: '0.8 MB',
    sizeMb: 0.8,
    course: 'Database',
    semester: 'Spring 2025',
    uploader: { name: 'Kim Anh', initials: 'KA', color: '#FEF3C7', text: '#B45309' },
    uploadedAt: 'Jun 10, 2025 - 09:17',
    status: 'Approved',
    description: 'Quick reference card for normalization rules, SQL syntax, and ER diagram notation.',
  },
  {
    title: 'AI Introduction Lecture Recording.mp4',
    type: 'MP4',
    size: '248 MB',
    sizeMb: 248,
    course: 'Artificial Intelligence',
    semester: 'Spring 2025',
    uploader: { name: 'John Pham', initials: 'JP', color: '#F3E8FF', text: '#7C3AED' },
    uploadedAt: 'Jun 10, 2025 - 20:44',
    status: 'Rejected',
    description: 'Lecture recording for Week 3 - Introduction to Neural Networks. Poor audio quality flagged.',
    rejectReason: 'Poor audio quality.',
  },
  {
    title: 'Calculus II Practice Exam.pdf',
    type: 'PDF',
    size: '1.2 MB',
    sizeMb: 1.2,
    course: 'Calculus II',
    semester: 'Fall 2025',
    uploader: { name: 'Linh Vo', initials: 'LV', color: '#DBEAFE', text: '#1D4ED8' },
    uploadedAt: 'Jun 09, 2025 - 16:55',
    status: 'Pending',
    description: 'Practice exam with 30 questions covering integration techniques and series convergence.',
  },
  {
    title: 'Database Query Examples.xlsx',
    type: 'XLSX',
    size: '2.3 MB',
    sizeMb: 2.3,
    course: 'Database',
    semester: 'Spring 2025',
    uploader: { name: 'Minh Tran', initials: 'MT', color: '#D1FAE5', text: '#047857' },
    uploadedAt: 'Jun 09, 2025 - 08:30',
    status: 'Approved',
    description: 'Collection of 50 SQL query examples with explanations covering joins, subqueries, and aggregation.',
  },
];

const seedPaymentMembers = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://i.pravatar.cc/36?img=47',
    plan: 'PRO',
    status: 'Active',
    billing: 'Yearly',
    paymentDate: 'Oct 24, 2023',
    amount: 588,
  },
  {
    name: 'Marcus Bell',
    email: 'm.bell@university.edu',
    initials: 'MB',
    avatarBg: '#dbeafe',
    avatarColor: '#1d4ed8',
    plan: 'PLUS',
    status: 'Active',
    billing: 'Monthly',
    paymentDate: 'Oct 12, 2023',
    amount: 19,
  },
  {
    name: 'David Wu',
    email: 'david.wu@techinst.org',
    initials: 'DW',
    avatarBg: '#ede9fe',
    avatarColor: '#7c3aed',
    plan: 'PRO',
    status: 'Active',
    billing: 'Yearly',
    paymentDate: 'Jan 05, 2023',
    amount: 588,
  },
  {
    name: 'Linh Nguyen',
    email: 'linh.n@school.edu',
    initials: 'LN',
    avatarBg: '#d1fae5',
    avatarColor: '#047857',
    plan: 'PLUS',
    status: 'Expired',
    billing: 'Monthly',
    paymentDate: 'Mar 18, 2023',
    amount: 19,
  },
  {
    name: 'Tom Harrington',
    email: 't.harrington@corp.com',
    initials: 'TH',
    avatarBg: '#fee2e2',
    avatarColor: '#dc2626',
    plan: 'PRO',
    status: 'Active',
    billing: 'Yearly',
    paymentDate: 'Dec 01, 2022',
    amount: 588,
  },
  {
    name: 'Amy Chen',
    email: 'amy.chen@startup.io',
    initials: 'AC',
    avatarBg: '#fef3c7',
    avatarColor: '#b45309',
    plan: 'PLUS',
    status: 'Active',
    billing: 'Monthly',
    paymentDate: 'Nov 30, 2023',
    amount: 19,
  },
];

const seedPaymentPlans = [
  { plan: 'PLUS', price: 19, billing: 'Monthly', description: 'Most popular choice for active users.' },
  { plan: 'PRO', price: 49, billing: 'Monthly', description: 'Advanced tools for institutions.' },
];

function readBoolean(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes'].includes(String(value).toLowerCase());
}

function assertSafeDatabaseName(name) {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error('SQLSERVER_DATABASE may only contain letters, numbers, and underscores.');
  }
}

function createSqlConfig(database = databaseName) {
  return {
    server: process.env.SQLSERVER_HOST || 'localhost',
    port: Number(process.env.SQLSERVER_PORT || 1433),
    database,
    user: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PASSWORD,
    options: {
      encrypt: readBoolean(process.env.SQLSERVER_ENCRYPT, false),
      trustServerCertificate: readBoolean(process.env.SQLSERVER_TRUST_SERVER_CERTIFICATE, true),
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
}

function normalizeUserInput(body) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();

  if (!name) {
    const error = new Error('Name is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!email) {
    const error = new Error('Email is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    email,
    role: body.role === 'Admin' ? 'Admin' : 'User',
    plan: ['Basic', 'Plus', 'Pro'].includes(body.plan) ? body.plan : 'Basic',
    folders: Number.isFinite(Number(body.folders)) ? Number(body.folders) : 0,
    tests: Number.isFinite(Number(body.tests)) ? Number(body.tests) : 0,
    type: body.type === 'logo' ? 'logo' : 'initials',
    initials: String(body.initials || getInitials(name)).trim(),
    color: String(body.color || '#DBEAFE'),
    textColor: String(body.textColor || '#1D4ED8'),
    location: String(body.location || 'Not set'),
    lastLogin: String(body.lastLogin || 'Never'),
    latestAction: String(body.latestAction || 'No activity yet.'),
    actionTime: String(body.actionTime || 'Just now'),
    status: body.status === 'Suspended' ? 'Suspended' : 'Active',
  };
}

function toUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    plan: row.plan || row.plan_name || 'Basic',
    folders: row.folders,
    tests: row.tests,
    type: row.type,
    initials: row.initials,
    color: row.color,
    textColor: row.text_color,
    location: row.location,
    lastLogin: row.last_login,
    latestAction: row.latest_action,
    actionTime: row.action_time,
    status: row.status,
  };
}

function getMonthLabel(dateText) {
  const [, month] = String(dateText || '').split('/');
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return labels[Number(month) - 1] || '';
}

function formatSemesterRange(startDate, endDate) {
  const start = getMonthLabel(startDate);
  const end = getMonthLabel(endDate);
  return start && end ? `${start} - ${end}` : `${startDate || ''} - ${endDate || ''}`.trim();
}

function normalizeSemesterInput(body) {
  const name = String(body.name || '').trim();
  if (!name) {
    const error = new Error('Semester name is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    startDate: String(body.startDate || '').trim(),
    endDate: String(body.endDate || '').trim(),
    description: String(body.description || '').trim(),
    status: body.status === 'ARCHIVED' ? 'ARCHIVED' : 'ACTIVE',
    storage: String(body.storage || '0 MB').trim(),
  };
}

function toSemester(row) {
  return {
    id: row.id,
    name: row.name,
    range: formatSemesterRange(row.start_date, row.end_date),
    courses: row.courses || 0,
    docs: row.docs || 0,
    storage: row.storage,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description || '',
  };
}

function normalizeCourseInput(body) {
  const name = String(body.name || '').trim();
  const code = String(body.code || '').trim();
  if (!name) {
    const error = new Error('Course name is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    code: code || 'COURSE',
    instructor: String(body.instructor || '').trim(),
    docs: Number.isFinite(Number(body.docs)) ? Number(body.docs) : 0,
    updated: String(body.updated || 'Just now').trim(),
    status: ['Active', 'Draft', 'Archived'].includes(body.status) ? body.status : 'Active',
    icon: String(body.icon || 'book').trim(),
    color: String(body.color || '#d1fae5').trim(),
    iconColor: String(body.iconColor || '#059669').trim(),
  };
}

function toCourse(row) {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    instructor: row.instructor,
    docs: row.docs,
    updated: row.updated_label,
    status: row.status,
    icon: row.icon,
    color: row.color,
    iconColor: row.icon_color,
  };
}

function normalizePracticeTestInput(body) {
  const name = String(body.name || '').trim();
  if (!name) {
    const error = new Error('Practice test name is required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    docs: Number.isFinite(Number(body.docs)) ? Number(body.docs) : 0,
    questions: Number.isFinite(Number(body.questions)) ? Number(body.questions) : 0,
    subject: String(body.subject || 'General').trim(),
    creatorInitials: String(body.creatorInitials || '??').trim(),
    creatorName: String(body.creatorName || 'Unknown').trim(),
    creatorColor: String(body.creatorColor || '#DBEAFE').trim(),
    creatorText: String(body.creatorText || '#1D4ED8').trim(),
    attempts: Number.isFinite(Number(body.attempts)) ? Number(body.attempts) : 0,
    avg: Number.isFinite(Number(body.avg)) ? Number(body.avg) : 0,
    status: ['Published', 'Pending Review', 'Flagged'].includes(body.status) ? body.status : 'Pending Review',
    createdType: ['AI Generated', 'Manual'].includes(body.createdType) ? body.createdType : 'AI Generated',
  };
}

function toPracticeTest(row) {
  return {
    id: row.id,
    name: row.name,
    docs: row.docs,
    questions: row.questions,
    subject: row.subject,
    creator: {
      initials: row.creator_initials,
      name: row.creator_name,
      color: row.creator_color,
      text: row.creator_text,
    },
    attempts: row.attempts,
    avg: row.avg,
    status: row.status,
    createdType: row.created_type,
  };
}

function normalizePracticeQuestionInput(body) {
  return {
    question: String(body.question || '').trim(),
    type: ['Multiple Choice', 'Essay', 'Short Answer'].includes(body.type) ? body.type : 'Multiple Choice',
    difficulty: ['Easy', 'Medium', 'Hard'].includes(body.difficulty) ? body.difficulty : 'Medium',
    aiScore: Number.isFinite(Number(body.aiScore)) ? Number(body.aiScore) : 0,
  };
}

function toPracticeQuestion(row) {
  return {
    id: row.id,
    question: row.question,
    type: row.question_type,
    difficulty: row.difficulty,
    aiScore: row.ai_score,
  };
}

function normalizeReviewQueueInput(body) {
  return {
    queueId: String(body.queueId || body.id || '').trim(),
    course: String(body.course || '').trim(),
    time: String(body.time || 'Just now').trim(),
    flag: String(body.flag || '').trim(),
    flagScore: body.flagScore === undefined || body.flagScore === null ? null : Number(body.flagScore),
    question: String(body.question || '').trim(),
    aiAnswer: String(body.aiAnswer || '').trim(),
    currentAnswer: String(body.currentAnswer || '').trim(),
    flagNote: String(body.flagNote || '').trim(),
    userReportStudent: String(body.userReportStudent || body.userReport?.student || '').trim(),
    userReportText: String(body.userReportText || body.userReport?.text || '').trim(),
    type: body.type === 'reported' ? 'reported' : 'low',
    status: ['Pending', 'Edited', 'Approved', 'Rejected', 'Deleted'].includes(body.status) ? body.status : 'Pending',
  };
}

function toReviewQueueItem(row) {
  return {
    id: row.queue_id,
    course: row.course,
    time: row.time_label,
    flag: row.flag,
    flagScore: row.flag_score,
    question: row.question,
    aiAnswer: row.ai_answer,
    currentAnswer: row.current_answer,
    flagNote: row.flag_note,
    userReport: row.user_report_student || row.user_report_text
      ? { student: row.user_report_student, text: row.user_report_text }
      : undefined,
    type: row.queue_type,
    status: row.status,
  };
}

function normalizeDocumentInput(body) {
  const title = String(body.title || '').trim();
  if (!title) {
    const error = new Error('Document title is required.');
    error.statusCode = 400;
    throw error;
  }

  const sizeMb = Number(body.sizeMb ?? String(body.size || '').replace(/[^\d.]/g, ''));

  return {
    title,
    type: ['PDF', 'DOCX', 'PPTX', 'XLSX', 'MP4'].includes(body.type) ? body.type : 'PDF',
    size: String(body.size || '0 MB').trim(),
    sizeMb: Number.isFinite(sizeMb) ? sizeMb : 0,
    course: String(body.course || '').trim(),
    semester: String(body.semester || '').trim(),
    uploaderName: String(body.uploaderName || body.uploader?.name || 'Unknown').trim(),
    uploaderInitials: String(body.uploaderInitials || body.uploader?.initials || '??').trim(),
    uploaderColor: String(body.uploaderColor || body.uploader?.color || '#DBEAFE').trim(),
    uploaderText: String(body.uploaderText || body.uploader?.text || '#1D4ED8').trim(),
    uploadedAt: String(body.uploadedAt || 'Just now').trim(),
    status: ['Pending', 'Approved', 'Rejected'].includes(body.status) ? body.status : 'Pending',
    description: String(body.description || '').trim(),
    rejectReason: String(body.rejectReason || '').trim(),
  };
}

function toDocument(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.document_type,
    size: row.size_label,
    sizeMb: Number(row.size_mb || 0),
    course: row.course,
    semester: row.semester,
    uploader: {
      name: row.uploader_name,
      initials: row.uploader_initials,
      color: row.uploader_color,
      text: row.uploader_text,
    },
    uploadedAt: row.uploaded_at_label,
    status: row.status,
    description: row.description,
    rejectReason: row.reject_reason,
  };
}

function normalizePaymentMemberInput(body) {
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  if (!name || !email) {
    const error = new Error('Payment member name and email are required.');
    error.statusCode = 400;
    throw error;
  }

  return {
    name,
    email,
    avatar: String(body.avatar || '').trim(),
    initials: String(body.initials || getInitials(name)).trim(),
    avatarBg: String(body.avatarBg || '#dbeafe').trim(),
    avatarColor: String(body.avatarColor || '#1d4ed8').trim(),
    plan: ['PLUS', 'PRO'].includes(body.plan) ? body.plan : 'PLUS',
    status: body.status === 'Expired' ? 'Expired' : 'Active',
    billing: body.billing === 'Yearly' ? 'Yearly' : 'Monthly',
    paymentDate: String(body.paymentDate || 'Just now').trim(),
    amount: Number.isFinite(Number(body.amount)) ? Number(body.amount) : 0,
  };
}

function normalizePaymentPlanInput(body) {
  const plan = String(body.plan || '').trim().toUpperCase();
  if (!['PLUS', 'PRO'].includes(plan)) {
    const error = new Error('Payment plan must be PLUS or PRO.');
    error.statusCode = 400;
    throw error;
  }

  return {
    plan,
    price: Number.isFinite(Number(body.price)) ? Number(body.price) : 0,
    billing: body.billing === 'Yearly' ? 'Yearly' : 'Monthly',
    description: String(body.description || '').trim(),
  };
}

function toPaymentMember(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar_url || '',
    initials: row.initials,
    avatarBg: row.avatar_bg,
    avatarColor: row.avatar_color,
    plan: row.plan_name,
    status: row.status,
    billing: row.billing,
    paymentDate: row.payment_date_label,
    amount: Number(row.amount || 0),
  };
}

function toPaymentPlan(row) {
  return {
    plan: row.plan_code,
    price: Number(row.price || 0),
    billing: row.billing,
    description: row.description,
  };
}

function bindUserInputs(request, data) {
  return request
    .input('name', sql.NVarChar(120), data.name)
    .input('email', sql.NVarChar(255), data.email)
    .input('role', sql.NVarChar(20), data.role)
    .input('plan', sql.NVarChar(20), data.plan)
    .input('folders', sql.Int, data.folders)
    .input('tests', sql.Int, data.tests)
    .input('type', sql.NVarChar(20), data.type)
    .input('initials', sql.NVarChar(10), data.initials)
    .input('color', sql.NVarChar(20), data.color)
    .input('textColor', sql.NVarChar(20), data.textColor)
    .input('location', sql.NVarChar(120), data.location)
    .input('lastLogin', sql.NVarChar(80), data.lastLogin)
    .input('latestAction', sql.NVarChar(500), data.latestAction)
    .input('actionTime', sql.NVarChar(80), data.actionTime)
    .input('status', sql.NVarChar(20), data.status);
}

function bindSemesterInputs(request, data) {
  return request
    .input('name', sql.NVarChar(120), data.name)
    .input('startDate', sql.NVarChar(30), data.startDate)
    .input('endDate', sql.NVarChar(30), data.endDate)
    .input('description', sql.NVarChar(600), data.description)
    .input('status', sql.NVarChar(20), data.status)
    .input('storage', sql.NVarChar(40), data.storage);
}

function bindCourseInputs(request, data) {
  return request
    .input('name', sql.NVarChar(160), data.name)
    .input('code', sql.NVarChar(40), data.code)
    .input('instructor', sql.NVarChar(120), data.instructor)
    .input('docs', sql.Int, data.docs)
    .input('updated', sql.NVarChar(80), data.updated)
    .input('status', sql.NVarChar(20), data.status)
    .input('icon', sql.NVarChar(30), data.icon)
    .input('color', sql.NVarChar(20), data.color)
    .input('iconColor', sql.NVarChar(20), data.iconColor);
}

function bindPracticeTestInputs(request, data) {
  return request
    .input('name', sql.NVarChar(180), data.name)
    .input('docs', sql.Int, data.docs)
    .input('questions', sql.Int, data.questions)
    .input('subject', sql.NVarChar(120), data.subject)
    .input('creatorInitials', sql.NVarChar(10), data.creatorInitials)
    .input('creatorName', sql.NVarChar(120), data.creatorName)
    .input('creatorColor', sql.NVarChar(20), data.creatorColor)
    .input('creatorText', sql.NVarChar(20), data.creatorText)
    .input('attempts', sql.Int, data.attempts)
    .input('avg', sql.Int, data.avg)
    .input('status', sql.NVarChar(30), data.status)
    .input('createdType', sql.NVarChar(30), data.createdType);
}

function bindPracticeQuestionInputs(request, data) {
  return request
    .input('question', sql.NVarChar(1000), data.question)
    .input('type', sql.NVarChar(40), data.type)
    .input('difficulty', sql.NVarChar(20), data.difficulty)
    .input('aiScore', sql.Int, data.aiScore);
}

function bindReviewQueueInputs(request, data) {
  return request
    .input('queueId', sql.NVarChar(40), data.queueId)
    .input('course', sql.NVarChar(160), data.course)
    .input('time', sql.NVarChar(80), data.time)
    .input('flag', sql.NVarChar(80), data.flag)
    .input('flagScore', sql.Int, data.flagScore)
    .input('question', sql.NVarChar(1000), data.question)
    .input('aiAnswer', sql.NVarChar(1000), data.aiAnswer)
    .input('currentAnswer', sql.NVarChar(1000), data.currentAnswer)
    .input('flagNote', sql.NVarChar(1000), data.flagNote)
    .input('userReportStudent', sql.NVarChar(120), data.userReportStudent)
    .input('userReportText', sql.NVarChar(1000), data.userReportText)
    .input('type', sql.NVarChar(20), data.type)
    .input('status', sql.NVarChar(20), data.status);
}

function bindDocumentInputs(request, data) {
  return request
    .input('title', sql.NVarChar(255), data.title)
    .input('type', sql.NVarChar(20), data.type)
    .input('size', sql.NVarChar(40), data.size)
    .input('sizeMb', sql.Decimal(10, 2), data.sizeMb)
    .input('course', sql.NVarChar(160), data.course)
    .input('semester', sql.NVarChar(120), data.semester)
    .input('uploaderName', sql.NVarChar(120), data.uploaderName)
    .input('uploaderInitials', sql.NVarChar(10), data.uploaderInitials)
    .input('uploaderColor', sql.NVarChar(20), data.uploaderColor)
    .input('uploaderText', sql.NVarChar(20), data.uploaderText)
    .input('uploadedAt', sql.NVarChar(80), data.uploadedAt)
    .input('status', sql.NVarChar(20), data.status)
    .input('description', sql.NVarChar(1000), data.description)
    .input('rejectReason', sql.NVarChar(1000), data.rejectReason);
}

function bindPaymentMemberInputs(request, data) {
  return request
    .input('name', sql.NVarChar(120), data.name)
    .input('email', sql.NVarChar(255), data.email)
    .input('avatar', sql.NVarChar(500), data.avatar)
    .input('initials', sql.NVarChar(10), data.initials)
    .input('avatarBg', sql.NVarChar(20), data.avatarBg)
    .input('avatarColor', sql.NVarChar(20), data.avatarColor)
    .input('plan', sql.NVarChar(20), data.plan)
    .input('status', sql.NVarChar(20), data.status)
    .input('billing', sql.NVarChar(20), data.billing)
    .input('paymentDate', sql.NVarChar(80), data.paymentDate)
    .input('amount', sql.Decimal(10, 2), data.amount);
}

function bindPaymentPlanInputs(request, data) {
  return request
    .input('plan', sql.NVarChar(20), data.plan)
    .input('price', sql.Decimal(10, 2), data.price)
    .input('billing', sql.NVarChar(20), data.billing)
    .input('description', sql.NVarChar(300), data.description);
}

async function ensureDatabase() {
  assertSafeDatabaseName(databaseName);

  const masterPool = await sql.connect(createSqlConfig('master'));
  await masterPool.request().query(`
    IF DB_ID(N'${databaseName}') IS NULL
    BEGIN
      CREATE DATABASE [${databaseName}];
    END
  `);

  await masterPool.close();
}

async function ensureSchema(pool) {
  await pool.request().query(`
    IF OBJECT_ID(N'dbo.users', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.USER_MANAGEMENT', N'U') IS NULL
      EXEC sp_rename N'dbo.users', N'USER_MANAGEMENT';

    IF OBJECT_ID(N'dbo.library_semesters', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.LIBRARY_MANAGEMENT_SEMESTERS', N'U') IS NULL
      EXEC sp_rename N'dbo.library_semesters', N'LIBRARY_MANAGEMENT_SEMESTERS';

    IF OBJECT_ID(N'dbo.library_courses', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.LIBRARY_MANAGEMENT_COURSES', N'U') IS NULL
      EXEC sp_rename N'dbo.library_courses', N'LIBRARY_MANAGEMENT_COURSES';

    IF OBJECT_ID(N'dbo.practice_tests', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.PRACTICE_TEST_MANAGEMENT', N'U') IS NULL
      EXEC sp_rename N'dbo.practice_tests', N'PRACTICE_TEST_MANAGEMENT';

    IF OBJECT_ID(N'dbo.practice_questions', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.PRACTICE_TEST_MANAGEMENT_QUESTIONS', N'U') IS NULL
      EXEC sp_rename N'dbo.practice_questions', N'PRACTICE_TEST_MANAGEMENT_QUESTIONS';

    IF OBJECT_ID(N'dbo.documents', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.DOCUMENT_MANAGEMENT', N'U') IS NULL
      EXEC sp_rename N'dbo.documents', N'DOCUMENT_MANAGEMENT';

    IF OBJECT_ID(N'dbo.payments', N'U') IS NOT NULL
       AND OBJECT_ID(N'dbo.PAYMENT_MANAGEMENT', N'U') IS NULL
      EXEC sp_rename N'dbo.payments', N'PAYMENT_MANAGEMENT';

    IF COL_LENGTH(N'dbo.PAYMENT_MANAGEMENT', N'plan') IS NOT NULL
       AND COL_LENGTH(N'dbo.PAYMENT_MANAGEMENT', N'plan_name') IS NULL
      EXEC sp_rename N'dbo.PAYMENT_MANAGEMENT.plan', N'plan_name', N'COLUMN';

    IF COL_LENGTH(N'dbo.PAYMENT_MANAGEMENT_PLANS', N'plan') IS NOT NULL
       AND COL_LENGTH(N'dbo.PAYMENT_MANAGEMENT_PLANS', N'plan_code') IS NULL
      EXEC sp_rename N'dbo.PAYMENT_MANAGEMENT_PLANS.plan', N'plan_code', N'COLUMN';
  `);

  await pool.request().query(`
    IF OBJECT_ID(N'dbo.USER_MANAGEMENT', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.USER_MANAGEMENT (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(120) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        role NVARCHAR(20) NOT NULL DEFAULT 'User',
        plan_name NVARCHAR(20) NOT NULL DEFAULT 'Basic',
        folders INT NOT NULL DEFAULT 0,
        tests INT NOT NULL DEFAULT 0,
        type NVARCHAR(20) NOT NULL DEFAULT 'initials',
        initials NVARCHAR(10) NOT NULL DEFAULT '?',
        color NVARCHAR(20) NOT NULL DEFAULT '#DBEAFE',
        text_color NVARCHAR(20) NOT NULL DEFAULT '#1D4ED8',
        location NVARCHAR(120) NOT NULL DEFAULT 'Not set',
        last_login NVARCHAR(80) NOT NULL DEFAULT 'Never',
        latest_action NVARCHAR(500) NOT NULL DEFAULT 'No activity yet.',
        action_time NVARCHAR(80) NOT NULL DEFAULT 'Just now',
        status NVARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);

  await pool.request().query(`
    IF OBJECT_ID(N'dbo.DOCUMENT_MANAGEMENT', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.DOCUMENT_MANAGEMENT (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL UNIQUE,
        document_type NVARCHAR(20) NOT NULL DEFAULT 'PDF',
        size_label NVARCHAR(40) NOT NULL DEFAULT '0 MB',
        size_mb DECIMAL(10,2) NOT NULL DEFAULT 0,
        course NVARCHAR(160) NOT NULL DEFAULT '',
        semester NVARCHAR(120) NOT NULL DEFAULT '',
        uploader_name NVARCHAR(120) NOT NULL DEFAULT 'Unknown',
        uploader_initials NVARCHAR(10) NOT NULL DEFAULT '??',
        uploader_color NVARCHAR(20) NOT NULL DEFAULT '#DBEAFE',
        uploader_text NVARCHAR(20) NOT NULL DEFAULT '#1D4ED8',
        uploaded_at_label NVARCHAR(80) NOT NULL DEFAULT 'Just now',
        status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
        description NVARCHAR(1000) NOT NULL DEFAULT '',
        reject_reason NVARCHAR(1000) NOT NULL DEFAULT '',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);

  await pool.request().query(`
    IF OBJECT_ID(N'dbo.PAYMENT_MANAGEMENT', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.PAYMENT_MANAGEMENT (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(120) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        avatar_url NVARCHAR(500) NOT NULL DEFAULT '',
        initials NVARCHAR(10) NOT NULL DEFAULT '??',
        avatar_bg NVARCHAR(20) NOT NULL DEFAULT '#dbeafe',
        avatar_color NVARCHAR(20) NOT NULL DEFAULT '#1d4ed8',
        plan_name NVARCHAR(20) NOT NULL DEFAULT 'PLUS',
        status NVARCHAR(20) NOT NULL DEFAULT 'Active',
        billing NVARCHAR(20) NOT NULL DEFAULT 'Monthly',
        payment_date_label NVARCHAR(80) NOT NULL DEFAULT 'Just now',
        amount DECIMAL(10,2) NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END

    IF OBJECT_ID(N'dbo.PAYMENT_MANAGEMENT_PLANS', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.PAYMENT_MANAGEMENT_PLANS (
        plan_code NVARCHAR(20) NOT NULL PRIMARY KEY,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        billing NVARCHAR(20) NOT NULL DEFAULT 'Monthly',
        description NVARCHAR(300) NOT NULL DEFAULT '',
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);

  await pool.request().query(`
    IF OBJECT_ID(N'dbo.LIBRARY_MANAGEMENT_SEMESTERS', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.LIBRARY_MANAGEMENT_SEMESTERS (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(120) NOT NULL UNIQUE,
        start_date NVARCHAR(30) NOT NULL DEFAULT '',
        end_date NVARCHAR(30) NOT NULL DEFAULT '',
        description NVARCHAR(600) NOT NULL DEFAULT '',
        status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        storage NVARCHAR(40) NOT NULL DEFAULT '0 MB',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END

    IF OBJECT_ID(N'dbo.LIBRARY_MANAGEMENT_COURSES', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.LIBRARY_MANAGEMENT_COURSES (
        id INT IDENTITY(1,1) PRIMARY KEY,
        semester_id INT NOT NULL,
        name NVARCHAR(160) NOT NULL,
        code NVARCHAR(40) NOT NULL,
        instructor NVARCHAR(120) NOT NULL DEFAULT '',
        docs INT NOT NULL DEFAULT 0,
        updated_label NVARCHAR(80) NOT NULL DEFAULT 'Just now',
        status NVARCHAR(20) NOT NULL DEFAULT 'Active',
        icon NVARCHAR(30) NOT NULL DEFAULT 'book',
        color NVARCHAR(20) NOT NULL DEFAULT '#d1fae5',
        icon_color NVARCHAR(20) NOT NULL DEFAULT '#059669',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_library_courses_semesters
          FOREIGN KEY (semester_id) REFERENCES dbo.LIBRARY_MANAGEMENT_SEMESTERS(id) ON DELETE CASCADE
      );
    END
  `);

  await pool.request().query(`
    IF OBJECT_ID(N'dbo.PRACTICE_TEST_MANAGEMENT', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.PRACTICE_TEST_MANAGEMENT (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(180) NOT NULL UNIQUE,
        docs INT NOT NULL DEFAULT 0,
        questions INT NOT NULL DEFAULT 0,
        subject NVARCHAR(120) NOT NULL DEFAULT 'General',
        creator_initials NVARCHAR(10) NOT NULL DEFAULT '??',
        creator_name NVARCHAR(120) NOT NULL DEFAULT 'Unknown',
        creator_color NVARCHAR(20) NOT NULL DEFAULT '#DBEAFE',
        creator_text NVARCHAR(20) NOT NULL DEFAULT '#1D4ED8',
        attempts INT NOT NULL DEFAULT 0,
        avg INT NOT NULL DEFAULT 0,
        status NVARCHAR(30) NOT NULL DEFAULT 'Pending Review',
        created_type NVARCHAR(30) NOT NULL DEFAULT 'AI Generated',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END

    IF OBJECT_ID(N'dbo.PRACTICE_TEST_MANAGEMENT_QUESTIONS', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.PRACTICE_TEST_MANAGEMENT_QUESTIONS (
        id INT IDENTITY(1,1) PRIMARY KEY,
        test_id INT NOT NULL,
        question NVARCHAR(1000) NOT NULL,
        question_type NVARCHAR(40) NOT NULL DEFAULT 'Multiple Choice',
        difficulty NVARCHAR(20) NOT NULL DEFAULT 'Medium',
        ai_score INT NOT NULL DEFAULT 0,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_practice_questions_tests
          FOREIGN KEY (test_id) REFERENCES dbo.PRACTICE_TEST_MANAGEMENT(id) ON DELETE CASCADE
      );
    END

    IF OBJECT_ID(N'dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE', N'U') IS NULL
    BEGIN
      CREATE TABLE dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE (
        id INT IDENTITY(1,1) PRIMARY KEY,
        queue_id NVARCHAR(40) NOT NULL UNIQUE,
        course NVARCHAR(160) NOT NULL DEFAULT '',
        time_label NVARCHAR(80) NOT NULL DEFAULT 'Just now',
        flag NVARCHAR(80) NOT NULL DEFAULT '',
        flag_score INT NULL,
        question NVARCHAR(1000) NOT NULL,
        ai_answer NVARCHAR(1000) NOT NULL DEFAULT '',
        current_answer NVARCHAR(1000) NOT NULL DEFAULT '',
        flag_note NVARCHAR(1000) NOT NULL DEFAULT '',
        user_report_student NVARCHAR(120) NOT NULL DEFAULT '',
        user_report_text NVARCHAR(1000) NOT NULL DEFAULT '',
        queue_type NVARCHAR(20) NOT NULL DEFAULT 'low',
        status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
      );
    END
  `);

  for (const user of seedUsers) {
    const data = normalizeUserInput(user);
    await bindUserInputs(pool.request(), data).query(`
      IF NOT EXISTS (SELECT 1 FROM dbo.USER_MANAGEMENT WHERE email = @email)
      BEGIN
        INSERT INTO dbo.USER_MANAGEMENT (
          name, email, role, plan_name, folders, tests, type, initials, color, text_color,
          location, last_login, latest_action, action_time, status
        )
        VALUES (
          @name, @email, @role, @plan, @folders, @tests, @type, @initials, @color, @textColor,
          @location, @lastLogin, @latestAction, @actionTime, @status
        );
      END
    `);
  }

  const semesterCount = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.LIBRARY_MANAGEMENT_SEMESTERS;');
  if (semesterCount.recordset[0].total === 0) {
    for (const semester of seedSemesters) {
      const data = normalizeSemesterInput(semester);
      const insertedSemester = await bindSemesterInputs(pool.request(), data).query(`
        INSERT INTO dbo.LIBRARY_MANAGEMENT_SEMESTERS (name, start_date, end_date, description, status, storage)
        OUTPUT INSERTED.id
        VALUES (@name, @startDate, @endDate, @description, @status, @storage);
      `);

      const semesterId = insertedSemester.recordset[0].id;
      const courses = seedCourses[data.name] || [];

      for (const course of courses) {
        const courseData = normalizeCourseInput(course);
        await bindCourseInputs(pool.request(), courseData)
          .input('semesterId', sql.Int, semesterId)
          .query(`
            INSERT INTO dbo.LIBRARY_MANAGEMENT_COURSES (
              semester_id, name, code, instructor, docs, updated_label,
              status, icon, color, icon_color
            )
            VALUES (
              @semesterId, @name, @code, @instructor, @docs, @updated,
              @status, @icon, @color, @iconColor
            );
          `);
      }
    }
  }

  const practiceTestCount = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.PRACTICE_TEST_MANAGEMENT;');
  if (practiceTestCount.recordset[0].total === 0) {
    for (const test of seedPracticeTests) {
      const data = normalizePracticeTestInput(test);
      const insertedTest = await bindPracticeTestInputs(pool.request(), data).query(`
        INSERT INTO dbo.PRACTICE_TEST_MANAGEMENT (
          name, docs, questions, subject, creator_initials, creator_name,
          creator_color, creator_text, attempts, avg, status, created_type
        )
        OUTPUT INSERTED.id
        VALUES (
          @name, @docs, @questions, @subject, @creatorInitials, @creatorName,
          @creatorColor, @creatorText, @attempts, @avg, @status, @createdType
        );
      `);

      const testId = insertedTest.recordset[0].id;
      const questions = seedPracticeQuestions[data.name] || [];
      for (const question of questions) {
        const questionData = normalizePracticeQuestionInput(question);
        await bindPracticeQuestionInputs(pool.request(), questionData)
          .input('testId', sql.Int, testId)
          .query(`
            INSERT INTO dbo.PRACTICE_TEST_MANAGEMENT_QUESTIONS (test_id, question, question_type, difficulty, ai_score)
            VALUES (@testId, @question, @type, @difficulty, @aiScore);
          `);
      }
    }
  }

  const reviewQueueCount = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE;');
  if (reviewQueueCount.recordset[0].total === 0) {
    for (const item of seedPracticeReviewQueue) {
      const data = normalizeReviewQueueInput(item);
      await bindReviewQueueInputs(pool.request(), data).query(`
        INSERT INTO dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE (
          queue_id, course, time_label, flag, flag_score, question, ai_answer,
          current_answer, flag_note, user_report_student, user_report_text,
          queue_type, status
        )
        VALUES (
          @queueId, @course, @time, @flag, @flagScore, @question, @aiAnswer,
          @currentAnswer, @flagNote, @userReportStudent, @userReportText,
          @type, @status
        );
      `);
    }
  }

  const documentCount = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.DOCUMENT_MANAGEMENT;');
  if (documentCount.recordset[0].total === 0) {
    for (const document of seedDocuments) {
      const data = normalizeDocumentInput(document);
      await bindDocumentInputs(pool.request(), data).query(`
        INSERT INTO dbo.DOCUMENT_MANAGEMENT (
          title, document_type, size_label, size_mb, course, semester,
          uploader_name, uploader_initials, uploader_color, uploader_text,
          uploaded_at_label, status, description, reject_reason
        )
        VALUES (
          @title, @type, @size, @sizeMb, @course, @semester,
          @uploaderName, @uploaderInitials, @uploaderColor, @uploaderText,
          @uploadedAt, @status, @description, @rejectReason
        );
      `);
    }
  }

  const paymentMemberCount = await pool.request().query('SELECT COUNT(*) AS total FROM dbo.PAYMENT_MANAGEMENT;');
  if (paymentMemberCount.recordset[0].total === 0) {
    for (const member of seedPaymentMembers) {
      const data = normalizePaymentMemberInput(member);
      await bindPaymentMemberInputs(pool.request(), data).query(`
        INSERT INTO dbo.PAYMENT_MANAGEMENT (
          name, email, avatar_url, initials, avatar_bg, avatar_color,
          plan_name, status, billing, payment_date_label, amount
        )
        VALUES (
          @name, @email, @avatar, @initials, @avatarBg, @avatarColor,
          @plan, @status, @billing, @paymentDate, @amount
        );
      `);
    }
  }

  for (const plan of seedPaymentPlans) {
    const data = normalizePaymentPlanInput(plan);
    await bindPaymentPlanInputs(pool.request(), data).query(`
      IF NOT EXISTS (SELECT 1 FROM dbo.PAYMENT_MANAGEMENT_PLANS WHERE plan_code = @plan)
      BEGIN
        INSERT INTO dbo.PAYMENT_MANAGEMENT_PLANS (plan_code, price, billing, description)
        VALUES (@plan, @price, @billing, @description);
      END
    `);
  }
}

async function createPool() {
  await ensureDatabase();
  const pool = await new sql.ConnectionPool(createSqlConfig()).connect();
  await ensureSchema(pool);
  return pool;
}

const pool = await createPool();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    database: databaseName,
    server: process.env.SQLSERVER_HOST || 'localhost',
  });
});

app.get('/api/admin/dashboard', async (_req, res, next) => {
  try {
    const [
      usersResult,
      revenueResult,
      documentsResult,
      practiceTestsResult,
      planResult,
      recentDocumentsResult,
      reviewQueueResult,
    ] = await Promise.all([
      pool.request().query(`
        SELECT
          COUNT(*) AS total_users,
          SUM(CASE WHEN created_at >= DATEADD(day, -30, SYSUTCDATETIME()) THEN 1 ELSE 0 END) AS new_this_month
        FROM dbo.USER_MANAGEMENT;
      `),
      pool.request().query(`
        SELECT
          COALESCE(SUM(CASE WHEN status = 'Active' THEN amount ELSE 0 END), 0) AS total_revenue,
          COALESCE(SUM(CASE WHEN status = 'Active' AND plan_name = 'PLUS' THEN amount ELSE 0 END), 0) AS plus_revenue,
          COALESCE(SUM(CASE WHEN status = 'Active' AND plan_name = 'PRO' THEN amount ELSE 0 END), 0) AS pro_revenue
        FROM dbo.PAYMENT_MANAGEMENT;
      `),
      pool.request().query(`
        SELECT
          COUNT(*) AS total_documents,
          COALESCE(SUM(size_mb), 0) AS total_size_mb,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved_documents,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending_documents
        FROM dbo.DOCUMENT_MANAGEMENT;
      `),
      pool.request().query(`
        SELECT COUNT(*) AS total_tests
        FROM dbo.PRACTICE_TEST_MANAGEMENT;
      `),
      pool.request().query(`
        SELECT plan_name, COUNT(*) AS total
        FROM dbo.USER_MANAGEMENT
        GROUP BY plan_name;
      `),
      pool.request().query(`
        SELECT TOP 5 title, uploader_name, uploaded_at_label, status
        FROM dbo.DOCUMENT_MANAGEMENT
        ORDER BY id DESC;
      `),
      pool.request().query(`
        SELECT COUNT(*) AS pending_reviews
        FROM dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE
        WHERE status IN ('Pending', 'Edited');
      `),
    ]);

    const users = usersResult.recordset[0];
    const revenue = revenueResult.recordset[0];
    const documents = documentsResult.recordset[0];
    const practiceTests = practiceTestsResult.recordset[0];
    const totalUsers = Number(users.total_users || 0);
    const planDistribution = planResult.recordset.map((row) => ({
      plan: row.plan_name,
      total: row.total,
      percent: totalUsers ? Math.round((row.total / totalUsers) * 100) : 0,
    }));

    res.json({
      stats: {
        totalUsers,
        newUsersThisMonth: Number(users.new_this_month || 0),
        totalRevenue: Number(revenue.total_revenue || 0),
        plusRevenue: Number(revenue.plus_revenue || 0),
        proRevenue: Number(revenue.pro_revenue || 0),
        totalDocuments: Number(documents.total_documents || 0),
        totalSizeMb: Number(documents.total_size_mb || 0),
        approvedDocuments: Number(documents.approved_documents || 0),
        pendingDocuments: Number(documents.pending_documents || 0),
        totalPracticeTests: Number(practiceTests.total_tests || 0),
        pendingReviews: Number(reviewQueueResult.recordset[0].pending_reviews || 0),
      },
      planDistribution,
      recentDocuments: recentDocumentsResult.recordset.map((row) => ({
        title: row.title,
        user: row.uploader_name,
        time: row.uploaded_at_label,
        status: row.status,
      })),
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/users', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    const request = pool.request();

    const result = q
      ? await request.input('search', sql.NVarChar(260), `%${q}%`).query(`
          SELECT id, name, email, role, plan_name AS [plan], folders, tests, type, initials, color,
                 text_color, location, last_login, latest_action, action_time, status
          FROM dbo.USER_MANAGEMENT
          WHERE LOWER(name) LIKE @search
             OR LOWER(email) LIKE @search
             OR LOWER(role) LIKE @search
             OR LOWER(plan_name) LIKE @search
          ORDER BY id DESC;
        `)
      : await request.query(`
          SELECT id, name, email, role, plan_name AS [plan], folders, tests, type, initials, color,
                 text_color, location, last_login, latest_action, action_time, status
          FROM dbo.USER_MANAGEMENT
          ORDER BY id DESC;
        `);

    res.json(result.recordset.map(toUser));
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/users', async (req, res, next) => {
  try {
    const data = normalizeUserInput(req.body);
    const result = await bindUserInputs(pool.request(), data).query(`
      INSERT INTO dbo.USER_MANAGEMENT (
        name, email, role, plan_name, folders, tests, type, initials, color, text_color,
        location, last_login, latest_action, action_time, status
      )
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role,
             INSERTED.plan_name AS [plan], INSERTED.folders, INSERTED.tests, INSERTED.type,
             INSERTED.initials, INSERTED.color, INSERTED.text_color, INSERTED.location,
             INSERTED.last_login, INSERTED.latest_action, INSERTED.action_time, INSERTED.status
      VALUES (
        @name, @email, @role, @plan, @folders, @tests, @type, @initials, @color, @textColor,
        @location, @lastLogin, @latestAction, @actionTime, @status
      );
    `);

    res.status(201).json(toUser(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/users/:id', async (req, res, next) => {
  try {
    const existing = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .query(`
        SELECT id, name, email, role, plan_name AS [plan], folders, tests, type, initials, color,
               text_color, location, last_login, latest_action, action_time, status
        FROM dbo.USER_MANAGEMENT
        WHERE id = @id;
      `);

    if (existing.recordset.length === 0) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const data = normalizeUserInput({ ...toUser(existing.recordset[0]), ...req.body });
    const result = await bindUserInputs(pool.request(), data)
      .input('id', sql.Int, Number(req.params.id))
      .query(`
        UPDATE dbo.USER_MANAGEMENT
        SET name = @name,
            email = @email,
            role = @role,
            plan_name = @plan,
            folders = @folders,
            tests = @tests,
            type = @type,
            initials = @initials,
            color = @color,
            text_color = @textColor,
            location = @location,
            last_login = @lastLogin,
            latest_action = @latestAction,
            action_time = @actionTime,
            status = @status,
            updated_at = SYSUTCDATETIME()
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role,
               INSERTED.plan_name AS [plan], INSERTED.folders, INSERTED.tests, INSERTED.type,
               INSERTED.initials, INSERTED.color, INSERTED.text_color, INSERTED.location,
               INSERTED.last_login, INSERTED.latest_action, INSERTED.action_time, INSERTED.status
        WHERE id = @id;
      `);

    res.json(toUser(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/users/:id', async (req, res, next) => {
  try {
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .query('DELETE FROM dbo.USER_MANAGEMENT WHERE id = @id;');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/library/semesters', async (_req, res, next) => {
  try {
    const result = await pool.request().query(`
      SELECT s.id, s.name, s.start_date, s.end_date, s.description, s.status, s.storage,
             COUNT(c.id) AS courses,
             COALESCE(SUM(c.docs), 0) AS docs
      FROM dbo.LIBRARY_MANAGEMENT_SEMESTERS s
      LEFT JOIN dbo.LIBRARY_MANAGEMENT_COURSES c ON c.semester_id = s.id
      GROUP BY s.id, s.name, s.start_date, s.end_date, s.description, s.status, s.storage
      ORDER BY s.id DESC;
    `);

    res.json(result.recordset.map(toSemester));
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/library/semesters', async (req, res, next) => {
  try {
    const data = normalizeSemesterInput(req.body);
    const result = await bindSemesterInputs(pool.request(), data).query(`
      INSERT INTO dbo.LIBRARY_MANAGEMENT_SEMESTERS (name, start_date, end_date, description, status, storage)
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.start_date, INSERTED.end_date,
             INSERTED.description, INSERTED.status, INSERTED.storage,
             0 AS courses, 0 AS docs
      VALUES (@name, @startDate, @endDate, @description, @status, @storage);
    `);

    res.status(201).json(toSemester(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/library/semesters/:id', async (req, res, next) => {
  try {
    const data = normalizeSemesterInput(req.body);
    const updateResult = await bindSemesterInputs(pool.request(), data)
      .input('id', sql.Int, Number(req.params.id))
      .query(`
        UPDATE dbo.LIBRARY_MANAGEMENT_SEMESTERS
        SET name = @name,
            start_date = @startDate,
            end_date = @endDate,
            description = @description,
            status = @status,
            storage = @storage,
            updated_at = SYSUTCDATETIME()
        WHERE id = @id;
      `);

    if (updateResult.rowsAffected[0] === 0) {
      res.status(404).json({ message: 'Semester not found.' });
      return;
    }

    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .query(`
        SELECT s.id, s.name, s.start_date, s.end_date, s.description, s.status, s.storage,
               COUNT(c.id) AS courses,
               COALESCE(SUM(c.docs), 0) AS docs
        FROM dbo.LIBRARY_MANAGEMENT_SEMESTERS s
        LEFT JOIN dbo.LIBRARY_MANAGEMENT_COURSES c ON c.semester_id = s.id
        WHERE s.id = @id
        GROUP BY s.id, s.name, s.start_date, s.end_date, s.description, s.status, s.storage;
      `);

    res.json(toSemester(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/library/semesters/:id', async (req, res, next) => {
  try {
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .query('DELETE FROM dbo.LIBRARY_MANAGEMENT_SEMESTERS WHERE id = @id;');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: 'Semester not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/library/semesters/:id/courses', async (req, res, next) => {
  try {
    const result = await pool.request()
      .input('semesterId', sql.Int, Number(req.params.id))
      .query(`
        SELECT id, name, code, instructor, docs, updated_label, status, icon, color, icon_color
        FROM dbo.LIBRARY_MANAGEMENT_COURSES
        WHERE semester_id = @semesterId
        ORDER BY id DESC;
      `);

    res.json(result.recordset.map(toCourse));
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/library/semesters/:id/courses', async (req, res, next) => {
  try {
    const data = normalizeCourseInput(req.body);
    const result = await bindCourseInputs(pool.request(), data)
      .input('semesterId', sql.Int, Number(req.params.id))
      .query(`
        INSERT INTO dbo.LIBRARY_MANAGEMENT_COURSES (
          semester_id, name, code, instructor, docs, updated_label,
          status, icon, color, icon_color
        )
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.code, INSERTED.instructor,
               INSERTED.docs, INSERTED.updated_label, INSERTED.status,
               INSERTED.icon, INSERTED.color, INSERTED.icon_color
        VALUES (
          @semesterId, @name, @code, @instructor, @docs, @updated,
          @status, @icon, @color, @iconColor
        );
      `);

    res.status(201).json(toCourse(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/library/courses/:id', async (req, res, next) => {
  try {
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .query('DELETE FROM dbo.LIBRARY_MANAGEMENT_COURSES WHERE id = @id;');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/document-management', async (_req, res, next) => {
  try {
    const result = await pool.request().query(`
      SELECT id, title, document_type, size_label, size_mb, course, semester,
             uploader_name, uploader_initials, uploader_color, uploader_text,
             uploaded_at_label, status, description, reject_reason
      FROM dbo.DOCUMENT_MANAGEMENT
      ORDER BY id DESC;
    `);

    res.json(result.recordset.map(toDocument));
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/document-management/:id/status', async (req, res, next) => {
  try {
    const status = ['Pending', 'Approved', 'Rejected'].includes(req.body.status)
      ? req.body.status
      : 'Pending';
    const rejectReason = status === 'Rejected' ? String(req.body.rejectReason || '').trim() : '';
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .input('status', sql.NVarChar(20), status)
      .input('rejectReason', sql.NVarChar(1000), rejectReason)
      .query(`
        UPDATE dbo.DOCUMENT_MANAGEMENT
        SET status = @status,
            reject_reason = @rejectReason,
            updated_at = SYSUTCDATETIME()
        WHERE id = @id;

        SELECT id, title, document_type, size_label, size_mb, course, semester,
               uploader_name, uploader_initials, uploader_color, uploader_text,
               uploaded_at_label, status, description, reject_reason
        FROM dbo.DOCUMENT_MANAGEMENT
        WHERE id = @id;
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'Document not found.' });
      return;
    }

    res.json(toDocument(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/payments', async (_req, res, next) => {
  try {
    const membersResult = await pool.request().query(`
      SELECT id, name, email, avatar_url, initials, avatar_bg, avatar_color,
             plan_name, status, billing, payment_date_label, amount
      FROM dbo.PAYMENT_MANAGEMENT
      ORDER BY id DESC;
    `);
    const plansResult = await pool.request().query(`
      SELECT plan_code, price, billing, description
      FROM dbo.PAYMENT_MANAGEMENT_PLANS
      ORDER BY CASE plan_code WHEN 'PLUS' THEN 1 WHEN 'PRO' THEN 2 ELSE 3 END;
    `);

    const members = membersResult.recordset.map(toPaymentMember);
    const activeSubscriptions = members.filter(member => member.status === 'Active').length;
    const pendingInvoices = members.filter(member => member.status === 'Expired').length;
    const totalRevenue = members.reduce((sum, member) => {
      if (member.status !== 'Active') return sum;
      return sum + Number(member.amount || 0);
    }, 0);

    res.json({
      members,
      plans: plansResult.recordset.map(toPaymentPlan),
      stats: {
        totalRevenue,
        activeSubscriptions,
        pendingInvoices,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/payments/plans/:plan', async (req, res, next) => {
  try {
    const data = normalizePaymentPlanInput({ ...req.body, plan: req.params.plan });
    const result = await bindPaymentPlanInputs(pool.request(), data).query(`
      UPDATE dbo.PAYMENT_MANAGEMENT_PLANS
      SET price = @price,
          billing = @billing,
          description = COALESCE(NULLIF(@description, ''), description),
          updated_at = SYSUTCDATETIME()
      WHERE plan_code = @plan;

      SELECT plan_code, price, billing, description
      FROM dbo.PAYMENT_MANAGEMENT_PLANS
      WHERE plan_code = @plan;
    `);

    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'Payment plan not found.' });
      return;
    }

    res.json(toPaymentPlan(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/practice-tests', async (_req, res, next) => {
  try {
    const result = await pool.request().query(`
      SELECT id, name, docs, questions, subject, creator_initials, creator_name,
             creator_color, creator_text, attempts, avg, status, created_type
      FROM dbo.PRACTICE_TEST_MANAGEMENT
      ORDER BY id DESC;
    `);

    res.json(result.recordset.map(toPracticeTest));
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/practice-tests/:id/questions', async (req, res, next) => {
  try {
    const result = await pool.request()
      .input('testId', sql.Int, Number(req.params.id))
      .query(`
        SELECT id, question, question_type, difficulty, ai_score
        FROM dbo.PRACTICE_TEST_MANAGEMENT_QUESTIONS
        WHERE test_id = @testId
        ORDER BY id;
      `);

    res.json(result.recordset.map(toPracticeQuestion));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/admin/practice-tests/:id', async (req, res, next) => {
  try {
    const result = await pool.request()
      .input('id', sql.Int, Number(req.params.id))
      .query('DELETE FROM dbo.PRACTICE_TEST_MANAGEMENT WHERE id = @id;');

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: 'Practice test not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/practice-review-queue', async (_req, res, next) => {
  try {
    const result = await pool.request().query(`
      SELECT queue_id, course, time_label, flag, flag_score, question, ai_answer,
             current_answer, flag_note, user_report_student, user_report_text,
             queue_type, status
      FROM dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE
      WHERE status IN ('Pending', 'Edited')
      ORDER BY id DESC;
    `);

    res.json(result.recordset.map(toReviewQueueItem));
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/practice-review-queue/:id', async (req, res, next) => {
  try {
    const data = normalizeReviewQueueInput({ ...req.body, id: req.params.id, status: 'Edited' });
    const result = await pool.request()
      .input('queueId', sql.NVarChar(40), req.params.id)
      .input('question', sql.NVarChar(1000), data.question)
      .input('aiAnswer', sql.NVarChar(1000), data.aiAnswer)
      .input('currentAnswer', sql.NVarChar(1000), data.currentAnswer)
      .query(`
        UPDATE dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE
        SET question = @question,
            ai_answer = @aiAnswer,
            current_answer = @currentAnswer,
            status = 'Edited',
            updated_at = SYSUTCDATETIME()
        WHERE queue_id = @queueId;

        SELECT queue_id, course, time_label, flag, flag_score, question, ai_answer,
               current_answer, flag_note, user_report_student, user_report_text,
               queue_type, status
        FROM dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE
        WHERE queue_id = @queueId;
      `);

    if (result.recordset.length === 0) {
      res.status(404).json({ message: 'Review queue item not found.' });
      return;
    }

    res.json(toReviewQueueItem(result.recordset[0]));
  } catch (error) {
    next(error);
  }
});

app.put('/api/admin/practice-review-queue/:id/resolve', async (req, res, next) => {
  try {
    const status = ['Approved', 'Rejected', 'Deleted'].includes(req.body.status)
      ? req.body.status
      : 'Approved';
    const result = await pool.request()
      .input('queueId', sql.NVarChar(40), req.params.id)
      .input('status', sql.NVarChar(20), status)
      .query(`
        UPDATE dbo.PRACTICE_TEST_MANAGEMENT_REVIEW_QUEUE
        SET status = @status,
            updated_at = SYSUTCDATETIME()
        WHERE queue_id = @queueId;
      `);

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ message: 'Review queue item not found.' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  const isUniqueEmailError = error.number === 2601 || error.number === 2627;
  res.status(error.statusCode || (isUniqueEmailError ? 409 : 500)).json({
    message: isUniqueEmailError ? 'Email already exists.' : error.message || 'Server error.',
  });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
