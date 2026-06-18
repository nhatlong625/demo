package com.aistudyhub.backend.dto.response;

public class DocumentStatsResponse {
    private String subjectName;
    private Integer documentCount;
    private Integer recentDocId;
    private String recentDocTitle;
    private String recentDocName;
    private String recentDocType;
    private String recentDocUrl;
    private String recentDocUploadedAt;

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Integer getDocumentCount() { return documentCount; }
    public void setDocumentCount(Integer documentCount) { this.documentCount = documentCount; }

    public Integer getRecentDocId() { return recentDocId; }
    public void setRecentDocId(Integer recentDocId) { this.recentDocId = recentDocId; }

    public String getRecentDocTitle() { return recentDocTitle; }
    public void setRecentDocTitle(String recentDocTitle) { this.recentDocTitle = recentDocTitle; }

    public String getRecentDocName() { return recentDocName; }
    public void setRecentDocName(String recentDocName) { this.recentDocName = recentDocName; }

    public String getRecentDocType() { return recentDocType; }
    public void setRecentDocType(String recentDocType) { this.recentDocType = recentDocType; }

    public String getRecentDocUrl() { return recentDocUrl; }
    public void setRecentDocUrl(String recentDocUrl) { this.recentDocUrl = recentDocUrl; }

    public String getRecentDocUploadedAt() { return recentDocUploadedAt; }
    public void setRecentDocUploadedAt(String recentDocUploadedAt) { this.recentDocUploadedAt = recentDocUploadedAt; }
}