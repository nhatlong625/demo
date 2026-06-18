package com.aistudyhub.backend_java.repository;

import com.aistudyhub.backend_java.model.entity.AuthToken;
import com.aistudyhub.backend_java.model.entity.TokenType;
import com.aistudyhub.backend_java.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, Integer> {

    Optional<AuthToken> findByToken(String token);

    @Modifying
    @Query("UPDATE AuthToken t SET t.isUsed = true WHERE t.user = :user AND t.tokenType = :type AND t.isUsed = false")
    void invalidateTokensByUserAndType(User user, TokenType type);
}
