package com.aistudyhub.backend.service;

import com.aistudyhub.backend.dto.response.SemesterResponse;
import com.aistudyhub.backend.dto.response.SubjectResponse;
import com.aistudyhub.backend.entity.Document;
import com.aistudyhub.backend.entity.Semester;
import com.aistudyhub.backend.entity.Subject;
import com.aistudyhub.backend.repository.DocumentRepository;
import com.aistudyhub.backend.repository.SemesterRepository;
import com.aistudyhub.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SemesterService {

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private DocumentRepository documentRepository;

    public List<SemesterResponse> getAllSemesters() {
        List<Semester> semesters = semesterRepository.findAll();

        return semesters.stream().map(sem -> {
            SemesterResponse res = new SemesterResponse();
            res.setSemesterId(sem.getSemesterId());
            res.setSemesterName(sem.getSemesterName());

            List<Subject> subjects = subjectRepository.findBySemesterId(sem.getSemesterId());
            List<SubjectResponse> subjectResponses = subjects.stream().map(sub -> {
                SubjectResponse subRes = new SubjectResponse();
                subRes.setSubjectId(sub.getSubjectId());
                subRes.setSubjectName(sub.getSubjectName());
                subRes.setDescription(sub.getDescription());

                List<Document> subjectDocs = documentRepository.findBySubjectId(sub.getSubjectId());
                subRes.setDocumentCount(subjectDocs.size());

                if (!subjectDocs.isEmpty()) {
                    Document recent = subjectDocs.stream()
                            .max(java.util.Comparator.comparing(Document::getCreatedAt))
                            .orElse(null);
                    if (recent != null) {
                        subRes.setRecentDocId(recent.getDocumentId());
                        subRes.setRecentDocTitle(recent.getTitle());
                        subRes.setRecentDocName(recent.getDocumentName());
                        subRes.setRecentDocType(recent.getDocumentType());
                        subRes.setRecentDocUrl(recent.getDocumentUrl());
                        subRes.setRecentDocUploadedAt(recent.getCreatedAt().toString());
                    }
                }

                return subRes;
            }).collect(Collectors.toList());

            res.setSubjects(subjectResponses);
            return res;
        }).collect(Collectors.toList());
    }
}