package io.joao.fonseca.todo.api.dto.user;

public record LoginAttemptDto(
        String username,
        String password
) {}

