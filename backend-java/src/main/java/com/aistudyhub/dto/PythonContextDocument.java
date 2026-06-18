package com.aistudyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PythonContextDocument(
        @JsonProperty("document_id") Integer documentId,
        @JsonProperty("document_name") String documentName,
        String title,
        @JsonProperty("subject_id") Integer subjectId,
        @JsonProperty("subject_name") String subjectName,
        Double score,
        @JsonProperty("summary_content") String summaryContent
) {
}
