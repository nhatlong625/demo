package com.aistudyhub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import java.util.Objects;

@Configuration
public class RestClientConfig {
    @Bean
    RestClient pythonAiRestClient(@Value("${ai.python-service.base-url}") String baseUrl) {
        String configuredBaseUrl = Objects.requireNonNull(baseUrl, "Python AI service base URL must not be null");
        return RestClient.builder().baseUrl(configuredBaseUrl).build();
    }
}
