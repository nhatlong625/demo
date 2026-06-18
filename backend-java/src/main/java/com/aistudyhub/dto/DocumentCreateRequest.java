package com.aistudyhub.dto;

import jakarta.validation.constraints.NotNull;

public record DocumentCreateRequest(
        @NotNull Integer userId,
        @NotNull Integer subjectId,
        String title,
        String documentName,
        String documentType,
        Long documentSize,
        String documentUrl,
        String visibilityStatus,
        String status
) {
}
