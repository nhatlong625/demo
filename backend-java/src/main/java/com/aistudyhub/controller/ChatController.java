package com.aistudyhub.controller;

import com.aistudyhub.dto.ChatAskRequest;
import com.aistudyhub.dto.ChatAskResponse;
import com.aistudyhub.dto.ChatMessageResponse;
import com.aistudyhub.dto.ChatSessionResponse;
import com.aistudyhub.dto.CreateChatSessionRequest;
import com.aistudyhub.dto.DeleteChatSessionRequest;
import com.aistudyhub.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/sessions")
    public List<ChatSessionResponse> listSessions(@RequestParam Integer userId) {
        return chatService.listSessions(userId);
    }

    @PostMapping("/sessions")
    public ChatSessionResponse createSession(@Valid @RequestBody CreateChatSessionRequest request) {
        return chatService.createSession(request);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public List<ChatMessageResponse> listMessages(
            @PathVariable Integer sessionId,
            @RequestParam(required = false) Integer userId
    ) {
        return chatService.listMessages(sessionId, userId);
    }

    @DeleteMapping("/sessions/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSession(
            @PathVariable Integer sessionId,
            @RequestParam(required = false) Integer userId,
            @RequestBody(required = false) DeleteChatSessionRequest request
    ) {
        Integer requestUserId = request == null || request.userId() == null ? userId : request.userId();
        chatService.deleteSession(sessionId, requestUserId);
    }

    @PostMapping("/ask")
    public ChatAskResponse ask(@Valid @RequestBody ChatAskRequest request) {
        return chatService.ask(request);
    }
}
