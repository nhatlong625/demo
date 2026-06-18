package com.aistudyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record PythonChatAskRequest(
        String message,
        @JsonProperty("session_id") Integer sessionId,
        @JsonProperty("context_documents") List<PythonContextDocument> contextDocuments
) {
}
