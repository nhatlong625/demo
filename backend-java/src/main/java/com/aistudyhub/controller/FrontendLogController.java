package com.aistudyhub.controller;

import com.aistudyhub.dto.FrontendLogRequest;
import com.aistudyhub.service.FrontendLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
public class FrontendLogController {
    private final FrontendLogService frontendLogService;

    public FrontendLogController(FrontendLogService frontendLogService) {
        this.frontendLogService = frontendLogService;
    }

    @PostMapping("/frontend")
    public ResponseEntity<Map<String, String>> logFrontendError(@RequestBody FrontendLogRequest request) throws IOException {
        frontendLogService.write(request);
        return ResponseEntity.ok(Map.of("status", "logged"));
    }
}
