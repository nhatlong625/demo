package com.aistudyhub.service;

import com.aistudyhub.dto.ChatAskResponse;
import com.aistudyhub.dto.DocumentSummarizeResponse;
import com.aistudyhub.dto.PythonChatAskRequest;
import com.aistudyhub.dto.PythonDocumentSummarizeRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@Service
public class PythonAiService {
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String baseUrl;

    public PythonAiService(@Value("${ai.python-service.base-url}") String baseUrl, ObjectMapper objectMapper) {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
        this.objectMapper = objectMapper;
        this.baseUrl = normalizeBaseUrl(Objects.requireNonNull(baseUrl, "Python AI service base URL must not be null"));
    }

    public ChatAskResponse ask(PythonChatAskRequest request) {
        return postJson("/api/chat/ask", Objects.requireNonNull(request, "Python chat request must not be null"), ChatAskResponse.class);
    }

    public DocumentSummarizeResponse summarize(PythonDocumentSummarizeRequest request) {
        return postJson("/api/documents/summarize", Objects.requireNonNull(request, "Python summarize request must not be null"), DocumentSummarizeResponse.class);
    }

    private <T> T postJson(String path, Object request, Class<T> responseType) {
        String jsonRequest = toJson(request);
        URI uri = URI.create(baseUrl + path);
        HttpRequest httpRequest = HttpRequest.newBuilder(uri)
                .version(HttpClient.Version.HTTP_1_1)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonRequest, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RestClientException("POST " + uri + " failed with " + response.statusCode() + ": " + response.body());
            }
            return objectMapper.readValue(response.body(), responseType);
        } catch (IOException ex) {
            throw new RestClientException("Python AI service request failed", ex);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new RestClientException("Python AI service request was interrupted", ex);
        }
    }

    private String toJson(Object request) {
        try {
            return objectMapper.writeValueAsString(request);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Could not serialize Python AI request body", ex);
        }
    }

    private String normalizeBaseUrl(String value) {
        String trimmed = value.trim();
        return trimmed.endsWith("/") ? trimmed.substring(0, trimmed.length() - 1) : trimmed;
    }
}
