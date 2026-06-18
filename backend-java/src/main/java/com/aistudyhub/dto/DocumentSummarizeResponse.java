package com.aistudyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DocumentSummarizeResponse(
        @JsonProperty("document_id") Integer documentId,
        @JsonProperty("document_name") String documentName,
        String summary,
        @JsonProperty("chunk_count") Integer chunkCount,
        @JsonProperty("used_mock_ai") Boolean usedMockAi,
        @JsonProperty("saved_to_db") Boolean savedToDb
) {
}
