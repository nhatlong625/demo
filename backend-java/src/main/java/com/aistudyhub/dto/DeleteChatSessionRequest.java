package com.aistudyhub.dto;

public record DeleteChatSessionRequest(
        Integer userId,
        Integer sessionId,
        String sessionTitle,
        String deletedAt
) {
}
