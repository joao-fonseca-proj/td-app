package io.joao.fonseca.todo.api.dto.user;

public record LoginResponseDto(
        String username,
        String token
) {
}

