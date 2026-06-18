package com.aistudyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DetectedSubjectResponse(
        @JsonProperty("subject_id") Integer subjectId,
        @JsonProperty("subject_name") String subjectName
) {
}
