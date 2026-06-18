package com.aistudyhub.dto;

import jakarta.validation.constraints.NotNull;

public record DocumentSummarizeRequest(@NotNull Integer userId, @NotNull Integer documentId, String text, String filePath, Integer maxChunks) {
}
