package com.aistudyhub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;

import java.time.Instant;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + " " + Objects.toString(error.getDefaultMessage(), "is invalid"))
                .orElse("Invalid request payload.");
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(RestClientException.class)
    ResponseEntity<Map<String, Object>> handlePythonService(RestClientException ex) {
        return error(HttpStatus.BAD_GATEWAY, "Python AI service request failed: " + ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex) {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        HttpStatus safeStatus = Objects.requireNonNull(status, "HTTP status must not be null");
        String safeMessage = Objects.toString(message, "Unexpected server error");
        return ResponseEntity.status(safeStatus).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", safeStatus.value(),
                "error", safeStatus.getReasonPhrase(),
                "message", safeMessage
        ));
    }
}
