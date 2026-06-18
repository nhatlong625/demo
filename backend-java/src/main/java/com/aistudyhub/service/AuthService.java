package com.aistudyhub.backend_java.service;

import com.aistudyhub.backend_java.model.dto.request.*;
import com.aistudyhub.backend_java.model.dto.response.AuthResponse;
import com.aistudyhub.backend_java.model.dto.response.MessageResponse;

public interface AuthService {

    MessageResponse register(RegisterRequest request);

    MessageResponse verifyEmail(String token);

    AuthResponse login(LoginRequest request);

    MessageResponse forgotPassword(ForgotPasswordRequest request);

    MessageResponse resetPassword(ResetPasswordRequest request);
}
