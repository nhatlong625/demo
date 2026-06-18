package com.aistudyhub.service;

import com.aistudyhub.dto.DocumentCreateRequest;
import com.aistudyhub.dto.DocumentResponse;
import com.aistudyhub.dto.DocumentSummarizeRequest;
import com.aistudyhub.dto.DocumentSummarizeResponse;
import com.aistudyhub.dto.PythonDocumentSummarizeRequest;
import com.aistudyhub.exception.ResourceNotFoundException;
import com.aistudyhub.model.StudyDocument;
import com.aistudyhub.repository.AiSummaryRepository;
import com.aistudyhub.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final AiSummaryRepository aiSummaryRepository;
    private final PythonAiService pythonAiService;

    public DocumentService(DocumentRepository documentRepository, AiSummaryRepository aiSummaryRepository, PythonAiService pythonAiService) {
        this.documentRepository = documentRepository;
        this.aiSummaryRepository = aiSummaryRepository;
        this.pythonAiService = pythonAiService;
    }

    public List<DocumentResponse> listDocuments() {
        return documentRepository.findAll().stream().map(this::toResponse).toList();
    }

    public DocumentResponse getDocument(Integer documentId) {
        return documentRepository.findById(documentId)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + documentId));
    }

    @Transactional
    public DocumentResponse createDocument(DocumentCreateRequest request) {
        StudyDocument saved = documentRepository.save(new StudyDocument(
                null,
                request.userId(),
                request.subjectId(),
                defaultText(request.title(), request.documentName()),
                defaultText(request.documentName(), "untitled-document"),
                defaultText(request.documentType(), "UNKNOWN"),
                request.documentSize() == null ? 0L : request.documentSize(),
                defaultText(request.documentUrl(), ""),
                defaultText(request.visibilityStatus(), "Private"),
                defaultText(request.status(), "Active"),
                LocalDateTime.now(),
                LocalDateTime.now(),
                null
        ));
        return toResponse(saved);
    }

    @Transactional
    public DocumentSummarizeResponse summarize(DocumentSummarizeRequest request) {
        StudyDocument document = documentRepository.findById(request.documentId())
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + request.documentId()));

        DocumentSummarizeResponse response = pythonAiService.summarize(new PythonDocumentSummarizeRequest(
                request.documentId(),
                document.documentName(),
                request.text(),
                request.filePath(),
                request.maxChunks() == null ? 8 : request.maxChunks()
        ));

        aiSummaryRepository.save(request.documentId(), request.userId(), response.summary(), Boolean.TRUE.equals(response.usedMockAi()) ? "mock-ai" : "python-ai-service");
        return new DocumentSummarizeResponse(response.documentId(), response.documentName(), response.summary(), response.chunkCount(), response.usedMockAi(), true);
    }

    private DocumentResponse toResponse(StudyDocument document) {
        return new DocumentResponse(document.documentId(), document.userId(), document.subjectId(), document.title(), document.documentName(), document.documentType(), document.documentSize(), document.documentUrl(), document.visibilityStatus(), document.status(), document.uploadedAt(), document.createdAt(), document.updatedAt());
    }

    private String defaultText(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
