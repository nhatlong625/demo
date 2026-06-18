package com.aistudyhub.backend.dto.response;

import java.util.List;

public class SemesterResponse {
    private Integer semesterId;
    private String semesterName;
    private List<SubjectResponse> subjects;

    public Integer getSemesterId() { return semesterId; }
    public void setSemesterId(Integer semesterId) { this.semesterId = semesterId; }

    public String getSemesterName() { return semesterName; }
    public void setSemesterName(String semesterName) { this.semesterName = semesterName; }

    public List<SubjectResponse> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectResponse> subjects) { this.subjects = subjects; }
}