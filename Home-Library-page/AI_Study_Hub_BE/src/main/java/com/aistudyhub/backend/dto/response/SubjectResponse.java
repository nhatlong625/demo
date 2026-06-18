package com.aistudyhub.backend.dto.response;

public class SubjectResponse {
    private Integer subjectId;
    private String subjectName;
    private String description;
    private Integer documentCount;
    private String recentDocTitle;
    private String recentDocUrl;
    private Integer recentDocId;
    private String recentDocName;
    private String recentDocType;
    private String recentDocUploadedAt;

    public Integer getSubjectId() { return subjectId; }
    public void setSubjectId(Integer subjectId) { this.subjectId = subjectId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDocumentCount() { return documentCount; }
    public void setDocumentCount(Integer documentCount) { this.documentCount = documentCount; }

    public String getRecentDocTitle() { return recentDocTitle; }
    public void setRecentDocTitle(String recentDocTitle) { this.recentDocTitle = recentDocTitle; }

    public String getRecentDocUrl() { return recentDocUrl; }
    public void setRecentDocUrl(String recentDocUrl) { this.recentDocUrl = recentDocUrl; }

    public Integer getRecentDocId() { return recentDocId; }
    public void setRecentDocId(Integer recentDocId) { this.recentDocId = recentDocId; }

    public String getRecentDocName() { return recentDocName; }
    public void setRecentDocName(String recentDocName) { this.recentDocName = recentDocName; }

    public String getRecentDocType() { return recentDocType; }
    public void setRecentDocType(String recentDocType) { this.recentDocType = recentDocType; }

    public String getRecentDocUploadedAt() { return recentDocUploadedAt; }
    public void setRecentDocUploadedAt(String recentDocUploadedAt) { this.recentDocUploadedAt = recentDocUploadedAt; }
}