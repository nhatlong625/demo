package com.aistudyhub.dto;

import java.time.LocalDateTime;

public record ChatSessionResponse(Integer sessionId, Integer userId, Integer documentId, String sessionTitle, LocalDateTime createdAt, LocalDateTime updatedAt) {
}
