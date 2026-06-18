package com.aistudyhub.controller;

import com.aistudyhub.dto.DocumentCreateRequest;
import com.aistudyhub.dto.DocumentResponse;
import com.aistudyhub.dto.DocumentSummarizeRequest;
import com.aistudyhub.dto.DocumentSummarizeResponse;
import com.aistudyhub.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public List<DocumentResponse> listDocuments() {
        return documentService.listDocuments();
    }

    @GetMapping("/{documentId}")
    public DocumentResponse getDocument(@PathVariable Integer documentId) {
        return documentService.getDocument(documentId);
    }

    @PostMapping
    public DocumentResponse createDocument(@Valid @RequestBody DocumentCreateRequest request) {
        return documentService.createDocument(request);
    }

    @PostMapping("/summarize")
    public DocumentSummarizeResponse summarize(@Valid @RequestBody DocumentSummarizeRequest request) {
        return documentService.summarize(request);
    }
}
