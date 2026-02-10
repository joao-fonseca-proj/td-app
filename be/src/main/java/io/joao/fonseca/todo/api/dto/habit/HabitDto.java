package io.joao.fonseca.todo.api.dto.habit;

import java.util.List;

public record HabitDto(Long id, Long panelId, String name, String category, String frequency, List<String> daysOfWeek) {
}
