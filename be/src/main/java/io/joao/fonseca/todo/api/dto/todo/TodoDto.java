package io.joao.fonseca.todo.api.dto.todo;

import java.time.LocalDate;

public record TodoDto(
        Long id,
        Long panelId,
        String title,
        LocalDate dueDate,
        boolean completed,
        String urgency,
        String category,
        Integer position) {
}

