package com.aistudyhub.backend_java.service.impl;

import com.aistudyhub.backend_java.exception.*;
import com.aistudyhub.backend_java.model.dto.request.*;
import com.aistudyhub.backend_java.model.dto.response.AuthResponse;
import com.aistudyhub.backend_java.model.dto.response.MessageResponse;
import com.aistudyhub.backend_java.model.entity.AuthToken;
import com.aistudyhub.backend_java.model.entity.TokenType;
import com.aistudyhub.backend_java.model.entity.User;
import com.aistudyhub.backend_java.repository.AuthTokenRepository;
import com.aistudyhub.backend_java.repository.UserRepository;
import com.aistudyhub.backend_java.security.JwtTokenProvider;
import com.aistudyhub.backend_java.service.AuthService;
import com.aistudyhub.backend_java.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final AuthTokenRepository authTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    // ========== 1. REGISTER ==========

    @Override
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .isVerified(false)
                .build();
        user = userRepository.save(user);

        // Tạo email verification token (24h)
        String tokenValue = UUID.randomUUID().toString();
        AuthToken authToken = AuthToken.builder()
                .user(user)
                .token(tokenValue)
                .tokenType(TokenType.EMAIL_VERIFY)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .isUsed(false)
                .build();
        authTokenRepository.save(authToken);

        // Gửi email (best-effort, không rollback nếu fail)
        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), tokenValue);
        } catch (Exception e) {
            // Log lỗi nhưng không throw, user vẫn được tạo
        }

        return MessageResponse.ok("Registration successful. Please check your email to verify.");
    }

    // ========== 2. VERIFY EMAIL ==========

    @Override
    @Transactional
    public MessageResponse verifyEmail(String token) {
        AuthToken authToken = validateAndGetToken(token, TokenType.EMAIL_VERIFY);
        User user = authToken.getUser();

        user.setIsVerified(true);
        userRepository.save(user);

        authToken.setIsUsed(true);
        authTokenRepository.save(authToken);

        return MessageResponse.ok("Email verified successfully. You can now login.");
    }

    // ========== 3. LOGIN ==========

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.getIsVerified()) {
            throw new UnauthorizedException("Please verify your email before logging in");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String jwt = jwtTokenProvider.generateToken(user, user.getUserId());

        return AuthResponse.of(jwt, user.getUserId(), user.getEmail(),
                user.getFullName(), user.getRole());
    }

    // ========== 4. FORGOT PASSWORD ==========

    @Override
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        // Không tiết lộ user có tồn tại hay không (chống enumeration)
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            // Hủy tất cả token reset cũ
            authTokenRepository.invalidateTokensByUserAndType(user, TokenType.PASSWORD_RESET);

            // Tạo token mới (15 phút)
            String tokenValue = UUID.randomUUID().toString();
            AuthToken authToken = AuthToken.builder()
                    .user(user)
                    .token(tokenValue)
                    .tokenType(TokenType.PASSWORD_RESET)
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .isUsed(false)
                    .build();
            authTokenRepository.save(authToken);

            try {
                emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), tokenValue);
            } catch (Exception e) {
                // Log lỗi, không throw
            }
        });

        return MessageResponse.ok("If the email exists, a reset link has been sent.");
    }

    // ========== 5. RESET PASSWORD ==========

    @Override
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        AuthToken authToken = validateAndGetToken(request.getToken(), TokenType.PASSWORD_RESET);
        User user = authToken.getUser();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        authToken.setIsUsed(true);
        authTokenRepository.save(authToken);

        return MessageResponse.ok("Password reset successfully. You can now login.");
    }

    // ========== HELPER ==========

    private AuthToken validateAndGetToken(String tokenValue, TokenType expectedType) {
        AuthToken authToken = authTokenRepository.findByToken(tokenValue)
                .orElseThrow(() -> new BadRequestException("Invalid token"));

        if (authToken.getIsUsed()) {
            throw new BadRequestException("Token has already been used");
        }

        if (authToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Token has expired");
        }

        if (authToken.getTokenType() != expectedType) {
            throw new BadRequestException("Invalid token type");
        }

        return authToken;
    }
}
