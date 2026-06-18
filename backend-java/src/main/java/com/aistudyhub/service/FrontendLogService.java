package com.aistudyhub.service;

import com.aistudyhub.dto.FrontendLogRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class FrontendLogService {
    private final ObjectMapper objectMapper;
    private final Path logFile = Path.of("logs", "frontend-errors.log");

    public FrontendLogService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void write(FrontendLogRequest request) throws IOException {
        Files.createDirectories(logFile.getParent());
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", request.timestamp() == null ? Instant.now() : request.timestamp());
        entry.put("level", valueOrDefault(request.level(), "ERROR"));
        entry.put("message", valueOrDefault(request.message(), "Unknown frontend error"));
        entry.put("stack", request.stack());
        entry.put("componentStack", request.componentStack());
        entry.put("url", request.url());
        entry.put("userAgent", request.userAgent());

        String line = objectMapper.writeValueAsString(entry) + System.lineSeparator();
        Files.writeString(logFile, line, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
    }

    private String valueOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
