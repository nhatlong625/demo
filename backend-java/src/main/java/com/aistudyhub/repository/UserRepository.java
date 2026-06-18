package com.aistudyhub.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class UserRepository {
    private static final String DEMO_EMAIL = "demo@student.local";

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer resolveUserId(Integer requestedUserId) {
        if (requestedUserId != null && existsById(requestedUserId)) {
            return requestedUserId;
        }
        return ensureDemoUser();
    }

    private boolean existsById(Integer userId) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM [USER] WHERE user_id = ?", Integer.class, userId);
        return count != null && count > 0;
    }

    private Integer ensureDemoUser() {
        List<Integer> existing = jdbcTemplate.query("SELECT user_id FROM [USER] WHERE email = ?", (rs, rowNum) -> rs.getInt("user_id"), DEMO_EMAIL);
        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        Integer roleId = ensureStudentRole();
        jdbcTemplate.update("""
                INSERT INTO [USER] (role_id, full_name, email, password_hash, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """, roleId, "Demo Student", DEMO_EMAIL, "demo-password-not-for-login", "Active", LocalDateTime.now());

        return jdbcTemplate.queryForObject("SELECT user_id FROM [USER] WHERE email = ?", Integer.class, DEMO_EMAIL);
    }

    private Integer ensureStudentRole() {
        List<Integer> existing = jdbcTemplate.query("SELECT role_id FROM ROLE WHERE role_name = ?", (rs, rowNum) -> rs.getInt("role_id"), "Student");
        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        jdbcTemplate.update("""
                INSERT INTO ROLE (role_name, description, created_at)
                VALUES (?, ?, ?)
                """, "Student", "Default student role", LocalDateTime.now());
        return jdbcTemplate.queryForObject("SELECT role_id FROM ROLE WHERE role_name = ?", Integer.class, "Student");
    }
}
