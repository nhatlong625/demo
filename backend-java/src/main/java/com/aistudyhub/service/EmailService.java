package com.aistudyhub.backend_java.service;

public interface EmailService {

    /**
     * Send email verification link to user.
     */
    void sendVerificationEmail(String to, String fullName, String token);

    /**
     * Send password reset link to user.
     */
    void sendPasswordResetEmail(String to, String fullName, String token);
}
