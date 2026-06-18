package com.aistudyhub.backend.service;

import com.aistudyhub.backend.entity.Subject;
import com.aistudyhub.backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subject> getSubjectsBySemester(Integer semesterId) {
        return subjectRepository.findBySemesterId(semesterId);
    }

    public Subject addSubject(Integer semesterId, String subjectName, String description) {
        Subject subject = new Subject();
        subject.setSemesterId(semesterId);
        subject.setSubjectName(subjectName);
        subject.setDescription(description);
        subject.setCreatedAt(LocalDateTime.now());
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Integer subjectId) {
        subjectRepository.deleteById(subjectId);
    }
}