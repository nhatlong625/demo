package com.aistudyhub.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ChatAskRequest(
        @NotNull Integer userId,
        Integer sessionId,
        Integer documentId,
        Integer subjectId,
        List<Integer> documentIds,
        @NotBlank String message,
        @Min(1) @Max(10) Integer topK
) {
}
