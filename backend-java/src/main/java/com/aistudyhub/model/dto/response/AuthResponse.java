package com.aistudyhub.backend_java.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private Integer userId;
    private String email;
    private String fullName;
    private String role;

    public static AuthResponse of(String token, Integer userId, String email,
                                   String fullName, String role) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(userId)
                .email(email)
                .fullName(fullName)
                .role(role)
                .build();
    }
}
