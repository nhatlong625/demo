package com.aistudyhub.repository;

import com.aistudyhub.model.ChatSession;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository
public class ChatSessionRepository {
    private static final @NonNull RowMapper<ChatSession> ROW_MAPPER = (rs, rowNum) -> new ChatSession(
            rs.getInt("session_id"),
            rs.getInt("user_id"),
            rs.getObject("document_id") == null ? null : rs.getInt("document_id"),
            rs.getString("session_title"),
            requiredDateTime(rs.getTimestamp("created_at"), "created_at"),
            optionalDateTime(rs.getTimestamp("updated_at"))
    );

    private final JdbcTemplate jdbcTemplate;

    public ChatSessionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ChatSession> findByUserId(Integer userId) {
        return jdbcTemplate.query("""
                SELECT session_id, user_id, document_id, session_title, created_at, updated_at
                FROM CHAT_SESSION
                WHERE user_id = ?
                ORDER BY updated_at DESC, created_at DESC
                """, ROW_MAPPER, userId);
    }

    public Optional<ChatSession> findById(Integer sessionId) {
        List<ChatSession> rows = jdbcTemplate.query("""
                SELECT session_id, user_id, document_id, session_title, created_at, updated_at
                FROM CHAT_SESSION
                WHERE session_id = ?
                """, ROW_MAPPER, sessionId);
        return rows.stream().findFirst();
    }

    public ChatSession save(Integer userId, Integer documentId, String sessionTitle) {
        LocalDateTime now = LocalDateTime.now();
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement("""
                    INSERT INTO CHAT_SESSION (user_id, document_id, session_title, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                    """, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, userId);
            if (documentId == null) {
                ps.setNull(2, Types.INTEGER);
            } else {
                ps.setInt(2, documentId);
            }
            ps.setString(3, sessionTitle);
            ps.setObject(4, now);
            ps.setObject(5, now);
            return ps;
        }, keyHolder);
        Number key = Objects.requireNonNull(keyHolder.getKey(), "CHAT_SESSION generated key must not be null");
        return findById(key.intValue()).orElseThrow();
    }

    public void touch(Integer sessionId) {
        jdbcTemplate.update("UPDATE CHAT_SESSION SET updated_at = ? WHERE session_id = ?", LocalDateTime.now(), sessionId);
    }

    public int deleteById(Integer sessionId) {
        return jdbcTemplate.update("DELETE FROM CHAT_SESSION WHERE session_id = ?", sessionId);
    }

    private static LocalDateTime requiredDateTime(Timestamp timestamp, String columnName) {
        return Objects.requireNonNull(timestamp, columnName + " must not be null").toLocalDateTime();
    }

    private static LocalDateTime optionalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }
}
