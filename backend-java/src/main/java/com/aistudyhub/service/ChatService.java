package com.aistudyhub.service;

import com.aistudyhub.dto.ChatAskRequest;
import com.aistudyhub.dto.ChatAskResponse;
import com.aistudyhub.dto.ChatMessageResponse;
import com.aistudyhub.dto.ChatSessionResponse;
import com.aistudyhub.dto.CreateChatSessionRequest;
import com.aistudyhub.dto.DetectedSubjectResponse;
import com.aistudyhub.dto.PythonContextDocument;
import com.aistudyhub.dto.PythonChatAskRequest;
import com.aistudyhub.dto.SourceDocumentResponse;
import com.aistudyhub.exception.ResourceNotFoundException;
import com.aistudyhub.model.ChatSession;
import com.aistudyhub.model.ChatMessage;
import com.aistudyhub.model.SummaryHit;
import com.aistudyhub.repository.AiSummaryRepository;
import com.aistudyhub.repository.ChatMessageRepository;
import com.aistudyhub.repository.ChatSessionRepository;
import com.aistudyhub.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;

import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class ChatService {
    private static final Logger log = LoggerFactory.getLogger(ChatService.class);
    private static final Pattern TOKEN_PATTERN = Pattern.compile("[a-zA-Z0-9_]+");

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final AiSummaryRepository aiSummaryRepository;
    private final PythonAiService pythonAiService;
    private final UserRepository userRepository;

    public ChatService(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository, AiSummaryRepository aiSummaryRepository, PythonAiService pythonAiService, UserRepository userRepository) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.aiSummaryRepository = aiSummaryRepository;
        this.pythonAiService = pythonAiService;
        this.userRepository = userRepository;
    }

    public List<ChatSessionResponse> listSessions(Integer userId) {
        Integer effectiveUserId = userRepository.resolveUserId(userId);
        return chatSessionRepository.findByUserId(effectiveUserId).stream().map(this::toResponse).toList();
    }

    public List<ChatMessageResponse> listMessages(Integer sessionId, Integer userId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found: " + sessionId));

        if (userId != null) {
            Integer effectiveUserId = userRepository.resolveUserId(userId);
            if (!Objects.equals(session.userId(), effectiveUserId)) {
                throw new ResourceNotFoundException("Chat session not found: " + sessionId);
            }
        }

        return chatMessageRepository.findBySessionId(sessionId).stream().map(this::toMessageResponse).toList();
    }

    @Transactional
    public void deleteSession(Integer sessionId, Integer userId) {
        Integer effectiveUserId = userRepository.resolveUserId(userId);
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat session not found: " + sessionId));

        if (!Objects.equals(session.userId(), effectiveUserId)) {
            throw new ResourceNotFoundException("Chat session not found: " + sessionId);
        }

        chatMessageRepository.deleteBySessionId(sessionId);
        chatSessionRepository.deleteById(sessionId);
        log.info("Deleted chat session {} for user {} with title '{}'", sessionId, effectiveUserId, session.sessionTitle());
    }

    @Transactional
    public ChatSessionResponse createSession(CreateChatSessionRequest request) {
        Integer effectiveUserId = userRepository.resolveUserId(request.userId());
        return toResponse(chatSessionRepository.save(effectiveUserId, request.documentId(), request.sessionTitle()));
    }

    @Transactional
    public ChatAskResponse ask(ChatAskRequest request) {
        Integer effectiveUserId = userRepository.resolveUserId(request.userId());
        Integer sessionId = request.sessionId();
        if (sessionId == null) {
            ChatSession session = chatSessionRepository.save(effectiveUserId, request.documentId(), createTitle(request.message()));
            sessionId = session.sessionId();
        } else {
            Integer existingSessionId = sessionId;
            chatSessionRepository.findById(existingSessionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Chat session not found: " + existingSessionId));
        }

        chatMessageRepository.save(sessionId, "USER", request.message());
        List<SummaryHit> contextHits = searchContext(effectiveUserId, request);
        List<SourceDocumentResponse> sources = contextHits.stream().map(this::toSourceResponse).toList();
        DetectedSubjectResponse detectedSubject = contextHits.isEmpty()
                ? null
                : new DetectedSubjectResponse(contextHits.getFirst().subjectId(), contextHits.getFirst().subjectName());

        ChatAskResponse aiResponse;
        try {
            aiResponse = pythonAiService.ask(new PythonChatAskRequest(
                    request.message(),
                    sessionId,
                    contextHits.stream().map(this::toPythonContextDocument).toList()
            ));
        } catch (RestClientException ex) {
            aiResponse = new ChatAskResponse(
                    buildLocalMockAnswer(request.message(), contextHits),
                    sessionId,
                    detectedSubject,
                    sources,
                    true
            );
        }
        chatMessageRepository.save(sessionId, "ASSISTANT", aiResponse.answer());
        chatSessionRepository.touch(sessionId);

        return new ChatAskResponse(aiResponse.answer(), sessionId, detectedSubject, sources, aiResponse.usedMockAi());
    }

    private ChatSessionResponse toResponse(ChatSession session) {
        return new ChatSessionResponse(session.sessionId(), session.userId(), session.documentId(), session.sessionTitle(), session.createdAt(), session.updatedAt());
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        return new ChatMessageResponse(
                message.messageId(),
                message.sessionId(),
                "USER".equalsIgnoreCase(message.sessionType()) ? "user" : "assistant",
                message.messageContent(),
                message.createdAt()
        );
    }

    private String createTitle(String message) {
        String normalized = message == null ? "New AI Chat" : message.trim();
        if (normalized.isBlank()) return "New AI Chat";
        return normalized.length() > 80 ? normalized.substring(0, 80) : normalized;
    }

    private List<SummaryHit> searchContext(Integer userId, ChatAskRequest request) {
        List<Integer> documentIds = normalizeDocumentIds(request);
        int topK = request.topK() == null ? 3 : request.topK();

        return aiSummaryRepository.findForChatContext(userId, request.subjectId(), documentIds).stream()
                .map(hit -> hit.withScore(keywordScore(request.message(), hit)))
                .sorted(Comparator.comparing(SummaryHit::score).reversed())
                .limit(topK)
                .toList();
    }

    private List<Integer> normalizeDocumentIds(ChatAskRequest request) {
        if (request.documentIds() != null && !request.documentIds().isEmpty()) {
            return request.documentIds();
        }
        if (request.documentId() != null) {
            return List.of(request.documentId());
        }
        return List.of();
    }

    private Double keywordScore(String query, SummaryHit hit) {
        Set<String> queryTerms = tokenize(query);
        if (queryTerms.isEmpty()) {
            return 0.0;
        }

        String haystack = String.join(" ", Arrays.asList(
                nullToBlank(hit.documentName()),
                nullToBlank(hit.title()),
                nullToBlank(hit.subjectName()),
                nullToBlank(hit.summaryContent())
        ));
        Set<String> haystackTerms = tokenize(haystack);
        long overlap = queryTerms.stream().filter(haystackTerms::contains).count();
        return Math.round((double) overlap / queryTerms.size() * 10_000.0) / 10_000.0;
    }

    private Set<String> tokenize(String text) {
        Set<String> terms = new HashSet<>();
        TOKEN_PATTERN.matcher(nullToBlank(text).toLowerCase(Locale.ROOT))
                .results()
                .map(match -> match.group())
                .forEach(terms::add);
        return terms;
    }

    private SourceDocumentResponse toSourceResponse(SummaryHit hit) {
        return new SourceDocumentResponse(
                hit.documentId(),
                hit.documentName(),
                hit.title(),
                hit.subjectId(),
                hit.subjectName(),
                hit.score(),
                preview(hit.summaryContent())
        );
    }

    private PythonContextDocument toPythonContextDocument(SummaryHit hit) {
        return new PythonContextDocument(
                hit.documentId(),
                hit.documentName(),
                hit.title(),
                hit.subjectId(),
                hit.subjectName(),
                hit.score(),
                hit.summaryContent()
        );
    }

    private String buildLocalMockAnswer(String question, List<SummaryHit> hits) {
        if (hits.isEmpty()) {
            return "Mock mode is active because the Python AI service is not reachable. I could not find a matching mock document for this question.";
        }

        SummaryHit bestHit = hits.getFirst();
        StringBuilder answer = new StringBuilder();
        answer.append("Mock mode is active because the Python AI service is not reachable.\n\n");
        answer.append("Based on ").append(bestHit.documentName()).append(": ");
        answer.append(preview(bestHit.summaryContent()));

        if (hits.size() > 1) {
            answer.append("\n\nRelated mock documents:");
            hits.stream()
                    .limit(3)
                    .forEach(hit -> answer.append("\n- ").append(hit.documentName()));
        }

        if (question != null && !question.isBlank()) {
            answer.append("\n\nQuestion: ").append(question.trim());
        }

        return answer.toString();
    }

    private String preview(String text) {
        String normalized = nullToBlank(text);
        return normalized.length() > 240 ? normalized.substring(0, 240) : normalized;
    }

    private String nullToBlank(String value) {
        return value == null ? "" : value;
    }
}
