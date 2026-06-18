package com.aistudyhub.backend.service;

import com.aistudyhub.backend.entity.Document;
import com.aistudyhub.backend.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import com.aistudyhub.backend.repository.SubjectRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    public Document uploadDocument(MultipartFile file, String title,
                                   Integer subjectId, Integer userId,
                                   String visibilityStatus) throws Exception {

        // 1. Tạo tên file unique
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // 2. Upload lên Supabase Storage
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

        WebClient client = WebClient.create();
        client.post()
                .uri(uploadUrl)
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .header(HttpHeaders.CONTENT_TYPE, file.getContentType())
                .bodyValue(file.getBytes())
                .retrieve()
                .toBodilessEntity()
                .block();

        // 3. Tạo public URL
        String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;

        // 4. Lưu metadata vào DB
        Document doc = new Document();
        doc.setUserId(userId);
        doc.setSubjectId(subjectId);
        doc.setTitle(title);
        doc.setDocumentName(file.getOriginalFilename());
        doc.setDocumentType(getExtension(file.getOriginalFilename()));
        doc.setDocumentSize(file.getSize());
        doc.setDocumentUrl(publicUrl);
        doc.setVisibilityStatus(visibilityStatus);
        doc.setStatus("Active");
        doc.setUploadedAt(LocalDateTime.now());
        doc.setCreatedAt(LocalDateTime.now());

        return documentRepository.save(doc);
    }

    public List<Document> getDocumentsBySubject(Integer subjectId) {
        return documentRepository.findBySubjectId(subjectId);
    }

    public List<Document> getDocumentsByUser(Integer userId) {
        return documentRepository.findByUserId(userId);
    }

    public void deleteDocument(Integer documentId) {
        // 1. Lấy document từ DB
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // 2. Lấy tên file từ URL
        String fileName = doc.getDocumentUrl()
                .replace(supabaseUrl + "/storage/v1/object/public/" + bucket + "/", "");

        // 3. Xóa file trên Supabase (dùng JSON body)
        String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucket;

        WebClient client = WebClient.create();
        client.method(org.springframework.http.HttpMethod.DELETE)
                .uri(deleteUrl)
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .header("Content-Type", "application/json")
                .bodyValue("{\"prefixes\": [\"" + fileName + "\"]}")
                .retrieve()
                .toBodilessEntity()
                .block();

        // 4. Xóa record trong DB
        documentRepository.deleteById(documentId);
    }

    public List<com.aistudyhub.backend.dto.response.DocumentStatsResponse> getAllDocumentStats() {
        // Lấy tất cả subject
        List<com.aistudyhub.backend.entity.Subject> subjects = subjectRepository.findAll();

        return subjects.stream().map(sub -> {
            List<Document> docs = documentRepository.findBySubjectId(sub.getSubjectId());
            com.aistudyhub.backend.dto.response.DocumentStatsResponse res =
                    new com.aistudyhub.backend.dto.response.DocumentStatsResponse();
            res.setSubjectName(sub.getSubjectName());
            res.setDocumentCount(docs.size());

            if (!docs.isEmpty()) {
                Document recent = docs.stream()
                        .max(java.util.Comparator.comparing(Document::getCreatedAt))
                        .orElse(null);
                if (recent != null) {
                    res.setRecentDocId(recent.getDocumentId());
                    res.setRecentDocTitle(recent.getTitle());
                    res.setRecentDocName(recent.getDocumentName());
                    res.setRecentDocType(recent.getDocumentType());
                    res.setRecentDocUrl(recent.getDocumentUrl());
                    res.setRecentDocUploadedAt(recent.getCreatedAt().toString());
                }
            }
            return res;
        }).collect(java.util.stream.Collectors.toList());
    }

    private String getExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "unknown";
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }
}