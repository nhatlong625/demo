package com.aistudyhub.backend.controller;

import com.aistudyhub.backend.entity.Subject;
import com.aistudyhub.backend.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<List<Subject>> getBySemester(@PathVariable Integer semesterId) {
        return ResponseEntity.ok(subjectService.getSubjectsBySemester(semesterId));
    }

    @PostMapping
    public ResponseEntity<Subject> addSubject(
            @RequestParam Integer semesterId,
            @RequestParam String subjectName,
            @RequestParam(required = false) String description) {
        return ResponseEntity.ok(subjectService.addSubject(semesterId, subjectName, description));
    }

    @DeleteMapping("/{subjectId}")
    public ResponseEntity<String> deleteSubject(@PathVariable Integer subjectId) {
        subjectService.deleteSubject(subjectId);
        return ResponseEntity.ok("Xóa subject thành công!");
    }
}