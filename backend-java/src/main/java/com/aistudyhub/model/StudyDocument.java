package com.aistudyhub.model;

import java.time.LocalDateTime;

public record StudyDocument(
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
