package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.todo.TodoDto;
import io.joao.fonseca.todo.domain.todo.Todo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class TodoRegistrationService {

    private final HabitService habitService;
    private final PanelService panelService;
    private final TodoService todoService;

    public TodoRegistrationService(final HabitService habitService, final PanelService panelService, final TodoService todoService) {
        this.habitService = habitService;
        this.panelService = panelService;
        this.todoService = todoService;
    }

    public TodoDto create(final TodoDto todoDto, final Long userId) {
        final var panel = panelService.findByIdAndUserId(todoDto.panelId(), userId)
                .orElseThrow(EntityNotFoundException::new);

        if (todoDto.habitId() != null) {
            final var habit = habitService.findByIdAndPanelId(todoDto.habitId(), panel.getId())
                    .orElseThrow(EntityNotFoundException::new);

            return todoService.createInPanelWithHabit(todoDto, panel, habit);
        }
        return todoService.createInPanel(todoDto, panel);
    }

    @Transactional
    public TodoDto updateHabit(final Long todoId, final Long habitId, final Long userId) {
        final var habit = habitService.findByIdAndUserId(habitId, userId)
                .orElseThrow();

        return todoService.updateHabit(todoId, userId, habit);
    }
}
