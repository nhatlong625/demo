package com.aistudyhub.dto;

import java.time.LocalDateTime;

public record DocumentResponse(
        Integer documentId,
        Integer userId,
        Integer subjectId,
        String title,
        String documentName,
        String documentType,
        Long documentSize,
        String documentUrl,
        String visibilityStatus,
        String status,
        LocalDateTime uploadedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
