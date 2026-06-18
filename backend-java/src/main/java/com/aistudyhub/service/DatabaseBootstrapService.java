package com.aistudyhub.service;

import com.aistudyhub.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DatabaseBootstrapService {
    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;

    public DatabaseBootstrapService(JdbcTemplate jdbcTemplate, UserRepository userRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void prepareSchemaForAiChat() {
        jdbcTemplate.execute("""
                IF EXISTS (
                    SELECT 1
                    FROM sys.columns
                    WHERE object_id = OBJECT_ID('CHAT_SESSION')
                      AND name = 'document_id'
                      AND is_nullable = 0
                )
                BEGIN
                    ALTER TABLE CHAT_SESSION ALTER COLUMN document_id INT NULL
                END
                """);

        seedMockAiChatDocuments();
    }

    private void seedMockAiChatDocuments() {
        Integer userId = userRepository.resolveUserId(1);
        Integer swrSubjectId = ensureSubject("Semester 3", "Software Requirements", "Mock test subject for AI Chat.");
        Integer mathSubjectId = ensureSubject("Semester 2", "Linear Algebra", "Mock test subject for AI Chat.");

        List<MockDocument> documents = List.of(
                new MockDocument(
                        swrSubjectId,
                        "SWR Course Overview",
                        "mock-swr-course-overview.txt",
                        "Software Requirements (SWR) teaches students how to discover, analyze, document, and validate what a software system must do. Important concepts include stakeholders, functional requirements, non-functional requirements, business rules, scope, SRS documents, traceability, and validation. SWR helps reduce misunderstanding before implementation begins."
                ),
                new MockDocument(
                        swrSubjectId,
                        "Requirements Interview Guide",
                        "mock-requirements-interview-guide.txt",
                        "Interview is a requirements elicitation technique in Software Requirements. Analysts talk directly with stakeholders to understand goals, workflows, constraints, exceptions, pain points, and acceptance criteria. Interviews can be structured, semi-structured, or open-ended. Good interview notes are later refined into clear and testable requirements."
                ),
                new MockDocument(
                        swrSubjectId,
                        "SRS Document Template",
                        "mock-srs-document-template.txt",
                        "Common Software Requirements documents include Vision and Scope, Software Requirements Specification (SRS), Business Rules, Use Case Specification, User Stories, and Requirements Traceability Matrix. An SRS usually contains purpose, scope, definitions, functional requirements, non-functional requirements, interfaces, constraints, assumptions, and acceptance criteria."
                ),
                new MockDocument(
                        mathSubjectId,
                        "Linear Algebra Eigenvectors Notes",
                        "mock-linear-algebra-eigenvectors.txt",
                        "Eigenvectors are non-zero vectors that keep their direction after a linear transformation. Eigenvalues are the scale factors applied to those eigenvectors. They are useful for understanding matrix transformations, stability, principal components, and systems of linear equations."
                )
        );

        documents.forEach(document -> seedDocumentAndSummary(userId, document));
    }

    private Integer ensureSubject(String semesterName, String subjectName, String description) {
        Integer semesterId = findId("SELECT semester_id FROM SEMESTER WHERE semester_name = ?", semesterName);
        if (semesterId == null) {
            jdbcTemplate.update("""
                    INSERT INTO SEMESTER (semester_name, created_at, updated_at)
                    VALUES (?, ?, NULL)
                    """, semesterName, LocalDateTime.now());
            semesterId = findId("SELECT semester_id FROM SEMESTER WHERE semester_name = ?", semesterName);
        }

        Integer subjectId = findId("SELECT subject_id FROM SUBJECT WHERE subject_name = ?", subjectName);
        if (subjectId == null) {
            jdbcTemplate.update("""
                    INSERT INTO SUBJECT (semester_id, subject_name, description, created_at, updated_at)
                    VALUES (?, ?, ?, ?, NULL)
                    """, semesterId, subjectName, description, LocalDateTime.now());
            subjectId = findId("SELECT subject_id FROM SUBJECT WHERE subject_name = ?", subjectName);
        }

        return subjectId;
    }

    private void seedDocumentAndSummary(Integer userId, MockDocument document) {
        Integer documentId = findId("""
                SELECT document_id
                FROM DOCUMENT
                WHERE user_id = ? AND document_name = ?
                """, userId, document.documentName());

        if (documentId == null) {
            jdbcTemplate.update("""
                    INSERT INTO DOCUMENT (user_id, subject_id, title, document_name, document_type, document_size,
                                          document_url, visibility_status, status, uploaded_at, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
                    """,
                    userId,
                    document.subjectId(),
                    document.title(),
                    document.documentName(),
                    "TXT",
                    documentSummary(document).length(),
                    "../mock-documents/ai-chat/" + document.documentName(),
                    "Private",
                    "Active",
                    LocalDateTime.now(),
                    LocalDateTime.now()
            );
            documentId = findId("""
                    SELECT document_id
                    FROM DOCUMENT
                    WHERE user_id = ? AND document_name = ?
                    """, userId, document.documentName());
        }

        Integer summaryCount = jdbcTemplate.queryForObject("""
                SELECT COUNT(1)
                FROM AI_SUMMARY
                WHERE user_id = ? AND document_id = ? AND model_name = ?
                """, Integer.class, userId, documentId, "mock-test");

        if (summaryCount == null || summaryCount == 0) {
            jdbcTemplate.update("""
                    INSERT INTO AI_SUMMARY (document_id, user_id, summary_content, model_name, created_at)
                    VALUES (?, ?, ?, ?, ?)
                    """, documentId, userId, documentSummary(document), "mock-test", LocalDateTime.now());
        }
    }

    private String documentSummary(MockDocument document) {
        Path path = Path.of("..", "mock-documents", "ai-chat", document.documentName()).normalize();
        if (!Files.exists(path)) {
            return document.summary();
        }

        try {
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException ex) {
            return document.summary();
        }
    }

    private Integer findId(String sql, Object... args) {
        List<Integer> ids = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getInt(1), args);
        return ids.isEmpty() ? null : ids.get(0);
    }

    private record MockDocument(Integer subjectId, String title, String documentName, String summary) {
    }
}
