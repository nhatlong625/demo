package com.aistudyhub.model;

import java.time.LocalDateTime;

public record ChatSession(Integer sessionId, Integer userId, Integer documentId, String sessionTitle, LocalDateTime createdAt, LocalDateTime updatedAt) {
}
