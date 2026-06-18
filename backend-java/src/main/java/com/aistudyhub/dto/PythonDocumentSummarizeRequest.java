package com.aistudyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PythonDocumentSummarizeRequest(
        @JsonProperty("document_id") Integer documentId,
        @JsonProperty("document_name") String documentName,
        String text,
        @JsonProperty("file_path") String filePath,
        @JsonProperty("max_chunks") Integer maxChunks
) {
}
