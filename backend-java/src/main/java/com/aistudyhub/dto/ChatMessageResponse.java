package com.aistudyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        @JsonProperty("message_id") Integer messageId,
        @JsonProperty("session_id") Integer sessionId,
        String role,
        String content,
        @JsonProperty("created_at") LocalDateTime createdAt
) {
}
