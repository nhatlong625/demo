package com.aistudyhub.repository;

import com.aistudyhub.model.SummaryHit;
import org.springframework.lang.NonNull;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AiSummaryRepository {
    private static final @NonNull RowMapper<SummaryHit> SUMMARY_HIT_ROW_MAPPER = (rs, rowNum) -> new SummaryHit(
            rs.getInt("document_id"),
            rs.getString("document_name"),
            rs.getString("title"),
            rs.getObject("subject_id", Integer.class),
            rs.getString("subject_name"),
            rs.getString("summary_content"),
            0.0
    );

    private final JdbcTemplate jdbcTemplate;

    public AiSummaryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Integer documentId, Integer userId, String summaryContent, String modelName) {
        jdbcTemplate.update("""
                INSERT INTO AI_SUMMARY (document_id, user_id, summary_content, model_name, created_at)
                VALUES (?, ?, ?, ?, ?)
                """, documentId, userId, summaryContent, modelName, LocalDateTime.now());
    }

    public List<SummaryHit> findForChatContext(Integer userId, Integer subjectId, List<Integer> documentIds) {
        StringBuilder sql = new StringBuilder("""
                SELECT
                    d.document_id,
                    d.document_name,
                    d.title,
                    sub.subject_id,
                    sub.subject_name,
                    s.summary_content
                FROM AI_SUMMARY s
                JOIN DOCUMENT d ON s.document_id = d.document_id
                LEFT JOIN SUBJECT sub ON d.subject_id = sub.subject_id
                WHERE s.user_id = ?
                """);
        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (subjectId != null) {
            sql.append(" AND d.subject_id = ?");
            params.add(subjectId);
        }

        if (documentIds != null && !documentIds.isEmpty()) {
            sql.append(" AND d.document_id IN (");
            sql.append(String.join(",", documentIds.stream().map(id -> "?").toList()));
            sql.append(")");
            params.addAll(documentIds);
        }

        return jdbcTemplate.query(sql.toString(), SUMMARY_HIT_ROW_MAPPER, params.toArray());
    }
}
