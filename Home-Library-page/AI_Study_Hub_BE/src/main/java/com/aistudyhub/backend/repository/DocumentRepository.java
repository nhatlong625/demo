package com.aistudyhub.backend.repository;

import com.aistudyhub.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findBySubjectId(Integer subjectId);
    List<Document> findByUserId(Integer userId);
    List<Document> findBySubjectIdAndVisibilityStatus(Integer subjectId, String visibilityStatus);
    List<Document> findBySubjectIdOrderByCreatedAtDesc(Integer subjectId);
    List<Document> findAllByOrderByCreatedAtDesc();
}