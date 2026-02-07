package io.joao.fonseca.todo.api.dto.user;

public record RegisterRequestDto(
        String name,
        String username,
        String password,
        String email
) {}
