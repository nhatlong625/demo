package com.aistudyhub.repository;

import com.aistudyhub.model.StudyDocument;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class DocumentRepository {
    private static final @NonNull RowMapper<StudyDocument> ROW_MAPPER = (rs, rowNum) -> new StudyDocument(
            rs.getInt("document_id"),
            rs.getInt("user_id"),
            rs.getInt("subject_id"),
            rs.getString("title"),
            rs.getString("document_name"),
            rs.getString("document_type"),
            rs.getLong("document_size"),
            rs.getString("document_url"),
            rs.getString("visibility_status"),
            rs.getString("status"),
            requiredDateTime(rs.getTimestamp("uploaded_at"), "uploaded_at"),
            requiredDateTime(rs.getTimestamp("created_at"), "created_at"),
            optionalDateTime(rs.getTimestamp("updated_at"))
    );

    private final JdbcTemplate jdbcTemplate;

    public DocumentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<StudyDocument> findAll() {
        return jdbcTemplate.query("""
                SELECT document_id, user_id, subject_id, title, document_name, document_type, document_size,
                       document_url, visibility_status, status, uploaded_at, created_at, updated_at
                FROM DOCUMENT
                ORDER BY created_at DESC
                """, ROW_MAPPER);
    }

    public Optional<StudyDocument> findById(Integer documentId) {
        List<StudyDocument> rows = jdbcTemplate.query("""
                SELECT document_id, user_id, subject_id, title, document_name, document_type, document_size,
                       document_url, visibility_status, status, uploaded_at, created_at, updated_at
                FROM DOCUMENT
                WHERE document_id = ?
                """, ROW_MAPPER, documentId);
        return rows.stream().findFirst();
    }

    public StudyDocument save(StudyDocument document) {
        LocalDateTime now = LocalDateTime.now();
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement("""
                    INSERT INTO DOCUMENT (user_id, subject_id, title, document_name, document_type, document_size,
                                          document_url, visibility_status, status, uploaded_at, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, document.userId());
            ps.setInt(2, document.subjectId());
            ps.setString(3, document.title());
            ps.setString(4, document.documentName());
            ps.setString(5, document.documentType());
            ps.setLong(6, document.documentSize());
            ps.setString(7, document.documentUrl());
            ps.setString(8, document.visibilityStatus());
            ps.setString(9, document.status());
            ps.setObject(10, now);
            ps.setObject(11, now);
            return ps;
        }, keyHolder);
        Number key = Objects.requireNonNull(keyHolder.getKey(), "DOCUMENT generated key must not be null");
        return findById(key.intValue()).orElseThrow();
    }

    private static LocalDateTime requiredDateTime(Timestamp timestamp, String columnName) {
        return Objects.requireNonNull(timestamp, columnName + " must not be null").toLocalDateTime();
    }

    private static LocalDateTime optionalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
}
