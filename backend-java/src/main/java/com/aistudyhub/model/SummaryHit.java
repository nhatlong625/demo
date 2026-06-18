package com.aistudyhub.model;

public record SummaryHit(
        Integer documentId,
        String documentName,
        String title,
        Integer subjectId,
        String subjectName,
        String summaryContent,
        Double score
) {
    public SummaryHit withScore(Double score) {
        return new SummaryHit(documentId, documentName, title, subjectId, subjectName, summaryContent, score);
    }
}
