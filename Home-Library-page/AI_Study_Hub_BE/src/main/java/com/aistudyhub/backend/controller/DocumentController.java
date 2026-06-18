package com.aistudyhub.backend.controller;

import com.aistudyhub.backend.entity.Document;
import com.aistudyhub.backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private com.aistudyhub.backend.repository.DocumentRepository documentRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("subjectId") Integer subjectId,
            @RequestParam("userId") Integer userId,
            @RequestParam(value = "visibilityStatus", defaultValue = "PRIVATE") String visibilityStatus) {
        try {
            Document doc = documentService.uploadDocument(file, title, subjectId, userId, visibilityStatus);
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload thất bại: " + e.getMessage());
        }
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Document>> getBySubject(@PathVariable Integer subjectId) {
        return ResponseEntity.ok(documentService.getDocumentsBySubject(subjectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Document>> getByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(documentService.getDocumentsByUser(userId));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<?> getDocumentById(@PathVariable Integer documentId) {
        return documentRepository.findById(documentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<String> deleteDocument(@PathVariable Integer documentId) {
        if (!documentRepository.existsById(documentId)) {
            return ResponseEntity.notFound().build();
        }
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok("Xóa document thành công!");
    }

    @PatchMapping("/{documentId}/visibility")
    public ResponseEntity<?> updateVisibility(
            @PathVariable Integer documentId,
            @RequestParam String visibilityStatus) {
        return documentRepository.findById(documentId).map(doc -> {
            doc.setVisibilityStatus(visibilityStatus);
            documentRepository.save(doc);
            return ResponseEntity.ok(doc);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all-stats")
    public ResponseEntity<?> getAllStats() {
        return ResponseEntity.ok(documentService.getAllDocumentStats());
    }
}