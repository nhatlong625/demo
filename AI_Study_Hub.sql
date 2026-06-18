USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'AI_StudyHub')
BEGIN
    ALTER DATABASE AIStudyHubDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE AIStudyHubDB;
END
GO

CREATE DATABASE AIStudyHubDB;
GO

USE AIStudyHubDB;
GO

-- =========================
-- 1. USERS
-- =========================
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- =========================
-- 2. SEMESTERS
-- =========================
CREATE TABLE Semesters (
    semester_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    semester_name NVARCHAR(100) NOT NULL,
    start_date DATE NULL,
    end_date DATE NULL,

    CONSTRAINT FK_Semesters_Users
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

-- =========================
-- 3. COURSES
-- =========================
CREATE TABLE Courses (
    course_id INT IDENTITY(1,1) PRIMARY KEY,
    semester_id INT NOT NULL,
    course_name NVARCHAR(100) NOT NULL,
    course_code VARCHAR(50) NULL,
    description NVARCHAR(255) NULL,

    CONSTRAINT FK_Courses_Semesters
        FOREIGN KEY (semester_id) REFERENCES Semesters(semester_id)
);
GO

-- =========================
-- 4. DOCUMENTS
-- =========================
CREATE TABLE Documents (
    document_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NULL,

    title NVARCHAR(150) NOT NULL,
    description NVARCHAR(255) NULL,

    document_name NVARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NULL,
    document_size INT NULL,
    document_url NVARCHAR(500) NULL,

    visibility VARCHAR(20) DEFAULT 'PRIVATE',
    status VARCHAR(20) DEFAULT 'UPLOADED',

    uploaded_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,

    CONSTRAINT FK_Documents_Users
        FOREIGN KEY (user_id) REFERENCES Users(user_id),

    CONSTRAINT FK_Documents_Courses
        FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);
GO

-- =========================
-- 5. AI_SUMMARIES
-- =========================
CREATE TABLE AI_Summaries (
    summary_id INT IDENTITY(1,1) PRIMARY KEY,
    document_id INT NOT NULL UNIQUE,

    summary_content NVARCHAR(MAX) NOT NULL,
    keyword_list NVARCHAR(MAX) NULL,
    generated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_AISummaries_Documents
        FOREIGN KEY (document_id) REFERENCES Documents(document_id)
);
GO

-- =========================
-- 6. AI_QUESTIONS
-- =========================
CREATE TABLE AI_Questions (
    question_id INT IDENTITY(1,1) PRIMARY KEY,
    document_id INT NOT NULL,

    question_text NVARCHAR(MAX) NOT NULL,
    option_a NVARCHAR(255) NULL,
    option_b NVARCHAR(255) NULL,
    option_c NVARCHAR(255) NULL,
    option_d NVARCHAR(255) NULL,
    correct_answer VARCHAR(10) NOT NULL,

    question_type VARCHAR(50) DEFAULT 'MULTIPLE_CHOICE',
    difficulty VARCHAR(20) DEFAULT 'EASY',
    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_AIQuestions_Documents
        FOREIGN KEY (document_id) REFERENCES Documents(document_id)
);
GO

-- =========================
-- 7. PRACTICE_TESTS
-- =========================
CREATE TABLE Practice_Tests (
    test_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    document_id INT NULL,

    test_title NVARCHAR(150) NOT NULL,
    total_questions INT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_PracticeTests_Users
        FOREIGN KEY (user_id) REFERENCES Users(user_id),

    CONSTRAINT FK_PracticeTests_Documents
        FOREIGN KEY (document_id) REFERENCES Documents(document_id)
);
GO

-- =========================
-- 8. PRACTICE_TEST_QUESTIONS
-- =========================
CREATE TABLE Practice_Test_Questions (
    test_question_id INT IDENTITY(1,1) PRIMARY KEY,
    test_id INT NOT NULL,
    question_id INT NOT NULL,

    question_order INT NOT NULL,

    CONSTRAINT FK_TestQuestions_PracticeTests
        FOREIGN KEY (test_id) REFERENCES Practice_Tests(test_id),

    CONSTRAINT FK_TestQuestions_AIQuestions
        FOREIGN KEY (question_id) REFERENCES AI_Questions(question_id)
);
GO

-- =========================
-- 9. QUIZ_ATTEMPTS
-- =========================
CREATE TABLE Quiz_Attempts (
    attempt_id INT IDENTITY(1,1) PRIMARY KEY,
    test_id INT NOT NULL,
    user_id INT NOT NULL,

    score FLOAT DEFAULT 0,
    total_correct INT DEFAULT 0,
    total_questions INT DEFAULT 0,

    started_at DATETIME DEFAULT GETDATE(),
    submitted_at DATETIME NULL,

    CONSTRAINT FK_QuizAttempts_PracticeTests
        FOREIGN KEY (test_id) REFERENCES Practice_Tests(test_id),

    CONSTRAINT FK_QuizAttempts_Users
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

-- =========================
-- 10. QUIZ_ANSWERS
-- =========================
CREATE TABLE Quiz_Answers (
    answer_id INT IDENTITY(1,1) PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,

    selected_answer VARCHAR(10) NULL,
    is_correct BIT DEFAULT 0,

    CONSTRAINT FK_QuizAnswers_Attempts
        FOREIGN KEY (attempt_id) REFERENCES Quiz_Attempts(attempt_id),

    CONSTRAINT FK_QuizAnswers_Questions
        FOREIGN KEY (question_id) REFERENCES AI_Questions(question_id)
);
GO

-- =========================
-- 11. STUDY_ACTIVITY
-- User 1 - N Study_Activity
-- =========================
CREATE TABLE Study_Activity (
    activity_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,

    activity_type VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50) NULL,
    reference_id INT NULL,

    activity_date DATE NOT NULL,
    activity_time DATETIME DEFAULT GETDATE(),

    duration_minutes INT DEFAULT 0,
    points_earned INT DEFAULT 0,

    CONSTRAINT FK_StudyActivity_Users
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

-- =========================
-- 12. STUDY_STREAK
-- User 1 - 1 Study_Streak
-- =========================
CREATE TABLE Study_Streak (
    streak_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,

    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,

    last_activity_date DATE NULL,
    streak_start_date DATE NULL,
    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_StudyStreak_Users
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO