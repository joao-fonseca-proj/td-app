package io.joao.fonseca.todo.service;

import io.joao.fonseca.todo.api.dto.habit.HabitDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class HabitRegistrationService {

    private final PanelService panelService;
    private final HabitService habitService;
    private final TodoService todoService;

    public HabitRegistrationService(final PanelService panelService, final HabitService habitService,
                                    final TodoService todoService) {
        this.panelService = panelService;
        this.habitService = habitService;
        this.todoService = todoService;
    }

    public HabitDto create(final HabitDto habitDto, final Long userId) {
        final var panel = panelService.findByIdAndUserId(habitDto.panelId(), userId)
                .orElseThrow(EntityNotFoundException::new);

        return habitService.createInPanel(habitDto, panel);
    }

    @Transactional
    public void deleteHabitById(final Long habitId, final Long userId, final boolean deleteTasks) {
        habitService.findByIdAndUserId(habitId, userId) // check if exists by user
                .orElseThrow(EntityNotFoundException::new);
        if (deleteTasks) {
            todoService.deleteTodosByHabitId(habitId);
        } else {
            todoService.nullTodosByHabitId(habitId);
        }
        habitService.deleteHabitById(habitId);
    }

}
