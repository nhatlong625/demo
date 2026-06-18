package com.aistudyhub.model;

import java.time.LocalDateTime;

public record ChatMessage(Integer messageId, Integer sessionId, String sessionType, String messageContent, LocalDateTime createdAt) {
}
