package com.aistudyhub.dto;

import java.time.Instant;

public record FrontendLogRequest(
        String level,
        String message,
        String stack,
        String componentStack,
        String url,
        String userAgent,
        Instant timestamp
) {
}
