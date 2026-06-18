package com.aistudyhub.repository;

import com.aistudyhub.model.ChatMessage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Repository
public class ChatMessageRepository {
    private static final @NonNull RowMapper<ChatMessage> ROW_MAPPER = (rs, rowNum) -> new ChatMessage(
            rs.getInt("message_id"),
            rs.getInt("session_id"),
            rs.getString("session_type"),
            rs.getString("message_content"),
            requiredDateTime(rs.getTimestamp("created_at"), "created_at")
    );

    private final JdbcTemplate jdbcTemplate;

    public ChatMessageRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<ChatMessage> findBySessionId(Integer sessionId) {
        return jdbcTemplate.query("""
                SELECT message_id, session_id, session_type, message_content, created_at
                FROM CHAT_MESSAGE
                WHERE session_id = ?
                ORDER BY created_at ASC, message_id ASC
                """, ROW_MAPPER, sessionId);
    }

    public void save(Integer sessionId, String sessionType, String messageContent) {
        jdbcTemplate.update("""
                INSERT INTO CHAT_MESSAGE (session_id, session_type, message_content, created_at)
                VALUES (?, ?, ?, ?)
                """, sessionId, sessionType, messageContent, LocalDateTime.now());
    }

    public int deleteBySessionId(Integer sessionId) {
        return jdbcTemplate.update("DELETE FROM CHAT_MESSAGE WHERE session_id = ?", sessionId);
    }

    private static LocalDateTime requiredDateTime(Timestamp timestamp, String columnName) {
        return Objects.requireNonNull(timestamp, columnName + " must not be null").toLocalDateTime();
    }
}
