package com.aistudyhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateChatSessionRequest(@NotNull Integer userId, Integer documentId, @NotBlank String sessionTitle) {
}
