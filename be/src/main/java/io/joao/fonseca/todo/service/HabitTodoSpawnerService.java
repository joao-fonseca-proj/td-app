package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import io.joao.fonseca.todo.domain.habit.Habit;
import io.joao.fonseca.todo.domain.todo.Urgency;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class HabitTodoSpawnerService {

    private final TodoService todoService;

    public HabitTodoSpawnerService(final TodoService todoService) {
        this.todoService = todoService;
    }

    public void spawnTodos(final Habit habit, final int daysAhead) {
        final var bufferEnd = LocalDate.now().plusDays(daysAhead);

        // 1. Find the furthest date we've already reached for this habit
        final var lastSpawnedDate = todoService.findMaxDueDateByHabitId(habit.getId())
                .orElse(LocalDate.now().minusDays(1)); // If new habit, start from yesterday

        final var startPoint = lastSpawnedDate.plusDays(1);
        if (startPoint.isAfter(bufferEnd)) {
            return;
        }

        // 4. Only loop through the "Gap" (usually just 1 day if running daily)
        for (LocalDate date = startPoint; !date.isAfter(bufferEnd); date = date.plusDays(1)) {
            if (habit.getDaysOfWeek().contains(date.getDayOfWeek())) {
                final var todoToCreate = buildFromHabit(habit, date);
                todoService.createInPanelWithHabit(todoToCreate, habit.getPanel(), habit);
            }
        }
    }

    // should not map to dto again.. but lidatings
    private TodoDto buildFromHabit(final Habit habit, final LocalDate date) {
        return new TodoDto(null, habit.getPanel().getId(), habit.getId(), habit.getName(), date,
                false, Urgency.NORMAL.name(), habit.getCategory().name(), null);
    }

}
