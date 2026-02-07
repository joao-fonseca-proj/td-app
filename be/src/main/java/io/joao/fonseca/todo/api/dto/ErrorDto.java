package io.joao.fonseca.todo.api.dto;

public record ErrorDto(int code, String statusCode, String message) {
}
